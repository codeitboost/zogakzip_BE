const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Comment = require('../models/comment');

// 댓글 등록
router.post('/comments', async (req, res) => {
  try {
    const { nickname, content, password, postId } = req.body;
    if (!nickname || !content || !password || !postId) {
      return res.status(400).json({ message: '잘못된 요청입니다' });
    }

    const comment = new Comment({ nickname, content, password, postId });
    await comment.save();
    res.status(200).json({
      id: comment._id,
      nickname: comment.nickname,
      content: comment.content,
      createdAt: comment.createdAt
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(400).json({ message: '잘못된 요청입니다' });
  }
});

// 댓글 목록 조회
router.get('/comments', async (req, res) => {
  try {
    const { page = 1, pageSize = 10, postId } = req.query;
    if (!postId) {
      return res.status(400).json({ message: 'Post ID is required' });
    }

    const comments = await Comment.find({ postId })
      .skip((page - 1) * pageSize)
      .limit(parseInt(pageSize))
      .exec();
    const totalItemCount = await Comment.countDocuments({ postId });

    res.status(200).json({
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalItemCount / pageSize),
      totalItemCount,
      data: comments
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(400).json({ message: '잘못된 요청입니다' });
  }
});

// 댓글 수정
router.put('/comments/:id', async (req, res) => {
  try {
    const { nickname, content, password } = req.body;
    if (!nickname || !content || !password) {
      return res.status(400).json({ message: '잘못된 요청입니다' });
    }

    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: '존재하지 않습니다' });
    if (comment.password !== password) return res.status(403).json({ message: '비밀번호가 틀렸습니다' });

    comment.nickname = nickname;
    comment.content = content;
    await comment.save();

    res.status(200).json({
      id: comment._id,
      nickname: comment.nickname,
      content: comment.content,
      createdAt: comment.createdAt
    });
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(400).json({ message: '잘못된 요청입니다' });
  }
});

// 댓글 삭제
router.delete('/comments/:id', async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ message: '잘못된 요청입니다' });
    }

    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: '존재하지 않습니다' });
    if (comment.password !== password) return res.status(403).json({ message: '비밀번호가 틀렸습니다' });

    await comment.remove();
    res.status(200).json({ message: '댓글 삭제 성공' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(400).json({ message: '잘못된 요청입니다' });
  }
});

module.exports = router;
