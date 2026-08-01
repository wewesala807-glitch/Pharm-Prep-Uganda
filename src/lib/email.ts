import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPaymentConfirmationEmail(params: {
  to: string;
  name: string;
  plan: string;
  months: number;
  amount: number;
  expiresAt: Date;
}) {
  const { to, name, plan, months, amount, expiresAt } = params;

  return resend.emails.send({
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
