// controllers/authController.js
const User = require("../models/user");
const bcrypt = require("bcryptjs");

// REGISTER
exports.postRegister = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password) {
      return res.send("Username & password required");
    }

    await User.create(username, password, role || "student");

    res.redirect("/login");
  } catch (err) {
    console.error(err);
    res.send("Registration failed");
  }
};

exports.postLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findByUsername(username);
    if (!user) {
      return res.send("User not found");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.send("Wrong password");
    }

    req.session.isLoggedIn = true;
    req.session.user = {
      id: user.id,
      username: user.username,
      role: user.role
    };

    if (user.role === 'admin') {
      return res.redirect('/admin/dashboard');
    } 
    if (user.role === 'faculty') {
      return res.redirect('/faculty/dashboard');
    }

    return res.redirect('/');
  } catch (err) {
    console.error(err);
    res.send("Login error");
  }
};

