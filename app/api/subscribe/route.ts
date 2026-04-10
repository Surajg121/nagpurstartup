import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

// Fetch the first available audience ID from Resend automatically
async function getAudienceId(): Promise<string | null> {
  const { data, error } = await resend.audiences.list();
  if (error) return null;
  const list = (data as any)?.data ?? (data as any)?.audiences ?? data;
  if (!Array.isArray(list) || list.length === 0) return null;
  return list[0].id;
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    const audienceId = await getAudienceId();
    if (!audienceId) {
      return NextResponse.json({ error: "Newsletter not configured." }, { status: 500 });
    }

    const { error } = await resend.contacts.create({
      email,
      audienceId,
      unsubscribed: false,
    });

    if (error) {
      // Treat "already exists" as a soft duplicate, not a hard error
      const msg = (error as any)?.message ?? "";
      if (msg.toLowerCase().includes("already exists")) {
        return NextResponse.json({ alreadySubscribed: true });
      }
      return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
