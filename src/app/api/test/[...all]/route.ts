import { NextResponse } from 'next/server'

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ all: string[] }> },
) {
  const { all } = await ctx.params
  return NextResponse.json({ ok: true, all })
}
