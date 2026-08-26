import express from "express";
import db from "../config/db.js";
import bcrypt from 'bcrypt';
import authMiddleware from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/authorizeRoles.js";
const router = express.Router();

//Get API for all users
router.get("/",authMiddleware,authorizeRoles("Admin","Manager"), (req, resp) => {

    const sql = `SELECT users.id,users.name,users.email,roles.name AS role FROM users JOIN roles ON users.role_id = roles.id `;
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            return resp.status(500).json({ message: "Failed to fetch users" });
        }
        resp.json(result);
    });
});

// POST API for creating user
router.post("/", authMiddleware, authorizeRoles("Admin"), async (req, resp) => {

    const { name, email, password, role_id } = req.body;

    if (!name || !email || !password || !role_id) {
        return resp.status(400).json({ message: "All fields are required" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = `INSERT INTO users(name, email, password, role_id) VALUES (?, ?, ?, ?)`;

        db.query(sql, [name, email, hashedPassword, role_id], (err, result) => {
            if (err) {
                console.log("Create user DB error:", err);

                // Duplicate email (unique constraint on users.email)
                if (err.code === "ER_DUP_ENTRY") {
                    return resp.status(409).json({
                        message: "A user with this email already exists"
                    });
                }

                // role_id doesn't exist in roles table
                if (err.code === "ER_NO_REFERENCED_ROW" || err.code === "ER_NO_REFERENCED_ROW_2") {
                    return resp.status(400).json({
                        message: "Selected role is invalid"
                    });
                }

                // Column value too long / wrong type / etc — still generic,
                // but at least distinguishable in logs from the duplicate case
                return resp.status(500).json({
                    message: "Failed to create user. Please check the details and try again."
                });
            }

            resp.status(201).json({
                message: "User created successfully",
                userId: result.insertId
            });
        });
    } catch (err) {
        console.log("Password hashing error:", err);
        return resp.status(500).json({ message: "Password hashing failed" });
    }

});


router.get(
    "/butlers",
    authMiddleware,
    authorizeRoles("Admin", "Manager"),
    (req, res) => {

        const sql = `
            SELECT
                users.id,
                users.name,
                users.email
            FROM users
            JOIN roles
                ON users.role_id = roles.id
            WHERE roles.name = ?
            ORDER BY users.name ASC
        `;

        db.query(sql, ["Butler"], (err, result) => {

            if (err) {

                console.log("Get Butlers error:", err);

                return res.status(500).json({
                    message: "Failed to fetch Butlers"
                });
            }

            res.json(result);
        });
    }
);

// GET API to get user by id
router.get("/:id",authMiddleware,authorizeRoles("Admin","Manager"), (req, resp) => {
    const userId = req.params.id;

    const sql = `SELECT users.id, users.name, users.email, roles.name AS role FROM users JOIN roles ON users.role_id = roles.id WHERE users.id = ? `;
    db.query(sql, [userId], (err, result) => {
        if (err) {
            console.log(err);
            return resp.status(500).json({ message: "Failed to fetch user" });
        }
        if (result.length === 0) {
            return resp.status(404).json({ message: "User not found" });
        }
        resp.json(result[0]);
    });
});

// Update User by id
router.put("/:id",authMiddleware,authorizeRoles("Admin","Manager"), (req, resp) => {

    const userId = req.params.id;
    const { name, email, role_id } = req.body;
    if (!name || !email || !role_id) {
        return resp.status(400).json({ message: "Name, email and role are required" });
    }
    const sql = `UPDATE users SET name = ?, email = ?, role_id = ? WHERE id = ?`;

    db.query(sql, [name, email, role_id, userId], (err, result) => {
        if (err) {
            console.log(err);
            return resp.status(500).json({ message: "Failed to update user" });
        }

        // if (result.affectedRows === 0) {
        //     return res.status(404).json({message: "User not found"});
        // }
        resp.json({ message: "User updated successfully" });
    }
    );
});

// Reset a user's password (Admin only)
router.put("/:id/reset-password", authMiddleware, authorizeRoles("Admin","Manager"), async (req, resp) => {

    const userId = req.params.id;
    const { new_password } = req.body;

    if (!new_password || new_password.length < 6) {
        return resp.status(400).json({ message: "New password must be at least 6 characters" });
    }

    try {
        const hashedPassword = await bcrypt.hash(new_password, 10);

        const sql = `UPDATE users SET password = ? WHERE id = ?`;

        db.query(sql, [hashedPassword, userId], (err, result) => {
            if (err) {
                console.log(err);
                return resp.status(500).json({ message: "Failed to reset password" });
            }

            if (result.affectedRows === 0) {
                return resp.status(404).json({ message: "User not found" });
            }

            resp.json({ message: "Password reset successfully" });
        });
    } catch (err) {
        console.log(err);
        return resp.status(500).json({ message: "Password hashing failed" });
    }
});

// Delete user by id
router.delete("/:id",authMiddleware,authorizeRoles("Admin"), (req, resp) => {
    const userId = req.params.id;
    const sql = `DELETE FROM users WHERE id = ? `;

    db.query(sql, [userId], (err, result) => {
        if (err) {
            console.log(err);
            return resp.status(500).json({ message: "Failed to delete user" });
        }

        if (result.affectedRows === 0) {
            return resp.status(404).json({ message: "User not found" });
        }

        resp.json({ message: "User deleted successfully" });
    });
});

export default router;