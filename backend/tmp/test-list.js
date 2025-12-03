require("dotenv").config({ path: "../.env" });

const cloudinary = require("../src/services/cloudinary");

(async () => {
  try {
    const r = await cloudinary.api.resources({
      type: "upload",
      prefix: "medblog/medblog_design",
      max_results: 200,
    });

    console.log("FOUND:", r.resources.length);
    console.log(
      r.resources.map((x) => ({
        id: x.public_id,
        url: x.secure_url,
        folder: x.folder,
      }))
    );
  } catch (err) {
    console.error("ERROR:", err);
  }
})();
