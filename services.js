const express = require('express');
const router = express.Router();

const services = [
  { id: 1, name: 'Service X', price: 2000 },
  { id: 2, name: 'Service Y', price: 9000 },
];

router.get('/', (req, res) => {
  res.json(services);
});

module.exports = router;
