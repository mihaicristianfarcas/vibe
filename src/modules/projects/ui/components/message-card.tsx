import ThemeResponsiveLogo from '@/components/theme-responsive-logo'
import { Card } from '@/components/ui/card'
import { Fragment, MessageRole, MessageType } from '@/generated/prisma'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { ChevronRightIcon, Code2Icon } from 'lucide-react'
import Image from 'next/image'
interface UserMessageProps {
  content: string
}

const UserMessage = ({ content }: UserMessageProps) => {
  return (
    <div className='flex justify-end pr-2 pb-4 pl-10'>
      <Card className='bg-muted max-w-[80%] rounded-lg border-none p-3 break-words shadow-none'>
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
      <div className='flex flex-col gap-y-4 pl-8.5'>
        <span>{content}</span>
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

  return <UserMessage content={content} />
}

export default MessageCard
