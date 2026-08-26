import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../config/db.js";

const router = express.Router();


// LOGIN
router.post("/login", (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required"
        });
    }

    const sql = `
        SELECT
            users.id,
            users.name,
            users.email,
            users.password,
            roles.name AS role
        FROM users
        JOIN roles
        ON users.role_id = roles.id
        WHERE users.email = ?
    `;

    db.query(sql, [email], async (err, result) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                message: "Database error"
            });
        }

        if (result.length === 0) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const user = result[0];

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

       const token = jwt.sign(
    {
        id: user.id,
        name: user.name,
        role: user.role
    },
    process.env.JWT_SECRET,
    {
        expiresIn: "1d"
    }
);

        res.json({
            message: "Login successful",
            token: token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    });
});


export default router;