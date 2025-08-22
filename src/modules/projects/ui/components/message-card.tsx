import ThemeResponsiveLogo from '@/components/theme-responsive-logo'
import { Card } from '@/components/ui/card'
import { Fragment, MessageRole, MessageType } from '@/generated/prisma'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { ChevronRightIcon, Code2Icon } from 'lucide-react'
import { useUser } from '@clerk/nextjs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface UserMessageProps {
  content: string
  createdAt: Date
}

const UserMessage = ({ content, createdAt }: UserMessageProps) => {
  const { user } = useUser()

  return (
    <div className='group flex flex-col px-2 pb-4'>
      <div className='mb-2 flex items-center justify-end gap-2 pr-2'>
        <span className='text-muted-foreground text-xs opacity-0 transition-opacity group-hover:opacity-100'>
          {format(createdAt, "HH:mm 'on' MMM dd, yyyy")}
        </span>
        <span className='text-md font-medium'>{user?.firstName || 'You'}</span>
        <Avatar className='h-7 w-7'>
          <AvatarImage src={user?.imageUrl} />
          <AvatarFallback className='rounded-md text-xs'>
            {user?.firstName?.[0] ||
              user?.emailAddresses[0]?.emailAddress[0]?.toUpperCase() ||
              'U'}
          </AvatarFallback>
        </Avatar>
      </div>
      <Card className='bg-muted mr-8.5 ml-auto max-w-[80%] rounded-lg border-none p-3 break-words shadow-none'>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ children }) => <p className='mb-2 last:mb-0'>{children}</p>,
            code: ({ children, className }) => {
              const isInline = !className
              return isInline ? (
                <code className='bg-muted-foreground/20 rounded px-1 py-0.5 font-mono text-xs'>
                  {children}
                </code>
              ) : (
                <code className='bg-muted-foreground/10 block overflow-x-auto rounded p-2 font-mono text-xs'>
                  {children}
                </code>
              )
            },
            pre: ({ children }) => (
              <pre className='bg-muted-foreground/10 overflow-x-auto rounded p-2'>
                {children}
              </pre>
            ),
            ul: ({ children }) => (
              <ul className='mb-2 list-disc pl-4'>{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className='mb-2 list-decimal pl-4'>{children}</ol>
            ),
            li: ({ children }) => <li className='mb-1'>{children}</li>,
            blockquote: ({ children }) => (
              <blockquote className='border-muted-foreground/30 border-l-4 pl-4 italic'>
                {children}
              </blockquote>
            ),
            h1: ({ children }) => (
              <h1 className='mb-2 text-lg font-bold'>{children}</h1>
            ),
            h2: ({ children }) => (
              <h2 className='mb-2 text-base font-bold'>{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 className='mb-2 text-sm font-bold'>{children}</h3>
            ),
            strong: ({ children }) => (
              <strong className='font-semibold'>{children}</strong>
            ),
            em: ({ children }) => <em className='italic'>{children}</em>
          }}
        >
          {content}
        </ReactMarkdown>
      </Card>
    </div>
  )
}

interface FragmentCardProps {
  fragment: Fragment
  isActiveFragment: boolean
  onFragmentClick: (fragment: Fragment) => void
}

const FragmentCard = ({
  fragment,
  isActiveFragment,
  onFragmentClick
}: FragmentCardProps) => {
  return (
    <button
      className={cn(
        'bg-muted hover:bg-secondary flex w-fit items-start gap-2 rounded-lg border p-3 text-start transition-colors',
        isActiveFragment &&
          'bg-primary text-primary-foreground border-primary hover:bg-primary'
      )}
      onClick={() => onFragmentClick(fragment)}
    >
      <Code2Icon className='mt-0.5 size-4' />
      <span className='line-clamp-1 text-sm font-medium'>{fragment.title}</span>
      <div className='mt-0.5 flex items-center justify-center'>
        <ChevronRightIcon className='size-4' />
      </div>
    </button>
  )
}

interface AssistantMessageProps {
  content: string
  fragment: Fragment | null
  createdAt: Date
  isActiveFragment: boolean
  onFragmentClick: (fragment: Fragment) => void
  type: MessageType
}

const AssistantMessage = ({
  content,
  fragment,
  createdAt,
  isActiveFragment,
  onFragmentClick,
  type
}: AssistantMessageProps) => {
  return (
    <div
      className={cn(
        'group flex flex-col px-2 pb-4',
        type === 'ERROR' && 'text-red-700 dark:text-red-500'
      )}
    >
      <div className='mb-2 flex items-center gap-2 pl-2'>
        <ThemeResponsiveLogo
          className='h-7 w-7'
          aria-label='Wolf Logo'
          role='img'
        />
        <span className='text-md font-medium'>Vibe</span>
        <span className='text-muted-foreground text-xs opacity-0 transition-opacity group-hover:opacity-100'>
          {format(createdAt, "HH:mm 'on' MMM dd, yyyy")}
        </span>
      </div>
      <div className='flex flex-col gap-y-4 px-3'>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ children }) => <p className='mb-2 last:mb-0'>{children}</p>,
            code: ({ children, className }) => {
              const isInline = !className
              return isInline ? (
                <code className='bg-muted-foreground/20 rounded px-1 py-0.5 font-mono text-xs'>
                  {children}
                </code>
              ) : (
                <code className='bg-muted-foreground/10 block overflow-x-auto rounded p-2 font-mono text-xs'>
                  {children}
                </code>
              )
            },
            pre: ({ children }) => (
              <pre className='bg-muted-foreground/10 overflow-x-auto rounded p-2'>
                {children}
              </pre>
            ),
            ul: ({ children }) => (
              <ul className='mb-2 list-disc pl-4'>{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className='mb-2 list-decimal pl-4'>{children}</ol>
            ),
            li: ({ children }) => <li className='mb-1'>{children}</li>,
            blockquote: ({ children }) => (
              <blockquote className='border-muted-foreground/30 border-l-4 pl-4 italic'>
                {children}
              </blockquote>
            ),
            h1: ({ children }) => (
              <h1 className='mb-2 text-lg font-bold'>{children}</h1>
            ),
            h2: ({ children }) => (
              <h2 className='mb-2 text-base font-bold'>{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 className='mb-2 text-sm font-bold'>{children}</h3>
            ),
            strong: ({ children }) => (
              <strong className='font-semibold'>{children}</strong>
            ),
            em: ({ children }) => <em className='italic'>{children}</em>
          }}
        >
          {content.replace(/<task_summary>|<\/task_summary>/g, '')}
        </ReactMarkdown>
        {fragment && type === 'RESULT' && (
          <FragmentCard
            fragment={fragment}
            isActiveFragment={isActiveFragment}
            onFragmentClick={onFragmentClick}
          />
        )}
      </div>
    </div>
  )
}

interface MessageCardProps {
  content: string
  role: MessageRole
  fragment: Fragment | null
  createdAt: Date
  isActiveFragment: boolean
  onFragmentClick: (fragment: Fragment) => void
  type: MessageType
}

const MessageCard = ({
  content,
  role,
  fragment,
  createdAt,
  isActiveFragment,
  onFragmentClick,
  type
}: MessageCardProps) => {
  if (role === 'ASSISTANT')
    return (
      <AssistantMessage
        content={content}
        fragment={fragment}
        createdAt={createdAt}
        isActiveFragment={isActiveFragment}
        onFragmentClick={onFragmentClick}
        type={type}
      />
    )

  return <UserMessage content={content} createdAt={createdAt} />
}

export default MessageCard
