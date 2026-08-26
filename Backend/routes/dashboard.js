import express from "express";
import db from "../config/db.js";
import authMiddleware from "../middleware/authMiddleware.js";
import authorizeRole from "../middleware/authorizeRoles.js";

const router = express.Router();


router.get(
    "/",
    authMiddleware,
    authorizeRole(
        "Admin",
        "Manager",
        "Employee",
        "Butler"
    ),
    (req, res) => {


        if (!req.user || !req.user.id) {
            return res.status(401).json({
                message: "Invalid user information in token"
            });
        }


        const userId = req.user.id;
        const userRole = req.user.role;

       let sql = `
  SELECT

    COUNT(*) AS total_tasks,

    SUM(
        CASE
            WHEN status NOT IN ('In-Progress', 'Completed','Rejected')
            THEN 1
            ELSE 0
        END
    ) AS pending_tasks,

    SUM(
        CASE
            WHEN status = 'In-Progress'
            THEN 1
            ELSE 0
        END
    ) AS in_progress_tasks,

    SUM(
        CASE
            WHEN status = 'Completed'
            THEN 1
            ELSE 0
        END
    ) AS completed_tasks,

    SUM(
        CASE
            WHEN due_date < NOW()
            AND status != 'Completed'
            THEN 1
            ELSE 0
        END
    ) AS overdue_tasks

FROM tasks
`;

        let values = [];


       if (userRole === "Employee") {

    sql += `
        WHERE assigned_by = ?
    `;

    values.push(userId);

} else if (userRole === "Butler") {

    sql += `
        WHERE assigned_to = ?
    `;

    values.push(userId);
}


        db.query(
            sql,
            values,
            (err, result) => {

                if (err) {

                    console.log(
                        "Dashboard error:",
                        err
                    );

                    return res.status(500).json({
                        message:
                            "Failed to load dashboard"
                    });
                }


                const data = result[0];

                res.json({

                    role: userRole,

                    totalTasks:
                        Number(data.total_tasks || 0),

                    pendingTasks:
                        Number(data.pending_tasks || 0),

                    inProgressTasks:
                        Number(data.in_progress_tasks || 0),

                    completedTasks:
                        Number(data.completed_tasks || 0),

                    overdueTasks:
                        Number(data.overdue_tasks || 0)

                });

            }
        );

    }
);


export default router;