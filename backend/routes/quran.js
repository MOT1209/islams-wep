const express = require('express');
const router = express.Router();
const quranController = require('../controllers/quranController');

router.get('/surahs', quranController.getAllSurahs);
router.get('/surahs/:id', quranController.getSurahAyahs);

module.exports = router;
