const Post = require('../models/post');
const Group = require('../models/group');

async function getPostById(postId) {
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return { status: 404, message: '존재하지 않습니다', post: null };
    }
    return { status: 200, message: null, post };
  } catch (error) {
    console.error('Error fetching post:', error);
    return { status: 500, message: '서버 오류', post: null };
  }
}

async function verifyPostPassword(postId, password) {
  const { status, message, post } = await getPostById(postId);
  if (status !== 200) return { status, message };

  if (post.postPassword !== password) {
    return { status: 401, message: '비밀번호가 틀렸습니다' };
  }
  
  return { status: 200, message: '비밀번호가 확인되었습니다' };
}

async function verifyGroupPassword(groupId, groupPassword) {
  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return { status: 404, message: '그룹을 찾을 수 없습니다.' };
    }

    if (group.password !== groupPassword) {
      return { status: 403, message: '그룹 비밀번호가 일치하지 않습니다.' };
    }

    return { status: 200, message: null };
  } catch (error) {
    console.error('Error verifying group password:', error);
    return { status: 500, message: '서버 오류' };
  }
}

module.exports = {
  getPostById,
  verifyPostPassword,
  verifyGroupPassword
};
