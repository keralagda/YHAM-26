import { NextResponse } from 'next/server'
import { verifySession } from '@/lib/auth'

export async function POST(request: Request) {
  const user = await verifySession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { mode, theme, tone, prompt, text, targetLang } = await request.json()

    if (!mode) {
      return NextResponse.json({ error: 'Generation mode is required' }, { status: 400 })
    }

    if (mode === 'script') {
      // Mock generation of campaign announcement scripts
      const script = generateMockScript(theme || 'development', tone || 'inspiring', prompt || '')
      return NextResponse.json({ result: script })
    }

    if (mode === 'speech') {
      // Mock generation of speech outlines
      const speech = generateMockSpeech(theme || 'social_justice', prompt || '')
      return NextResponse.json({ result: speech })
    }

    if (mode === 'translate') {
      // Mock translations
      if (!text || !targetLang) {
        return NextResponse.json({ error: 'Text and target language required' }, { status: 400 })
      }
      const translation = generateMockTranslation(text, targetLang)
      return NextResponse.json({ result: translation })
    }

    return NextResponse.json({ error: 'Invalid mode' }, { status: 400 })
  } catch (error) {
    console.error('AI API error:', error)
    return NextResponse.json({ error: 'AI processing failed' }, { status: 500 })
  }
}

function generateMockScript(theme: string, tone: string, prompt: string): string {
  const headers = {
    inspiring: "🌟 JAI HIND! TOGETHER WE RISE! 🌟",
    aggressive: "🔥 THE TIME FOR CHANGE IS NOW! 🔥",
    informative: "📢 IMPORTANT PARTY ANNOUNCEMENT 📢"
  }[tone as 'inspiring' | 'aggressive' | 'informative'] || "📢 ANNOUNCEMENT"

  const bodies = {
    development: `We are launching a comprehensive Youth Employment Drive starting next Monday. We aim to train over 5,000 volunteers in modern digital governance and campaign logistics. Let's make our constituencies models of modern infrastructure!`,
    social_justice: `Every voice matters. Under our new Jan Sunwai local programs, we are ensuring that grievance filing reaches the most remote booth levels. Our leaders will stand in solidarity with every marginalized citizen.`,
    cadre_rally: `All active Booth Leads and Panna Pramukhs are requested to coordinate local committee meetings this weekend. Ensure every household is visited, and log your activity counts in the workspace.`
  }[theme as 'development' | 'social_justice' | 'cadre_rally'] || `Let's work together to drive positive progress in our region. Reach out to all households and listen to public feedback.`

  return `${headers}\n\n${bodies}\n\nKey Focus: ${prompt || 'General Outreach'}\n\n- YHAM Youth Command`
}

function generateMockSpeech(theme: string, prompt: string): string {
  return `🎤 RALLY SPEECH OUTLINE: ${theme.toUpperCase().replace('_', ' ')}

[1. INTRODUCTION (0 - 2 mins)]
- Greet with traditional "Jai Bhim", "Jai Hind".
- Acknowledge local village/booth leaders and citizens gathered.
- Highlight the importance of youth leadership in modern politics.

[2. CORE PROBLEM (2 - 5 mins)]
- Discuss lack of active grievance redressal (connect with Jan Sunwai portal).
- Explain how previous systems neglected constituency development.
- Target Keyword Focus: "${prompt || 'Grassroots empowerment'}".

[3. OUR VISION & SOLUTION (5 - 8 mins)]
- Explain how YHAM digitizes cadet performance.
- Highlight the Blood Bank and disaster relief committees.
- Guarantee active participation at the Booth level.

[4. CALL TO ACTION (8 - 10 mins)]
- Urge youth to register via the Karyakarta Portal.
- Promote scan-to-verify digital ID registrations.
- Conclude with high-energy slogans.`
}

function generateMockTranslation(text: string, targetLang: string): string {
  if (targetLang === 'hi') {
    return `[अनुवाद]: ${text}\n\n(YHAM AI अनुवाद: कृपया घोषणापत्र प्रारूप सुनिश्चित करें)`
  }
  if (targetLang === 'ml') {
    return `[വിവർത്തനം]: ${text}\n\n(YHAM AI വിവർത്തനം: ബൂത്ത് തല വിവരങ്ങൾ)`
  }
  return `[Translated to EN]: ${text}\n\n(YHAM AI Translation)`
}
