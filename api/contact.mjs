import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Vercel auto-parses JSON bodies; guard against edge cases
  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ error: "Invalid request body" });
    }
  }

  const { name, phone, email, service, message } = body || {};

  if (!name || !phone || !email || !message) {
    return res.status(400).json({ error: "Please fill in all required fields." });
  }

  const serviceLabel = service || "Not specified";
  const subject = `New service request — ${serviceLabel}`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:6px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:#b31942;padding:24px 32px;">
              <p style="margin:0;color:#ffffff;font-size:20px;font-weight:700;letter-spacing:0.04em;">Resolute Plumbing</p>
              <p style="margin:4px 0 0;color:rgba(255,255,255,0.85);font-size:13px;">New contact form submission</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:28px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #eeeeee;">
                    <span style="display:inline-block;width:110px;font-size:13px;font-weight:700;color:#555555;text-transform:uppercase;letter-spacing:0.05em;">Name</span>
                    <span style="font-size:15px;color:#111111;">${escapeHtml(name)}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #eeeeee;">
                    <span style="display:inline-block;width:110px;font-size:13px;font-weight:700;color:#555555;text-transform:uppercase;letter-spacing:0.05em;">Phone</span>
                    <span style="font-size:15px;color:#111111;">${escapeHtml(phone)}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #eeeeee;">
                    <span style="display:inline-block;width:110px;font-size:13px;font-weight:700;color:#555555;text-transform:uppercase;letter-spacing:0.05em;">Email</span>
                    <a href="mailto:${escapeHtml(email)}" style="font-size:15px;color:#1a5fb0;">${escapeHtml(email)}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #eeeeee;">
                    <span style="display:inline-block;width:110px;font-size:13px;font-weight:700;color:#555555;text-transform:uppercase;letter-spacing:0.05em;">Service</span>
                    <span style="font-size:15px;color:#111111;">${escapeHtml(serviceLabel)}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;">
                    <span style="display:block;font-size:13px;font-weight:700;color:#555555;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:8px;">Message</span>
                    <p style="margin:0;font-size:15px;color:#111111;line-height:1.6;white-space:pre-wrap;">${escapeHtml(message)}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8f8f8;padding:16px 32px;border-top:1px solid #eeeeee;">
              <p style="margin:0;font-size:12px;color:#999999;">
                Reply directly to this email to reach ${escapeHtml(name)} at ${escapeHtml(email)}.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

  try {
    const { error } = await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL,
      to: process.env.CONTACT_TO_EMAIL,
      replyTo: email,
      subject,
      html,
    });

    if (error) {
      console.error("Resend API error:", error);
      return res.status(500).json({ error: "Failed to send your message. Please try again or call us directly." });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Resend exception:", err);
    return res.status(500).json({ error: "Failed to send your message. Please try again or call us directly." });
  }
}
