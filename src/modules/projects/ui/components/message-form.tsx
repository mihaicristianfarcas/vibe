import { useForm } from 'react-hook-form'
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormField } from '@/components/ui/form'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import { Button } from '@/components/ui/button'
import { ArrowUpIcon, Loader2Icon } from 'lucide-react'
import { useTRPC } from '@/trpc/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

interface Props {
  projectId: string
}

const formSchema = z.object({
  value: z.string().min(1, { message: 'Message is required.' }).max(10000, {
    message: 'Message is too long!'
  })
})

const MessageForm = ({ projectId }: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      value: ''
    }
  })

  const [isFocused, setIsFocused] = useState(false)
  const showUsage = false

  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const createMessage = useMutation(
    trpc.messages.create.mutationOptions({
      onSuccess: () => {
        form.reset()
        queryClient.invalidateQueries(
          trpc.messages.getMany.queryOptions({ projectId })
        )
        // TODO invalidate usage status
      },
      onError: error => {
        // TODO Redirect to pricing page if related error
        toast.error(error.message)
      }
    })
  )

  const isPending = createMessage.isPending
  const isSendButtonDisabled = isPending || !form.formState.isValid

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await createMessage.mutateAsync({
      value: values.value,
      projectId
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(
          'bg-sidebar relative rounded-xl border p-4 transition-all',
          isFocused && 'shadow-xs',
          showUsage && 'rounded-t-none'
        )}
      >
        <FormField
          control={form.control}
          name='value'
          render={({ field }) => (
            <TextareaAutosize
              {...field}
              disabled={isPending}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              minRows={2}
              maxRows={8}
              className='w-full resize-none border-none bg-transparent pt-2 outline-none'
              placeholder='What would you like to build?'
              onKeyDown={event => {
                if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
                  event.preventDefault()
                  form.handleSubmit(onSubmit)(event)
                }
              }}
            />
          )}
        />
        <div className='flex items-end justify-between gap-x-2 pt-2'>
          <div className='text-muted-foreground font-mono text-xs'>
            <kbd className='bg-muted text-muted-foreground pointer-events-none ml-auto inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-xs font-medium select-none'>
              <span>&#8984; + Enter</span>
            </kbd>
            &nbsp;to submit
          </div>
          <Button
            disabled={isSendButtonDisabled}
            className={cn(
              'size-8 rounded-full',
              isSendButtonDisabled && 'bg-muted-foreground border'
            )}
          >
            {isPending ? (
              <Loader2Icon className='size-4 animate-spin' />
            ) : (
              <ArrowUpIcon />
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default MessageForm
