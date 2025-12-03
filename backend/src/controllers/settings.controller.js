const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/* =====================================================
   GET SETTINGS (Upsert ensures it always exists)
===================================================== */
async function getSettings(req, res) {
  try {
    // We use 'upsert' to ensure settings exist even if it's the first time
    const settings = await prisma.siteSettings.upsert({
      where: { id: 1 },
      update: {}, // If found, do nothing
      create: {
        theme: "professional", // Default
      },
    });
    res.json(settings);
  } catch (err) {
    console.error("GET SETTINGS ERROR:", err);
    res.status(500).json({ error: "Failed to fetch settings" });
  }
}

/* =====================================================
   UPDATE THEME
===================================================== */
async function updateTheme(req, res) {
  try {
    const { theme } = req.body;
    const settings = await prisma.siteSettings.update({
      where: { id: 1 },
      data: { theme },
    });
    res.json(settings);
  } catch (err) {
    console.error("UPDATE THEME ERROR:", err);
    res.status(500).json({ error: "Failed to update theme" });
  }
}

module.exports = {
  getSettings,
  updateTheme,
};