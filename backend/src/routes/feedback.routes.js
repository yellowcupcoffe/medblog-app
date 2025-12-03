const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const { requireAuth } = require("../middleware/auth.middleware");

const prisma = new PrismaClient();

// 1. PUBLIC: Create Feedback
router.post("/", async (req, res) => {
  try {
    const { email, message, postId } = req.body; // <--- Grab postId

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const feedback = await prisma.feedback.create({
      data: {
        email: email || "Anonymous",
        message,
        // If postId exists, link it. Convert to Number to be safe.
        postId: postId ? Number(postId) : null, 
      },
    });

    res.status(201).json(feedback);
  } catch (err) {
    console.error("FEEDBACK CREATE ERROR:", err);
    res.status(500).json({ error: "Failed to save feedback" });
  }
});

// 2. ADMIN: List All Feedback
router.get("/", requireAuth, async (req, res) => {
  try {
    const list = await prisma.feedback.findMany({
      orderBy: { createdAt: "desc" },
      // <--- NEW: Include the Post title and slug
      include: {
        post: {
          select: { title: true, slug: true }
        }
      }
    });
    res.json(list);
  } catch (err) {
    console.error("FEEDBACK LIST ERROR:", err);
    res.status(500).json({ error: "Failed to load feedback" });
  }
});

// 3. ADMIN: Delete Feedback
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const id = Number(req.params.id);
    await prisma.feedback.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    console.error("FEEDBACK DELETE ERROR:", err);
    res.status(500).json({ error: "Failed to delete feedback" });
  }
});

module.exports = router;