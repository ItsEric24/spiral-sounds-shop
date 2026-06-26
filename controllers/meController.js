import { db } from "../db/db.js";

export async function getCurrentUser(req, res) {
  try {
    if (!req.session.userId) {
      return res.status(400).json({ isLoggedIn: false });
    }

    const currentUser = db.prepare(`SELECT name FROM users WHERE id = ?`);

    const result = currentUser.get(req.session.userId);

    res.status(200).json({ isLoggedIn: true, name: result.name });
  } catch (err) {
    console.error("getCurrentUser error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
