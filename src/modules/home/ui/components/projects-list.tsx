'use client'

import ThemeResponsiveLogo from '@/components/theme-responsive-logo'
import { Button } from '@/components/ui/button'
import { useTRPC } from '@/trpc/client'
import { useUser } from '@clerk/nextjs'
import { useQuery } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import { AppWindowMac } from 'lucide-react'
import Link from 'next/link'

const ProjectsList = () => {
  const trpc = useTRPC()
  const { user } = useUser()
  const { data: projects } = useQuery(trpc.projects.getMany.queryOptions())

  if (!user) return null

  return (
    <div className='dark:bg-sidebar flex w-full flex-col gap-y-4 rounded-xl border bg-white p-6 sm:gap-y-3'>
      <h2 className='text-2xl font-semibold'>{user?.firstName}&apos;s Vibes</h2>
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
        {projects?.length === 0 && (
          <div className='col-span-full text-center'>
            <p className='text-muted-foreground text-sm'>
              No project found. Create your first project!
            </p>
          </div>
        )}
        {projects?.map(project => (
          <Button
            key={project.id}
            variant='outline'
            className='h-auto w-full justify-start p-3 text-start font-normal'
            asChild
          >
            <Link href={`/projects/${project.id}`}>
              <div className='flex items-center gap-x-4'>
                <AppWindowMac />
                <div className='flex flex-col'>
                  <h3 className='truncate font-medium'>{project.name}</h3>
                  <p className='text-muted-foreground text-sm'>
                    {formatDistanceToNow(project.updatedAt, {
                      addSuffix: true
                    })}
                  </p>
                </div>
              </div>
            </Link>
          </Button>
        ))}
      </div>
    </div>
  )
}

export default ProjectsList
