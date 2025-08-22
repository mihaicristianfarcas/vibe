import { inngest } from './client'
import { z } from 'zod'
import {
  createAgent,
  createTool,
  createNetwork,
  type Tool
} from '@inngest/agent-kit'
import { Sandbox } from '@e2b/code-interpreter'
import { getSandbox, lastAssistantTextMessageContent } from './utils'
import { SYSTEM_PROMPT } from '@/system_prompt'
import { ANALYSIS_PROMPT } from '@/analysis_prompt'
import { prisma } from '@/lib/db'
import {
  createAIProviderConfig,
  getAIProvider,
  AIProvider
} from '@/lib/ai-provider'
import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'

interface AgentState {
  summary: string
  files: { [path: string]: string }
  visionAnalysis?: string
  hasImageContent?: boolean
}

export const codeAgentFunction = inngest.createFunction(
  { id: 'code-agent' },
  { event: 'code-agent/run' },
  async ({ event, step }) => {
    const sandboxId = await step.run('get-sandbox-id', async () => {
      const sandbox = await Sandbox.create('vibe-nextjs-tmpl')
      return sandbox.sandboxId
    })

    const aiConfig = createAIProviderConfig()

    const codeAgent = createAgent<AgentState>({
      name: 'code-agent',
      description: 'An expert coding agent',
      system: SYSTEM_PROMPT,
      model: aiConfig.agentModel,
      tools: [
        createTool({
          name: 'analyzeImage',
          description: 'Analyze wireframe or design images to understand the application requirements and provide implementation guidance. Use this tool when an image has been provided with the request.',
          parameters: z.object({
            userPrompt: z.string().describe('The user prompt or context for the image analysis')
          }),
          handler: async ({ userPrompt }, { step, network }) => {
            // Get image content from the event data passed to the function
            const imageContent = event.data.imageContent
            if (!imageContent) {
              return 'No image content available for analysis.'
            }
            return await step?.run('vision-analysis', async () => {
              const aiConfig = createAIProviderConfig()
              const provider = getAIProvider()

              let visionResponse
              if (provider === AIProvider.ANTHROPIC) {
                const anthropicClient = aiConfig.directClient as Anthropic
                visionResponse = await anthropicClient.messages.create({
                  model: aiConfig.modelName,
                  max_tokens: 4096,
                  temperature: 0.1,
                  system: ANALYSIS_PROMPT,
                  messages: [
                    {
                      role: 'user',
                      content: [
                        {
                          type: 'text',
                          text: userPrompt
                        },
                        {
                          type: 'image',
                          source: {
                            type: 'base64',
                            media_type: 'image/png',
                            data: imageContent.replace(
                              /^data:image\/[a-z]+;base64,/,
                              ''
                            )
                          }
                        }
                      ]
                    }
                  ]
                })
              } else {
                const openaiClient = aiConfig.directClient as OpenAI
                visionResponse = await openaiClient.chat.completions.create({
                  model: aiConfig.modelName,
                  messages: [
                    {
                      role: 'system',
                      content: ANALYSIS_PROMPT
                    },
                    {
                      role: 'user',
                      content: [
                        {
                          type: 'text',
                          text: userPrompt
                        },
                        {
                          type: 'image_url',
                          image_url: { url: imageContent }
                        }
                      ]
                    }
                  ],
                  temperature: 0.1,
                  max_tokens: 4096
                })
              }

              // Extract the analysis text
              let visionAnalysis = ''
              if (provider === AIProvider.ANTHROPIC) {
                const anthropicResponse = visionResponse as Anthropic.Messages.Message
                visionAnalysis = anthropicResponse.content
                  .filter(
                    (block): block is Anthropic.TextBlock => block.type === 'text'
                  )
                  .map(block => block.text)
                  .join('')
              } else {
                const openaiResponse =
                  visionResponse as OpenAI.Chat.Completions.ChatCompletion
                visionAnalysis = openaiResponse.choices[0]?.message?.content || ''
              }

              // Store analysis in network state
              if (network) {
                network.state.data.visionAnalysis = visionAnalysis
              }

              return visionAnalysis
            })
          }
        }),
        createTool({
          name: 'terminal',
          description: 'Use the terminal to run commands in the sandbox environment.',
          parameters: z.object({
            command: z.string().describe('The command to execute in the terminal')
          }),
          handler: async ({ command }, { step }) => {
            return await step?.run('terminal', async () => {
              const buffers = { stdout: '', stderr: '' }
              try {
                const sandbox = await getSandbox(sandboxId)
                const result = await sandbox.commands.run(command, {
                  onStdout: (data: string) => {
                    buffers.stdout += data
                  },
                  onStderr: (data: string) => {
                    buffers.stderr += data
                  }
                })
                return result.stdout
              } catch (e) {
                console.error(
                  `Command failed: ${e}\nstdout: ${buffers.stdout}\nstderr: ${buffers.stderr}`
                )
              }
            })
          }
        }),
        createTool({
          name: 'createOrUpdateFiles',
          description: 'Create or update multiple files in the sandbox environment with the specified content.',
          parameters: z.object({
            files: z.array(
              z.object({
                path: z.string().describe('The file path relative to the project root'),
                content: z.string().describe('The complete file content to write')
              })
            ).describe('Array of files to create or update')
          }),
          handler: async (
            { files },
            { step, network }: Tool.Options<AgentState>
          ) => {
            const newFiles = await step?.run(
              'createOrUpdateFiles',
              async () => {
                try {
                  const updatedFiles = network.state.data.files || {}
                  const sandbox = await getSandbox(sandboxId)
                  for (const file of files) {
                    await sandbox.files.write(file.path, file.content)
                    updatedFiles[file.path] = file.content
                  }
                  return updatedFiles
                } catch (e) {
                  return 'Error: ' + e
                }
              }
            )
            if (typeof newFiles === 'object') {
              network.state.data.files = newFiles
            }
          }
        }),
        createTool({
          name: 'readFiles',
          description: 'Read the contents of one or more files from the sandbox environment.',
          parameters: z.object({
            files: z.array(z.string().describe('File path to read')).describe('Array of file paths to read')
          }),
          handler: async ({ files }, { step }) => {
            return await step?.run('readFiles', async () => {
              try {
                const sandbox = await getSandbox(sandboxId)
                const contents = []
                for (const file of files) {
                  const content = await sandbox.files.read(file)
                  contents.push({ path: file, content })
                }
                return JSON.stringify(contents)
              } catch (e) {
                return 'Error: ' + e
              }
            })
          }
        })
      ],
      lifecycle: {
        onResponse: async ({ result, network }) => {
          const lastAssistantTextMessage =
            lastAssistantTextMessageContent(result)
          if (lastAssistantTextMessage && network)
            if (lastAssistantTextMessage?.includes('<task_summary>'))
              network.state.data.summary = lastAssistantTextMessage

          return result
        }
      }
    })

    const network = createNetwork<AgentState>({
      name: 'coding-agent-network',
      agents: [codeAgent],
      maxIter: 15,
      router: async ({ network }) => {
        const summary = network.state.data.summary
        if (summary) return
        return codeAgent
      }
    })

    // Set up initial network state
    if (event.data.imageContent) {
      network.state.data.hasImageContent = true
    }

    // Always use network.run() and let the agent decide how to handle the request
    let userPrompt = event.data.value
    if (event.data.imageContent) {
      userPrompt += `\n\nNote: An image has been provided that should be analyzed using the analyzeImage tool. The image content is available for analysis.`
    }

    const result = await network.run(userPrompt)

    const isError =
      !result.state.data.summary ||
      Object.keys(result.state.data.files || {}).length === 0

    const sandboxUrl = await step.run('get-sandbox-url', async () => {
      const sandbox = await getSandbox(sandboxId)
      const host = sandbox.getHost(3000)
      return `https://${host}`
    })

    await step.run('save-result', async () => {
      if (isError)
        return await prisma.message.create({
          data: {
            content: 'Something went wrong. Please try again.',
            role: 'ASSISTANT',
            type: 'ERROR',
            projectId: event.data.projectId
          }
        })

      return await prisma.message.create({
        data: {
          content: result.state.data.summary,
          role: 'ASSISTANT',
          type: 'RESULT',
          fragment: {
            create: {
              sandboxUrl: sandboxUrl,
              title: 'Fragment',
              files: result.state.data.files
            }
          },
          projectId: event.data.projectId
        }
      })
    })
    return {
      url: sandboxUrl,
      title: 'Fragment',
      files: result.state.data.files,
      summary: result.state.data.summary
    }
  }
)
