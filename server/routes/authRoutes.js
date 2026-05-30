const express = require("express");
const {
  register,
  login,
  getProfile,
} = require("../controllers/authControllers");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", auth, getProfile);

module.exports = router;
