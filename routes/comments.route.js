const express = require("express");
const router = express.Router({ mergeParams: true }); // mergeParams 설정 추가

const authMiddleware = require("../middlewares/auth-middleware");
const { sequelize, users, posts, comments } = require("../models");

// 댓글 작성 api
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const { id } = res.locals.user;

    if (!postId) {
      return res.status(404).json({ message: "게시글이 존재하지 않습니다." });
    }
    if (!content) {
      return res
        .status(412)
        .json({ message: "데이터형식이 올바르지않습니다." });
    }

    const comment = await comments.create({
      postId: postId,
      userId: id,
      comment: content,
    });
    res.status(201).json({ message: "댓글이 작성되었습니다." });
  } catch (error) {
    res.status(400).json({ errorMessage: error.message });
  }
});

// 댓글 목록 조회
router.get("/", authMiddleware, async (req, res) => {
  const { postId } = req.params;
  try {
    if (!postId) {
      return res.status(404).json({ message: "게시글이 존재하지 않습니다." });
    }

    const post = await posts.findAll({
      include: [
        {
          model: comments,
          include: [{ model: users, attributes: ["nickname"] }],
          attributes: ["id", "userId", "comment", "createdAt", "updatedAt"],
        },
      ],
      where: { id: postId },
    });

    const mappedPost = post.map((comments) => {
      return comments.toJSON().comments;
    });

    return res.status(200).json({ comments: mappedPost });
  } catch (error) {
    res.status(400).json({ errorMessage: error.message });
  }
});

// 댓글 수정
router.put("/:commentId", authMiddleware, async (req, res) => {
  const commentId = req.params.commentId;
  const content = req.body.content;
  const { id } = res.locals.user;
  const comment = await comments.findOne({ where: { id: commentId } });
  try {
    if (!postId) {
      return res.status(404).json({ message: "게시글이 존재하지 않습니다." });
    }
    if (!content) {
      return res
        .status(400)
        .json({ message: "데이터 형식이 올바르지 않습니다." });
    }
    if (!comment) {
      return res.status(400).json({ message: "댓글이 존재하지 않습니다." });
    }
    if (comment) {
      if (id !== comment.userId) {
        return res
          .status(400)
          .json({ message: "댓글의 수정 권한이 존재하지 않습니다." });
      } else {
        await comments.update(
          { comment: content },
          {
            where: {
              id: commentId,
            },
          }
        );
        res.status(200).json({ message: "댓글을 수정하였습니다." });
      }
    }
  } catch (error) {
    res.status(400).json({ errorMessage: error.message });
  }
});

// 댓글 삭제
router.delete("/:commentId", authMiddleware, async (req, res) => {
  const commentId = req.params.commentId;
  const { id } = res.locals.user;
  const comment = await comments.findOne({ where: { id: commentId } });
  try {
    if (!postId) {
      return res.status(404).json({ message: "게시글이 존재하지 않습니다." });
    }
    if (!comment)
      return res.status(400).json({ message: "댓글이 존재하지 않습니다." });
    if (comment) {
      if (id !== comment.userId) {
        return res
          .status(400)
          .json({ message: "댓글의 삭제 권한이 존재하지 않습니다." });
      } else {
        await comments.destroy({
          where: {
            id: commentId,
          },
        });
        res.status(200).json({ message: "댓글을 삭제하였습니다." });
      }
    }
  } catch (error) {
    res.status(400).json({ errorMessage: error.message });
  }
});

module.exports = router;
