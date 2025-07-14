import { inngest } from '@/inngest/client';
import { prisma } from '@/lib/db';
import { baseProcedure, createTRPCRouter } from '@/trpc/init';
import z from 'zod';

export const messageRouter = createTRPCRouter({
  create: baseProcedure
    .input(
      z.object({
        value: z.string().min(1, { message: 'Message is required.' })
      })
    )
    .mutation(async ({ input }) => {
      const newMessage = await prisma.message.create({
        data: {
          content: input.value,
          role: 'USER',
          type: 'RESULT'
        }
      });

      await inngest.send({
        name: 'code-agent/run',
        data: {
          value: input.value
        }
      });

      return newMessage;
    }),
  getMany: baseProcedure.query(async () => {
    const messages = await prisma.message.findMany({
      orderBy: { updatedAt: 'desc' }
      // include: { fragment: true }
    });
    return messages;
  })
});
