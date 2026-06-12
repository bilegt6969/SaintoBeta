import { NextRequest, NextResponse } from 'next/server';

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

const MAX_FIELD_LENGTH = 1024;

function truncate(value: string, max = MAX_FIELD_LENGTH): string {
  const s = String(value ?? '').trim();
  return s.length > max ? s.slice(0, max) + '…' : s;
}

export async function POST(request: NextRequest) {
  if (!DISCORD_WEBHOOK_URL || !DISCORD_WEBHOOK_URL.startsWith('https://discord.com/api/webhooks/')) {
    console.error('DISCORD_WEBHOOK_URL not configured or invalid.');
    return NextResponse.json(
      { success: false, error: 'Contact form is not configured.' },
      { status: 503 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid JSON body.' },
      { status: 400 }
    );
  }

  const inquiryType = truncate((body.inquiryType as string) ?? '');
  const companyName = truncate((body.companyName as string) ?? '');
  const companySize = truncate((body.companySize as string) ?? '');
  const firstName = truncate((body.firstName as string) ?? '');
  const lastName = truncate((body.lastName as string) ?? '');
  const workEmail = truncate((body.workEmail as string) ?? '');
  const phoneNumber = truncate((body.phoneNumber as string) ?? '');
  const productInterest = truncate((body.productInterest as string) ?? '');
  const businessNeeds = truncate((body.businessNeeds as string) ?? '', 2000);

  if (!inquiryType || !firstName || !lastName || !workEmail || !phoneNumber || !productInterest) {
    return NextResponse.json(
      { success: false, error: 'Required fields missing.' },
      { status: 400 }
    );
  }

  // If company inquiry, require company fields
  if (inquiryType === 'company' && (!companyName || !companySize)) {
    return NextResponse.json(
      { success: false, error: 'Company fields required for company inquiries.' },
      { status: 400 }
    );
  }

  const fields: { name: string; value: string; inline?: boolean }[] = [
    { name: 'Төрөл', value: inquiryType === 'company' ? 'Компани' : 'Хувь хүн', inline: true },
    { name: 'Нэр', value: `${firstName} ${lastName}` },
    { name: 'Имэйл', value: workEmail, inline: true },
    { name: 'Утасны дугаар', value: phoneNumber, inline: true },
    { name: 'Асуулт', value: productInterest },
    { name: 'Нэмэлт мэдээлэл', value: businessNeeds || 'Оруулсангүй' }
  ];

  if (inquiryType === 'company') {
    fields.splice(1, 0, { name: 'Компанийн нэр', value: companyName, inline: true });
    fields.splice(2, 0, { name: 'Компанийн хэмжээ', value: companySize, inline: true });
  }

  const discordPayload = {
    embeds: [{
      title: 'Шинэ хүсэлт',
      color: 5814783,
      fields,
      timestamp: new Date().toISOString()
    }]
  };

  try {
    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(discordPayload),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('Discord webhook failed:', response.status, text);
      return NextResponse.json(
        { success: false, error: 'Failed to send message. Please try again.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Contact form error:', err);
    return NextResponse.json(
      { success: false, error: 'Network error. Please try again.' },
      { status: 500 }
    );
  }
}
