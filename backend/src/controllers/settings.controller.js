const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/* =====================================================
   GET SETTINGS (Safer Singleton Logic)
===================================================== */
async function getSettings(req, res) {
  try {
    // 1. Try to find ANY settings row
    let settings = await prisma.siteSettings.findFirst();

    // 2. If none exists, create one
    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {
          theme: "professional",
        },
      });
    }

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
    
    // Update the first record found
    const existing = await prisma.siteSettings.findFirst();
    
    if (!existing) {
        return res.status(404).json({ error: "Settings not initialized" });
    }

    const settings = await prisma.siteSettings.update({
      where: { id: existing.id },
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