const express = require('express');
const mongoose = require('mongoose');
const commentRoutes = require('./routes/commentRoutes');
const groupRoutes = require('./routes/groupRoutes');
const postRoutes = require('./routes/postRoutes');

const app = express();
const PORT = 3000;

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/socialMediaDB')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));


app.use('/api/comments', commentRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/posts', postRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
