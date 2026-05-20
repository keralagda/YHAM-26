export type Language = "hi" | "en" | "ml";

export const translations: Record<Language, Record<string, string>> = {
  hi: {
    // Header
    orgName: "युवा हिंदुस्तानी अवाम मोर्चा",
    orgShortName: "YHAM",
    navHome: "मुख्य",
    navVision: "दृष्टि",
    navStructure: "संगठन",
    navOpportunities: "अवसर",
    navNational: "राष्ट्रीय",
    navLeadership: "नेतृत्व",
    navContact: "संपर्क",
    langToggle: "भाषा",

    // Hero Section
    heroSubtitle: "राष्ट्रीय संवर्धन और जमीनी विकास की नई शुरुआत",
    heroSlogan: "सशक्त युवा, मजबूत भारत",
    heroTagline: "भारत के युवाओं को संगठित कर, समावेशी और प्रगतिशील समाज का निर्माण",
    heroCta: "आज ही जुड़ें",
    heroLearnMore: "और जानें",

    // Vision & Mission
    visionTitle: "दृष्टि और मिशन",
    visionHeading: "हमारी दृष्टि",
    visionText: "भारत के युवाओं को सशक्त बनाना, उन्हें राष्ट्र निर्माण में सक्रिय भागीदार बनाना और एक समावेशी, प्रगतिशील समाज का निर्माण करना।",
    missionHeading: "हमारा मिशन",
    missionText: "ग्राम से लेकर राष्ट्रीय स्तर तक युवाओं को संगठित करना, उनके मुद्दों को उठाना, नेतृत्व क्षमता विकसित करना और सामाजिक, आर्थिक व राजनीतिक परिवर्तन के लिए निरंतर काम करना।",

    // HAM Leadership
    hamLeadershipTitle: "हिंदुस्तानी अवाम मोर्चा (HAM) नेतृत्व",
    hamPatron: "राष्ट्रीय संरक्षक",
    hamPresident: "राष्ट्रीय अध्यक्ष",
    hamPatronName: "जीतन राम मांझी",
    hamPresidentName: "संतोष कुमार सुमन",
    hamEndorsementName: "श्री फग्गन सिंह कुलस्ते",
    hamEndorsementRole: "राज्यपाल 2024",

    // YHAM Leadership
    yhamLeadershipTitle: "युवा हिंदुस्तानी अवाम मोर्चा नेतृत्व",
    youthPresident: "राष्ट्रीय युवा अध्यक्ष",
    youthVicePresident: "राष्ट्रीय युवा उपाध्यक्ष",
    youthGenSecretary: "राष्ट्रीय युवा महासचिव",
    youthPresidentName: "कमल परवेज़",
    youthVicePresidentName: "कैलास पी",
    youthGenSecretaryName: "अनीस बी",
    youthGenSecretaryRole: "संगठनात्मक - YHAM",
    proposedBy: "प्रस्तावित by",

    // Grassroots
    grassrootsTitle: "जमीनी स्तर पर संगठन",
    structureHeading: "जमीनी ढांचा",
    villageCommittee: "ग्राम/वार्ड समितियां",
    villageDesc: "हर गांव व शहरी वार्ड में 5–10 सक्रिय सदस्य, सीधे जनता से संपर्क।",
    blockCommittee: "ब्लॉक/तहसील समितियां",
    blockDesc: "स्थानीय समस्याओं का समन्वित समाधान और गतिविधियों का समन्वय।",
    districtCommittee: "जिला समितियां",
    districtDesc: "जिले में नेतृत्व, राज्य व राष्ट्रीय स्तर से समन्वय।",
    membershipHeading: "सदस्यता अभियान",
    membershipOnline: "ऑनलाइन पोर्टल और मोबाइल ऐप के माध्यम से आसान पंजीकरण।",
    membershipCampus: "स्कूल, कॉलेज, विश्वविद्यालय व ट्रेनिंग सेंटरों में सदस्यता शिविर।",
    membershipInclusive: "सभी धर्म, जाति, लिंग और वर्ग के युवाओं की समावेशी भागीदारी।",

    // Opportunities
    opportunitiesTitle: "युवाओं के लिए अवसर",
    localIssuesHeading: "स्थानीय मुद्दों पर काम",
    localIssue1: "बेरोज़गारी, शिक्षा, स्वास्थ्य, स्वच्छता, सड़क, पानी, बिजली जैसे मुद्दों पर फोकस।",
    localIssue2: "जनसुनवाई के ज़रिए समस्याओं और सुझावों को सुनना।",
    localIssue3: "केवल विरोध नहीं, समाधान-उन्मुख कार्रवाई।",
    skillHeading: "कौशल और नेतृत्व विकास",
    skill1: "नेतृत्व, संचार, डिजिटल साक्षरता और सामाजिक कार्य पर कार्यशालाएं।",
    skill2: "कौशल विकास केंद्रों के लिए सरकार व निजी क्षेत्र से साझेदारी।",
    skill3: "उद्यमिता को बढ़ावा, खुद का व्यवसाय शुरू करने में सहयोग।",

    // National Presence
    nationalTitle: "राष्ट्रीय स्तर पर पहचान",
    digitalHeading: "डिजिटल और मीडिया उपस्थिति",
    digital1: "पेशेवर वेबसाइट, ऑनलाइन सदस्यता और न्यूज़ अपडेट।",
    digital2: "फेसबुक, इंस्टाग्राम, ट्विटर, यूट्यूब और लिंक्डइन पर सक्रिय कैंपेन।",
    digital3: "राष्ट्रीय मुद्दों पर ऑनलाइन अभियान और हैशटैग मूवमेंट।",
    eventsHeading: "राष्ट्रीय कार्यक्रम",
    event1: "वार्षिक राष्ट्रीय अधिवेशन में देशभर के युवा प्रतिनिधि।",
    event2: "युवा संसद, रैलियां और पदयात्राएं, जागरूकता और भागीदारी के लिए।",
    mediaHeading: "मीडिया संबंध",
    media1: "प्रमुख घटनाओं और घोषणाओं के लिए प्रेस विज्ञप्ति जारी करें।",
    media2: "महत्वपूर्ण मुद्दों पर प्रेस कॉन्फ्रेंस आयोजित करें।",
    media3: "राष्ट्रीय और क्षेत्रीय मीडिया आउटलेट्स के साथ संबंध बनाएं।",
    brandingHeading: "ब्रांडिंग और संदेश",
    branding1: "एक स्पष्ट और सम्मोहक संदेश जो युवाओं के साथ गूंजता हो।",
    branding2: "यादगार लोगो और नारा।",
    branding3: "पोस्टर, बैनर, पर्चे, और टी-शर्ट जैसी प्रचार सामग्री।",

    // Collaboration
    collaborationTitle: "सहयोग और भागीदारी",
    collabNGO: "एनजीओ और नागरिक समाज",
    collabNGODesc: "समान विचारधारा वाले एनजीओ और नागरिक समाज संगठनों के साथ सहयोग।",
    collabAcademic: "शैक्षणिक संस्थान",
    collabAcademicDesc: "स्कूलों, कॉलेजों और विश्वविद्यालयों के साथ साझेदारी।",
    collabCorporate: "कॉर्पोरेट क्षेत्र",
    collabCorporateDesc: "कॉर्पोरेट सामाजिक जिम्मेदारी (CSR) के तहत परियोजनाओं के लिए सहयोग।",
    collabYouth: "अन्य युवा संगठन",
    collabYouthDesc: "अन्य युवा संगठनों के साथ नेटवर्क और संयुक्त कार्यक्रम।",

    // Monitoring & Funding
    monitoringTitle: "निगरानी और मूल्यांकन",
    monitor1: "रणनीति की प्रगति की नियमित समीक्षा।",
    monitor2: "सदस्यों और जनता से फीडबैक एकत्र।",
    monitor3: "फीडबैक और बदलते परिवेश के आधार पर रणनीति को अपनाएं।",
    monitor4: "सदस्यता, कार्यक्रमों और गतिविधियों का डेटा एकत्र और विश्लेषण।",
    fundingTitle: "वित्त पोषण",
    fund1: "मामूली सदस्यता शुल्क।",
    fund2: "व्यक्तियों और संगठनों से दान।",
    fund3: "विशिष्ट परियोजनाओं के लिए ऑनलाइन क्राउडफंडिंग अभियान।",
    fund4: "कार्यक्रमों और गतिविधियों के लिए कॉर्पोरेट प्रायोजन।",

    // Code of Conduct
    conductTitle: "आचार संहिता",
    conduct1: "अनुशासन और उच्च नैतिक मानक।",
    conduct2: "वित्तीय लेनदेन में पारदर्शिता।",
    conduct3: "नेतृत्व को सदस्यों के प्रति जवाबदेह बनाएं।",

    // Call to Action
    ctaTitle: "आइए, युवा शक्ति को एकजुट करें!",
    ctaSubtitle: "आज ही जुड़ें – युवा हिंदुस्तानी अवाम मोर्चा के साथ",
    ctaMembership: "सदस्यता हेतु",
    ctaWebsite: "वेबसाइट",
    ctaEmail: "ईमेल",
    ctaPhone: "फ़ोन/व्हाट्सएप",
    ctaClosing: "साथ मिलकर बनाएं",
    ctaClosingSlogan: "युवा नेतृत्व वाला नया हिंदुस्तान",

    // Footer
    footerTagline: "सशक्त युवा, मजबूत भारत",
    footerRights: "सर्वाधिकार सुरक्षित",
    footerFollow: "हमें फॉलो करें",
    footerQuickLinks: "त्वरित लिंक",
  },

  en: {
    // Header
    orgName: "Yuva Hindustani Awam Morcha",
    orgShortName: "YHAM",
    navHome: "Home",
    navVision: "Vision",
    navStructure: "Organization",
    navOpportunities: "Opportunities",
    navNational: "National",
    navLeadership: "Leadership",
    navContact: "Contact",
    langToggle: "Language",

    // Hero Section
    heroSubtitle: "A New Beginning for National Promotion and Grassroots Development",
    heroSlogan: "Empowered Youth, Strong India",
    heroTagline: "Organizing India's youth to build an inclusive and progressive society",
    heroCta: "Join Today",
    heroLearnMore: "Learn More",

    // Vision & Mission
    visionTitle: "Vision & Mission",
    visionHeading: "Our Vision",
    visionText: "To empower India's youth, make them active participants in nation-building, and create an inclusive, progressive society.",
    missionHeading: "Our Mission",
    missionText: "To organize youth from the village level to the national level, raise their issues, develop leadership capacity, and work continuously for social, economic, and political change.",

    // HAM Leadership
    hamLeadershipTitle: "Hindustani Awam Morcha (HAM) Leadership",
    hamPatron: "National Patron",
    hamPresident: "National President",
    hamPatronName: "Jitan Ram Manjhi",
    hamPresidentName: "Santosh Kumar Suman",
    hamEndorsementName: "Shri Faggan Singh Kulaste",
    hamEndorsementRole: "Governor 2024",

    // YHAM Leadership
    yhamLeadershipTitle: "Yuva Hindustani Awam Morcha Leadership",
    youthPresident: "National Youth President",
    youthVicePresident: "National Youth Vice President",
    youthGenSecretary: "National Youth General Secretary",
    youthPresidentName: "Kamal Parvez",
    youthVicePresidentName: "Kailas P",
    youthGenSecretaryName: "Anees B",
    youthGenSecretaryRole: "Organizational - YHAM",
    proposedBy: "Proposed by",

    // Grassroots
    grassrootsTitle: "Grassroots Organization",
    structureHeading: "Organizational Structure",
    villageCommittee: "Village/Ward Committees",
    villageDesc: "5–10 active members in every village and urban ward, maintaining direct contact with the people.",
    blockCommittee: "Block/Tehsil Committees",
    blockDesc: "Coordinated resolution of local problems and coordination of activities.",
    districtCommittee: "District Committees",
    districtDesc: "Leadership at district level, coordination with state and national level.",
    membershipHeading: "Membership Campaign",
    membershipOnline: "Easy registration through online portal and mobile app.",
    membershipCampus: "Membership camps in schools, colleges, universities, and training centers.",
    membershipInclusive: "Inclusive participation of youth from all religions, castes, genders, and backgrounds.",

    // Opportunities
    opportunitiesTitle: "Opportunities for Youth",
    localIssuesHeading: "Working on Local Issues",
    localIssue1: "Focus on issues like unemployment, education, health, sanitation, roads, water, and electricity.",
    localIssue2: "Listening to problems and suggestions through public hearings.",
    localIssue3: "Not just opposition, but solution-oriented action.",
    skillHeading: "Skill & Leadership Development",
    skill1: "Workshops on leadership, communication, digital literacy, and social work.",
    skill2: "Partnership with government and private sector for skill development centers.",
    skill3: "Promoting entrepreneurship, support in starting own business.",

    // National Presence
    nationalTitle: "National-Level Recognition",
    digitalHeading: "Digital & Media Presence",
    digital1: "Professional website, online membership, and news updates.",
    digital2: "Active campaigns on Facebook, Instagram, Twitter, YouTube, and LinkedIn.",
    digital3: "Online campaigns and hashtag movements on national issues.",
    eventsHeading: "National Events",
    event1: "Annual national convention with youth delegates from across the country.",
    event2: "Youth Parliament, rallies, and padayatras for awareness and participation.",
    mediaHeading: "Media Relations",
    media1: "Press releases for major events and announcements.",
    media2: "Press conferences on important issues.",
    media3: "Building relationships with national and regional media outlets.",
    brandingHeading: "Branding & Messaging",
    branding1: "A clear and compelling message that resonates with youth.",
    branding2: "Memorable logo and slogan.",
    branding3: "Promotional materials like posters, banners, flyers, and T-shirts.",

    // Collaboration
    collaborationTitle: "Collaboration & Partnerships",
    collabNGO: "NGOs & Civil Society",
    collabNGODesc: "Collaboration with like-minded NGOs and civil society organizations.",
    collabAcademic: "Academic Institutions",
    collabAcademicDesc: "Partnership with schools, colleges, and universities.",
    collabCorporate: "Corporate Sector",
    collabCorporateDesc: "Collaboration for projects under Corporate Social Responsibility (CSR).",
    collabYouth: "Other Youth Organizations",
    collabYouthDesc: "Networking with other youth organizations and joint programs.",

    // Monitoring & Funding
    monitoringTitle: "Monitoring & Evaluation",
    monitor1: "Regular review of strategy progress.",
    monitor2: "Collecting feedback from members and the public.",
    monitor3: "Adapting strategy based on feedback and changing circumstances.",
    monitor4: "Data collection and analysis of membership, programs, and activities.",
    fundingTitle: "Funding",
    fund1: "Nominal membership fees.",
    fund2: "Donations from individuals and organizations.",
    fund3: "Online crowdfunding campaigns for specific projects.",
    fund4: "Corporate sponsorship for programs and activities.",

    // Code of Conduct
    conductTitle: "Code of Conduct",
    conduct1: "Discipline and high ethical standards.",
    conduct2: "Transparency in financial transactions.",
    conduct3: "Accountable leadership towards members.",

    // Call to Action
    ctaTitle: "Let Us Unite the Youth Power!",
    ctaSubtitle: "Join today – with Yuva Hindustani Awam Morcha",
    ctaMembership: "For Membership",
    ctaWebsite: "Website",
    ctaEmail: "Email",
    ctaPhone: "Phone/WhatsApp",
    ctaClosing: "Together we build",
    ctaClosingSlogan: "A New India with Youth Leadership",

    // Footer
    footerTagline: "Empowered Youth, Strong India",
    footerRights: "All Rights Reserved",
    footerFollow: "Follow Us",
    footerQuickLinks: "Quick Links",
  },

  ml: {
    // Header
    orgName: "യുവ ഹിന്ദുസ്ഥാനി അവാം മോർച്ച",
    orgShortName: "YHAM",
    navHome: "ഹോം",
    navVision: "ദർശനം",
    navStructure: "സംഘടന",
    navOpportunities: "അവസരങ്ങൾ",
    navNational: "ദേശീയ",
    navLeadership: "നേതൃത്വം",
    navContact: "ബന്ധപ്പെടുക",
    langToggle: "ഭാഷ",

    // Hero Section
    heroSubtitle: "ദേശീയ പ്രമോഷനും പ്രാഥമിക വികസനവുമായുള്ള പുതിയ തുടക്കം",
    heroSlogan: "ശക്തമായ യുവാക്കൾ, ബലമുള്ള ഭാരതം",
    heroTagline: "ഒരു ഉൾക്കൊള്ളുന്ന, പുരോഗമന സമൂഹം കെട്ടിപ്പടുക്കാൻ ഇന്ത്യയിലെ യുവാക്കളെ സംഘടിപ്പിക്കുന്നു",
    heroCta: "ഇന്നേ ചേരൂ",
    heroLearnMore: "കൂടുതൽ അറിയുക",

    // Vision & Mission
    visionTitle: "ദർശനവും ദൗത്യവും",
    visionHeading: "ഞങ്ങളുടെ ദർശനം",
    visionText: "ഇന്ത്യയിലെ യുവാക്കളെ ശാക്തീകരിക്കുക, രാഷ്ട്രനിർമ്മാണത്തിൽ സജീവ പങ്കാളികളാക്കുക, ഒരു ഉൾക്കൊള്ളുന്ന പുരോഗമന സമൂഹം സൃഷ്ടിക്കുക.",
    missionHeading: "ഞങ്ങളുടെ ദൗത്യം",
    missionText: "ഗ്രാമ തലം മുതൽ ദേശീയ തലം വരെ യുവാക്കളെ സംഘടിപ്പിക്കുക, അവരുടെ പ്രശ്നങ്ങൾ ഉന്നയിക്കുക, നേതൃത്വ ശേഷി വികസിപ്പിക്കുക, സാമൂഹിക, സാമ്പത്തിക, രാഷ്ട്രീയ മാറ്റത്തിനായി തുടർച്ചയായി പ്രവർത്തിക്കുക.",

    // HAM Leadership
    hamLeadershipTitle: "ഹിന്ദുസ്ഥാനി അവാം മോർച്ച (HAM) നേതൃത്വം",
    hamPatron: "ദേശീയ രക്ഷാധികാരി",
    hamPresident: "ദേശീയ അധ്യക്ഷൻ",
    hamPatronName: "ജിതൻ റാം മാഞ്ചി",
    hamPresidentName: "സന്തോഷ് കുമാർ സുമൻ",
    hamEndorsementName: "ശ്രീ ഫഗ്ഗൻ സിംഗ് കുലസ്തെ",
    hamEndorsementRole: "ഗവർണർ 2024",

    // YHAM Leadership
    yhamLeadershipTitle: "യുവ ഹിന്ദുസ്ഥാനി അവാം മോർച്ച നേതൃത്വം",
    youthPresident: "ദേശീയ യുവജന അധ്യക്ഷൻ",
    youthVicePresident: "ദേശീയ യുവജന വൈസ് പ്രസിഡന്റ്",
    youthGenSecretary: "ദേശീയ യുവജന ജനറൽ സെക്രട്ടറി",
    youthPresidentName: "കമൽ പർവേസ്",
    youthVicePresidentName: "കൈലാസ് പി",
    youthGenSecretaryName: "അനീസ് ബി",
    youthGenSecretaryRole: "ഓർഗനൈസേഷണൽ - YHAM",
    proposedBy: "നിർദ്ദേശിച്ചത്",

    // Grassroots
    grassrootsTitle: "പ്രാഥമിക തലത്തിലെ സംഘടന",
    structureHeading: "സാംഘിക ഘടന",
    villageCommittee: "ഗ്രാമ/വാർഡ് കമ്മിറ്റികൾ",
    villageDesc: "ഓരോ ഗ്രാമത്തിലും നഗര വാർഡിലും 5-10 സജീവ അംഗങ്ങൾ, ജനങ്ങളുമായി നേരിട്ട് ബന്ധം.",
    blockCommittee: "ബ്ലോക്ക്/താലൂക്ക് കമ്മിറ്റികൾ",
    blockDesc: "പ്രാദേശിക പ്രശ്നങ്ങളുടെ ഏകോപിത പരിഹാരം, പ്രവർത്തനങ്ങളുടെ ഏകോപനം.",
    districtCommittee: "ജില്ലാ കമ്മിറ്റികൾ",
    districtDesc: "ജില്ലാ തലത്തിൽ നേതൃത്വം, സംസ്ഥാന തലവുമായും ദേശീയ തലവുമായും ഏകോപനം.",
    membershipHeading: "അംഗത്വ കാമ്പെയ്ൻ",
    membershipOnline: "ഓൺലൈൻ പോർട്ടലിലൂടെയും മൊബൈൽ ആപ്പിലൂടെയും എളുപ്പത്തിൽ രജിസ്ട്രേഷൻ.",
    membershipCampus: "സ്കൂളുകൾ, കോളേജുകൾ, സർവകലാശാലകൾ, ട്രെയിനിംഗ് സെന്ററുകൾ എന്നിവിടെ അംഗത്വ ക്യാമ്പുകൾ.",
    membershipInclusive: "എല്ലാ മതം, ജാതി, ലിംഗം, വിഭാഗങ്ങളിൽ നിന്നുമുള്ള യുവാക്കളുടെ ഉൾക്കൊള്ളൽ പങ്കാളിത്തം.",

    // Opportunities
    opportunitiesTitle: "യുവാകൾക്കുള്ള അവസരങ്ങൾ",
    localIssuesHeading: "പ്രാദേശിക പ്രശ്നങ്ങളിൽ പ്രവർത്തിക്കൽ",
    localIssue1: "തൊഴിലില്ലായ്ഷ, വിദ്യാഭ്യാസം, ആരോഗ്യം, ശുചിത്വം, റോഡ്, വെള്ളം, വൈദ്യുതി എന്നിവയിൽ ശ്രദ്ധ കേന്ദ്രീകരിക്കുക.",
    localIssue2: "പൊതു കേൾവികളിലൂടെ പ്രശ്നങ്ങളും നിർദ്ദേശങ്ങളും കേൾക്കുക.",
    localIssue3: "എതിർപ്പ് മാത്രമല്ല, പരിഹാര അധിഷ്ഠിത പ്രവർത്തനം.",
    skillHeading: "കഴിവ് & നേതൃത്വ വികസനം",
    skill1: "നേതൃത്വം, ആശയവിനിമയം, ഡിജിറ്റൽ സാക്ഷരത, സാമൂഹിക പ്രവർത്തനം എന്നിവയിൽ വർക്ക്ഷോപ്പുകൾ.",
    skill2: "കഴിവ് വികസന കേന്ദ്രങ്ങൾക്കായി സർക്കാരുമായും സ്വകാര്യ മേഖലയുമായും പങ്കാളിത്തം.",
    skill3: "സംരംഭകത്വം പ്രോത്സാഹിപ്പിക്കൽ, സ്വന്തം ബിസിനസ്സ് ആരംഭിക്കാൻ പിന്തുണ.",

    // National Presence
    nationalTitle: "ദേശീയ തലത്തിലെ അംഗീകാരം",
    digitalHeading: "ഡിജിറ്റൽ & മീഡിയ സാന്നിധ്യം",
    digital1: "പ്രൊഫഷണൽ വെബ്സൈറ്റ്, ഓൺലൈൻ അംഗത്വം, വാർത്താ അപ്ഡേറ്റുകൾ.",
    digital2: "ഫേസ്ബുക്ക്, ഇൻസ്റ്റാഗ്രാം, ട്വിറ്റർ, യൂട്യൂബ്, ലിങ്ക്ഡ്ഇൻ എന്നിവയിൽ സജീവ കാമ്പെയ്നുകൾ.",
    digital3: "ദേശീയ പ്രശ്നങ്ങളിൽ ഓൺലൈൻ കാമ്പെയ്നുകളും ഹാഷ്ടാഗ് മൂവ്മെന്റുകളും.",
    eventsHeading: "ദേശീയ പരിപാടികൾ",
    event1: "രാജ്യത്തുടനീളമുള്ള യുവ പ്രതിനിധികളുമായുള്ള വാർഷിക ദേശീയ സമ്മേളനം.",
    event2: "അവബോധവും പങ്കാളിത്തവും വർദ്ധിപ്പിക്കാൻ യുവ പാർലമെന്റ്, റാലികൾ, പദയാത്രകൾ.",
    mediaHeading: "മീഡിയ ബന്ധങ്ങൾ",
    media1: "പ്രധാന പരിപാടികൾക്കും പ്രഖ്യാപനങ്ങൾക്കും പ്രസ് റിലീസ്.",
    media2: "പ്രധാന പ്രശ്നങ്ങളിൽ പ്രസ് കോൺഫറൻസ്.",
    media3: "ദേശീയ, പ്രാദേശിക മീഡിയ ഔട്ട്‌ലെറ്റുകളുമായി ബന്ധങ്ങൾ സ്ഥാപിക്കൽ.",
    brandingHeading: "ബ്രാൻഡിംഗ് & സന്ദേശം",
    branding1: "യുവാക്കളുമായി അനുരണനം സൃഷ്ടിക്കുന്ന വ്യക്തവും ആകർഷകവുമായ സന്ദേശം.",
    branding2: "മനസ്സിൽ നിലനിൽക്കുന്ന ലോഗോയും മുദ്രാവാക്യവും.",
    branding3: "പോസ്റ്ററുകൾ, ബാനറുകൾ, ലഘുലേഖകൾ, ടി-ഷർട്ടുകൾ എന്നിവ പോലുള്ള പ്രമോഷണൽ സാമഗ്രികൾ.",

    // Collaboration
    collaborationTitle: "സഹകരണം & പങ്കാളിത്തം",
    collabNGO: "എൻജിഒകളും സിവിൽ സൊസൈറ്റിയും",
    collabNGODesc: "സമാന ചിന്താഗതിക്കാരായ എൻജിഒകളുമായും സിവിൽ സൊസൈറ്റി സംഘടനകളുമായും സഹകരണം.",
    collabAcademic: "വിദ്യാഭ്യാസ സ്ഥാപനങ്ങൾ",
    collabAcademicDesc: "സ്കൂളുകൾ, കോളേജുകൾ, സർവകലാശാലകൾ എന്നിവയുമായി പങ്കാളിത്തം.",
    collabCorporate: "കോർപ്പറേറ്റ് മേഖല",
    collabCorporateDesc: "കോർപ്പറേറ്റ് സാമൂഹിക ഉത്തരവാദിത്തത്തിന് (CSR) കീഴിലുള്ള പദ്ധതികൾക്ക് സഹകരണം.",
    collabYouth: "മറ്റ് യുവജന സംഘടനകൾ",
    collabYouthDesc: "മറ്റ് യുവജന സംഘടനകളുമായി നെറ്റ്വർക്കിംഗും സംയുക്ത പരിപാടികളും.",

    // Monitoring & Funding
    monitoringTitle: "നിരീക്ഷണം & മൂല്യനിർണ്ണയം",
    monitor1: "തന്ത്രത്തിന്റെ പുരോഗതിയുടെ പതിവ് അവലോകനം.",
    monitor2: "അംഗങ്ങളിൽ നിന്നും പൊതുജനങ്ങളിൽ നിന്നും ഫീഡ്ബാക്ക് ശേഖരണം.",
    monitor3: "ഫീഡ്ബാക്കിന്റെയും മാറുന്ന സാഹചര്യങ്ങളുടെയും അടിസ്ഥാനത്തിൽ തന്ത്രം അനുയോജ്യമാക്കൽ.",
    monitor4: "അംഗത്വം, പരിപാടികൾ, പ്രവർത്തനങ്ങൾ എന്നിവയുടെ ഡാറ്റ ശേഖരണവും വിശകലനവും.",
    fundingTitle: "ധനസഹായം",
    fund1: "നാമമാത്ര അംഗത്വ ഫീസ്.",
    fund2: "വ്യക്തികളിൽ നിന്നും സംഘടനകളിൽ നിന്നും സംഭാവനകൾ.",
    fund3: "നിർദ്ദിഷ്ട പദ്ധതികൾക്കായി ഓൺലൈൻ ക്രൗഡ്ഫണ്ടിംഗ് കാമ്പെയ്നുകൾ.",
    fund4: "പരിപാടികൾക്കും പ്രവർത്തനങ്ങൾക്കും കോർപ്പറേറ്റ് സ്പോൺസർഷിപ്പ്.",

    // Code of Conduct
    conductTitle: "പെരുമാറ്റച്ചട്ടം",
    conduct1: "അച്ചടക്കവും ഉയർന്ന ധാർമ്മിക മാനദണ്ഡങ്ങളും.",
    conduct2: "സാമ്പത്തിക ഇടപാടുകളിൽ സുതാര്യത.",
    conduct3: "അംഗങ്ങൾക്ക് ഉത്തരവാദിയായ നേതൃത്വം.",

    // Call to Action
    ctaTitle: "യുവ ശക്തിയെ ഒന്നിപ്പിക്കാം!",
    ctaSubtitle: "ഇന്നേ ചേരൂ – യുവ ഹിന്ദുസ്ഥാനി അവാം മോർച്ചയുമായി",
    ctaMembership: "അംഗത്വത്തിന്",
    ctaWebsite: "വെബ്സൈറ്റ്",
    ctaEmail: "ഇമെയിൽ",
    ctaPhone: "ഫോൺ/വാട്ട്സ്ആപ്പ്",
    ctaClosing: "ഒന്നിച്ച് നമുക്ക് നിർമ്മിക്കാം",
    ctaClosingSlogan: "യുവ നേതൃത്വമുള്ള പുതിയ ഇന്ത്യ",

    // Footer
    footerTagline: "ശക്തമായ യുവാക്കൾ, ബലമുള്ള ഭാരതം",
    footerRights: "എല്ലാ അവകാശങ്ങളും സംവരണം ചെയ്തിരിക്കുന്നു",
    footerFollow: "ഞങ്ങളെ പിന്തുടരൂ",
    footerQuickLinks: "ദ്രുത ലിങ്കുകൾ",
  },
};
