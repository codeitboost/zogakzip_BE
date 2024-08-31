const express = require('express');
const router = express.Router();
const Group = require('../models/group');

// 그룹 등록
router.post('/groups', async (req, res) => {
  try {
    const group = new Group(req.body);
    await group.save();
    res.status(201).json(group);
  } catch (error) {
    res.status(400).json({ message: '잘못된 요청입니다' });
  }
});

// 그룹 목록 조회
router.get('/groups', async (req, res) => {
  try {
    const groups = await Group.find();
    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ message: '서버 오류' });
  }
});

// 그룹 수정
router.put('/groups/:id', async (req, res) => {
  try {
    const group = await Group.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!group) return res.status(404).json({ message: '그룹을 찾을 수 없습니다' });
    res.status(200).json(group);
  } catch (error) {
    res.status(400).json({ message: '잘못된 요청입니다' });
  }
});

// 그룹 삭제
router.delete('/groups/:id', async (req, res) => {
  try {
    const group = await Group.findByIdAndDelete(req.params.id);
    if (!group) return res.status(404).json({ message: '그룹을 찾을 수 없습니다' });
    res.status(200).json({ message: '그룹 삭제 성공' });
  } catch (error) {
    res.status(500).json({ message: '서버 오류' });
  }
});

module.exports = router;
