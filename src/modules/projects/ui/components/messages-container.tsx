import { useTRPC } from '@/trpc/client';
import { useSuspenseQuery } from '@tanstack/react-query';
import MessageCard from './message-card';
import MessageForm from './message-form';
import { useEffect, useRef } from 'react';

interface Props {
  projectId: string;
}

const MessagesContainer = ({ projectId }: Props) => {
  const trpc = useTRPC();
  const { data: messages } = useSuspenseQuery(trpc.messages.getMany.queryOptions({ projectId: projectId }));

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lastAssistantMessage = messages.findLast(message => message.role === 'ASSISTANT');

    if (lastAssistantMessage) {
      // TODO set active fragment
    }
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView();
  }, [messages.length]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="pt-2 pr-1">
          {messages.map(message => (
            <MessageCard
              key={message.id}
              content={message.content}
              role={message.role}
              fragment={message.fragment}
              createdAt={message.createdAt}
              isActiveFragment={false}
              onFragmentClick={() => {}}
              type={message.type}
            />
          ))}
          <div ref={bottomRef} />
        </div>
      </div>
      <div className="relative p-3 pt-1">
        <div className="to-background pointer-events-none absolute -top-6 right-0 left-0 h-6 bg-gradient-to-b from-transparent" />
        <MessageForm projectId={projectId} />
      </div>
    </div>
  );
};

export default MessagesContainer;
