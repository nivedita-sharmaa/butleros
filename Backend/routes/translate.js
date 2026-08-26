import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { translateText } from "../utils/translate.js";

const router = express.Router();

// router.post("/", authMiddleware, async (req, res) => {
//     const { text, targetLang } = req.body;

//     if (!text) {
//         return res.status(400).json({ message: "Text is required" });
//     }

//     console.log(`Translating: "${text}" → ${targetLang}`);

//     const translated = await translateText(text, targetLang || "hi");

//     console.log(`Result: "${translated}"`);

//     res.json({ translated });
// });

router.post("/", authMiddleware, async (req, res) => {
    const { text, targetLang } = req.body;

    if (!text) {
        return res.status(400).json({ message: "Text is required" });
    }

    const result = await translateText(text, targetLang || "hi");

    res.json({
        translated: result.text,
        limited: result.limited,
    });
});

export default router;