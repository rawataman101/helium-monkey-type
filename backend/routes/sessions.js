import express from "express";
import {
  createSession,
  getUserSessions,
  analyzeSession,
} from "../controllers/sessions.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// POST /api/sessions → Save a typing session
router.post("/", verifyToken, createSession);

// GET /api/sessions/:userId → Get all sessions for a user
router.get("/:userId", verifyToken, getUserSessions);

// GET /api/analysis/:sessionId → Analyze session errors & patterns
router.get("/analysis/:sessionId", verifyToken, analyzeSession);

export default router;
