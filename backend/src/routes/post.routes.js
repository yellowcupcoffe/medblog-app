const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware/auth.middleware");
const {
  listPosts,
  getPostBySlug,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  uploadImage,
  incrementViews,
  getAllPostsAdmin,
} = require("../controllers/post.controller");

const multer = require("multer");

// ✅ NO LIMITS, MEMORY STORAGE
const upload = multer({ 
  storage: multer.memoryStorage() 
});

// -----------------------------
// ADMIN ROUTES
// -----------------------------
router.get("/admin/all", requireAuth, getAllPostsAdmin);
router.post("/", requireAuth, createPost);
router.put("/:id", requireAuth, updatePost);
router.delete("/:id", requireAuth, deletePost);

// Upload route
router.post("/upload", requireAuth, upload.single("image"), uploadImage);

// -----------------------------
// PUBLIC ROUTES
// -----------------------------
router.get("/", listPosts);
router.post("/:slug/view", incrementViews);
router.get("/id/:id", requireAuth, getPostById);
router.get("/:slug", getPostBySlug);

module.exports = router;