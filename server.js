// server.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// MongoDB connection
mongoose.connect('mongodb://localhost/simple-auth-system', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// User schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const User = mongoose.model('User', userSchema);

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Routes
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  const newUser = new User({ username, password });
  newUser.save((err) => {
    if (err) {
      res.status(500).json({ error: 'Could not register user.' });
    } else {
      res.json({ success: 'User registered successfully.' });
    }
  });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  User.findOne({ username, password }, (err, user) => {
    if (err || !user) {
      res.status(401).json({ error: 'Invalid credentials.' });
    } else {
      res.json({ success: 'Login successful.' });
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
