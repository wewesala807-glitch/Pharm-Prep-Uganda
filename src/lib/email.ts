import { Resend } from "resend";

// Constructed lazily so a missing key doesn't crash pages that import this
// module without actually sending an email.
let _resend: Resend | null = null;
function getResend(): Resend {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("Resend is not configured. Set RESEND_API_KEY in .env.");
  }
  _resend ??= new Resend(process.env.RESEND_API_KEY);
  return _resend;
}

export async function sendPaymentConfirmationEmail(params: {
  to: string;
  name: string;
  plan: string;
  months: number;
  amount: number;
  expiresAt: Date;
}) {
  const { to, name, plan, months, amount, expiresAt } = params;

  return getResend().emails.send({
    from: process.env.FROM_EMAIL!,
    to,
    subject: "Your PharmaPrep Uganda Premium subscription is active",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color:#1A56DB;">Payment confirmed 🎉</h2>
        <p>Hi ${name},</p>
        <p>Your payment of <strong>UGX ${amount.toLocaleString()}</strong> was successful.
        You now have <strong>${plan}</strong> access for ${months} month(s).</p>
        <p>Your subscription is valid until <strong>${expiresAt.toDateString()}</strong>.</p>
        <p>Good luck with your licensing exam preparation!</p>
        <p style="color:#94A3B8; font-size:12px;">— PharmaPrep Uganda</p>
      </div>
    `,
  });
}
