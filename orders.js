const express = require('express');
const router = express.Router();

const orders = [];

router.post('/', (req, res) => {
  const { userId, items } = req.body;
  const newOrder = { orderId: orders.length + 1, userId, items };
  orders.push(newOrder);
  res.status(201).json(newOrder);
});

module.exports = router;
