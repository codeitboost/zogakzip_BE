const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const { getPostById, verifyPostPassword, verifyGroupPassword } = require('../utils/postUtils');
const Group = require('../models/group');

// 추억 생성
router.post('/groups/:groupId/posts', async (req, res) => {
  const groupId = req.params.groupId;
  const {
    nickname,
    title,
    content,
    postPassword,
    groupPassword,
    imageUrl,
    tags,
    location,
    moment,
    isPublic
  } = req.body;

  if (!nickname || !title || !content || !postPassword || !groupPassword) {
    return res.status(400).json({ message: "잘못된 요청입니다" });
  }

  try {
    const { status, message } = await verifyGroupPassword(groupId, groupPassword);
    if (status !== 200) return res.status(status).json({ message });

    const newPost = new Post({
      groupId: groupId,
      nickname: nickname,
      title: title,
      content: content,
      postPassword: postPassword,
      imageUrl: imageUrl,
      tags: tags,
      location: location,
      moment: moment,
      isPublic: isPublic,
      likeCount: 0,
      commentCount: 0
    });

    const post = await newPost.save();
    res.status(200).json({
      id: post._id,
      groupId: post.groupId,
      nickname: post.nickname,
      title: post.title,
      content: post.content,
      imageUrl: post.imageUrl,
      tags: post.tags,
      location: post.location,
      moment: post.moment,
      isPublic: post.isPublic,
      likeCount: post.likeCount,
      commentCount: post.commentCount,
      createdAt: post.createdAt
    });
  } catch (error) {
    console.error('추억 생성 중 오류 발생:', error);
    res.status(500).json({ message: '서버 오류로 인해 추억을 생성할 수 없습니다.' });
  }
});

// 추억 조회
router.get('/groups/:groupId/posts', async (req, res) => {
  const groupId = req.params.groupId;
  const { page = 1, pageSize = 10, sortBy = 'latest', keyword = '', isPublic } = req.query;

  const filter = {
    groupId: groupId,
    ...(keyword && { $or: [{ title: { $regex: keyword, $options: 'i' } }, { tags: { $regex: keyword, $options: 'i' } }] }),
    ...(isPublic !== undefined && { isPublic: isPublic === 'true' })
  };

  const sortOptions = {
    latest: { createdAt: -1 },
    mostCommented: { commentCount: -1 },
    mostLiked: { likeCount: -1 }
  };

  try {
    const posts = await Post.find(filter)
      .sort(sortOptions[sortBy])
      .skip((page - 1) * pageSize)
      .limit(parseInt(pageSize));

    const totalItemCount = await Post.countDocuments(filter);
    res.status(200).json({
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalItemCount / pageSize),
      totalItemCount: totalItemCount,
      data: posts.map(post => ({
        id: post._id,
        nickname: post.nickname,
        title: post.title,
        imageUrl: post.imageUrl,
        tags: post.tags,
        location: post.location,
        moment: post.moment,
        isPublic: post.isPublic,
        likeCount: post.likeCount,
        commentCount: post.commentCount,
        createdAt: post.createdAt
      }))
    });
  } catch (error) {
    console.error('게시글 목록 조회 중 오류 발생:', error);
    res.status(500).json({ message: '서버 오류로 인해 게시글 목록을 조회할 수 없습니다.' });
  }
});

