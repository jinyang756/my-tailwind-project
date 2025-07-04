const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 中间件配置
app.use(cors());
app.use(express.json());

// 路由配置
app.use('/api/media', require('./routes/media'));

// 数据库连接
mongoose.connect(process.env.MONGODB_URI || 'mongodb://mongodb:27017/mediaDB')
  .then(() => console.log('MongoDB连接成功'))
  .catch(err => {
    console.error('MongoDB连接失败: 请确保MongoDB服务已启动或检查连接字符串');
    console.error('错误详情:', err.message);
  });

// 启动服务器
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`服务器运行在端口 ${PORT}`));

module.exports = app;