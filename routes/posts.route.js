const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");
const { sequelize, posts } = require("../models");

// 게시글 작성 API
router.post("/posts", authMiddleware, async (req, res) => {
  // 사용자 정보 확인
  const { id } = res.locals.user;
  const { title, content } = req.body;

  const post = await posts.create({ userId: id, title, content });

  return res.status(201).json({ message: "게시글 작성에 성공하였습니다" });
});

// 게시글 목록조회 API
router.get("/posts", async (req, res) => {
  const _posts = await posts.findAll({
    attributes: ["id", "userId", "title", "createdAt", "updatedAt"],
    order: [["createdAt", "DESC"]],
  });

  return res.status(200).json({ posts: _posts });
});

// 게시글 상세 조회 API
router.get("/posts/:id", async (req, res) => {
  const { id } = req.params;
  const post = await posts.findOne({
    attributes: [
      "id",
      "userId",
      [
        sequelize.literal(
          `(SELECT nickname FROM users WHERE users.id = posts.userId)`
        ),
        "nickname",
      ],
      "title",
      "content",
      "createdAt",
      "updatedAt",
    ],
    where: { id },
  });

  return res.status(200).json({ post: post });
});

// 게시글 수정 API
router.patch("/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { content, title } = req.body;

    const post = await posts.findOne({ where: { id } });
    post.title = title; // 게시글 제목 수정
    post.content = content; // 게시글 내용 수정
    post.updatedAt = Date.now(); // 수정된 시간 저장
    await post.save(); // 수정된 게시글 저장

    return res.status(200).json({ message: "게시글을 수정하였습니다." });
  } catch {
    res.status(400).json({ errorMessage: error.message });
  }
});

// 게시글 삭제 API
router.delete("/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const post = await posts.findOne({ where: { id } });
    await post.destroy();

    return res.status(200).json({ message: "게시글을 삭제하였습니다." });
  } catch {
    res.status(400).json({ errorMessage: error.message });
  }
});

module.exports = router;
