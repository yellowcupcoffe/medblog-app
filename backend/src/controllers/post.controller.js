// src/controllers/post.controller.js
const { PrismaClient } = require("@prisma/client");
const cloudinary = require("../services/cloudinary");
const { sendNewsletterEmail } = require("../services/email.service");
const prisma = new PrismaClient();


/* =====================================================
   IMAGE UPLOAD
===================================================== */
async function uploadImage(req, res) {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "medblog",
          transformation: [{ quality: "auto" }],
        },
        (err, result) => (err ? reject(err) : resolve(result))
      );

      stream.end(req.file.buffer);
    });

    res.json({ url: result.secure_url });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ error: "Upload failed" });
  }
}

/* =====================================================
   PUBLIC — LIST POSTS (SEARCH + PAGINATION)
===================================================== */
async function listPosts(req, res) {
  try {
    const page = Number(req.query.page) || 1;
    const perPage = Number(req.query.perPage) || 6;
    const search = (req.query.search || "").toString();

    const where = {
      published: true,
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
        { category: { contains: search, mode: "insensitive" } },
        ...(search ? [{ tags: { hasSome: [search] } }] : []),
      ],
    };

    const total = await prisma.post.count({ where });

    const posts = await prisma.post.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    });

    res.json({ posts, total });
  } catch (err) {
    console.error("LIST POSTS ERROR:", err);
    res.status(500).json({ error: "Failed to load posts" });
  }
}

/* =====================================================
   ADMIN — LIST ALL POSTS (DRAFT + PUBLISHED)
===================================================== */
async function getAllPostsAdmin(req, res) {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.json(posts);
  } catch (err) {
    console.error("ADMIN LIST ERROR:", err);
    res.status(500).json({ error: "Failed to load admin posts" });
  }
}

/* =====================================================
   ADMIN — GET POST BY ID (for Edit Page)
===================================================== */
async function getPostById(req, res) {
  try {
    const id = Number(req.params.id);

    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) return res.status(404).json({ error: "Post not found" });

    res.json(post);
  } catch (err) {
    console.error("GET POST BY ID ERROR:", err);
    res.status(500).json({ error: "Failed to fetch post" });
  }
}

/* =====================================================
   PUBLIC — GET POST BY SLUG
===================================================== */
async function getPostBySlug(req, res) {
  try {
    const slug = req.params.slug;

    const post = await prisma.post.findUnique({
      where: { slug },
    });

    if (!post) return res.status(404).json({ error: "Post not found" });

    res.json(post);
  } catch (err) {
    console.error("GET BY SLUG ERROR:", err);
    res.status(500).json({ error: "Failed to fetch post" });
  }
}

/* =====================================================
   INCREMENT VIEWS
===================================================== */
async function incrementViews(req, res) {
  try {
    const slug = req.params.slug;

    await prisma.post.update({
      where: { slug },
      data: { views: { increment: 1 } },
    });

    res.json({ success: true });
  } catch (err) {
    console.error("VIEW ERROR:", err);
    res.status(500).json({ error: "Failed to increment views" });
  }
}

/* =====================================================
   CREATE POST
===================================================== */
async function createPost(req, res) {
  try {
    const { title, slug, content, coverImage, published, tags, category, notify } = req.body;

    const post = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        coverImage,
        published: Boolean(published),
        views: 0,
        tags: tags || [],
        category: category || null,
        author: { connect: { id: req.user.id } },
      },
    });

    // If Admin checked "Notify" AND the post is actually published
    if (notify && published) {
      console.log(`🔔 Triggering newsletter for: ${post.title}`);
      sendNewsletterEmail(post).catch(err => console.error("Background email failed", err));
    }

    res.json(post);
  } catch (err) {
    // --- NEW: Handle Duplicate Slug Error ---
    if (err.code === 'P2002' && err.meta?.target?.includes('slug')) {
      return res.status(400).json({ error: "This slug already exists. Please change the URL slug." });
    }

    console.error("CREATE ERROR:", err);
    res.status(500).json({ error: "Failed to create post" });
  }
}

/* =====================================================
   UPDATE POST
===================================================== */
async function updatePost(req, res) {
  try {
    const { title, slug, content, coverImage, published, tags, category } = req.body;

    const post = await prisma.post.update({
      where: { id: Number(req.params.id) },
      data: {
        title,
        slug,
        content,
        coverImage,
        published: Boolean(published),
        tags: tags || [],
        category: category || null,
      },
    });

    res.json(post);
  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ error: "Failed to update post" });
  }
}

/* =====================================================
   DELETE POST
===================================================== */
async function deletePost(req, res) {
  try {
    await prisma.post.delete({
      where: { id: Number(req.params.id) },
    });

    res.json({ success: true });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ error: "Failed to delete post" });
  }
}



/* =====================================================
   EXPORTS
===================================================== */
module.exports = {
  uploadImage,
  listPosts,
  getAllPostsAdmin,
  getPostById,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
  incrementViews,
};
