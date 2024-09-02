const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');

// 댓글 추가
router.post('/posts/:postId/comments', async (req, res) => {
  const { nickname, content, password } = req.body;
  const { postId } = req.params;

  // 요청 데이터 검증
  if (!nickname || !content || !password) {
    return res.status(400).json({ message: '잘못된 요청입니다' });
  }

  try {
    // 댓글 생성
    const newComment = new Comment({
      nickname,
      content,
      password,
      postId,
    });

    const savedComment = await newComment.save();

    // 성공 응답
    res.status(200).json({
      id: savedComment._id,
      nickname: savedComment.nickname,
      content: savedComment.content,
      createdAt: savedComment.createdAt,
    });
  } catch (error) {
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
});

module.exports = router;
