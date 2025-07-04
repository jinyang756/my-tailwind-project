const express = require('express');
const router = express.Router();
const Media = require('../models/Media');

// 获取所有媒体资源
router.get('/', async (req, res) => {
  try {
    const media = await Media.find();
    res.json(media);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 获取单个媒体资源
router.get('/:id', getMedia, (req, res) => {
  res.json(res.media);
});

// 创建媒体资源
router.post('/', async (req, res) => {
  const media = new Media({
    type: req.body.type,
    name: req.body.name,
    description: req.body.description,
    imageUrl: req.body.imageUrl,
    fileUrl: req.body.fileUrl
  });

  try {
    const newMedia = await media.save();
    res.status(201).json(newMedia);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 更新媒体资源
router.patch('/:id', getMedia, async (req, res) => {
  if (req.body.type != null) {
    res.media.type = req.body.type;
  }
  if (req.body.name != null) {
    res.media.name = req.body.name;
  }
  if (req.body.description != null) {
    res.media.description = req.body.description;
  }
  if (req.body.imageUrl != null) {
    res.media.imageUrl = req.body.imageUrl;
  }
  if (req.body.fileUrl != null) {
    res.media.fileUrl = req.body.fileUrl;
  }

  try {
    const updatedMedia = await res.media.save();
    res.json(updatedMedia);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 删除媒体资源
router.delete('/:id', getMedia, async (req, res) => {
  try {
    await res.media.deleteOne();
    res.json({ message: '媒体资源已删除' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 中间件：获取单个媒体资源
async function getMedia(req, res, next) {
  let media;
  try {
    media = await Media.findById(req.params.id);
    if (media == null) {
      return res.status(404).json({ message: '找不到媒体资源' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.media = media;
  next();
}

module.exports = router;