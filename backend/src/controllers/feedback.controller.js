const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Public — submit feedback
async function submitFeedback(req, res) {
  try {
    const { email, message } = req.body;

    if (!email || !message) {
      return res.status(400).json({ error: "Email & message are required" });
    }

    const fb = await prisma.feedback.create({
      data: { email, message },
    });

    res.json({ success: true, feedback: fb });
  } catch (err) {
    console.error("FEEDBACK ERROR:", err);
    res.status(500).json({ error: "Failed to submit feedback" });
  }
}

// Admin — list all feedback
async function listFeedback(req, res) {
  try {
    const feedback = await prisma.feedback.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.json(feedback);
  } catch (err) {
    console.error("LIST FEEDBACK ERROR:", err);
    res.status(500).json({ error: "Failed to load feedback" });
  }
}

// Admin — delete feedback
async function deleteFeedback(req, res) {
  try {
    await prisma.feedback.delete({
      where: { id: Number(req.params.id) },
    });

    res.json({ success: true });
  } catch (err) {
    console.error("DELETE FEEDBACK ERROR:", err);
    res.status(500).json({ error: "Failed to delete feedback" });
  }
}

module.exports = {
  submitFeedback,
  listFeedback,
  deleteFeedback,
};
