'use client';

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import MessagesContainer from '../components/messages-container';
import { Suspense } from 'react';

interface Props {
  projectId: string;
}

const ProjectView = ({ projectId }: Props) => {
  return (
    <div className="h-screen">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={35} minSize={20} className="flex min-h-0 flex-col">
          <Suspense fallback={<p>Loading messages...</p>}>
            <MessagesContainer projectId={projectId} />
          </Suspense>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={65} minSize={50}>
          TODO Preview
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default ProjectView;
