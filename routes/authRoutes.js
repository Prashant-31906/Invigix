// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// PAGE RENDER ROUTES (GET)
router.get("/login", (req, res) => {
  res.render("login");     // ya res.sendFile(...)
});

router.get("/register", (req, res) => {
  res.render("register");  // ya res.sendFile(...)
});

// AUTH LOGIC ROUTES (POST)
router.post("/register", authController.postRegister);
router.post("/login", authController.postLogin);

module.exports = router;
