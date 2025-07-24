'use client'

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from '@/components/ui/resizable'
import MessagesContainer from '../components/messages-container'
import { Suspense, useState } from 'react'
import { Fragment } from '@/generated/prisma'
import ProjectHeader from '../components/project-header'
import FragmentWeb from '../components/fragment-web'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CodeIcon, CrownIcon, EyeIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import FileExplorer from '@/components/file-explorer'
import UserControl from '@/components/user-control'
import { Spinner } from '@/components/ui/spinner'

interface Props {
  projectId: string
}

const ProjectView = ({ projectId }: Props) => {
  const [activeFragment, setActiveFragment] = useState<Fragment | null>(null)
  const [tabState, setTabState] = useState<'preview' | 'code'>('preview')

  return (
    <div className='h-screen'>
      <ResizablePanelGroup direction='horizontal'>
        <ResizablePanel
          defaultSize={30}
          minSize={20}
          className='flex min-h-0 flex-col'
        >
          <Suspense
            fallback={
              <header className='flex items-center justify-between border-b p-3'>
                <div className='flex items-center gap-2'>
                  <Spinner />
                  <div className='bg-muted h-6 w-20 animate-pulse rounded' />
                </div>
              </header>
            }
          >
            <ProjectHeader projectId={projectId} />
          </Suspense>
          <Suspense
            fallback={
              <div className='flex min-h-0 flex-1 flex-col'>
                <div className='flex min-h-0 flex-1 items-center justify-center'>
                  <Spinner />
                </div>
              </div>
            }
          >
            <MessagesContainer
              projectId={projectId}
              activeFragment={activeFragment}
              setActiveFragment={setActiveFragment}
            />
          </Suspense>
        </ResizablePanel>
        <ResizableHandle className='hover:bg-primary transition-colors' />
        <ResizablePanel defaultSize={70} minSize={50}>
          <Tabs
            className='h-full gap-y-0'
            defaultValue='preview'
            value={tabState}
            onValueChange={value => setTabState(value as 'preview' | 'code')}
          >
            <div className='flex w-full items-center gap-x-2 border-b p-2'>
              <TabsList className='h-8 rounded-md border p-0'>
                <TabsTrigger value='preview' className='rounded-md'>
                  <EyeIcon />
                  <span>Demo</span>
                </TabsTrigger>
                <TabsTrigger value='code' className='rounded-md'>
                  <CodeIcon />
                  <span>Code</span>
                </TabsTrigger>
              </TabsList>
              <div className='ml-auto flex items-center gap-x-4'>
                <Button asChild size='sm' variant='tertiary'>
                  <Link href='/pricing'>
                    <CrownIcon /> Upgrade
                  </Link>
                </Button>
                <UserControl />
              </div>
            </div>
            <TabsContent value='preview'>
              {!!activeFragment && <FragmentWeb data={activeFragment} />}
            </TabsContent>
            <TabsContent value='code' className='min-h-0'>
              {!!activeFragment?.files && (
                <FileExplorer
                  files={activeFragment.files as { [path: string]: string }}
                />
              )}
            </TabsContent>
          </Tabs>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

export default ProjectView
