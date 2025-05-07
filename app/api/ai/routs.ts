// app/api/ai/route.ts
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const documentTypes = [
  {
    id: "rental",
    name: "عقد إيجار",
    description: "عقد إيجار قياسي للممتلكات السكنية أو التجارية",
    keywords: ["إيجار", "عقار", "سكن", "تجاري", "شقة", "منزل", "مكتب"]
  },
  {
    id: "employment",
    name: "عقد عمل",
    description: "اتفاق بين صاحب العمل والموظف",
    keywords: ["عمل", "توظيف", "موظف", "صاحب عمل", "راتب", "وظيفة"]
  },
  {
    id: "service",
    name: "عقد خدمة",
    description: "للمقاولين المستقلين أو مقدمي الخدمات",
    keywords: ["خدمة", "مقاول", "مستقل", "استشارة", "مشروع", "تنفيذ"]
  },
  {
    id: "sales",
    name: "عقد بيع",
    description: "لشراء/بيع البضائع أو العقارات",
    keywords: ["بيع", "شراء", "عقار", "بضائع", "منتج", "ممتلكات"]
  },
  {
    id: "nda",
    name: "اتفاقية عدم إفصاح",
    description: "اتفاقية سرية بين الأطراف",
    keywords: ["سرية", "عدم إفصاح", "معلومات", "حماية", "اتفاق", "خصوصية"]
  },
];

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    // First try to match with keywords for simple cases
    const matchedDoc = documentTypes.find(doc => 
      doc.keywords.some(keyword => message.includes(keyword))
    );

    if (matchedDoc) {
      return NextResponse.json({
        response: `بناءً على طلبك، أنصحك باستخدام "${matchedDoc.name}".\n\n${matchedDoc.description}\n\nيمكنك تنزيل هذا المستند مباشرة من القائمة.`,
        documentId: matchedDoc.id
      });
    }

    // For more complex queries, use OpenAI
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `أنت مساعد قانوني يساعد المستخدمين في العثور على المستندات القانونية المناسبة. لدينا الأنواع التالية من المستندات:
          ${documentTypes.map(doc => `- ${doc.name}: ${doc.description}`).join('\n')}
          
          يجب عليك تحليل مشكلة المستخدم واقتراح أنسب مستند من القائمة أعلاه. قدم إجابة واضحة ومفيدة باللغة العربية.`
        },
        {
          role: "user",
          content: message
        }
      ],
      model: "gpt-3.5-turbo",
    });

    const aiResponse = completion.choices[0]?.message?.content || "عذرًا، لم أتمكن من معالجة طلبك. يرجى المحاولة مرة أخرى.";

    return NextResponse.json({
      response: aiResponse,
      documentId: null
    });

  } catch (error) {
    console.error('AI API error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء معالجة طلبك' },
      { status: 500 }
    );
  }
}