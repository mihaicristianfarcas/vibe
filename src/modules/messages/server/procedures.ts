import { inngest } from '@/inngest/client'
import { prisma } from '@/lib/db'
import { protectedProcedure, createTRPCRouter } from '@/trpc/init'
import { TRPCError } from '@trpc/server'
import z from 'zod'

export const messagesRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        value: z.string().min(1, { message: 'Value is required.' }).max(10000, {
          message: 'Value is too long'
        }),
        projectId: z.string().min(1, { message: 'Project ID is required.' })
      })
    )
    .mutation(async ({ input, ctx }) => {
      const project = await prisma.project.findUnique({
        where: {
          id: input.projectId,
          userId: ctx.auth.userId
        }
      })

      if (!project)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Project not found.'
        })

      const newMessage = await prisma.message.create({
        data: {
          content: input.value,
          role: 'USER',
          type: 'RESULT',
          projectId: project.id
        }
      })

      await inngest.send({
        name: 'code-agent/run',
        data: {
          value: input.value,
          projectId: input.projectId
        }
      })

      return newMessage
    }),
  getMany: protectedProcedure
    .input(
      z.object({
        projectId: z.string().min(1, { message: 'Project ID is required.' })
      })
    )
    .query(async ({ input, ctx }) => {
      const messages = await prisma.message.findMany({
        where: {
          projectId: input.projectId,
          project: {
            userId: ctx.auth.userId
          }
        },
        include: {
          fragment: true
        },
        orderBy: { updatedAt: 'asc' }
      })
      return messages
    })
})
