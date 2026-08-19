import { Resend } from "resend";

export type ContactMessage = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type ContactMailer = {
  emails: {
    send: (payload: Record<string, unknown>) => Promise<{
      data?: { id?: string } | null;
      error?: { message?: string } | null;
    }>;
  };
};

function requireEmailConfig() {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL || "Arko Kundu <onboarding@resend.dev>";
  const to = process.env.CONTACT_TO_EMAIL || "arkokundu500@gmail.com";

  if (!apiKey) {
    throw new Error("Contact email delivery is not configured: missing RESEND_API_KEY.");
  }

  return { apiKey, from, to };
}

function getSenderAddress(configuredFrom: string): string {
  const trimmed = configuredFrom.trim();
  const lower = trimmed.toLowerCase();
  // If the user specified a public mailbox (e.g. gmail.com), Resend API requires onboarding@resend.dev
  if (
    lower.includes("@gmail.com") ||
    lower.includes("@yahoo.com") ||
    lower.includes("@outlook.com") ||
    lower.includes("@hotmail.com") ||
    lower.includes("@icloud.com") ||
    !lower.includes("@")
  ) {
    return "Arko Kundu Portfolio <onboarding@resend.dev>";
  }
  return trimmed;
}

export async function sendContactMessage(
  input: ContactMessage,
  mailer?: ContactMailer,
) {
  const config = requireEmailConfig();
  const client = mailer ?? (new Resend(config.apiKey) as unknown as ContactMailer);
  const sender = getSenderAddress(config.from);

  const payload = {
    from: sender,
    to: [config.to],
    replyTo: input.email,
    subject: `[Portfolio] ${input.subject}`,
    text: [
      `From: ${input.name}`,
      `Email: ${input.email}`,
      "",
      input.message,
    ].join("\n"),
  };

  const result = await client.emails.send(payload);

  if (result.error) {
    // If domain verification failed with a custom from address, retry with onboarding@resend.dev
    if (result.error.message?.includes("domain is not verified") && sender !== "Arko Kundu Portfolio <onboarding@resend.dev>") {
      const fallbackResult = await client.emails.send({
        ...payload,
        from: "Arko Kundu Portfolio <onboarding@resend.dev>",
      });
      if (fallbackResult.error) {
        throw new Error(fallbackResult.error.message || "Resend rejected the message.");
      }
      return { id: fallbackResult.data?.id ?? "accepted" };
    }
    throw new Error(result.error.message || "Resend rejected the message.");
  }

  return { id: result.data?.id ?? "accepted" };
}
