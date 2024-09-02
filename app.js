require('dotenv').config(); // 환경변수 로딩

const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');

// 라우터 불러오기
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Body parser 설정
app.use(bodyParser.json());

// Multer 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // 업로드 폴더 설정
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // 파일명 설정
  }
});

const upload = multer({ storage: storage });

// 이미지 업로드 라우트
app.post('/api/image', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: '이미지 파일이 필요합니다.' });
  }

  // 업로드된 이미지의 URL 생성
  const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.status(200).json({ imageUrl });
});

// 정적 파일 제공
app.use('/uploads', express.static('uploads'));

// 라우터 등록
app.use('/api', postRoutes); // 모든 /api/* 경로를 postRoutes로 처리
app.use('/api/posts/coments', commentRoutes); // 모든 /api/* 경로를 commentRoutes로 처리

// MongoDB 연결
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// 서버 시작
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
