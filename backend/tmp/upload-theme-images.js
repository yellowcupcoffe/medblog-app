require("dotenv").config();
const fs = require("fs");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadThemeImages() {
  try {
    const urls = JSON.parse(
      fs.readFileSync(__dirname + "/theme-images.json", "utf8")
    );

    console.log(`Found ${urls.length} images`);
    console.log("Uploading to: medblog/theme_pics");

    for (const url of urls) {
      const publicId = url.split("/").pop().split(".")[0]; // remove .jpg
      console.log("Uploading:", publicId);

      await cloudinary.uploader.upload(url, {
        folder: "medblog/theme_pics",
        public_id: publicId,
        overwrite: true,
      });
    }

    console.log("DONE — all images uploaded successfully!");

  } catch (err) {
    console.error("UPLOAD ERROR:", err);
  }
}

uploadThemeImages();
