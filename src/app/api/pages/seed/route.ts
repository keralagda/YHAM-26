import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifySession } from '@/lib/auth'

export async function POST() {
  const user = await verifySession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const existingPages = await db.page.findMany()
    const existingSlugs = existingPages.map(p => p.slug)

    const defaultPages = [
      {
        slug: 'home',
        titleHi: 'मुख्य पृष्ठ',
        titleEn: 'Home',
        titleMl: 'ഹോം',
        description: 'Main landing page',
        template: 'landing',
        theme: 'saffron',
        published: true,
        isHomePage: true,
        order: 0,
      },
      {
        slug: 'national-leadership',
        titleHi: 'राष्ट्रीय नेतृत्व',
        titleEn: 'National Leadership',
        titleMl: 'ദേശീയ നേതൃത്വം',
        description: 'HAM National Executive members',
        template: 'fullwidth',
        theme: 'red-white',
        published: true,
        isHomePage: false,
        order: 1,
      },
      {
        slug: 'about',
        titleHi: 'हमारे बारे में',
        titleEn: 'About YHAM',
        titleMl: 'ഞങ്ങളെ കുറിച്ച്',
        description: 'About the Youth Wing',
        template: 'default',
        theme: 'saffron',
        published: false,
        isHomePage: false,
        order: 2,
      },
      {
        slug: 'south-india',
        titleHi: 'दक्षिण भारत अभियान',
        titleEn: 'South India Campaign',
        titleMl: 'ദക്ഷിണേന്ത്യ കാമ്പെയ്ൻ',
        description: 'Party expansion in South Indian states',
        template: 'landing',
        theme: 'green',
        published: false,
        isHomePage: false,
        order: 3,
      },
    ]

    const created = []
    for (const page of defaultPages) {
      if (!existingSlugs.includes(page.slug)) {
        const p = await db.page.create({ data: page })
        created.push(p)
      }
    }

    return NextResponse.json({ success: true, created: created.length, total: defaultPages.length })
  } catch (error) {
    console.error('Error seeding pages:', error)
    return NextResponse.json({ error: 'Failed to seed pages' }, { status: 500 })
  }
}
