import { openai, anthropic } from '@inngest/agent-kit'
import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'

export enum AIProvider {
  OPENAI = 'openai',
  ANTHROPIC = 'anthropic'
}

export interface AIProviderConfig {
  agentModel: ReturnType<typeof openai> | ReturnType<typeof anthropic> // For agent-kit usage
  directClient: OpenAI | Anthropic // For direct API calls
  modelName: string
}

export function createAIProviderConfig(): AIProviderConfig {
  const provider = (process.env.AI_PROVIDER as AIProvider) || AIProvider.OPENAI

  switch (provider) {
    case AIProvider.ANTHROPIC:
      return {
        agentModel: anthropic({
          model: 'claude-sonnet-4-20250514',
          defaultParameters: {
            temperature: 0.1,
            max_tokens: 10000
          }
        }),
        directClient: new Anthropic({
          apiKey: process.env.ANTHROPIC_API_KEY
        }),
        modelName: 'claude-sonnet-4-20250514'
      }

    case AIProvider.OPENAI:
    default:
      return {
        agentModel: openai({
          model: 'gpt-4o',
          defaultParameters: { temperature: 0.1 }
        }),
        directClient: new OpenAI({
          apiKey: process.env.OPENAI_API_KEY
        }),
        modelName: 'gpt-4o'
      }
  }
}

export function getAIProvider(): AIProvider {
  return (process.env.AI_PROVIDER as AIProvider) || AIProvider.OPENAI
}
