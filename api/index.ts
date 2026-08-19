import "dotenv/config";
import express from "express";
import { initTRPC, TRPCError } from "@trpc/server";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import superjson from "superjson";
import { z } from "zod";
import { Resend } from "resend";

// 1. Initialize tRPC instance
const t = initTRPC.create({
  transformer: superjson,
});

const router = t.router;
const publicProcedure = t.procedure;

// 2. Email Address Resolver
function getSenderAddress(configuredFrom?: string): string {
  const trimmed = (configuredFrom || "").trim();
  const lower = trimmed.toLowerCase();
  if (
    !trimmed ||
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

// 3. Send Email Helper
async function sendContactEmail(input: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL || "arkokundu500@gmail.com";
  const from = getSenderAddress(process.env.RESEND_FROM_EMAIL);

  if (!apiKey) {
    throw new Error(
      "Resend API key is missing. Please ensure RESEND_API_KEY is configured in your Vercel Environment Variables."
    );
  }

  const resend = new Resend(apiKey);
  const payload = {
    from,
    to: [to],
    replyTo: input.email,
    subject: `[Portfolio] ${input.subject}`,
    text: [
      `From: ${input.name}`,
      `Email: ${input.email}`,
      "",
      input.message,
    ].join("\n"),
  };

  const result = await resend.emails.send(payload);

  if (result.error) {
    // If custom domain verification failed, retry with onboarding@resend.dev fallback
    if (from !== "Arko Kundu Portfolio <onboarding@resend.dev>") {
      const fallback = await resend.emails.send({
        ...payload,
        from: "Arko Kundu Portfolio <onboarding@resend.dev>",
      });
      if (fallback.error) {
        throw new Error(fallback.error.message || "Resend failed to deliver email.");
      }
      return { id: fallback.data?.id ?? "sent" };
    }
    throw new Error(result.error.message || "Resend failed to deliver email.");
  }

  return { id: result.data?.id ?? "sent" };
}

// 4. App Router
export const appRouter = router({
  auth: router({
    me: publicProcedure.query(() => null),
    logout: publicProcedure.mutation(() => ({ success: true })),
  }),
  contact: router({
    send: publicProcedure
      .input(
        z.object({
          name: z.string().trim().min(2).max(100),
          email: z.string().trim().email().max(320),
          subject: z.string().trim().min(3).max(160),
          message: z.string().trim().min(10).max(3000),
        })
      )
      .mutation(async ({ input }) => {
        try {
          return await sendContactEmail(input);
        } catch (error: any) {
          console.error("[Contact API Error]:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: error?.message || "Your message could not be sent. Please try again shortly.",
          });
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;

// 5. Express Serverless App
const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

const trpcMiddleware = createExpressMiddleware({
  router: appRouter,
  createContext: ({ req, res }) => ({ req, res, user: null }),
});

// Mount tRPC for both /api/trpc and /trpc (handling direct and rewritten paths)
app.use("/api/trpc", trpcMiddleware);
app.use("/trpc", trpcMiddleware);

app.get("/api/health", (_req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

export default app;
