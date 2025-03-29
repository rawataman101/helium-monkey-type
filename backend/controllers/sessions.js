import Session from "../models/Session.js";

// POST /api/sessions
export const createSession = async (req, res) => {
  try {
    const { wpm, accuracy, totalErrors, errorWords, typingDurations } =
      req.body;

    const newSession = new Session({
      userId: req.userId, // Comes from JWT middleware
      wpm,
      accuracy,
      totalErrors,
      errorWords,
      typingDurations,
    });

    const saved = await newSession.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Error saving session:", err);
    res.status(500).json({ error: "Failed to save session" });
  }
};

// GET /api/sessions/:userId
export const getUserSessions = async (req, res) => {
  try {
    const { userId } = req.params;

    // Only allow user to view their own data
    if (req.userId !== userId) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    const sessions = await Session.find({ userId }).sort({ createdAt: -1 });
    res.json(sessions);
  } catch (err) {
    console.error("Error fetching sessions:", err);
    res.status(500).json({ error: "Failed to fetch sessions" });
  }
};

// GET /api/analysis/:sessionId
export const analyzeSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await Session.findById(sessionId);

    if (!session) return res.status(404).json({ error: "Session not found" });
    if (req.userId !== session.userId)
      return res.status(403).json({ error: "Unauthorized access" });

    const { typingDurations, errorWords } = session;

    // Basic analysis
    const avgTime =
      typingDurations.reduce((a, b) => a + b, 0) / typingDurations.length;
    const slowWords = typingDurations
      .map((t, i) => ({ word: errorWords[i] || `word${i + 1}`, time: t }))
      .filter((obj) => obj.time > avgTime * 1.5);

    const errorFrequency = {};
    for (const word of errorWords) {
      errorFrequency[word] = (errorFrequency[word] || 0) + 1;
    }

    const topMistakes = Object.entries(errorFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word, count]) => ({ word, count }));

    res.json({
      avgTypingTime: avgTime,
      slowWords,
      topMistakes,
    });
  } catch (err) {
    console.error("Error analyzing session:", err);
    res.status(500).json({ error: "Failed to analyze session" });
  }
};
