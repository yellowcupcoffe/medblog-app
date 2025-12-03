const { Resend } = require("resend");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
// Initialize Resend with the key from env
const resend = new Resend(process.env.RESEND_API_KEY);

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
// ⚠️ CRITICAL FIX: You MUST use this specific email for testing
const EMAIL_FROM = "onboarding@resend.dev"; 

/* =====================================================
   1. SEND WELCOME EMAIL
===================================================== */
async function sendWelcomeEmail(email) {
  try {
    if (!process.env.RESEND_API_KEY) return;

    await resend.emails.send({
      from: EMAIL_FROM,
      to: email,
      subject: "Welcome to MedBlog",
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2 style="color: #E11D48;">Welcome to MedBlog!</h2>
          <p>Thanks for subscribing. You have successfully joined our community.</p>
        </div>
      `,
    });
    console.log(`✅ Welcome email sent to ${email}`);
  } catch (err) {
    console.error("❌ WELCOME EMAIL ERROR:", err.message);
  }
}

/* =====================================================
   2. SEND NEWSLETTER EMAIL (Fixed Loop Logic)
===================================================== */
async function sendNewsletterEmail(post) {
  try {
    if (!process.env.RESEND_API_KEY) return;

    // 1. Get all subscribers
    const subscribers = await prisma.subscriber.findMany({
      select: { email: true }
    });

    if (subscribers.length === 0) {
      console.log("No subscribers found. Skipping.");
      return;
    }

    const emailList = subscribers.map((s) => s.email);
    const postUrl = `${FRONTEND_URL}/blog/${post.slug}`;

    console.log(`📧 Preparing to send to ${emailList.length} subscribers...`);

    // ⚠️ FIX: Loop through and send individually
    // This solves the "Missing to field" error because every email has a 'to'
    for (const email of emailList) {
        try {
          await resend.emails.send({
            from: EMAIL_FROM, // Must be onboarding@resend.dev
            to: email,        // ✅ Sending directly to this user
            subject: `New Story: ${post.title}`,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #111;">${post.title}</h2>
                <p>A new article has just been published.</p>
                <br/>
                <a href="${postUrl}" style="background-color: #000; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Read Now</a>
              </div>
            `,
          });
          console.log(`✅ Newsletter sent to ${email}`);
        } catch (innerErr) {
          console.error(`❌ Failed to send to ${email}:`, innerErr.message);
        }
    }

  } catch (err) {
    console.error("❌ NEWSLETTER ERROR:", err.message);
  }
}

module.exports = {
  sendWelcomeEmail,
  sendNewsletterEmail,
};