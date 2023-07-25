const express = require('express');
const { v4: uuidV4 } = require('uuid');

const router = express.Router();

router.get('/', (req, res) => {
  res.redirect(`/${uuidV4()}`);
});

router.get('/:channel', (req, res) => {
  res.render('channel', { channelId: req.params.channel });
});

module.exports = router;
