const express = require('express');
const router = express.Router();

const users = [];

router.post('/', (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ message: 'Username is required' });
  }
  const newUser = { id: users.length + 1, username, cart: [] };
  users.push(newUser);
  res.status(201).json(newUser);
});

module.exports = router;
