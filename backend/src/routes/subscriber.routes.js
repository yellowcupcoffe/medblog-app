// backend/src/routes/subscriber.routes.js
const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const { sendWelcomeEmail } = require("../services/email.service");

const prisma = new PrismaClient();

// 1. PUBLIC: Subscribe (Used by Navbar Modal)
router.post("/subscribe", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ error: "Email required" });

    // Check if exists
    const exists = await prisma.subscriber.findUnique({ where: { email } });
    if (exists) {
      return res.json({ message: "Already subscribed" });
    }

    // Save to DB
    const saved = await prisma.subscriber.create({ data: { email } });

    // Send Welcome Email (Async - don't wait for it)
    sendWelcomeEmail(email).catch(err => console.error("Welcome email failed", err));

    res.json({ success: true, email: saved.email });

  } catch (err) {
    console.error("SUBSCRIBE ERROR:", err);
    res.status(500).json({ error: "Subscription failed" });
  }
});

// 2. ADMIN: List Subscribers (Used by Dashboard)
router.get("/admin/all", async (req, res) => {
  try {
    const list = await prisma.subscriber.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(list);
  } catch (err) {
    console.error("LIST ERROR:", err);
    res.status(500).json({ error: "Failed to load subscribers" });
  }
});

// 3. ADMIN: Delete Subscriber (Used by Dashboard)
// This ensures that if you delete them here, they are GONE from the DB
// and will NOT receive the next newsletter.
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    await prisma.subscriber.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ error: "Failed to delete subscriber" });
  }
});

module.exports = router;