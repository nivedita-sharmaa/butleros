import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getActiveCall } from "../socket.js";

const router = express.Router();

router.get("/active", authMiddleware, (req, res) => {
    res.json({ activeCall: getActiveCall() });
});

export default router;