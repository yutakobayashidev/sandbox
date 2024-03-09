import { InternalContext } from "@/config";

export async function getContentCache({
  command,
  text,
  ctx,
}: {
  command: string;
  text: string;
  ctx: InternalContext;
}) {
  const cachedText = await ctx.kv.get(`${command}:${text}`);

  return cachedText;
}

export async function putContentCache({
  ctx,
  command,
  text,
}: {
  command: string;
  text: string;
  ctx: InternalContext;
}) {
  return ctx.kv.put(`${command}:${text}`, text);
}
