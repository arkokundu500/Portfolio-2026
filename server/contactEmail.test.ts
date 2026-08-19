import { describe, expect, it, vi } from "vitest";
import { sendContactMessage } from "./contactEmail";

describe("sendContactMessage", () => {
  it("constructs a replyable portfolio contact email", async () => {
    const send = vi.fn().mockResolvedValue({ data: { id: "message_123" }, error: null });
    const previous = {
      apiKey: process.env.RESEND_API_KEY,
      from: process.env.RESEND_FROM_EMAIL,
      to: process.env.CONTACT_TO_EMAIL,
    };

    process.env.RESEND_API_KEY = "test_key";
    process.env.RESEND_FROM_EMAIL = "Arko Kundu <hello@example.com>";
    process.env.CONTACT_TO_EMAIL = "arko@example.com";

    await expect(sendContactMessage({
      name: "Mina Patel",
      email: "mina@example.com",
      subject: "Product collaboration",
      message: "I would like to discuss a product build.",
    }, { emails: { send } })).resolves.toEqual({ id: "message_123" });

    expect(send).toHaveBeenCalledWith(expect.objectContaining({
      from: "Arko Kundu <hello@example.com>",
      to: ["arko@example.com"],
      replyTo: "mina@example.com",
      subject: "[Portfolio] Product collaboration",
    }));

    process.env.RESEND_API_KEY = previous.apiKey;
    process.env.RESEND_FROM_EMAIL = previous.from;
    process.env.CONTACT_TO_EMAIL = previous.to;
  });
});
