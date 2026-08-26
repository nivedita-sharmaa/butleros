import express from "express";
import db from "../config/db.js";
import authMiddleware from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/authorizeRoles.js";
const router = express.Router();

router.post("/", authMiddleware, authorizeRoles("Admin","Manager","Employee"), async (req, resp) => {

    const {
        name,
        description,
        category,
        default_priority,
        is_active,
        sla_minutes,
        configurable_fields
    } = req.body;

    if (!name) {
        return resp.status(400).json({ message: "name is required" });
    }

    try {
        const created_by = req.user.id;

        const sql = `
            INSERT INTO task_templates
                (name, description, category, default_priority, is_active, sla_minutes, configurable_fields, created_by)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(
            sql,
            [
                name,
                description || null,
                category || null,
                default_priority || "Medium",
                is_active === undefined ? true : Boolean(is_active),
                sla_minutes || null,
                configurable_fields || null,
                created_by
            ],
            (err, result) => {
                if (err) {
                    console.log(err);
                    return resp.status(500).json({ message: "Failed to create task" });
                }
                resp.status(201).json({ message: "Task created successfully", templateId: result.insertId });
            }
        );
    } catch (err) {
        console.log(err);
        return resp.status(500).json({ message: "Task Creation failed" });
    }

});

router.get("/", authMiddleware, authorizeRoles("Admin","Manager","Employee"), (req, resp) => {

    const sql = `
        SELECT
            task_templates.id,
            task_templates.name,
            task_templates.description,
            task_templates.category,
            task_templates.default_priority,
            task_templates.is_active,
            task_templates.sla_minutes,
            task_templates.configurable_fields,
            task_templates.created_by,
            task_templates.created_at,
            users.name as created_by_name
        FROM task_templates
        JOIN users ON task_templates.created_by = users.id
        ORDER BY task_templates.created_at DESC
    `;

    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            return resp.status(500).json({ message: "Failed to fetch tasks" });
        }
        resp.json(result);
    });
});

router.get("/:id", authMiddleware, authorizeRoles("Admin","Manager","Employee"), (req, resp) => {
    const templateId = req.params.id;

    const sql = `
        SELECT
            task_templates.id,
            task_templates.name,
            task_templates.description,
            task_templates.category,
            task_templates.default_priority,
            task_templates.is_active,
            task_templates.sla_minutes,
            task_templates.configurable_fields,
            task_templates.created_by,
            task_templates.created_at,
            users.name as created_by_name
        FROM task_templates
        JOIN users ON task_templates.created_by = users.id
        WHERE task_templates.id = ?
    `;

    db.query(sql, [templateId], (err, result) => {
        if (err) {
            console.log(err);
            return resp.status(500).json({ message: "Failed to fetch task" });
        }
        if (result.length === 0) {
            return resp.status(404).json({ message: "task not found" });
        }
        resp.json(result[0]);
    });
});

router.put("/:id", authMiddleware, authorizeRoles("Admin","Manager","Employee"), (req, resp) => {

    const templateId = req.params.id;
    const {
        name,
        description,
        category,
        default_priority,
        is_active,
        sla_minutes,
        configurable_fields
    } = req.body;

    if (!name) {
        return resp.status(400).json({ message: "Template Name required" });
    }

    const sql = `
        UPDATE task_templates
        SET name = ?, description = ?, category = ?, default_priority = ?, is_active = ?, sla_minutes = ?, configurable_fields = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [
            name,
            description,
            category || null,
            default_priority || "Medium",
            is_active === undefined ? true : Boolean(is_active),
            sla_minutes || null,
            configurable_fields || null,
            templateId
        ],
        (err, result) => {
            if (err) {
                console.log(err);
                return resp.status(500).json({ message: "Failed to update task" });
            }

            resp.json({ message: "task updated successfully" });
        }
    );
});

// router.delete("/:id", authMiddleware, authorizeRoles("Admin","Manager","Employee"), (req, resp) => {
//     const templateId = req.params.id;
//     const sql = `DELETE FROM task_templates WHERE id = ? `;

//     db.query(sql, [templateId], (err, result) => {
//         if (err) {
//             console.log(err);
//             return resp.status(500).json({ message: "Failed to delete task template" });
//         }

//         if (result.affectedRows === 0) {
//             return resp.status(404).json({ message: "task template not found" });
//         }

//         resp.json({ message: "task template deleted successfully" });
//     });
// });

router.delete("/:id", authMiddleware, authorizeRoles("Admin","Manager","Employee"), (req, resp) => {
    const templateId = req.params.id;

    // Check if any tasks still reference this template first
    const checkSql = `SELECT COUNT(*) AS count FROM tasks WHERE template_id = ?`;

    db.query(checkSql, [templateId], (checkErr, checkResult) => {
        if (checkErr) {
            console.log(checkErr);
            return resp.status(500).json({ message: "Failed to check template usage" });
        }

        if (checkResult[0].count > 0) {
            return resp.status(400).json({
                message: `Cannot delete this template — ${checkResult[0].count} task(s) still reference it`
            });
        }

        const sql = `DELETE FROM task_templates WHERE id = ?`;

        db.query(sql, [templateId], (err, result) => {
            if (err) {
                console.log(err);
                return resp.status(500).json({ message: "Failed to delete task template" });
            }

            if (result.affectedRows === 0) {
                return resp.status(404).json({ message: "task template not found" });
            }

            resp.json({ message: "task template deleted successfully" });
        });
    });
});

export default router;