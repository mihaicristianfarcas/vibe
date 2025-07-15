'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTRPC } from '@/trpc/client';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

const Page = () => {
  const router = useRouter();
  const [value, setValue] = useState('');
  const trpc = useTRPC();
  const createProject = useMutation(
    trpc.projects.create.mutationOptions({
      onError: error => {
        toast.error(error.message);
      },
      onSuccess: data => {
        router.push(`/projects/${data.id}`);
      }
    })
  );
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-y-4">
        <Input value={value} onChange={event => setValue(event.target.value)} />
        <Button disabled={createProject.isPending} onClick={() => createProject.mutate({ value: value })}>
          SUBMIT
        </Button>
      </div>
    </div>
  );
};

export default Page;
