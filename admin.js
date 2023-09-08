const express = require('express');
const router = express.Router();

const orders = [];

router.get('/orders', (req, res) => {
  res.json(orders);
});

module.exports = router;
