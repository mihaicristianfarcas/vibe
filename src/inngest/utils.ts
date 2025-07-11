import Sandbox from '@e2b/code-interpreter';

export async function getSandbox(sandboxId: string) {
  const sandbox = await Sandbox.connect(sandboxId);
  if (!sandbox) {
    throw new Error(`Sandbox with ID ${sandboxId} not found`);
  }
  return sandbox;
}
