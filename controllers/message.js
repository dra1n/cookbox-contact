const cors = require('cors');
const router = require('express').Router();
const sendMessage = require('../lib/send-message');

router.post('/', cors({origin: '*'}), (req, res, next) => {
  sendMessage(req.body);
  res.status(200).end();
});

module.exports = router;
