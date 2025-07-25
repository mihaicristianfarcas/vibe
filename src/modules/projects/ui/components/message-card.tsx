import ThemeResponsiveLogo from '@/components/theme-responsive-logo'
import { Card } from '@/components/ui/card'
import { Fragment, MessageRole, MessageType } from '@/generated/prisma'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { ChevronRightIcon, Code2Icon } from 'lucide-react'
import { useUser } from '@clerk/nextjs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

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
        {content}
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
        <span>{content.replace(/<task_summary>|<\/task_summary>/g, '')}</span>
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
