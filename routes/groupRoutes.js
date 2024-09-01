const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Group = require('../models/group');

// 그룹 등록
router.post('/groups', async (req, res) => {
  try {
    const { name, password, imageUrl, isPublic, introduction } = req.body;
    if (!name || !password) {
      return res.status(400).json({ message: 'Name and password are required' });
    }

    const group = new Group({ name, password, imageUrl, isPublic, introduction });
    await group.save();
    res.status(201).json(group);
  } catch (error) {
    console.error('Error saving group:', error);
    res.status(400).json({ message: '잘못된 요청입니다' });
  }
});

// 그룹 목록 조회
router.get('/groups', async (req, res) => {
  try {
    const groups = await Group.find();
    res.status(200).json(groups);
  } catch (error) {
    console.error('Error fetching groups:', error);
    res.status(500).json({ message: '서버 오류' });
  }
});

// 그룹 상세 정보 조회
router.get('/groups/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: '잘못된 그룹 ID입니다' });
    }
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: '그룹을 찾을 수 없습니다' });
    res.status(200).json(group);
  } catch (error) {
    console.error('Error fetching group:', error);
    res.status(500).json({ message: '서버 오류' });
  }
});

// 그룹 수정
router.put('/groups/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: '잘못된 그룹 ID입니다' });
    }
    const group = await Group.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!group) return res.status(404).json({ message: '그룹을 찾을 수 없습니다' });
    res.status(200).json(group);
  } catch (error) {
    console.error('Error updating group:', error);
    res.status(500).json({ message: '서버 오류' });
  }
});

// 그룹 삭제
router.delete('/groups/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: '잘못된 그룹 ID입니다' });
    }
    const group = await Group.findByIdAndDelete(req.params.id);
    if (!group) return res.status(404).json({ message: '그룹을 찾을 수 없습니다' });
    res.status(200).json({ message: '그룹 삭제 성공' });
  } catch (error) {
    console.error('Error deleting group:', error);
    res.status(500).json({ message: '서버 오류' });
  }
});

// 비밀번호 확인
router.post('/groups/:id/check-password', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: '잘못된 그룹 ID입니다' });
    }
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: '그룹을 찾을 수 없습니다' });

    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ message: '비밀번호가 제공되지 않았습니다' });
    }
    if (password !== group.password) {
      return res.status(401).json({ message: '비밀번호가 틀렸습니다' });
    }

    res.status(200).json({ message: '비밀번호가 확인되었습니다' });
  } catch (error) {
    console.error('Error checking password:', error);
    res.status(500).json({ message: '서버 오류' });
  }
});

// 공감하기 기능
router.post('/groups/:id/like', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: '잘못된 그룹 ID입니다' });
    }
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: '그룹을 찾을 수 없습니다' });

    group.likeCount += 1;
    await group.save();

    res.status(200).json({ message: '그룹 공감하기 성공' });
  } catch (error) {
    console.error('Error liking group:', error);
    res.status(500).json({ message: '서버 오류' });
  }
});

// 그룹 공개 여부 확인
router.get('/groups/:id/is-public', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: '잘못된 그룹 ID입니다' });
    }
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: '그룹을 찾을 수 없습니다' });

    res.status(200).json({ id: group._id, isPublic: group.isPublic });
  } catch (error) {
    console.error('Error checking group visibility:', error);
    res.status(500).json({ message: '서버 오류' });
  }
});

module.exports = router;
