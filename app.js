const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const groupRoutes = require('./routes/groupRoutes');
const commentRoutes = require('./routes/commentRoutes'); // 댓글 라우트 추가

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB 연결
const mongoUri = 'mongodb+srv://chosj8575:<db_password>@cluster0.jhadc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB 연결 성공');
}).catch((error) => {
  console.error('MongoDB 연결 실패:', error);
});

// 미들웨어
app.use(bodyParser.json());

// 라우트 설정
app.use('/api/groups', groupRoutes);
app.use('/api/comments', commentRoutes); // 댓글 라우트 추가

// 서버 시작
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});
