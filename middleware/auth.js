const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async function auth(req, res, next) {
  try {
    // handle different header casings and stray spaces
    const authHeader = (req.headers.authorization || req.header("Authorization") || "").trim();
    if (!authHeader.toLowerCase().startsWith("bearer ")) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    const token = authHeader.split(" ")[1];
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "Server misconfigured: missing JWT_SECRET" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user; // full user doc (no password)
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token is not valid" });
  }
};
