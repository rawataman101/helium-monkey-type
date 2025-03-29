import express from "express";
import { signup, login, getUser } from "../controllers/auth.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// POST /api/auth/signup → Register new user
router.post("/signup", signup);

// POST /api/auth/login → Authenticate user
router.post("/login", login);

// GET /api/auth/user → Get authenticated user info
router.get("/user", verifyToken, getUser);

export default router;
