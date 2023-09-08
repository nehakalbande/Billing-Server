const express = require('express');
const bodyParser = require('body-parser');
const usersRouter = require('./users');
const productsRouter = require('./products');
const servicesRouter = require('./services');
const ordersRouter = require('./orders');
const adminRouter = require('./admin');

const app = express();
app.use(bodyParser.json());

app.use('/api/users', usersRouter);
app.use('/api/products', productsRouter);
app.use('/api/services', servicesRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/admin', adminRouter);

const users = [];
const products = [
  { id: 1, name: 'Product A', price: 1500 },
  { id: 2, name: 'Product B', price: 6000 },
];
const services = [
  { id: 1, name: 'Service X', price: 2000 },
  { id: 2, name: 'Service Y', price: 9000 },
];
const orders = [];

function calculateTax(price) {
  if (price > 1000 && price <= 5000) {
    return price * 0.12;
  } else if (price > 5000) {
    return price * 0.18;
  } else {
    return 0;
  }
}

function validateUser(req, res, next) {
  const userId = parseInt(req.params.userId);
  const user = users.find((user) => user.id === userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  req.user = user;
  next();
}

app.post('/api/users', (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ message: 'Username is required' });
  }
  const newUser = { id: users.length + 1, username, cart: [] };
  users.push(newUser);
  res.status(201).json(newUser);
});

app.get('/api/products', (req, res) => {
  res.json({ products, services });
});

app.post('/api/users/:userId/cart', validateUser, (req, res) => {
  const { type, id, quantity } = req.body;
  const item = type === 'product' ? products.find((item) => item.id === id) : services.find((item) => item.id === id);
  if (!item) {
    return res.status(404).json({ message: 'Item not found' });
  }
  if (!quantity || quantity < 1) {
    return res.status(400).json({ message: 'Invalid quantity' });
  }
  const { user } = req;
  for (let i = 0; i < quantity; i++) {
    user.cart.push({ ...item, tax: calculateTax(item.price) });
  }
  res.status(200).json(user.cart);
});

app.delete('/api/users/:userId/cart/:itemId', validateUser, (req, res) => {
  const itemId = parseInt(req.params.itemId);
  const { user } = req;
  const itemIndex = user.cart.findIndex((item) => item.id === itemId);
  if (itemIndex === -1) {
    return res.status(404).json({ message: 'Item not found in the cart' });
  }
  user.cart.splice(itemIndex, 1);
  res.status(204).send();
});

app.delete('/api/users/:userId/cart', validateUser, (req, res) => {
  const { user } = req;
  user.cart = [];
  res.status(204).send();
});

app.get('/api/users/:userId/cart/total', validateUser, (req, res) => {
  const { user } = req;
  const total = user.cart.reduce((acc, item) => acc + item.price + item.tax, 0);
  res.status(200).json({ total });
});

app.post('/api/users/:userId/orders', validateUser, (req, res) => {
  const { user } = req;
  if (user.cart.length === 0) {
    return res.status(400).json({ message: 'Cart is empty' });
  }
  const order = { userId: user.id, items: [...user.cart] };
  orders.push(order);
  user.cart = [];
  res.status(201).json(order);
});

app.get('/api/admin/orders', (req, res) => {
  res.json(orders);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
