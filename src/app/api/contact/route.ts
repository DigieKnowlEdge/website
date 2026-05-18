import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  const { name, email, phone, course } = await req.json();

  if (!name || !email || !phone) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Build transporter from env vars — set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS in .env.local
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; background: #0d0d0d; color: #f0f0f0; border-radius: 12px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #C9A84C, #00D4FF); padding: 24px 32px;">
        <h1 style="margin: 0; font-size: 22px; color: #080808; font-weight: 800;">New Registration — DigieKnowledge</h1>
      </div>
      <div style="padding: 32px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; color: #888; font-size: 13px; width: 140px;">Name</td>
            <td style="padding: 10px 0; color: #f0f0f0; font-size: 15px; font-weight: 600;">${name}</td>
          </tr>
          <tr style="border-top: 1px solid rgba(255,255,255,0.07);">
            <td style="padding: 10px 0; color: #888; font-size: 13px;">Email</td>
            <td style="padding: 10px 0; color: #f0f0f0; font-size: 15px;"><a href="mailto:${email}" style="color: #00D4FF;">${email}</a></td>
          </tr>
          <tr style="border-top: 1px solid rgba(255,255,255,0.07);">
            <td style="padding: 10px 0; color: #888; font-size: 13px;">Phone</td>
            <td style="padding: 10px 0; color: #f0f0f0; font-size: 15px;">${phone}</td>
          </tr>
          <tr style="border-top: 1px solid rgba(255,255,255,0.07);">
            <td style="padding: 10px 0; color: #888; font-size: 13px; vertical-align: top;">Course / Query</td>
            <td style="padding: 10px 0; color: #f0f0f0; font-size: 15px;">${course || "—"}</td>
          </tr>
        </table>
      </div>
      <div style="padding: 16px 32px; background: rgba(255,255,255,0.03); font-size: 12px; color: #555;">
        Submitted via DigieKnowledge registration form
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"DigieKnowledge Website" <${process.env.SMTP_USER}>`,
      to: "information@digieknowledge.com",
      replyTo: email,
      subject: `New Registration: ${name} — ${course || "General Inquiry"}`,
      html,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Mail error:", err);
    // Return 200 anyway — UI still shows success to user; admin can check logs
    return NextResponse.json({ success: true, warning: "mail_failed" });
  }
}
