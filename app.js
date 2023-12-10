const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const PORT = 3000;

// Body parser middleware
app.use(bodyParser.json());

// Connect to MongoDB using Mongoose
mongoose.connect('mongodb://0.0.0.0:27017/testDB', {

});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function () {
  console.log('Connected to MongoDB');
});

// User Schema
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});
const User = mongoose.model('User', userSchema);

// Blog Post Schema
const blogPostSchema = new mongoose.Schema({
  title: String,
  content: String,
});
const BlogPost = mongoose.model('BlogPost', blogPostSchema);
// test route
app.get('/test', async (req, res) => {
    try {
      res.status(200).json({ message: 'test route is working' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
// User registration route
app.post('/auth/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ username, email, password });
    console.log(username);
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// User authentication route
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (user) {
      res.status(200).json({ message: 'Login successful' });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new blog post route
app.post('/blog/new', async (req, res) => {
  try {
    const { title, content } = req.body;
    const newPost = new BlogPost({ title, content });
    await newPost.save();
    res.status(201).json({ message: 'Blog post created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
