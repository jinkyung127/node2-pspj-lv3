const express = require("express");
const router = express.Router({ mergeParams: true }); // mergeParams 설정 추가

const authMiddleware = require("../middlewares/auth-middleware");
const { sequelize, posts, comments } = require("../models");

// 댓글 작성 api
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const { id } = res.locals.user;

    const comment = await comments.create({
      postId: postId,
      userId: id,
      comment: content,
    });
    res.status(201).json({ message: "댓글이 작성되었습니다." });
  } catch {
    res.status(400).json({ errorMessage: error.message });
  }
});

// 댓글 수정
router.put("/:commentId", authMiddleware, async (req, res) => {
  const commentId = req.params.commentId;
  const content = req.body.content;
  const { id } = res.locals.user;
  const comment = await comments.findOne({ where: { id: commentId } });

  if (!comment)
    return res.status(400).json({ message: "댓글 내용을 입력해 주세요." });
  if (comment) {
    if (id !== comment.userId) {
      return res.status(400).json({ message: "댓글 작성자가 아닙니다." });
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
});

// 댓글 삭제
router.delete("/:commentId", authMiddleware, async (req, res) => {
  const commentId = req.params.commentId;
  const { id } = res.locals.user;
  const comment = await comments.findOne({ where: { id: commentId } });

  if (!comment)
    return res
      .status(400)
      .json({ message: "존재하지 않는 댓글은 삭제할 수 없습니다." });
  if (comment) {
    if (id !== comment.userId) {
      return res.status(400).json({ message: "댓글 작성자가 아닙니다." });
    } else {
      await comments.destroy({
        where: {
          id: commentId,
        },
      });
      res.status(200).json({ message: "댓글을 삭제하였습니다." });
    }
  }
});

module.exports = router;
