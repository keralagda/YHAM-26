import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifySession } from '@/lib/auth'

export async function POST() {
  const user = await verifySession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    // Delete existing and re-seed for a clean state
    await db.member.deleteMany({})

    const members = [
      // HAM National Leadership
      { nameHi: 'जीतन राम मांझी', nameEn: 'Jitan Ram Manjhi', nameMl: 'ജിതൻ റാം മാഞ്ചി', roleHi: 'मुख्य संरक्षक', roleEn: 'Chief Patron', roleMl: 'മുഖ്യ രക്ഷാധികാരി', phone: '', email: '', imageUrl: 'https://ham.org.in/wp-content/uploads/2024/07/Jitan-Ram-Manjhi.png', category: 'ham', order: 0 },
      { nameHi: 'संतोष कुमार सुमन', nameEn: 'Santosh Kumar Suman', nameMl: 'സന്തോഷ് കുമാർ സുമൻ', roleHi: 'राष्ट्रीय अध्यक्ष', roleEn: 'National President', roleMl: 'ദേശീയ അധ്യക്ഷൻ', phone: '', email: '', imageUrl: '', category: 'ham', order: 1 },
      { nameHi: 'राजेश कुमार पाण्डेय', nameEn: 'Rajesh Kumar Pandey', nameMl: 'രാജേഷ് കുമാർ പാണ്ഡേ', roleHi: 'राष्ट्रीय प्रधान महासचिव', roleEn: 'National Chief General Secretary', roleMl: 'ദേശീയ ചീഫ് ജനറൽ സെക്രട്ടറി', phone: '+919431877286', email: '', imageUrl: 'https://ham.org.in/wp-content/uploads/2024/08/%E0%A4%B6%E0%A5%8D%E0%A4%B0%E0%A5%80-%E0%A4%B0%E0%A4%BE%E0%A4%9C%E0%A5%87%E0%A4%B6-%E0%A4%95%E0%A5%81%E0%A4%AE%E0%A4%BE%E0%A4%B0-%E0%A4%AA%E0%A4%BE%E0%A4%A3%E0%A5%8D%E0%A4%A1%E0%A5%87%E0%A4%AF.png', category: 'ham', order: 2 },
      { nameHi: 'प्रफुल्ल कुमार माँझी', nameEn: 'Prafulla Kumar Manjhi', nameMl: 'പ്രഫുല്ല കുമാർ മാഞ്ചി', roleHi: 'राष्ट्रीय उपाध्यक्ष', roleEn: 'National Vice President', roleMl: 'ദേശീയ വൈസ് പ്രസിഡന്റ്', phone: '', email: '', imageUrl: 'https://ham.org.in/wp-content/uploads/2024/07/Prafulla-Manjhi-MLA.png', category: 'ham', order: 3 },
      { nameHi: 'ज्योति देवी', nameEn: 'Jyoti Devi', nameMl: 'ജ്യോതി ദേവി', roleHi: 'राष्ट्रीय महासचिव', roleEn: 'National General Secretary', roleMl: 'ദേശീയ ജനറൽ സെക്രട്ടറി', phone: '', email: '', imageUrl: 'https://ham.org.in/wp-content/uploads/2024/07/Jyoti-Devi-MLA.png', category: 'ham', order: 4 },
      { nameHi: 'बिरेन्द्र कुमार सिंह', nameEn: 'Birendra Kumar Singh', nameMl: 'ബിരേന്ദ്ര കുമാർ സിംഗ്', roleHi: 'राष्ट्रीय उपाध्यक्ष', roleEn: 'National Vice President', roleMl: 'ദേശീയ വൈസ് പ്രസിഡന്റ്', phone: '', email: '', imageUrl: 'https://ham.org.in/wp-content/uploads/2024/08/%E0%A4%A1%E0%A5%89-%E0%A4%B5%E0%A5%80%E0%A4%B0%E0%A5%87%E0%A4%82%E0%A4%A6%E0%A5%8D%E0%A4%B0-%E0%A4%95%E0%A5%81%E0%A4%AE%E0%A4%BE%E0%A4%B0-%E0%A4%B8%E0%A4%BF%E0%A4%82%E0%A4%B9-.png', category: 'ham', order: 5 },
      { nameHi: 'मारकंडेय प्रसाद', nameEn: 'Markandeya Prasad', nameMl: 'മാർക്കണ്ഡേയ പ്രസാദ്', roleHi: 'राष्ट्रीय उपाध्यक्ष', roleEn: 'National Vice President', roleMl: 'ദേശീയ വൈസ് പ്രസിഡന്റ്', phone: '', email: '', imageUrl: 'https://ham.org.in/wp-content/uploads/2024/08/%E0%A4%AE%E0%A4%BE%E0%A4%B0%E0%A4%95%E0%A4%82%E0%A4%A1%E0%A5%87%E0%A4%AF-%E0%A4%AA%E0%A5%8D%E0%A4%B0%E0%A4%B8%E0%A4%BE%E0%A4%A6.png', category: 'ham', order: 6 },
      { nameHi: 'श्याम सुन्दर शरण', nameEn: 'Shyam Sundar Sharan', nameMl: 'ശ്യാം സുന്ദർ ശരൺ', roleHi: 'मुख्य राष्ट्रीय प्रवक्ता', roleEn: 'Chief National Spokesperson', roleMl: 'മുഖ്യ ദേശീയ വക്താവ്', phone: '', email: '', imageUrl: 'https://ham.org.in/wp-content/uploads/2024/08/shiv-sharan-sir.png', category: 'ham', order: 7 },
      // YHAM Youth Leadership
      { nameHi: 'राजेश पाण्डेय', nameEn: 'Rajesh Pandey', nameMl: 'രാജേഷ് പാണ്ഡേ', roleHi: 'राष्ट्रीय प्रधान महासचिव, HAM (S)', roleEn: 'National Chief General Secretary, HAM (S)', roleMl: 'ദേശീയ ചീഫ് ജനറൽ സെക്രട്ടറി, HAM (S)', phone: '+919431877286', email: '', imageUrl: 'https://ham.org.in/wp-content/uploads/2024/08/%E0%A4%B6%E0%A5%8D%E0%A4%B0%E0%A5%80-%E0%A4%B0%E0%A4%BE%E0%A4%9C%E0%A5%87%E0%A4%B6-%E0%A4%95%E0%A5%81%E0%A4%AE%E0%A4%BE%E0%A4%B0-%E0%A4%AA%E0%A4%BE%E0%A4%A3%E0%A5%8D%E0%A4%A1%E0%A5%87%E0%A4%AF.png', category: 'yham', order: 0 },
      { nameHi: 'कमल परवेज़', nameEn: 'Kamal Parvez', nameMl: 'കമൽ പർവേസ്', roleHi: 'राष्ट्रीय युवा अध्यक्ष', roleEn: 'National Youth President', roleMl: 'ദേശീയ യുവജന അധ്യക്ഷൻ', phone: '+919431877286', email: '', imageUrl: '', category: 'yham', order: 1 },
      { nameHi: 'कैलास पी', nameEn: 'Kailas P', nameMl: 'കൈലാസ് പി', roleHi: 'राष्ट्रीय युवा उपाध्यक्ष (दक्षिण भारत प्रभारी)', roleEn: 'National Youth Vice President (South India In-charge)', roleMl: 'ദേശീയ യുവജന വൈസ് പ്രസിഡന്റ് (ദക്ഷിണേന്ത്യ ചുമതല)', phone: '+918606287838', email: '', imageUrl: '', category: 'yham', order: 2 },
      { nameHi: 'अनीस बी', nameEn: 'Anees B', nameMl: 'അനീസ് ബി', roleHi: 'संगठनात्मक - YHAM (दक्षिण भारत)', roleEn: 'Organizational - YHAM (South India)', roleMl: 'ഓർഗനൈസേഷണൽ - YHAM (ദക്ഷിണേന്ത്യ)', phone: '+917012693572', email: '', imageUrl: '', category: 'yham', order: 3 },
    ]

    for (const m of members) {
      await db.member.create({ data: { ...m, visible: true } })
    }

    return NextResponse.json({ success: true, count: members.length })
  } catch (error) {
    console.error('Error seeding members:', error)
    return NextResponse.json({ error: 'Failed to seed members' }, { status: 500 })
  }
}