// 추억 수정
router.put('/posts/:postId', async (req, res) => {
  const { postId } = req.params;
  const { nickname, title, content, postPassword, imageUrl, tags, location, moment, isPublic } = req.body;

  try {
    const { status, message, post } = await getPostById(postId);
    if (status !== 200) return res.status(status).json({ message });

    const passwordVerification = await verifyPostPassword(postId, postPassword);
    if (passwordVerification.status !== 200) return res.status(passwordVerification.status).json({ message: passwordVerification.message });

    post.nickname = nickname;
    post.title = title;
    post.content = content;
    post.imageUrl = imageUrl;
    post.tags = tags;
    post.location = location;
    post.moment = moment;
    post.isPublic = isPublic;

    await post.save();
    res.status(200).json({
      id: post._id,
      groupId: post.groupId,
      nickname: post.nickname,
      title: post.title,
      content: post.content,
      imageUrl: post.imageUrl,
      tags: post.tags,
      location: post.location,
      moment: post.moment,
      isPublic: post.isPublic,
      likeCount: post.likeCount,
      commentCount: post.commentCount,
      createdAt: post.createdAt
    });
  } catch (error) {
    console.error('추억 수정 중 오류 발생:', error);
    res.status(500).json({ message: '서버 오류로 인해 추억을 수정할 수 없습니다.' });
  }
});

// 추억 삭제
router.delete('/posts/:postId', async (req, res) => {
  const { postId } = req.params;
  const { postPassword } = req.body;

  try {
    const { status, message, post } = await getPostById(postId);
    if (status !== 200) return res.status(status).json({ message });

    const passwordVerification = await verifyPostPassword(postId, postPassword);
    if (passwordVerification.status !== 200) return res.status(passwordVerification.status).json({ message: passwordVerification.message });

    await Post.findByIdAndDelete(postId);
    res.status(200).json({ message: '게시글 삭제 성공' });
  } catch (error) {
    console.error('추억 삭제 중 오류 발생:', error);
    res.status(500).json({ message: '서버 오류로 인해 추억을 삭제할 수 없습니다.' });
  }
});

// 게시글 상세 정보 조회
router.get('/posts/:postId', async (req, res) => {
  const { postId } = req.params;

  try {
    const { status, message, post } = await getPostById(postId);
    if (status !== 200) return res.status(status).json({ message });

    res.status(200).json({
      id: post._id,
      groupId: post.groupId,
      nickname: post.nickname,
      title: post.title,
      content: post.content,
      imageUrl: post.imageUrl,
      tags: post.tags,
      location: post.location,
      moment: post.moment,
      isPublic: post.isPublic,
      likeCount: post.likeCount,
      commentCount: post.commentCount,
      createdAt: post.createdAt
    });
  } catch (error) {
    console.error('게시글 상세 정보 조회 중 오류 발생:', error);
    res.status(500).json({ message: '서버 오류로 인해 게시글 상세 정보를 조회할 수 없습니다.' });
  }
});

// 게시글 조회 권한 확인
router.post('/posts/:postId/verify-password', async (req, res) => {
  const { postId } = req.params;
  const { password } = req.body;

  try {
    const result = await verifyPostPassword(postId, password);
    res.status(result.status).json({ message: result.message });
  } catch (error) {
    console.error('게시글 조회 권한 확인 중 오류 발생:', error);
    res.status(500).json({ message: '서버 오류로 인해 게시글 조회 권한을 확인할 수 없습니다.' });
  }
});

// 게시글 공감
router.post('/posts/:postId/like', async (req, res) => {
  const { postId } = req.params;

  try {
    const { status, message, post } = await getPostById(postId);
    if (status !== 200) return res.status(status).json({ message });

    post.likeCount += 1;
    await post.save();
    res.status(200).json({ message: '게시글 공감하기 성공' });
  } catch (error) {
    console.error('게시글 공감 중 오류 발생:', error);
    res.status(500).json({ message: '서버 오류로 인해 공감할 수 없습니다.' });
  }
});

// 게시글 공개 여부 확인
router.get('/posts/:postId/is-public', async (req, res) => {
  const { postId } = req.params;

  try {
    const { status, message, post } = await getPostById(postId);
    if (status !== 200) return res.status(status).json({ message });

    res.status(200).json({ id: post._id, isPublic: post.isPublic });
  } catch (error) {
    console.error('게시글 공개 여부 확인 중 오류 발생:', error);
    res.status(500).json({ message: '서버 오류로 인해 게시글 공개 여부를 확인할 수 없습니다.' });
  }
});

module.exports = router;
