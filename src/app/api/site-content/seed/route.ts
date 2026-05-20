import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { translations } from '@/lib/translations'

const SECTION_DEFINITIONS = [
  {
    sectionKey: 'hero',
    label: 'Hero Banner',
    order: 0,
    sectionType: 'hero',
    translationKeys: ['heroSubtitle', 'heroSlogan', 'heroTagline', 'heroCta', 'heroLearnMore'],
  },
  {
    sectionKey: 'vision',
    label: 'Vision & Mission',
    order: 1,
    sectionType: 'content',
    translationKeys: ['visionTitle', 'visionHeading', 'visionText', 'missionHeading', 'missionText'],
  },
  {
    sectionKey: 'ham-leadership',
    label: 'HAM Leadership',
    order: 2,
    sectionType: 'leadership',
    translationKeys: ['hamLeadershipTitle', 'hamPatron', 'hamPresident', 'hamPatronName', 'hamPresidentName', 'hamEndorsementName', 'hamEndorsementRole'],
  },
  {
    sectionKey: 'yham-leadership',
    label: 'YHAM Leadership',
    order: 3,
    sectionType: 'leadership',
    translationKeys: ['yhamLeadershipTitle', 'youthPresident', 'youthVicePresident', 'youthGenSecretary', 'youthGenSecretaryRole', 'youthPresidentName', 'youthVicePresidentName', 'youthGenSecretaryName'],
  },
  {
    sectionKey: 'grassroots',
    label: 'Grassroots Organization',
    order: 4,
    sectionType: 'content',
    translationKeys: ['grassrootsTitle', 'structureHeading', 'villageCommittee', 'villageDesc', 'blockCommittee', 'blockDesc', 'districtCommittee', 'districtDesc', 'membershipHeading', 'membershipOnline', 'membershipCampus', 'membershipInclusive'],
  },
  {
    sectionKey: 'opportunities',
    label: 'Youth Opportunities',
    order: 5,
    sectionType: 'content',
    translationKeys: ['opportunitiesTitle', 'localIssuesHeading', 'localIssue1', 'localIssue2', 'localIssue3', 'skillHeading', 'skill1', 'skill2', 'skill3'],
  },
  {
    sectionKey: 'national',
    label: 'National Presence',
    order: 6,
    sectionType: 'content',
    translationKeys: ['nationalTitle', 'digitalHeading', 'digital1', 'digital2', 'digital3', 'eventsHeading', 'event1', 'event2', 'mediaHeading', 'media1', 'media2', 'media3', 'brandingHeading', 'branding1', 'branding2', 'branding3'],
  },
  {
    sectionKey: 'collaboration',
    label: 'Collaboration & Partnerships',
    order: 7,
    sectionType: 'content',
    translationKeys: ['collaborationTitle', 'collabNGO', 'collabNGODesc', 'collabAcademic', 'collabAcademicDesc', 'collabCorporate', 'collabCorporateDesc', 'collabYouth', 'collabYouthDesc'],
  },
  {
    sectionKey: 'monitoring',
    label: 'Monitoring, Funding & Conduct',
    order: 8,
    sectionType: 'content',
    translationKeys: ['monitoringTitle', 'monitor1', 'monitor2', 'monitor3', 'monitor4', 'fundingTitle', 'fund1', 'fund2', 'fund3', 'fund4', 'conductTitle', 'conduct1', 'conduct2', 'conduct3'],
  },
  {
    sectionKey: 'cta',
    label: 'Call to Action',
    order: 9,
    sectionType: 'cta',
    translationKeys: ['ctaTitle', 'ctaSubtitle', 'ctaMembership', 'ctaWebsite', 'ctaEmail', 'ctaPhone', 'ctaClosing', 'ctaClosingSlogan'],
  },
]

export async function POST() {
  try {
    // Clear existing sections
    await db.siteSection.deleteMany({})

    const sections = []
    for (const def of SECTION_DEFINITIONS) {
      const contentHi: Record<string, string> = {}
      const contentEn: Record<string, string> = {}
      const contentMl: Record<string, string> = {}

      for (const key of def.translationKeys) {
        contentHi[key] = translations.hi[key] || key
        contentEn[key] = translations.en[key] || key
        contentMl[key] = translations.ml[key] || key
      }

      const section = await db.siteSection.create({
        data: {
          sectionKey: def.sectionKey,
          label: def.label,
          order: def.order,
          visible: true,
          sectionType: def.sectionType,
          contentHi: JSON.stringify(contentHi),
          contentEn: JSON.stringify(contentEn),
          contentMl: JSON.stringify(contentMl),
        },
      })
      sections.push(section)
    }

    return NextResponse.json({ success: true, count: sections.length, sections })
  } catch (error) {
    console.error('Error seeding site sections:', error)
    return NextResponse.json({ error: 'Failed to seed sections' }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    await db.siteSection.deleteMany({})
    return NextResponse.json({ success: true, message: 'All sections deleted' })
  } catch (error) {
    console.error('Error deleting sections:', error)
    return NextResponse.json({ error: 'Failed to delete sections' }, { status: 500 })
  }
}
