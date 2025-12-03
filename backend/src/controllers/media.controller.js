// src/controllers/media.controller.js
const cloudinary = require("../services/cloudinary");

/**
 * listFolder: GET /api/media/list?folder=medblog_design
 * returns { images: [ { public_id, format, secure_url } ] }
 */
async function listFolder(req, res) {
  try {
    const folder = (req.query.folder || "medblog_design").replace(/^\/+|\/+$/g, "");
    // cloudinary.api.resources with prefix = folder
    const result = await cloudinary.api.resources({
      type: "upload",
      prefix: folder,
      max_results: 500,
    });

    const publicUrls = (result.resources || []).map(r => ({
      public_id: r.public_id,
      format: r.format,
      secure_url: r.secure_url,
    }));

    res.json({ images: publicUrls });
  } catch (err) {
    console.error("MEDIA LIST ERROR:", err);
    res.status(500).json({ error: "Failed to list media" });
  }
}

module.exports = { listFolder };
