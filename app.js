const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const groupRoutes = require('./routes/groupRoutes');
const postRoutes = require('./routes/postRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// 데이터베이스 연결
mongoose.connect('mongodb://localhost:27017/mydatabase')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// 미들웨어 설정
app.use(bodyParser.json()); // 요청 본문을 JSON으로 파싱
app.use('/api/groups', groupRoutes); // '/api' 경로로 시작하는 모든 요청을 groupRoutes로 처리
app.use('/api/posts', postRoutes);

// 서버 시작
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
