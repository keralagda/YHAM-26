import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifySession } from '@/lib/auth'

export async function POST() {
  const user = await verifySession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    // Clear existing pages and blocks for a fresh seed
    await db.block.deleteMany({})
    await db.page.deleteMany({})

    // Also seed members if none exist
    const memberCount = await db.member.count()
    if (memberCount === 0) {
      const members = [
        { nameHi: 'जीतन राम मांझी', nameEn: 'Jitan Ram Manjhi', nameMl: 'ജിതൻ റാം മാഞ്ചി', roleHi: 'मुख्य संरक्षक', roleEn: 'Chief Patron', roleMl: 'മുഖ്യ രക്ഷാധികാരി', phone: '', email: '', imageUrl: 'https://ham.org.in/wp-content/uploads/2024/07/Jitan-Ram-Manjhi.png', category: 'ham', order: 0, visible: true },
        { nameHi: 'संतोष कुमार सुमन', nameEn: 'Santosh Kumar Suman', nameMl: 'സന്തോഷ് കുമാർ സുമൻ', roleHi: 'राष्ट्रीय अध्यक्ष', roleEn: 'National President', roleMl: 'ദേശീയ അധ്യക്ഷൻ', phone: '', email: '', imageUrl: '', category: 'ham', order: 1, visible: true },
        { nameHi: 'राजेश कुमार पाण्डेय', nameEn: 'Rajesh Kumar Pandey', nameMl: 'രാജേഷ് കുമാർ പാണ്ഡേ', roleHi: 'राष्ट्रीय प्रधान महासचिव', roleEn: 'National Chief General Secretary', roleMl: 'ദേശീയ ചീഫ് ജനറൽ സെക്രട്ടറി', phone: '+919431877286', email: '', imageUrl: 'https://ham.org.in/wp-content/uploads/2024/08/%E0%A4%B6%E0%A5%8D%E0%A4%B0%E0%A5%80-%E0%A4%B0%E0%A4%BE%E0%A4%9C%E0%A5%87%E0%A4%B6-%E0%A4%95%E0%A5%81%E0%A4%AE%E0%A4%BE%E0%A4%B0-%E0%A4%AA%E0%A4%BE%E0%A4%A3%E0%A5%8D%E0%A4%A1%E0%A5%87%E0%A4%AF.png', category: 'ham', order: 2, visible: true },
        { nameHi: 'प्रफुल्ल कुमार माँझी', nameEn: 'Prafulla Kumar Manjhi', nameMl: 'പ്രഫുല്ല കുമാർ മാഞ്ചി', roleHi: 'राष्ट्रीय उपाध्यक्ष', roleEn: 'National Vice President', roleMl: 'ദേശീയ വൈസ് പ്രസിഡന്റ്', phone: '', email: '', imageUrl: 'https://ham.org.in/wp-content/uploads/2024/07/Prafulla-Manjhi-MLA.png', category: 'ham', order: 3, visible: true },
        { nameHi: 'ज्योति देवी', nameEn: 'Jyoti Devi', nameMl: 'ജ്യോതി ദേവി', roleHi: 'राष्ट्रीय महासचिव', roleEn: 'National General Secretary', roleMl: 'ദേശീയ ജനറൽ സെക്രട്ടറി', phone: '', email: '', imageUrl: 'https://ham.org.in/wp-content/uploads/2024/07/Jyoti-Devi-MLA.png', category: 'ham', order: 4, visible: true },
        { nameHi: 'बिरेन्द्र कुमार सिंह', nameEn: 'Birendra Kumar Singh', nameMl: 'ബിരേന്ദ്ര കുമാർ സിംഗ്', roleHi: 'राष्ट्रीय उपाध्यक्ष', roleEn: 'National Vice President', roleMl: 'ദേശീയ വൈസ് പ്രസിഡന്റ്', phone: '', email: '', imageUrl: 'https://ham.org.in/wp-content/uploads/2024/08/%E0%A4%A1%E0%A5%89-%E0%A4%B5%E0%A5%80%E0%A4%B0%E0%A5%87%E0%A4%82%E0%A4%A6%E0%A5%8D%E0%A4%B0-%E0%A4%95%E0%A5%81%E0%A4%AE%E0%A4%BE%E0%A4%B0-%E0%A4%B8%E0%A4%BF%E0%A4%82%E0%A4%B9-.png', category: 'ham', order: 5, visible: true },
        { nameHi: 'मारकंडेय प्रसाद', nameEn: 'Markandeya Prasad', nameMl: 'മാർക്കണ്ഡേയ പ്രസാദ്', roleHi: 'राष्ट्रीय उपाध्यक्ष', roleEn: 'National Vice President', roleMl: 'ദേശീയ വൈസ് പ്രസിഡന്റ്', phone: '', email: '', imageUrl: 'https://ham.org.in/wp-content/uploads/2024/08/%E0%A4%AE%E0%A4%BE%E0%A4%B0%E0%A4%95%E0%A4%82%E0%A4%A1%E0%A5%87%E0%A4%AF-%E0%A4%AA%E0%A5%8D%E0%A4%B0%E0%A4%B8%E0%A4%BE%E0%A4%A6.png', category: 'ham', order: 6, visible: true },
        { nameHi: 'श्याम सुन्दर शरण', nameEn: 'Shyam Sundar Sharan', nameMl: 'ശ്യാം സുന്ദർ ശരൺ', roleHi: 'मुख्य राष्ट्रीय प्रवक्ता', roleEn: 'Chief National Spokesperson', roleMl: 'മുഖ്യ ദേശീയ വക്താവ്', phone: '', email: '', imageUrl: 'https://ham.org.in/wp-content/uploads/2024/08/shiv-sharan-sir.png', category: 'ham', order: 7, visible: true },
        // YHAM
        { nameHi: 'राजेश पाण्डेय', nameEn: 'Rajesh Pandey', nameMl: 'രാജേഷ് പാണ്ഡേ', roleHi: 'राष्ट्रीय प्रधान महासचिव, HAM (S)', roleEn: 'National Chief General Secretary, HAM (S)', roleMl: 'ദേശീയ ചീഫ് ജനറൽ സെക്രട്ടറി, HAM (S)', phone: '+919431877286', email: '', imageUrl: 'https://ham.org.in/wp-content/uploads/2024/08/%E0%A4%B6%E0%A5%8D%E0%A4%B0%E0%A5%80-%E0%A4%B0%E0%A4%BE%E0%A4%9C%E0%A5%87%E0%A4%B6-%E0%A4%95%E0%A5%81%E0%A4%AE%E0%A4%BE%E0%A4%B0-%E0%A4%AA%E0%A4%BE%E0%A4%A3%E0%A5%8D%E0%A4%A1%E0%A5%87%E0%A4%AF.png', category: 'yham', order: 0, visible: true },
        { nameHi: 'कमल परवेज़', nameEn: 'Kamal Parvez', nameMl: 'കമൽ പർവേസ്', roleHi: 'राष्ट्रीय युवा अध्यक्ष', roleEn: 'National Youth President', roleMl: 'ദേശീയ യുവജന അധ്യക്ഷൻ', phone: '+919431877286', email: '', imageUrl: '', category: 'yham', order: 1, visible: true },
        { nameHi: 'कैलास पी', nameEn: 'Kailas P', nameMl: 'കൈലാസ് പി', roleHi: 'राष्ट्रीय युवा उपाध्यक्ष (दक्षिण भारत प्रभारी)', roleEn: 'National Youth Vice President (South India In-charge)', roleMl: 'ദേശീയ യുവജന വൈസ് പ്രസിഡന്റ് (ദക്ഷിണേന്ത്യ ചുമതല)', phone: '+918606287838', email: '', imageUrl: '', category: 'yham', order: 2, visible: true },
        { nameHi: 'अनीस बी', nameEn: 'Anees B', nameMl: 'അനീസ് ബി', roleHi: 'संगठनात्मक - YHAM (दक्षिण भारत)', roleEn: 'Organizational - YHAM (South India)', roleMl: 'ഓർഗനൈസേഷണൽ - YHAM (ദക്ഷിണേന്ത്യ)', phone: '+917012693572', email: '', imageUrl: '', category: 'yham', order: 3, visible: true },
      ]
      for (const m of members) { await db.member.create({ data: m }) }
    }

    // ─── HOME PAGE ─────────────────────────────────────────────────────────
    const homePage = await db.page.create({
      data: {
        slug: 'home',
        titleHi: 'मुख्य पृष्ठ',
        titleEn: 'Home',
        titleMl: 'ഹോം',
        description: 'Main landing page of YHAM',
        template: 'landing',
        theme: 'saffron',
        published: true,
        isHomePage: true,
        order: 0,
      },
    })

    const homeBlocks = [
      {
        type: 'hero',
        order: 0,
        content: JSON.stringify({
          titleHi: 'सशक्त युवा, मजबूत भारत',
          titleEn: 'Empowered Youth, Strong India',
          titleMl: 'ശക്തമായ യുവാക്കൾ, ബലമുള്ള ഭാരതം',
          subtitleHi: 'राष्ट्रीय संवर्धन और जमीनी विकास की नई शुरुआत',
          subtitleEn: 'A New Beginning for National Promotion and Grassroots Development',
          subtitleMl: 'ദേശീയ പ്രമോഷനും പ്രാഥമിക വികസനവുമായുള്ള പുതിയ തുടക്കം',
          ctaText: 'Join Today',
          ctaLink: '#cta',
          bgImage: '',
        }),
        settings: JSON.stringify({ padding: 'py-20' }),
      },
      {
        type: 'text',
        order: 1,
        content: JSON.stringify({
          headingHi: 'हमारी दृष्टि',
          headingEn: 'Our Vision',
          headingMl: 'ഞങ്ങളുടെ ദർശനം',
          bodyHi: 'भारत के युवाओं को सशक्त बनाना, उन्हें राष्ट्र निर्माण में सक्रिय भागीदार बनाना और एक समावेशी, प्रगतिशील समाज का निर्माण करना। दक्षिण भारतीय राज्यों — केरल, तमिलनाडु, कर्नाटक, तेलंगाना और आंध्र प्रदेश में पार्टी की उपस्थिति बढ़ाने पर विशेष ध्यान।',
          bodyEn: 'To empower India\'s youth, make them active participants in nation-building, and create an inclusive, progressive society. With a special focus on expanding the party\'s presence in South Indian states — Kerala, Tamil Nadu, Karnataka, Telangana, and Andhra Pradesh.',
          bodyMl: 'ഇന്ത്യയിലെ യുവാക്കളെ ശാക്തീകരിക്കുക, രാഷ്ട്രനിർമ്മാണത്തിൽ സജീവ പങ്കാളികളാക്കുക, ഒരു ഉൾക്കൊള്ളുന്ന പുരോഗമന സമൂഹം സൃഷ്ടിക്കുക.',
        }),
        settings: JSON.stringify({ padding: 'py-16' }),
      },
      {
        type: 'text',
        order: 2,
        content: JSON.stringify({
          headingHi: 'हमारा मिशन',
          headingEn: 'Our Mission',
          headingMl: 'ഞങ്ങളുടെ ദൗത്യം',
          bodyHi: 'ग्राम से लेकर राष्ट्रीय स्तर तक युवाओं को संगठित करना, उनके मुद्दों को उठाना, नेतृत्व क्षमता विकसित करना और सामाजिक, आर्थिक व राजनीतिक परिवर्तन के लिए निरंतर काम करना। युवा उपाध्यक्ष और महासचिव पद दक्षिण भारत में पार्टी के जमीनी नेटवर्क के निर्माण के लिए समर्पित हैं।',
          bodyEn: 'To organize youth from the village level to the national level, raise their issues, develop leadership capacity, and work continuously for social, economic, and political change. The Youth Vice President and General Secretary positions are dedicated to building the party\'s grassroots network across South India.',
          bodyMl: 'ഗ്രാമ തലം മുതൽ ദേശീയ തലം വരെ യുവാക്കളെ സംഘടിപ്പിക്കുക, അവരുടെ പ്രശ്നങ്ങൾ ഉന്നയിക്കുക, നേതൃത്വ ശേഷി വികസിപ്പിക്കുക.',
        }),
        settings: JSON.stringify({ padding: 'py-12' }),
      },
      {
        type: 'leaders',
        order: 3,
        content: JSON.stringify({
          titleHi: 'हिंदुस्तानी अवाम मोर्चा (HAM) नेतृत्व',
          titleEn: 'Hindustani Awam Morcha (HAM) Leadership',
          titleMl: 'ഹിന്ദുസ്ഥാനി അവാം മോർച്ച (HAM) നേതൃത്വം',
          category: 'ham',
        }),
        settings: JSON.stringify({ columns: '4', padding: 'py-16', bgColor: '#000080' }),
      },
      {
        type: 'leaders',
        order: 4,
        content: JSON.stringify({
          titleHi: 'युवा हिंदुस्तानी अवाम मोर्चा नेतृत्व',
          titleEn: 'YHAM Youth Leadership',
          titleMl: 'യുവ ഹിന്ദുസ്ഥാനി അവാം മോർച്ച നേതൃത്വം',
          category: 'yham',
        }),
        settings: JSON.stringify({ columns: '4', padding: 'py-16' }),
      },
      {
        type: 'text',
        order: 5,
        content: JSON.stringify({
          headingHi: 'जमीनी स्तर पर संगठन',
          headingEn: 'Grassroots Organization',
          headingMl: 'പ്രാഥമിക തലത്തിലെ സംഘടന',
          bodyHi: 'हर गांव व शहरी वार्ड में 5–10 सक्रिय सदस्य, सीधे जनता से संपर्क। ब्लॉक/तहसील समितियां स्थानीय समस्याओं का समन्वित समाधान करती हैं। जिला समितियां राज्य व राष्ट्रीय स्तर से समन्वय करती हैं।',
          bodyEn: '5-10 active members in every village and urban ward maintaining direct contact with people. Block/Tehsil committees coordinate local problem resolution. District committees provide leadership and coordinate with state and national level.',
          bodyMl: 'ഓരോ ഗ്രാമത്തിലും നഗര വാർഡിലും 5-10 സജീവ അംഗങ്ങൾ, ജനങ്ങളുമായി നേരിട്ട് ബന്ധം. ബ്ലോക്ക്/താലൂക്ക് കമ്മിറ്റികൾ പ്രാദേശിക പ്രശ്നങ്ങൾ പരിഹരിക്കുന്നു.',
        }),
        settings: JSON.stringify({ padding: 'py-16' }),
      },
      {
        type: 'text',
        order: 6,
        content: JSON.stringify({
          headingHi: 'युवाओं के लिए अवसर',
          headingEn: 'Opportunities for Youth',
          headingMl: 'യുവാകൾക്കുള്ള അവസരങ്ങൾ',
          bodyHi: 'बेरोज़गारी, शिक्षा, स्वास्थ्य, स्वच्छता जैसे मुद्दों पर फोकस। नेतृत्व, संचार, डिजिटल साक्षरता पर कार्यशालाएं। कौशल विकास केंद्रों के लिए सरकार व निजी क्षेत्र से साझेदारी। उद्यमिता को बढ़ावा।',
          bodyEn: 'Focus on unemployment, education, health, sanitation issues. Workshops on leadership, communication, digital literacy. Partnership with government and private sector for skill development. Promoting entrepreneurship.',
          bodyMl: 'തൊഴിലില്ലായ്മ, വിദ്യാഭ്യാസം, ആരോഗ്യം, ശുചിത്വം എന്നിവയിൽ ശ്രദ്ധ. നേതൃത്വം, ആശയവിനിമയം, ഡിജിറ്റൽ സാക്ഷരത എന്നിവയിൽ വർക്ക്ഷോപ്പുകൾ.',
        }),
        settings: JSON.stringify({ padding: 'py-16' }),
      },
      {
        type: 'stats',
        order: 7,
        content: JSON.stringify({
          stat1Label: 'States Active',
          stat1Value: '28+',
          stat2Label: 'Youth Members',
          stat2Value: '50,000+',
          stat3Label: 'District Committees',
          stat3Value: '200+',
        }),
        settings: JSON.stringify({ padding: 'py-12' }),
      },
      {
        type: 'text',
        order: 8,
        content: JSON.stringify({
          headingHi: 'राष्ट्रीय स्तर पर पहचान',
          headingEn: 'National-Level Recognition',
          headingMl: 'ദേശീയ തലത്തിലെ അംഗീകാരം',
          bodyHi: 'पेशेवर वेबसाइट, ऑनलाइन सदस्यता और न्यूज़ अपडेट। फेसबुक, इंस्टाग्राम, ट्विटर, यूट्यूब पर सक्रिय कैंपेन। वार्षिक राष्ट्रीय अधिवेशन में देशभर के युवा प्रतिनिधि।',
          bodyEn: 'Professional website, online membership, and news updates. Active campaigns on Facebook, Instagram, Twitter, YouTube. Annual national convention with youth delegates from across the country.',
          bodyMl: 'പ്രൊഫഷണൽ വെബ്സൈറ്റ്, ഓൺലൈൻ അംഗത്വം, വാർത്താ അപ്ഡേറ്റുകൾ. ഫേസ്ബുക്ക്, ഇൻസ്റ്റാഗ്രാം, ട്വിറ്റർ, യൂട്യൂബ് എന്നിവയിൽ സജീവ കാമ്പെയ്നുകൾ.',
        }),
        settings: JSON.stringify({ padding: 'py-16' }),
      },
      {
        type: 'cta',
        order: 9,
        content: JSON.stringify({
          headingHi: 'आइए, युवा शक्ति को एकजुट करें!',
          headingEn: 'Let Us Unite the Youth Power!',
          headingMl: 'യുവ ശക്തിയെ ഒന്നിപ്പിക്കാം!',
          buttonText: 'Join YHAM',
          buttonLink: 'https://www.yham.in',
          phone: '+91-8606287838',
          email: 'join@yham.in',
        }),
        settings: JSON.stringify({ padding: 'py-16' }),
      },
      {
        type: 'contact',
        order: 10,
        content: JSON.stringify({
          title: 'Contact Us',
          submitText: 'Send Message',
        }),
        settings: JSON.stringify({ padding: 'py-16' }),
      },
    ]

    for (const block of homeBlocks) {
      await db.block.create({ data: { pageId: homePage.id, ...block, visible: true } })
    }

    // ─── NATIONAL LEADERSHIP PAGE ───────────────────────────────────────────
    const leadershipPage = await db.page.create({
      data: {
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
    })

    const leadershipBlocks = [
      {
        type: 'hero',
        order: 0,
        content: JSON.stringify({
          titleHi: 'राष्ट्रीय कार्यकारिणी',
          titleEn: 'National Executive',
          titleMl: 'ദേശീയ കാര്യനിർവാഹക സമിതി',
          subtitleHi: 'हिंदुस्तानी अवाम मोर्चा (HAM) की राष्ट्रीय कार्यकारिणी के सम्मानित सदस्य',
          subtitleEn: 'Esteemed members of the National Executive of Hindustani Awam Morcha (HAM)',
          subtitleMl: 'ഹിന്ദുസ്ഥാനി അവാം മോർച്ച (HAM) ദേശീയ കാര്യനിർവാഹക സമിതിയിലെ ബഹുമാന്യ അംഗങ്ങൾ',
          ctaText: '',
          ctaLink: '',
          bgImage: '',
        }),
        settings: JSON.stringify({ padding: 'py-16' }),
      },
      {
        type: 'leaders',
        order: 1,
        content: JSON.stringify({
          titleHi: 'शीर्ष नेतृत्व',
          titleEn: 'Top Leadership',
          titleMl: 'ഉന്നത നേതൃത്വം',
          category: 'ham',
        }),
        settings: JSON.stringify({ columns: '4', padding: 'py-12' }),
      },
      {
        type: 'leaders',
        order: 2,
        content: JSON.stringify({
          titleHi: 'युवा नेतृत्व (YHAM)',
          titleEn: 'Youth Leadership (YHAM)',
          titleMl: 'യുവ നേതൃത്വം (YHAM)',
          category: 'yham',
        }),
        settings: JSON.stringify({ columns: '4', padding: 'py-12' }),
      },
      {
        type: 'cta',
        order: 3,
        content: JSON.stringify({
          headingHi: 'हिंदुस्तानी अवाम मोर्चा से जुड़ें',
          headingEn: 'Join Hindustani Awam Morcha',
          headingMl: 'ഹിന്ദുസ്ഥാനി അവാം മോർച്ചയിൽ ചേരൂ',
          buttonText: 'Join HAM',
          buttonLink: 'https://ham.org.in/join-ham/',
          phone: '+91-9431877286',
          email: 'hampartyofficial@gmail.com',
        }),
        settings: JSON.stringify({ padding: 'py-12' }),
      },
    ]

    for (const block of leadershipBlocks) {
      await db.block.create({ data: { pageId: leadershipPage.id, ...block, visible: true } })
    }

    // ─── SOUTH INDIA CAMPAIGN PAGE ───────────────────────────────────────────
    const southIndiaPage = await db.page.create({
      data: {
        slug: 'south-india',
        titleHi: 'दक्षिण भारत अभियान',
        titleEn: 'South India Campaign',
        titleMl: 'ദക്ഷിണേന്ത്യ കാമ്പെയ്ൻ',
        description: 'Party expansion in South Indian states',
        template: 'landing',
        theme: 'green',
        published: true,
        isHomePage: false,
        order: 2,
      },
    })

    const southIndiaBlocks = [
      {
        type: 'hero',
        order: 0,
        content: JSON.stringify({
          titleHi: 'दक्षिण भारत में HAM का विस्तार',
          titleEn: 'HAM Expansion in South India',
          titleMl: 'ദക്ഷിണേന്ത്യയിൽ HAM-ന്റെ വിപുലീകരണം',
          subtitleHi: 'केरल, तमिलनाडु, कर्नाटक, तेलंगाना और आंध्र प्रदेश में पार्टी की उपस्थिति बढ़ाना',
          subtitleEn: 'Expanding party presence in Kerala, Tamil Nadu, Karnataka, Telangana, and Andhra Pradesh',
          subtitleMl: 'കേരളം, തമിഴ്‌നാട്, കർണാടക, തെലങ്കാന, ആന്ധ്രാപ്രദേശ് എന്നിവിടങ്ങളിൽ പാർട്ടിയുടെ സാന്നിധ്യം വിപുലീകരിക്കുക',
          ctaText: 'Join the Movement',
          ctaLink: '#contact',
          bgImage: '',
        }),
        settings: JSON.stringify({ padding: 'py-20' }),
      },
      {
        type: 'text',
        order: 1,
        content: JSON.stringify({
          headingHi: 'दक्षिण भारत रणनीति',
          headingEn: 'South India Strategy',
          headingMl: 'ദക്ഷിണേന്ത്യ തന്ത്രം',
          bodyHi: 'युवा उपाध्यक्ष और महासचिव पद विशेष रूप से दक्षिण भारत में पार्टी के जमीनी नेटवर्क के निर्माण के लिए समर्पित हैं। हमारा लक्ष्य है कि प्रत्येक दक्षिण भारतीय राज्य में जिला स्तर तक संगठन का विस्तार किया जाए।',
          bodyEn: 'The Youth Vice President and General Secretary positions are specifically dedicated to building the party\'s grassroots network in South India. Our goal is to expand the organization to the district level in every South Indian state.',
          bodyMl: 'യുവ വൈസ് പ്രസിഡന്റ്, ജനറൽ സെക്രട്ടറി സ്ഥാനങ്ങൾ പ്രത്യേകമായി ദക്ഷിണേന്ത്യയിൽ പാർട്ടിയുടെ അടിത്തട്ട് ശൃംഖല കെട്ടിപ്പടുക്കുന്നതിന് സമർപ്പിതമാണ്.',
        }),
        settings: JSON.stringify({ padding: 'py-16' }),
      },
      {
        type: 'stats',
        order: 2,
        content: JSON.stringify({
          stat1Label: 'Target States',
          stat1Value: '5',
          stat2Label: 'Districts Covered',
          stat2Value: '50+',
          stat3Label: 'Youth Volunteers',
          stat3Value: '10,000+',
        }),
        settings: JSON.stringify({ padding: 'py-12' }),
      },
      {
        type: 'leaders',
        order: 3,
        content: JSON.stringify({
          titleHi: 'दक्षिण भारत नेतृत्व',
          titleEn: 'South India Leadership',
          titleMl: 'ദക്ഷിണേന്ത്യ നേതൃത്വം',
          category: 'yham',
        }),
        settings: JSON.stringify({ columns: '3', padding: 'py-12' }),
      },
      {
        type: 'cta',
        order: 4,
        content: JSON.stringify({
          headingHi: 'दक्षिण भारत में YHAM से जुड़ें',
          headingEn: 'Join YHAM in South India',
          headingMl: 'ദക്ഷിണേന്ത്യയിൽ YHAM-ൽ ചേരൂ',
          buttonText: 'Register Now',
          buttonLink: 'https://www.yham.in',
          phone: '+91-8606287838',
          email: 'south@yham.in',
        }),
        settings: JSON.stringify({ padding: 'py-12' }),
      },
    ]

    for (const block of southIndiaBlocks) {
      await db.block.create({ data: { pageId: southIndiaPage.id, ...block, visible: true } })
    }

    // ─── ABOUT PAGE ──────────────────────────────────────────────────────────
    const aboutPage = await db.page.create({
      data: {
        slug: 'about',
        titleHi: 'हमारे बारे में',
        titleEn: 'About YHAM',
        titleMl: 'ഞങ്ങളെ കുറിച്ച്',
        description: 'About the Youth Wing of HAM',
        template: 'default',
        theme: 'saffron',
        published: true,
        isHomePage: false,
        order: 3,
      },
    })

    const aboutBlocks = [
      {
        type: 'hero',
        order: 0,
        content: JSON.stringify({
          titleHi: 'युवा हिंदुस्तानी अवाम मोर्चा',
          titleEn: 'Yuva Hindustani Awam Morcha',
          titleMl: 'യുവ ഹിന്ദുസ്ഥാനി അവാം മോർച്ച',
          subtitleHi: 'हिंदुस्तानी अवाम मोर्चा (सेक्युलर) का युवा प्रकोष्ठ',
          subtitleEn: 'The Youth Wing of Hindustani Awam Morcha (Secular)',
          subtitleMl: 'ഹിന്ദുസ്ഥാനി അവാം മോർച്ച (സെക്യുലർ) യുവജന വിഭാഗം',
          ctaText: '',
          ctaLink: '',
          bgImage: '',
        }),
        settings: JSON.stringify({ padding: 'py-16' }),
      },
      {
        type: 'text',
        order: 1,
        content: JSON.stringify({
          headingHi: 'पार्टी के बारे में',
          headingEn: 'About the Party',
          headingMl: 'പാർട്ടിയെ കുറിച്ച്',
          bodyHi: 'हिंदुस्तानी अवाम मोर्चा (सेक्युलर) एक भारतीय राजनीतिक दल है जिसकी बिहार में उपस्थिति है। इसे 8 मई 2015 को बिहार के पूर्व मुख्यमंत्री श्री जीतन राम मांझी ने औपचारिक रूप से लॉन्च किया था। YHAM इसका युवा प्रकोष्ठ है जो भारत भर में युवाओं को संगठित करने का काम करता है।',
          bodyEn: 'Hindustani Awam Morcha (Secular), abbreviated HAM(S), is an Indian political party with a presence in Bihar. It was launched formally on 8 May 2015 by former Chief Minister of Bihar, Shri Jitan Ram Manjhi. YHAM is its youth wing that works to organize youth across India.',
          bodyMl: 'ഹിന്ദുസ്ഥാനി അവാം മോർച്ച (സെക്യുലർ) ബിഹാറിൽ സാന്നിധ്യമുള്ള ഒരു ഇന്ത്യൻ രാഷ്ട്രീയ പാർട്ടിയാണ്. 2015 മെയ് 8-ന് ബിഹാർ മുൻ മുഖ്യമന്ത്രി ശ്രീ ജിതൻ റാം മാഞ്ചി ഔപചാരികമായി ആരംഭിച്ചു.',
        }),
        settings: JSON.stringify({ padding: 'py-16' }),
      },
      {
        type: 'text',
        order: 2,
        content: JSON.stringify({
          headingHi: 'सहयोग और भागीदारी',
          headingEn: 'Collaboration & Partnerships',
          headingMl: 'സഹകരണം & പങ്കാളിത്തം',
          bodyHi: 'समान विचारधारा वाले एनजीओ और नागरिक समाज संगठनों के साथ सहयोग। स्कूलों, कॉलेजों और विश्वविद्यालयों के साथ साझेदारी। कॉर्पोरेट सामाजिक जिम्मेदारी (CSR) के तहत परियोजनाओं के लिए सहयोग। अन्य युवा संगठनों के साथ नेटवर्क और संयुक्त कार्यक्रम।',
          bodyEn: 'Collaboration with like-minded NGOs and civil society organizations. Partnership with schools, colleges, and universities. Collaboration for projects under Corporate Social Responsibility (CSR). Networking with other youth organizations and joint programs.',
          bodyMl: 'സമാന ചിന്താഗതിക്കാരായ എൻജിഒകളുമായും സിവിൽ സൊസൈറ്റി സംഘടനകളുമായും സഹകരണം. സ്കൂളുകൾ, കോളേജുകൾ, സർവകലാശാലകൾ എന്നിവയുമായി പങ്കാളിത്തം.',
        }),
        settings: JSON.stringify({ padding: 'py-16' }),
      },
      {
        type: 'text',
        order: 3,
        content: JSON.stringify({
          headingHi: 'आचार संहिता',
          headingEn: 'Code of Conduct',
          headingMl: 'പെരുമാറ്റച്ചട്ടം',
          bodyHi: 'अनुशासन और उच्च नैतिक मानक। वित्तीय लेनदेन में पारदर्शिता। नेतृत्व को सदस्यों के प्रति जवाबदेह बनाएं।',
          bodyEn: 'Discipline and high ethical standards. Transparency in financial transactions. Accountable leadership towards members.',
          bodyMl: 'അച്ചടക്കവും ഉയർന്ന ധാർമ്മിക മാനദണ്ഡങ്ങളും. സാമ്പത്തിക ഇടപാടുകളിൽ സുതാര്യത. അംഗങ്ങൾക്ക് ഉത്തരവാദിയായ നേതൃത്വം.',
        }),
        settings: JSON.stringify({ padding: 'py-12' }),
      },
    ]

    for (const block of aboutBlocks) {
      await db.block.create({ data: { pageId: aboutPage.id, ...block, visible: true } })
    }

    return NextResponse.json({
      success: true,
      pages: 4,
      message: 'Seeded Home (11 blocks), National Leadership (4 blocks), South India (5 blocks), About (4 blocks)',
    })
  } catch (error) {
    console.error('Error seeding pages:', error)
    return NextResponse.json({ error: 'Failed to seed pages' }, { status: 500 })
  }
}
