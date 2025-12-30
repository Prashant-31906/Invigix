// app.js
const express = require('express');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser'); // Import karo
const adminRoutes = require('./routes/adminRoutes');
const facultyRoutes = require('./routes/facultyRoutes');

const app = express();
const port = 3000;

// Database connection (ensure ye file exist karti hai)
const db = require('./config/db');

// View Engine Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true })); // Form data parse karne ke liye

// Session Middleware
app.use(session({
  secret: 'mySuperSecretKey123', // Isko strong banana production me
  resave: false,
  saveUninitialized: false,
}));

// Routes
const authRoutes = require('./routes/authRoutes');
app.use(authRoutes); // Login/Register routes ko use karo
app.use('/admin', adminRoutes);
app.use('/faculty', facultyRoutes);

// Home Route (Ab ye check karega ki user logged in hai ya nahi)
app.get('/', (req, res) => {
  if (!req.session.isLoggedIn) {
    return res.redirect('/login');
  }
  
  // Role ke hisab se redirect karo
  const user = req.session.user;
  if (user.role === 'admin') {
    return res.redirect('/admin/dashboard');
  } else if (user.role === 'faculty') {
    return res.redirect('/faculty/dashboard');
  }
  
  // (Yahan student ke dashboard ka logic baadme aayega)
  res.render('index', { 
    title: 'Dashboard',
    user: req.session.user 
  });
});

app.listen(port, () => {
  console.log(`Server http://localhost:${port} par chal raha hai...`);
});