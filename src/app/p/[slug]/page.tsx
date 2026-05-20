import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import { PageRenderer } from './renderer'

export default async function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const page = await db.page.findUnique({
    where: { slug },
    include: { blocks: { where: { visible: true }, orderBy: { order: 'asc' } } },
  })

  if (!page || !page.published) notFound()

  // Fetch members if any leaders block references them
  const hasLeadersBlock = page.blocks.some(b => b.type === 'leaders')
  let members: any[] = []
  if (hasLeadersBlock) {
    members = await db.member.findMany({ where: { visible: true }, orderBy: { order: 'asc' } })
  }

  return <PageRenderer page={page} members={members} />
}
