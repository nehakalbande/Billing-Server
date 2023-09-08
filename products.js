const express = require('express');
const router = express.Router();

const products = [
  { id: 1, name: 'Product A', price: 1500 },
  { id: 2, name: 'Product B', price: 6000 },
];

router.get('/', (req, res) => {
  res.json(products);
});

module.exports = router;
