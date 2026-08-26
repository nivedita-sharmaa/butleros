import express from "express";
import db from "../config/db.js";
import authMiddleware from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/authorizeRoles.js";
import createNotification from "../utils/createNotification.js";
import { getSocketIO } from "../socket.js";

const router = express.Router();

// router.post(
//     "/",
//     authMiddleware,
//     authorizeRoles("Admin", "Manager", "Employee"),
//     (req, res) => {

//         const {
//             template_id,
//             title,
//             description,
//             assigned_to,
//             due_date,
//             priority,
//             location,
//             custom_fields
//         } = req.body;

//         if (!title || title.trim() === "") {
//             return res.status(400).json({
//                 message: "Title is required"
//             });
//         }

//         const assignedBy = req.user.id;
//         const userRole = req.user.role;

//         // ==========================================
//         // EMPLOYEE CREATES TASK
//         // ==========================================
// if (userRole === "Employee") {

//     const taskStatus = "Draft";

//     const customFieldsJson =
//         custom_fields &&
//         Object.keys(custom_fields).length > 0
//             ? JSON.stringify(custom_fields)
//             : null;

//     const sql = `
//         INSERT INTO tasks (
//             template_id,
//             title,
//             description,
//             assigned_by,
//             assigned_to,
//             status,
//             priority,
//             due_date,
//             location,
//             custom_fields
//         )
//         VALUES (?, ?, ?, ?, NULL, ?, ?, ?, ?, ?)
//     `;

//     db.query(
//         sql,
//         [
//             template_id || null,
//             title.trim(),
//             description || null,
//             assignedBy,
//             taskStatus,
//             priority || "Medium",
//             due_date || null,
//             location || null,
//             customFieldsJson
//         ],
//         (err, result) => {

//             if (err) {

//                 console.log(
//                     "Employee task creation error:",
//                     err
//                 );

//                 return res.status(500).json({
//                     message: "Failed to create task"
//                 });
//             }

//             return res.status(201).json({
//                 message: "Task created successfully",
//                 taskId: result.insertId,
//                 status: "Draft"
//             });

//         }
//     );

//     // ==========================================
// // NOTIFY ADMIN AND MANAGER
// // Employee submitted a new task request
// // ==========================================

// const managementSql = `
//     SELECT
//         users.id
//     FROM users
//     JOIN roles
//         ON users.role_id = roles.id
//     WHERE roles.name IN ('Admin', 'Manager')
// `;

// db.query(managementSql, async (managementErr, managementUsers) => {

//     if (managementErr) {

//         console.log(
//             "Management notification user lookup error:",
//             managementErr
//         );

//     } else {

//         for (const manager of managementUsers) {

//             try {

//                 await createNotification({
//                     userId: manager.id,
//                     taskId: taskId,
//                     type: "TASK_SUBMITTED",
//                     title: "New Task Request",
//                     message:
//                         `${title.trim()} has been submitted by ${req.user.name || "an employee"} and requires your attention.`
//                 });

//             } catch (notificationError) {

//                 console.log(
//                     "Management notification error:",
//                     notificationError
//                 );

//             }

//         }

//     }

// });

//     return;
// }

//         // ==========================================
//         // ADMIN / MANAGER CREATES TASK
//         // ==========================================

//         if (
//             userRole === "Admin" ||
//             userRole === "Manager"
//         ) {

//             if (!assigned_to) {
//                 return res.status(400).json({
//                     message: "Butler is required"
//                 });
//             }

//             // ==========================================
//             // CHECK ASSIGNED USER
//             // ==========================================

//             const userSql = `
//                 SELECT
//                     users.id,
//                     users.name,
//                     roles.name AS role
//                 FROM users
//                 JOIN roles
//                     ON users.role_id = roles.id
//                 WHERE users.id = ?
//             `;

//             db.query(
//                 userSql,
//                 [assigned_to],
//                 (err, userResult) => {

//                     if (err) {

//                         console.log(
//                             "Assigned user lookup error:",
//                             err
//                         );

//                         return res.status(500).json({
//                             message: "Database error"
//                         });
//                     }

//                     if (userResult.length === 0) {

//                         return res.status(404).json({
//                             message: "Assigned user not found"
//                         });
//                     }

//                     const assignedUser = userResult[0];

//                     // ==========================================
//                     // ONLY BUTLER CAN BE ASSIGNED
//                     // ==========================================

//                     if (assignedUser.role !== "Butler") {

//                         return res.status(400).json({
//                             message:
//                                 "Task can only be assigned to a Butler"
//                         });
//                     }

//                     // ==========================================
//                     // CUSTOM FIELDS
//                     // ==========================================

//                     const customFieldsJson =
//                         custom_fields &&
//                             Object.keys(custom_fields).length > 0
//                             ? JSON.stringify(custom_fields)
//                             : null;

//                     // ==========================================
//                     // CREATE TASK
//                     // ==========================================

//                     const sql = `
//                         INSERT INTO tasks (
//                             template_id,
//                             title,
//                             description,
//                             assigned_by,
//                             assigned_to,
//                             status,
//                             priority,
//                             due_date,
//                             location,
//                             custom_fields
//                         )
//                         VALUES (?, ?, ?, ?, ?, 'Assigned', ?, ?, ?, ?)
//                     `;

//                     db.query(
//                         sql,
//                         [
//                             template_id || null,
//                             title.trim(),
//                             description || null,
//                             assignedBy,
//                             assigned_to,
//                             priority || "Medium",
//                             due_date || null,
//                             location || null,
//                             customFieldsJson
//                         ],
//                         (err, result) => {

//                             if (err) {

//                                 console.log(
//                                     "Task creation error:",
//                                     err
//                                 );

//                                 return res.status(500).json({
//                                     message:
//                                         "Failed to create task"
//                                 });
//                             }

//                             const taskId = result.insertId;

//                             // ==========================================
//                             // CREATE NOTIFICATION FOR BUTLER
//                             // ==========================================

//                             const notificationSql = `
//                                 INSERT INTO notifications (
//                                     user_id,
//                                     task_id,
//                                     type,
//                                     title,
//                                     message
//                                 )
//                                 VALUES (?, ?, ?, ?, ?)
//                             `;

//                             const notificationMessage =
//                                 `${title.trim()} has been assigned to you by ${req.user.name || "a requester"}.`;

//                             db.query(
//     notificationSql,
//     [
//         assigned_to,
//         taskId,
//         "TASK_ASSIGNED",
//         "New Task Assigned",
//         notificationMessage
//     ],
//     (notificationErr, notificationResult) => {

//         if (notificationErr) {

//             console.log(
//                 "Notification creation error:",
//                 notificationErr
//             );

//         } else {

//             // ==========================================
//             // SEND REAL-TIME NOTIFICATION
//             // ==========================================

//             const io = getSocketIO();

//             if (io) {

//                 io.to(`user_${assigned_to}`).emit(
//                     "new_notification",
//                     {
//                         id: notificationResult.insertId,
//                         user_id: assigned_to,
//                         task_id: taskId,
//                         type: "TASK_ASSIGNED",
//                         title: "New Task Assigned",
//                         message: notificationMessage,
//                         is_read: false,
//                         created_at: new Date()
//                     }
//                 );

//                 console.log(
//                     `Real-time notification sent to user ${assigned_to}`
//                 );
//             }
//         }

//         // ==========================================
//         // FINAL RESPONSE
//         // ==========================================

//         return res.status(201).json({

//             message:
//                 "Task created successfully",

//             taskId: taskId,

//             status: "Assigned"
//         });
//     }
// );
//                         }
//                     );
//                 }
//             );

//             return;
//         }
//     }
// );

router.post(
    "/",
    authMiddleware,
    authorizeRoles("Admin", "Manager", "Employee"),
    (req, res) => {

        const {
            template_id,
            title,
            description,
            due_date,
            priority,
            location,
            custom_fields,
            assignment_mode
        } = req.body;

        // ==========================================
        // VALIDATE TITLE
        // ==========================================

        if (!title || title.trim() === "") {
            return res.status(400).json({
                message: "Title is required"
            });
        }

        const assignedBy = Number(req.user.id);
        const userRole = req.user.role;

        // ==========================================
        // FIND BHARAT BHAIYA
        // ==========================================

        const butlerSql = `
            SELECT
                users.id,
                users.name
            FROM users
            JOIN roles
                ON users.role_id = roles.id
            WHERE roles.name = 'Butler'
            AND LOWER(TRIM(users.name)) = LOWER(TRIM(?))
            LIMIT 1
        `;

        db.query(
            butlerSql,
            ["Bharat Bhaiya"],
            (butlerErr, butlerResult) => {

                if (butlerErr) {

                    console.log(
                        "Butler lookup error:",
                        butlerErr
                    );

                    return res.status(500).json({
                        message: "Database error while finding Butler"
                    });
                }

                if (butlerResult.length === 0) {

                    return res.status(404).json({
                        message:
                            "Bharat Bhaiya Butler was not found"
                    });
                }

                const butler = butlerResult[0];

                const assignedTo = butler.id;

                // ==========================================
                // CUSTOM FIELDS
                // ==========================================

                const customFieldsJson =
                    custom_fields &&
                        Object.keys(custom_fields).length > 0
                        ? JSON.stringify(custom_fields)
                        : null;


                // ==========================================
                // DETERMINE TASK STATUS
                // ==========================================

                /*
                    Employee:
                    - Direct Assign -> Assigned
                    - Edit -> Assigned after form submission

                    Admin / Manager:
                    - Assigned
                */

                const taskStatus = "Assigned";


                // ==========================================
                // CREATE TASK
                // ==========================================

                const taskSql = `
                    INSERT INTO tasks (
                        template_id,
                        title,
                        description,
                        assigned_by,
                        assigned_to,
                        status,
                        priority,
                        due_date,
                        location,
                        custom_fields
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `;

                db.query(
                    taskSql,
                    [
                        template_id || null,
                        title.trim(),
                        description || null,
                        assignedBy,
                        assignedTo,
                        taskStatus,
                        priority || "Medium",
                        due_date || null,
                        location || null,
                        customFieldsJson
                    ],
                    async (taskErr, taskResult) => {

                        if (taskErr) {

                            console.log(
                                "Task creation error:",
                                taskErr
                            );

                            return res.status(500).json({
                                message:
                                    "Failed to create task"
                            });
                        }

                        const taskId =
                            taskResult.insertId;


                        // ==========================================
                        // SAVE ASSIGNMENT HISTORY
                        // ==========================================

                        /*
                            We are keeping the history table for
                            record/audit purposes.

                            There is NO assignment/reassignment
                            functionality in the UI.
                        */

                        const historySql = `
    INSERT INTO task_assignment_history
    (
        task_id,
        old_assigned_to,
        new_assigned_to,
        assigned_by
    )
    VALUES (?, ?, ?, ?)
`;

                        db.query(
                            historySql,
                            [
                                taskId,
                                null,        // old_assigned_to
                                assignedTo,  // new_assigned_to
                                assignedBy
                            ],
                            async (historyErr) => {

                                if (historyErr) {

                                    console.log(
                                        "Assignment history error:",
                                        historyErr
                                    );

                                    // Do not fail task creation
                                    // because history failed.
                                }


                                // ==========================================
                                // CREATE NOTIFICATION FOR BUTLER
                                // ==========================================

                                const notificationMessage =
                                    `"${title.trim()}" has been assigned to you by ${req.user.name || "a requester"}.`;

                                try {

                                    await createNotification({

                                        userId:
                                            assignedTo,

                                        taskId:
                                            taskId,

                                        type:
                                            "TASK_ASSIGNED",

                                        title:
                                            "New Task Assigned",

                                        message:
                                            notificationMessage
                                    });

                                    console.log(
                                        `Task assignment notification sent to Bharat Bhaiya (${assignedTo})`
                                    );

                                } catch (notificationError) {

                                    console.log(
                                        "Butler notification error:",
                                        notificationError
                                    );

                                    // Notification failure should
                                    // NOT fail task creation.
                                }


                                // ==========================================
                                // EMPLOYEE / MANAGEMENT NOTIFICATION
                                // ==========================================

                                /*
                                    Employee should know that their
                                    request has been assigned to the Butler.

                                    Admin/Manager who created the task
                                    do not need another notification
                                    about their own action.
                                */

                                if (userRole === "Employee") {

                                    try {

                                        await createNotification({

                                            userId:
                                                assignedBy,

                                            taskId:
                                                taskId,

                                            type:
                                                "TASK_ASSIGNED",

                                            title:
                                                "Task Assigned",

                                            message:
                                                `"${title.trim()}" has been assigned to Bharat Bhaiya.`
                                        });

                                    } catch (notificationError) {

                                        console.log(
                                            "Employee notification error:",
                                            notificationError
                                        );

                                    }
                                }

                                const taskPayload = {
                                    id: taskId,
                                    title: title.trim(),
                                    description: description || null,
                                    task_type: null, // add if your schema has this column; else leave null
                                    status: "Assigned",
                                    priority: priority || "Medium",
                                    due_date: due_date || null,
                                    location: location || null,
                                    assigned_by_name: req.user.name,
                                    assigned_to_name: butler.name,
                                };


                                // ==========================================
                                // FINAL RESPONSE
                                // ==========================================

                                return res.status(201).json({

                                    message:
                                        "Task assigned successfully",

                                    taskId:
                                        taskId,

                                    assignedTo:
                                        assignedTo,

                                    assignedToName:
                                        butler.name,

                                    status:
                                        "Assigned",

                                    assignmentMode:
                                        assignment_mode || "edit"
                                });

                            }
                        );
                    }
                );
            }
        );
    }
);


// ==========================================
// QUICK TASK - CREATE & DIRECTLY ASSIGN
// ==========================================

// ==========================================
// QUICK CREATE TASK
// DIRECTLY ASSIGN TO BHARAT BHAIYA
// ==========================================

router.post(
    "/quick-create",
    authMiddleware,
    authorizeRoles(
        "Admin",
        "Manager",
        "Employee"
    ),
    (req, res) => {

        const { template_id } = req.body;

        // ==========================================
        // VALIDATE TEMPLATE ID
        // ==========================================

        if (!template_id) {

            return res.status(400).json({
                message: "Template ID is required"
            });

        }

        const assignedBy = Number(req.user.id);
        const userRole = req.user.role;


        // ==========================================
        // GET TASK TEMPLATE
        // ==========================================

        const templateSql = `
            SELECT
                id,
                name,
                category,
                description,
                default_priority,
                is_active,
                sla_minutes,
                configurable_fields

            FROM task_templates

            WHERE id = ?
            AND is_active = 1

            LIMIT 1
        `;


        db.query(
            templateSql,
            [template_id],

            (templateErr, templateResult) => {

                // ==========================================
                // TEMPLATE DATABASE ERROR
                // ==========================================

                if (templateErr) {

                    console.log(
                        "Quick task template lookup error:",
                        templateErr
                    );

                    return res.status(500).json({

                        message:
                            "Database error while finding task template",

                        error:
                            templateErr.sqlMessage

                    });

                }


                // ==========================================
                // TEMPLATE NOT FOUND
                // ==========================================

                if (templateResult.length === 0) {

                    return res.status(404).json({

                        message:
                            "Task template not found or inactive"

                    });

                }


                const template =
                    templateResult[0];


                // ==========================================
                // FIND BHARAT BHAIYA
                // ==========================================

                const butlerSql = `
                    SELECT
                        users.id,
                        users.name

                    FROM users

                    JOIN roles
                        ON users.role_id = roles.id

                    WHERE roles.name = 'Butler'

                    AND LOWER(TRIM(users.name))
                        = LOWER(TRIM(?))

                    LIMIT 1
                `;


                db.query(
                    butlerSql,
                    ["Bharat Bhaiya"],

                    (butlerErr, butlerResult) => {

                        // ==========================================
                        // BUTLER DATABASE ERROR
                        // ==========================================

                        if (butlerErr) {

                            console.log(
                                "Quick task Butler lookup error:",
                                butlerErr
                            );

                            return res.status(500).json({

                                message:
                                    "Database error while finding Butler",

                                error:
                                    butlerErr.sqlMessage

                            });

                        }


                        // ==========================================
                        // BHARAT BHAIYA NOT FOUND
                        // ==========================================

                        if (butlerResult.length === 0) {

                            return res.status(404).json({

                                message:
                                    "Bharat Bhaiya Butler was not found"

                            });

                        }


                        const butler =
                            butlerResult[0];

                        const assignedTo =
                            Number(butler.id);


                        // ==========================================
                        // PARSE CONFIGURABLE FIELDS
                        // ==========================================

                        let customFieldsJson = null;


                        if (template.configurable_fields) {

                            try {

                                const parsedFields =
                                    typeof template.configurable_fields === "string"
                                        ? JSON.parse(
                                            template.configurable_fields
                                        )
                                        : template.configurable_fields;


                                customFieldsJson =
                                    JSON.stringify(
                                        parsedFields
                                    );

                            } catch (parseError) {

                                console.log(
                                    "Quick task configurable_fields parse error:",
                                    parseError
                                );

                                customFieldsJson = null;

                            }

                        }


                        // ==========================================
                        // CALCULATE DUE DATE USING SLA
                        // ==========================================

                        let dueDate = null;


                        if (
                            template.sla_minutes !== null &&
                            template.sla_minutes !== undefined
                        ) {

                            const due =
                                new Date();

                            due.setMinutes(
                                due.getMinutes() +
                                Number(
                                    template.sla_minutes
                                )
                            );


                            dueDate =
                                due
                                    .toISOString()
                                    .slice(0, 19)
                                    .replace("T", " ");

                        }


                        // ==========================================
                        // TASK STATUS
                        // ==========================================

                        const taskStatus =
                            "Assigned";


                        // ==========================================
                        // CREATE TASK
                        // ==========================================

                        const taskSql = `
                            INSERT INTO tasks (
                                template_id,
                                title,
                                description,
                                assigned_by,
                                assigned_to,
                                status,
                                priority,
                                due_date,
                                location,
                                custom_fields
                            )

                            VALUES (
                                ?,
                                ?,
                                ?,
                                ?,
                                ?,
                                ?,
                                ?,
                                ?,
                                ?,
                                ?
                            )
                        `;


                        db.query(
                            taskSql,

                            [
                                // template_id
                                template.id,

                                // title
                                template.name,

                                // description
                                template.description || null,

                                // person creating request
                                assignedBy,

                                // Bharat Bhaiya
                                assignedTo,

                                // directly assigned
                                taskStatus,

                                // template default priority
                                template.default_priority ||
                                "Medium",

                                // calculated from SLA
                                dueDate,

                                // quick templates do not have location
                                null,

                                // configurable fields
                                customFieldsJson
                            ],


                            (taskErr, taskResult) => {

                                // ==========================================
                                // TASK CREATION ERROR
                                // ==========================================

                                if (taskErr) {

                                    console.log(
                                        "Quick task creation error:",
                                        taskErr
                                    );

                                    return res.status(500).json({

                                        message:
                                            "Failed to create quick task",

                                        error:
                                            taskErr.sqlMessage

                                    });

                                }


                                const taskId =
                                    taskResult.insertId;


                                // ==========================================
                                // ASSIGNMENT HISTORY
                                // ==========================================

                                const historySql = `
    INSERT INTO task_assignment_history (
        task_id,
        old_assigned_to,
        new_assigned_to,
        assigned_by
    )

    VALUES (?, ?, ?, ?)
`;

                                db.query(
                                    historySql,

                                    [
                                        taskId,
                                        null,        // old_assigned_to
                                        assignedTo,  // new_assigned_to
                                        assignedBy
                                    ],

                                    async (historyErr) => {


                                        // ==========================================
                                        // HISTORY ERROR
                                        // ==========================================

                                        if (historyErr) {

                                            console.log(
                                                "Quick task assignment history error:",
                                                historyErr
                                            );

                                            // Don't fail task creation
                                            // because history is only audit data.

                                        }


                                        // ==========================================
                                        // NOTIFICATION TO BHARAT BHAIYA
                                        // ==========================================

                                        try {

                                            await createNotification({

                                                userId:
                                                    assignedTo,

                                                taskId:
                                                    taskId,

                                                type:
                                                    "TASK_ASSIGNED",

                                                title:
                                                    "New Task Assigned",

                                                message:
                                                    `"${template.name}" has been assigned to you by ${req.user.name ||
                                                    "a requester"
                                                    }.`
                                            });


                                            console.log(
                                                "Butler notification created"
                                            );


                                        } catch (notificationError) {

                                            console.log(
                                                "Quick task Butler notification error:",
                                                notificationError
                                            );

                                        }


                                        // ==========================================
                                        // NOTIFICATION TO EMPLOYEE
                                        // ==========================================

                                        if (
                                            userRole === "Employee"
                                        ) {

                                            try {

                                                await createNotification({

                                                    userId:
                                                        assignedBy,

                                                    taskId:
                                                        taskId,

                                                    type:
                                                        "TASK_ASSIGNED",

                                                    title:
                                                        "Task Assigned",

                                                    message:
                                                        `"${template.name}" has been assigned to Bharat Bhaiya.`
                                                });


                                                console.log(
                                                    "Employee notification created"
                                                );


                                            } catch (notificationError) {

                                                console.log(
                                                    "Quick task Employee notification error:",
                                                    notificationError
                                                );

                                            }

                                        }
                                        // ==========================================
                                        // REAL-TIME: NOTIFY DASHBOARDS
                                        // ==========================================
                                        try {
                                            const io = getSocketIO();
                                            console.log("Emitting task_created (quick-create) to role_Admin, role_Manager, user_" + assignedTo);

                                            const taskPayload = {
                                                id: taskId,
                                                title: template.name,
                                                description: template.description || null,
                                                task_type: template.category || null,
                                                status: taskStatus,
                                                priority: template.default_priority || "Medium",
                                                due_date: dueDate,
                                                location: null,
                                                assigned_by_name: req.user.name,
                                                assigned_to_name: butler.name,
                                            };

                                            io.to(`user_${assignedTo}`).emit("task_created", taskPayload);
                                            io.to("role_Admin").emit("task_created", taskPayload);
                                            io.to("role_Manager").emit("task_created", taskPayload);
                                        } catch (socketError) {
                                            console.log("Socket emit error (task_created, quick-create):", socketError);
                                        }

                                        // ==========================================
                                        // FINAL RESPONSE
                                        // ==========================================

                                        return res.status(201).json({

                                            message:
                                                "Quick task assigned successfully",

                                            taskId:
                                                taskId,

                                            templateId:
                                                template.id,

                                            title:
                                                template.name,

                                            assignedTo:
                                                assignedTo,

                                            assignedToName:
                                                butler.name,

                                            assignedBy:
                                                assignedBy,

                                            assignedByName:
                                                req.user.name,

                                            status:
                                                taskStatus,

                                            priority:
                                                template.default_priority ||
                                                "Medium",

                                            dueDate:
                                                dueDate,

                                            assignmentMode:
                                                "quick"

                                        });

                                    }
                                );

                            }
                        );

                    }
                );

            }
        );

    }
);



// router.post(
//     "/quick-create",
//     authMiddleware,
//     authorizeRoles("Admin", "Manager", "Employee"),
//     (req, res) => {

//         const {
//             template_id
//         } = req.body;

//         // ==========================================
//         // VALIDATE TEMPLATE ID
//         // ==========================================

//         if (!template_id) {
//             return res.status(400).json({
//                 message: "Template ID is required"
//             });
//         }

//         const assignedBy = Number(req.user.id);
//         const userRole = req.user.role;

//         // ==========================================
//         // GET TEMPLATE
//         // ==========================================

//         const templateSql = `
//     SELECT
//         id,
//         name,
//         category,
//         description,
//         default_priority,
//         is_active,
//         sla_minutes,
//         configurable_fields
//     FROM task_templates
//     WHERE id = ?
//     AND is_active = 1
//     LIMIT 1
// `;

//         db.query(
//             templateSql,
//             [template_id],
//             (templateErr, templateResult) => {

//                 if (templateErr) {

//                     console.log(
//                         "Quick task template lookup error:",
//                         templateErr
//                     );

//                     return res.status(500).json({
//                         message:
//                             "Database error while finding task template"
//                     });
//                 }

//                 if (templateResult.length === 0) {

//                     return res.status(404).json({
//                         message:
//                             "Task template not found or inactive"
//                     });
//                 }

//                 const template = templateResult[0];

//                 // ==========================================
//                 // FIND BHARAT BHAIYA
//                 // ==========================================

//                 const butlerSql = `
//                     SELECT
//                         users.id,
//                         users.name
//                     FROM users
//                     JOIN roles
//                         ON users.role_id = roles.id
//                     WHERE roles.name = 'Butler'
//                     AND LOWER(TRIM(users.name))
//                         = LOWER(TRIM(?))
//                     LIMIT 1
//                 `;

//                 db.query(
//                     butlerSql,
//                     ["Bharat Bhaiya"],
//                     (butlerErr, butlerResult) => {

//                         if (butlerErr) {

//                             console.log(
//                                 "Quick task Butler lookup error:",
//                                 butlerErr
//                             );

//                             return res.status(500).json({
//                                 message:
//                                     "Database error while finding Butler"
//                             });
//                         }

//                         if (butlerResult.length === 0) {

//                             return res.status(404).json({
//                                 message:
//                                     "Bharat Bhaiya Butler was not found"
//                             });
//                         }

//                         const butler = butlerResult[0];

//                         const assignedTo =
//                             Number(butler.id);

//                         // ==========================================
//                         // CUSTOM FIELDS
//                         // ==========================================

//                         let customFieldsJson = null;

//                         if (
//                             template.custom_fields &&
//                             typeof template.custom_fields === "object"
//                         ) {

//                             customFieldsJson =
//                                 JSON.stringify(
//                                     template.custom_fields
//                                 );

//                         } else if (
//                             template.custom_fields
//                         ) {

//                             customFieldsJson =
//                                 template.custom_fields;
//                         }

//                         // ==========================================
//                         // CREATE TASK
//                         // ==========================================

//                         const taskSql = `
//                             INSERT INTO tasks (
//                                 template_id,
//                                 title,
//                                 description,
//                                 assigned_by,
//                                 assigned_to,
//                                 status,
//                                 priority,
//                                 due_date,
//                                 location,
//                                 custom_fields
//                             )
//                             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//                         `;

//                         db.query(
//                             taskSql,
//                             [
//                                 template.id,
//                                 template.name,
//                                 template.description || null,
//                                 assignedBy,
//                                 assignedTo,
//                                 "Assigned",
//                                 template.priority || "Medium",
//                                 template.due_date || null,
//                                 template.location || null,
//                                 customFieldsJson
//                             ],
//                             (taskErr, taskResult) => {

//                                 if (taskErr) {

//                                     console.log(
//                                         "Quick task creation error:",
//                                         taskErr
//                                     );

//                                     return res.status(500).json({
//                                         message:
//                                             "Failed to create quick task"
//                                     });
//                                 }

//                                 const taskId =
//                                     taskResult.insertId;

//                                 // ==========================================
//                                 // ASSIGNMENT HISTORY
//                                 // ==========================================

//                                 const historySql = `
//                                     INSERT INTO task_assignment_history
//                                     (
//                                         task_id,
//                                         assigned_by,
//                                         assigned_to
//                                     )
//                                     VALUES (?, ?, ?)
//                                 `;

//                                 db.query(
//                                     historySql,
//                                     [
//                                         taskId,
//                                         assignedBy,
//                                         assignedTo
//                                     ],
//                                     async (historyErr) => {

//                                         if (historyErr) {

//                                             console.log(
//                                                 "Quick task assignment history error:",
//                                                 historyErr
//                                             );

//                                         }

//                                         // ==========================================
//                                         // BUTLER NOTIFICATION
//                                         // ==========================================

//                                         try {

//                                             await createNotification({

//                                                 userId:
//                                                     assignedTo,

//                                                 taskId:
//                                                     taskId,

//                                                 type:
//                                                     "TASK_ASSIGNED",

//                                                 title:
//                                                     "New Task Assigned",

//                                                 message:
//                                                     `"${template.name}" has been assigned to you by ${
//                                                         req.user.name ||
//                                                         "a requester"
//                                                     }.`
//                                             });

//                                         } catch (notificationError) {

//                                             console.log(
//                                                 "Quick task Butler notification error:",
//                                                 notificationError
//                                             );

//                                         }

//                                         // ==========================================
//                                         // EMPLOYEE NOTIFICATION
//                                         // ==========================================

//                                         if (
//                                             userRole === "Employee"
//                                         ) {

//                                             try {

//                                                 await createNotification({

//                                                     userId:
//                                                         assignedBy,

//                                                     taskId:
//                                                         taskId,

//                                                     type:
//                                                         "TASK_ASSIGNED",

//                                                     title:
//                                                         "Task Assigned",

//                                                     message:
//                                                         `"${template.name}" has been assigned to Bharat Bhaiya.`
//                                                 });

//                                             } catch (notificationError) {

//                                                 console.log(
//                                                     "Quick task Employee notification error:",
//                                                     notificationError
//                                                 );

//                                             }
//                                         }

//                                         // ==========================================
//                                         // FINAL RESPONSE
//                                         // ==========================================

//                                         return res.status(201).json({

//                                             message:
//                                                 "Quick task assigned successfully",

//                                             taskId:
//                                                 taskId,

//                                             templateId:
//                                                 template.id,

//                                             assignedTo:
//                                                 assignedTo,

//                                             assignedToName:
//                                                 butler.name,

//                                             status:
//                                                 "Assigned",

//                                             assignmentMode:
//                                                 "quick"
//                                         });

//                                     }
//                                 );
//                             }
//                         );
//                     }
//                 );
//             }
//         );
//     }
// );


router.put(
    "/:id/submit",
    authMiddleware,
    authorizeRoles("Employee"),
    (req, res) => {

        const taskId = req.params.id;

        const taskSql = `
            SELECT
                id,
                assigned_by,
                status
            FROM tasks
            WHERE id = ?
        `;

        db.query(taskSql, [taskId], (err, result) => {

            if (err) {
                console.log("Submit task lookup error:", err);

                return res.status(500).json({
                    message: "Database error"
                });
            }

            if (result.length === 0) {
                return res.status(404).json({
                    message: "Task not found"
                });
            }

            const task = result[0];

            // Employee can submit only their own task
            if (Number(task.assigned_by) !== Number(req.user.id)) {
                return res.status(403).json({
                    message: "You can only submit your own tasks"
                });
            }

            // Only Draft tasks can be submitted
            if (task.status !== "Draft") {
                return res.status(400).json({
                    message:
                        `Task cannot be submitted because its current status is ${task.status}`
                });
            }

            // Draft → Submitted
            const updateSql = `
                UPDATE tasks
                SET status = 'Submitted'
                WHERE id = ?
            `;

            db.query(updateSql, [taskId], (err) => {

                if (err) {
                    console.log("Submit task update error:", err);

                    return res.status(500).json({
                        message: "Failed to submit task"
                    });
                }

                // Save status history
                const historySql = `
                    INSERT INTO task_status_history
                    (
                        task_id,
                        changed_by,
                        old_status,
                        new_status
                    )
                    VALUES (?, ?, ?, ?)
                `;

                db.query(
                    historySql,
                    [
                        taskId,
                        req.user.id,
                        "Draft",
                        "Submitted"
                    ],
                    (err) => {

                        if (err) {
                            console.log(
                                "Submit history error:",
                                err
                            );

                            return res.status(500).json({
                                message:
                                    "Task submitted but status history could not be saved"
                            });
                        }

                        return res.json({
                            message: "Task submitted successfully",
                            taskId: taskId,
                            oldStatus: "Draft",
                            newStatus: "Submitted"
                        });

                    }
                );

            });

        });

    }
);
router.get(
    "/",
    authMiddleware,
    authorizeRoles("Admin", "Manager", "Employee", "Butler"),
    (req, res) => {

        let sql = `
            SELECT
                tasks.id,
                tasks.title,
                tasks.description,
                tasks.status,
                tasks.priority,
                tasks.due_date,
                tasks.location,
                tasks.created_at,

                task_templates.name AS task_type,
                task_templates.category AS category,

                assigned_user.id AS assigned_to,
                assigned_user.name AS assigned_to_name,
                assigned_role.name AS assigned_to_role,

                assigned_by_user.id AS assigned_by,
                assigned_by_user.name AS assigned_by_name

            FROM tasks

            LEFT JOIN task_templates
                ON tasks.template_id = task_templates.id

            LEFT JOIN users AS assigned_user
                ON tasks.assigned_to = assigned_user.id

            LEFT JOIN roles AS assigned_role
                ON assigned_user.role_id = assigned_role.id

            LEFT JOIN users AS assigned_by_user
                ON tasks.assigned_by = assigned_by_user.id
        `;

        let values = [];

        // ==========================================
        // ROLE BASED VISIBILITY
        // ==========================================

        // BUTLER
        // Butler sees only tasks assigned to them
        if (req.user.role === "Butler") {

            sql += `
                WHERE tasks.assigned_to = ?
            `;

            values.push(req.user.id);
        }

        // EMPLOYEE
        // Employee sees only requests created by themselves
        else if (req.user.role === "Employee") {

            sql += `
                WHERE tasks.assigned_by = ?
            `;

            values.push(req.user.id);
        }

        // ADMIN / MANAGER
        // No WHERE condition
        // They can see all tasks

        sql += `
            ORDER BY tasks.created_at DESC
        `;

        db.query(sql, values, (err, result) => {

            if (err) {

                console.log("Get tasks error:", err);

                return res.status(500).json({
                    message: "Failed to fetch tasks"
                });
            }

            res.json(result);
        });
    }
);
router.post(
    "/:id/comments",
    authMiddleware,
    authorizeRoles("Admin", "Manager", "Employee", "Butler"),
    (req, res) => {

        if (!req.user || !req.user.id) {
            return res.status(401).json({
                message: "Invalid user information in token"
            });
        }

        const taskId = req.params.id;
        const { comment } = req.body;
        console.log(req.user.name);
        // ==========================================
        // VALIDATE COMMENT
        // ==========================================

        if (!comment || comment.trim() === "") {
            return res.status(400).json({
                message: "Comment is required"
            });
        }

        // ==========================================
        // GET TASK
        // ==========================================

        const taskSql = `
            SELECT
                id,
                title,
                assigned_by,
                assigned_to
            FROM tasks
            WHERE id = ?
        `;

        db.query(
            taskSql,
            [taskId],
            (err, result) => {

                if (err) {

                    console.log(
                        "Task lookup error:",
                        err
                    );

                    return res.status(500).json({
                        message: "Database error"
                    });
                }

                if (result.length === 0) {

                    return res.status(404).json({
                        message: "Task not found"
                    });
                }

                const task = result[0];

                // ==========================================
                // CHECK ACCESS
                // ==========================================

                // Employee can comment only on own task
                if (
                    req.user.role === "Employee" &&
                    Number(task.assigned_by) !== Number(req.user.id)
                ) {

                    return res.status(403).json({
                        message:
                            "You can only comment on your own tasks"
                    });
                }

                // Butler can comment only on assigned task
                if (
                    req.user.role === "Butler" &&
                    Number(task.assigned_to) !== Number(req.user.id)
                ) {

                    return res.status(403).json({
                        message:
                            "You can only comment on tasks assigned to you"
                    });
                }

                // ==========================================
                // INSERT COMMENT
                // ==========================================

                const commentSql = `
                    INSERT INTO task_comments
                    (
                        task_id,
                        user_id,
                        comment
                    )
                    VALUES (?, ?, ?)
                `;

                db.query(
                    commentSql,
                    [
                        taskId,
                        req.user.id,
                        comment.trim()
                    ],
                    async (err, result) => {

                        if (err) {

                            console.log(
                                "Comment insert error:",
                                err
                            );

                            return res.status(500).json({
                                message:
                                    "Failed to add comment"
                            });
                        }

                        const commentId =
                            result.insertId;

                        // ==========================================
                        // CREATE NOTIFICATION
                        // ==========================================

                        try {

                            let notificationUserId = null;
                            let notificationTitle = "";
                            let notificationMessage = "";
                            let notificationType = "";

                            // ======================================
                            // BUTLER COMMENTED
                            // → NOTIFY REQUESTER
                            // ======================================

                            if (req.user.role === "Butler") {

                                notificationUserId =
                                    task.assigned_by;

                                notificationType =
                                    "TASK_COMMENT";

                                notificationTitle =
                                    "New Butler Reply";

                                notificationMessage =
                                    `${req.user.name || "Butler"} replied to your task "${task.title}".`;
                            }

                            // ======================================
                            // EMPLOYEE COMMENTED
                            // → NOTIFY BUTLER
                            // ======================================

                            // else if (
                            //     req.user.role === "Employee" &&
                            //     task.assigned_to
                            // ) {

                            //     notificationUserId =
                            //         task.assigned_to;

                            //     notificationType =
                            //         "TASK_COMMENT";

                            //     notificationTitle =
                            //         "New Task Comment";

                            //     notificationMessage =
                            //         `${req.user.name || "Requester"} commented on task "${task.title}".`;
                            // }

                            // ======================================
                            // ADMIN / MANAGER COMMENTED
                            // → NOTIFY BUTLER
                            // ======================================

                            else if (
                                (
                                    req.user.role === "Admin" ||
                                    req.user.role === "Manager" ||
                                    req.user.role === "Employee"
                                ) &&
                                task.assigned_to
                            ) {

                                notificationUserId =
                                    task.assigned_to;

                                notificationType =
                                    "TASK_COMMENT";

                                notificationTitle =
                                    "New Task Comment";

                                notificationMessage =
                                    `${req.user.name || req.user.role} commented on task "${task.title}".`;
                            }

                            // ==========================================
                            // SAVE + SEND REAL-TIME NOTIFICATION
                            // ==========================================

                            if (notificationUserId && notificationTitle) {

                                await createNotification({
                                    userId: notificationUserId,
                                    taskId: taskId,
                                    type: notificationType,
                                    title: notificationTitle,
                                    message: notificationMessage
                                });

                                console.log("Comment notification created for user:", notificationUserId);

                                // ==========================================
                                // LIVE PUSH — updates the other person's
                                // TaskDetails page instantly, no reload needed
                                // ==========================================

                                try {
                                    // const io = getSocketIO();

                                    // io.to(`user_${notificationUserId}`).emit("new_comment", {
                                    //     id: commentId,
                                    //     task_id: Number(taskId),
                                    //     user_id: req.user.id,
                                    //     user_name: req.user.name,
                                    //     user_role: req.user.role,
                                    //     comment: comment.trim(),
                                    //     created_at: new Date()
                                    // });

                                    const io = getSocketIO();

                                    if (io) {

                                        const liveComment = {
                                            id: commentId,
                                            task_id: Number(taskId),
                                            user_id: Number(req.user.id),
                                            user_name: req.user.name,
                                            user_role: req.user.role,
                                            comment: comment.trim(),
                                            created_at: new Date(),
                                        };

                                        const room =
                                            `user_${Number(notificationUserId)}`;

                                        io.to(room).emit(
                                            "new_comment",
                                            liveComment
                                        );

                                        console.log(
                                            `Live comment push sent to ${room}`
                                        );

                                    } else {

                                        console.warn(
                                            "Socket.IO unavailable. Comment was saved but live push could not be sent."
                                        );
                                    }
                                    console.log(`Live comment push sent to user_${notificationUserId}`);

                                } catch (socketError) {
                                    console.log("Comment socket push error:", socketError);
                                    // Should not fail the comment itself
                                }
                            }

                        } catch (notificationError) {

                            console.log(
                                "Comment notification error:",
                                notificationError
                            );

                            // Comment should still succeed
                        }

                        // ==========================================
                        // FINAL RESPONSE
                        // ==========================================

                        // return res.status(201).json({

                        //     message:
                        //         "Comment added successfully",

                        //     commentId:
                        //         commentId

                        // });

                        return res.status(201).json({
                            message: "Comment added successfully",

                            comment: {
                                id: commentId,
                                task_id: Number(taskId),
                                user_id: Number(req.user.id),
                                user_name: req.user.name,
                                user_role: req.user.role,
                                comment: comment.trim(),
                                created_at: new Date(),
                            },
                        });

                    }
                );

            }
        );
    }
);
router.get("/:id/comments", authMiddleware, authorizeRoles("Admin", "Manager", "Employee", "Butler"), (req, res) => {

    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "Invalid user information in token" });
    }

    const taskId = req.params.id;

    // Checking tasks
    const taskSql = ` SELECT
    id,
    assigned_by,
    assigned_to
FROM tasks
WHERE id = ? `;
    db.query(taskSql, [taskId], (err, taskResult) => {
        if (err) {
            console.log("Task lookup error:", err);
            return res.status(500).json({ message: "Database error" });
        }

        if (taskResult.length === 0) {
            return res.status(404).json({ message: "Task not found" });
        }
        const task = taskResult[0];
        // Employee and Butler can see comments only for their own ask

        if (req.user.role === "Employee") {
            if (Number(task.assigned_by) !== Number(req.user.id)) {
                return res.status(403).json({
                    message: "You cannot view comments for this task"
                });
            }
        }

        if (req.user.role === "Butler") {
            if (Number(task.assigned_to) !== Number(req.user.id)) {
                return res.status(403).json({
                    message: "You cannot view comments for this task"
                });
            }
        }
        const sql = `
                SELECT
                    task_comments.id,
                    task_comments.comment,
                    task_comments.created_at,
                    users.id AS user_id,
                    users.name AS user_name,
                    roles.name AS user_role
                FROM task_comments
                JOIN users
                ON task_comments.user_id = users.id
                LEFT JOIN roles
                ON users.role_id = roles.id
                WHERE task_comments.task_id = ?
                ORDER BY task_comments.created_at ASC
            `;

        db.query(sql, [taskId], (err, result) => {
            if (err) {
                console.log("Get comments error:", err);
                return res.status(500).json({ message: "Failed to fetch comments" });
            }
            res.json(result);
        });
    });
}
);

router.delete(
    "/:id",
    authMiddleware,
    authorizeRoles("Admin", "Manager", "Employee"),
    (req, res) => {

        const taskId = req.params.id;
        const userId = req.user.id;
        const userRole = req.user.role;

        // ==========================================
        // GET TASK
        // ==========================================

        const sql = `
            SELECT
                id,
                assigned_by
            FROM tasks
            WHERE id = ?
        `;

        db.query(sql, [taskId], (err, results) => {

            if (err) {

                console.log(
                    "Delete task lookup error:",
                    err
                );

                return res.status(500).json({
                    message: "Database error"
                });
            }

            if (results.length === 0) {

                return res.status(404).json({
                    message: "Task not found"
                });
            }

            const task = results[0];

            // ==========================================
            // PERMISSION CHECK
            // ==========================================

            // Admin and Manager can delete any task
            if (
                userRole !== "Admin" &&
                userRole !== "Manager"
            ) {

                // Employee can delete only
                // tasks created by themselves

                if (
                    userRole === "Employee" &&
                    Number(task.assigned_by) !== Number(userId)
                ) {

                    return res.status(403).json({
                        message:
                            "You can only delete tasks created by you"
                    });
                }
            }


            // ==========================================
            // DELETE RELATED DATA FIRST
            // ==========================================

            // 1. Delete notifications

            const deleteNotificationsSql = `
                DELETE FROM notifications
                WHERE task_id = ?
            `;

            db.query(
                deleteNotificationsSql,
                [taskId],
                (err) => {

                    if (err) {

                        console.log(
                            "Delete notifications error:",
                            err
                        );

                        return res.status(500).json({
                            message:
                                "Failed to delete task notifications"
                        });
                    }


                    // ==========================================
                    // 2. DELETE COMMENTS
                    // ==========================================

                    const deleteCommentsSql = `
                        DELETE FROM task_comments
                        WHERE task_id = ?
                    `;

                    db.query(
                        deleteCommentsSql,
                        [taskId],
                        (err) => {

                            if (err) {

                                console.log(
                                    "Delete comments error:",
                                    err
                                );

                                return res.status(500).json({
                                    message:
                                        "Failed to delete task comments"
                                });
                            }


                            // ==========================================
                            // 3. DELETE STATUS HISTORY
                            // ==========================================

                            const deleteStatusHistorySql = `
                                DELETE FROM task_status_history
                                WHERE task_id = ?
                            `;

                            db.query(
                                deleteStatusHistorySql,
                                [taskId],
                                (err) => {

                                    if (err) {

                                        console.log(
                                            "Delete status history error:",
                                            err
                                        );

                                        return res.status(500).json({
                                            message:
                                                "Failed to delete task status history"
                                        });
                                    }


                                    // ==========================================
                                    // 4. DELETE ASSIGNMENT HISTORY
                                    // ==========================================

                                    const deleteAssignmentHistorySql = `
                                        DELETE FROM task_assignment_history
                                        WHERE task_id = ?
                                    `;

                                    db.query(
                                        deleteAssignmentHistorySql,
                                        [taskId],
                                        (err) => {

                                            if (err) {

                                                console.log(
                                                    "Delete assignment history error:",
                                                    err
                                                );

                                                return res.status(500).json({
                                                    message:
                                                        "Failed to delete task assignment history"
                                                });
                                            }


                                            // ==========================================
                                            // 5. DELETE TASK
                                            // ==========================================

                                            const deleteTaskSql = `
                                                DELETE FROM tasks
                                                WHERE id = ?
                                            `;

                                            db.query(
                                                deleteTaskSql,
                                                [taskId],
                                                (err) => {

                                                    if (err) {

                                                        console.log(
                                                            "Delete task error:",
                                                            err
                                                        );

                                                        return res.status(500).json({
                                                            message:
                                                                "Failed to delete task"
                                                        });
                                                    }


                                                    // ==========================================
                                                    // SUCCESS
                                                    // ==========================================

                                                    return res.json({

                                                        message:
                                                            "Task deleted successfully",

                                                        taskId:
                                                            taskId

                                                    });

                                                }
                                            );

                                        }
                                    );

                                }
                            );

                        }
                    );

                }
            );

        });

    }
);

router.put(
    "/:id",
    authMiddleware,
    authorizeRoles("Admin", "Manager", "Employee"),
    (req, res) => {

        const taskId = req.params.id;

        const userId = req.user.id;
        const userRole = req.user.role;

        const {
            template_id,
            title,
            description,
            priority,
            due_date,
            location,
            custom_fields
        } = req.body;


        // ==========================================
        // VALIDATE TITLE
        // ==========================================

        if (!title || title.trim() === "") {
            return res.status(400).json({
                message: "Title is required"
            });
        }


        // ==========================================
        // FIND TASK
        // ==========================================

        const taskSql = `
            SELECT
                id,
                assigned_by,
                assigned_to,
                status
            FROM tasks
            WHERE id = ?
        `;

        db.query(taskSql, [taskId], (err, result) => {

            if (err) {

                console.log("Edit task lookup error:", err);

                return res.status(500).json({
                    message: "Database error"
                });
            }


            if (result.length === 0) {

                return res.status(404).json({
                    message: "Task not found"
                });
            }


            const task = result[0];


            // ==========================================
            // EMPLOYEE PERMISSION
            // ==========================================

            if (userRole === "Employee") {

                // Employee can edit only their own task
                if (
                    Number(task.assigned_by) !==
                    Number(userId)
                ) {

                    return res.status(403).json({
                        message:
                            "You can only edit tasks created by you"
                    });
                }


                // Employee can edit only Draft tasks
                // Employee can only edit their own task, and only before
                // a Butler has started acting on it
                if (task.status !== "Assigned") {
                    return res.status(400).json({
                        message:
                            `This task can no longer be edited because its current status is ${task.status}`
                    });
                }
            }


            // ==========================================
            // ADMIN / MANAGER
            // ==========================================

            // Admin and Manager can edit any task.
            // No ownership or Draft restriction.


            // ==========================================
            // CUSTOM FIELDS
            // ==========================================

            const customFieldsJson =
                custom_fields &&
                    Object.keys(custom_fields).length > 0
                    ? JSON.stringify(custom_fields)
                    : null;


            // ==========================================
            // UPDATE TASK
            // ==========================================

            const updateSql = `
                UPDATE tasks
                SET
                    template_id = ?,
                    title = ?,
                    description = ?,
                    priority = ?,
                    due_date = ?,
                    location = ?,
                    custom_fields = ?
                WHERE id = ?
            `;


            db.query(
                updateSql,
                [
                    template_id || null,
                    title.trim(),
                    description || null,
                    priority || "Medium",
                    due_date || null,
                    location || null,
                    customFieldsJson,
                    taskId
                ],
                (err, updateResult) => {

                    if (err) {

                        console.log(
                            "Edit task update error:",
                            err
                        );

                        return res.status(500).json({
                            message: "Failed to update task"
                        });
                    }


                    return res.json({

                        message:
                            "Task updated successfully",

                        taskId: taskId,

                        status: task.status
                    });
                }
            );
        });
    }
);
router.get(
    "/:id",
    authMiddleware,
    authorizeRoles("Admin", "Manager", "Butler", "Employee"),
    (req, res) => {

        const taskId = req.params.id;

        const sql = `
    SELECT
        tasks.id,
        tasks.title,
        tasks.description,
        tasks.status,
        tasks.priority,
        tasks.due_date,
        tasks.location,
        tasks.completion_notes,
        tasks.custom_fields,
       tasks.created_at,
tasks.updated_at,
tasks.assigned_by,
tasks.assigned_to,


        assigned_user.name AS assigned_to_name,
        assigned_role.name AS assigned_to_role,

        assigned_by_user.name AS assigned_by_name

    FROM tasks

    LEFT JOIN users AS assigned_user
        ON tasks.assigned_to = assigned_user.id

    LEFT JOIN roles AS assigned_role
        ON assigned_user.role_id = assigned_role.id

    JOIN users AS assigned_by_user
        ON tasks.assigned_by = assigned_by_user.id

    WHERE tasks.id = ?
`;
        db.query(sql, [taskId], (err, result) => {

            if (err) {

                console.log("Get task details error:", err);

                return res.status(500).json({
                    message: "Failed to fetch task"
                });
            }

            if (result.length === 0) {

                return res.status(404).json({
                    message: "Task not found"
                });
            }

            const task = result[0];

            // ==========================================
            // PARSE CUSTOM FIELDS
            // ==========================================

            if (task.custom_fields) {

                try {
                    task.custom_fields =
                        JSON.parse(task.custom_fields);

                } catch (parseErr) {

                    console.log(
                        "custom_fields parse error:",
                        parseErr
                    );

                    task.custom_fields = null;
                }
            }

            // ==========================================
            // ADMIN / MANAGER
            // ==========================================

            if (
                req.user.role === "Admin" ||
                req.user.role === "Manager"
            ) {

                return res.json(task);
            }

            // ==========================================
            // EMPLOYEE
            // ==========================================

            if (req.user.role === "Employee") {

                // Employee can view only tasks
                // created by themselves

                if (
                    Number(task.assigned_by) !==
                    Number(req.user.id)
                ) {

                    return res.status(403).json({
                        message:
                            "You can only access tasks created by you"
                    });
                }

                return res.json(task);
            }

            // ==========================================
            // BUTLER
            // ==========================================

            if (req.user.role === "Butler") {

                // Butler can view only tasks
                // assigned to themselves

                if (
                    Number(task.assigned_to) !==
                    Number(req.user.id)
                ) {

                    return res.status(403).json({
                        message:
                            "You can only access tasks assigned to you"
                    });
                }

                return res.json(task);
            }

        });
    }
);
router.put(
    "/:id/status",
    authMiddleware,
    authorizeRoles("Admin", "Manager", "Employee", "Butler"),
    (req, res) => {

        const taskId = req.params.id;
        const requestedStatus = req.body.status;

        // ==========================================
        // GET TASK
        // ==========================================

        const taskSql = `
            SELECT
                id,
                title,
                assigned_by,
                assigned_to,
                status
            FROM tasks
            WHERE id = ?
        `;

        db.query(taskSql, [taskId], (err, result) => {

            if (err) {
                console.log("Status task lookup error:", err);

                return res.status(500).json({
                    message: "Database error"
                });
            }

            if (result.length === 0) {
                return res.status(404).json({
                    message: "Task not found"
                });
            }

            const task = result[0];

            const currentStatus = task.status;
            const userRole = req.user.role;
            const userId = Number(req.user.id);

            // ==========================================
            // STATUS TRANSITION RULES
            // ==========================================

            const allowedTransitions = {

                Employee: {
                    Draft: ["Submitted"],
                    Submitted: ["Cancelled"],
                    Assigned: ["Cancelled"]
                },

                Admin: {
                    Submitted: ["Assigned"],
                    Assigned: ["Assigned", "Cancelled"],
                    Accepted: ["Cancelled"],
                    "In-Progress": ["Cancelled"],
                    "On Hold": ["Cancelled"]
                },

                Manager: {
                    Submitted: ["Assigned"],
                    Assigned: ["Assigned", "Cancelled"],
                    Accepted: ["Cancelled"],
                    "In-Progress": ["Cancelled"],
                    "On Hold": ["Cancelled"]
                },

                Butler: {
                    Assigned: ["Accepted", "Rejected"],
                    Accepted: ["In-Progress"],
                    "In-Progress": ["Completed", "On Hold"],
                    "On Hold": ["In-Progress", "Cancelled"]
                }
            };

            // ==========================================
            // CHECK ROLE
            // ==========================================

            if (!allowedTransitions[userRole]) {

                return res.status(403).json({
                    message:
                        "You are not allowed to change task status"
                });

            }

            // ==========================================
            // CHECK TASK OWNERSHIP
            // ==========================================

            if (
                userRole === "Employee" &&
                Number(task.assigned_by) !== userId
            ) {

                return res.status(403).json({
                    message:
                        "You can only update tasks created by you"
                });

            }

            if (
                userRole === "Butler" &&
                Number(task.assigned_to) !== userId
            ) {

                return res.status(403).json({
                    message:
                        "You can only update tasks assigned to you"
                });

            }

            // ==========================================
            // CHECK WHETHER TRANSITION IS ALLOWED
            // ==========================================

            const roleTransitions =
                allowedTransitions[userRole];

            const possibleStatuses =
                roleTransitions[currentStatus] || [];

            if (!possibleStatuses.includes(requestedStatus)) {

                return res.status(400).json({
                    message:
                        `You cannot change task status from "${currentStatus}" to "${requestedStatus}"`
                });

            }

            // ==========================================
            // UPDATE STATUS
            // ==========================================

            const updateSql = `
                UPDATE tasks
                SET status = ?
                WHERE id = ?
            `;

            db.query(
                updateSql,
                [requestedStatus, taskId],
                (err) => {

                    if (err) {

                        console.log(
                            "Status update error:",
                            err
                        );

                        return res.status(500).json({
                            message:
                                "Failed to update task status"
                        });

                    }

                    // ==========================================
                    // SAVE STATUS HISTORY
                    // ==========================================

                    const historySql = `
                        INSERT INTO task_status_history
                        (
                            task_id,
                            changed_by,
                            old_status,
                            new_status
                        )
                        VALUES (?, ?, ?, ?)
                    `;

                    db.query(
                        historySql,
                        [
                            taskId,
                            userId,
                            currentStatus,
                            requestedStatus
                        ],
                        async (err) => {

                            if (err) {

                                console.log(
                                    "Status history error:",
                                    err
                                );

                                return res.status(500).json({
                                    message:
                                        "Status updated but history could not be saved"
                                });

                            }

                            // ==========================================
                            // CREATE NOTIFICATION
                            // ==========================================

                            // ==========================================
                            // CREATE NOTIFICATION
                            // ==========================================

                            try {

                                // =====================================================
                                // 1. EMPLOYEE SUBMITTED TASK
                                //    Notify ALL Admins and Managers
                                // =====================================================

                                if (
                                    userRole === "Employee" &&
                                    currentStatus === "Draft" &&
                                    requestedStatus === "Submitted"
                                ) {

                                    const managementSql = `
            SELECT users.id
            FROM users
            JOIN roles
                ON users.role_id = roles.id
            WHERE roles.name IN ('Admin', 'Manager')
        `;

                                    db.query(
                                        managementSql,
                                        async (managementErr, managementUsers) => {

                                            if (managementErr) {

                                                console.log(
                                                    "Management notification lookup error:",
                                                    managementErr
                                                );

                                                return;
                                            }

                                            for (const manager of managementUsers) {

                                                try {

                                                    await createNotification({

                                                        userId: manager.id,

                                                        taskId: taskId,

                                                        type: "TASK_SUBMITTED",

                                                        title: "New Task Request",

                                                        message:
                                                            `"${task.title}" has been submitted by ${req.user.name || "an employee"
                                                            } and requires your attention.`

                                                    });

                                                    console.log(
                                                        `Task submitted notification sent to user ${manager.id}`
                                                    );

                                                } catch (notificationError) {

                                                    console.log(
                                                        "Management notification error:",
                                                        notificationError
                                                    );

                                                }
                                            }

                                        }
                                    );

                                }


                                // =====================================================
                                // 2. BUTLER CHANGED STATUS
                                //    Notify REQUESTER / EMPLOYEE
                                // =====================================================

                                else if (userRole === "Butler") {

                                    const notificationUserId =
                                        task.assigned_by;

                                    let notificationTitle = "";
                                    let notificationMessage = "";
                                    let notificationType = "";

                                    switch (requestedStatus) {

                                        case "Accepted":

                                            notificationTitle =
                                                "Task Accepted";

                                            notificationMessage =
                                                `"${task.title}" has been accepted by ${req.user.name || "the Butler"
                                                }.`;

                                            notificationType =
                                                "TASK_ACCEPTED";

                                            break;


                                        case "Rejected":

                                            notificationTitle =
                                                "Task Rejected";

                                            notificationMessage =
                                                `"${task.title}" has been rejected by ${req.user.name || "the Butler"
                                                }.`;

                                            notificationType =
                                                "TASK_REJECTED";

                                            break;


                                        case "In-Progress":

                                            notificationTitle =
                                                "Task In Progress";

                                            notificationMessage =
                                                `"${task.title}" is now in progress.`;

                                            notificationType =
                                                "TASK_IN_PROGRESS";

                                            break;


                                        case "Completed":

                                            notificationTitle =
                                                "Task Completed";

                                            notificationMessage =
                                                `"${task.title}" has been completed by ${req.user.name || "the Butler"
                                                }.`;

                                            notificationType =
                                                "TASK_COMPLETED";

                                            break;


                                        case "On Hold":

                                            notificationTitle =
                                                "Task On Hold";

                                            notificationMessage =
                                                `"${task.title}" has been put on hold by ${req.user.name || "the Butler"
                                                }.`;

                                            notificationType =
                                                "TASK_ON_HOLD";

                                            break;


                                        case "Cancelled":

                                            notificationTitle =
                                                "Task Cancelled";

                                            notificationMessage =
                                                `"${task.title}" has been cancelled by ${req.user.name || "the Butler"
                                                }.`;

                                            notificationType =
                                                "TASK_CANCELLED";

                                            break;

                                    }


                                    if (
                                        notificationUserId &&
                                        notificationTitle &&
                                        notificationMessage
                                    ) {

                                        await createNotification({

                                            userId:
                                                notificationUserId,

                                            taskId:
                                                taskId,

                                            type:
                                                notificationType,

                                            title:
                                                notificationTitle,

                                            message:
                                                notificationMessage

                                        });

                                        console.log(
                                            "Butler status notification sent to requester:",
                                            notificationUserId
                                        );

                                    }

                                }


                                // =====================================================
                                // 3. ADMIN / MANAGER CANCELLED TASK
                                //    Notify BUTLER
                                // =====================================================

                                else if (
                                    (userRole === "Admin" ||
                                        userRole === "Manager" ||
                                        userRole === "Employee") &&
                                    requestedStatus === "Cancelled" &&
                                    task.assigned_to
                                ) {

                                    await createNotification({

                                        userId:
                                            task.assigned_to,

                                        taskId:
                                            taskId,

                                        type:
                                            "TASK_CANCELLED",

                                        title:
                                            "Task Cancelled",

                                        message:
                                            `"${task.title}" has been cancelled by ${req.user.name || "the requester"
                                            }.`

                                    });

                                    console.log(
                                        "Cancellation notification sent to Butler:",
                                        task.assigned_to
                                    );

                                }

                            } catch (notificationError) {

                                console.log(
                                    "Status notification error:",
                                    notificationError
                                );

                                // Notification failure should NOT
                                // make the status update fail.
                            }

                            // ==========================================
                            // FINAL RESPONSE
                            // ==========================================

                            return res.json({

                                message:
                                    "Task status updated successfully",

                                taskId:
                                    taskId,

                                oldStatus:
                                    currentStatus,

                                newStatus:
                                    requestedStatus

                            });

                        }
                    );

                }
            );

        });

    }
);
router.get("/:id/history", authMiddleware, authorizeRoles("Admin", "Manager", "Employee", "Butler"), (req, res) => {

    const taskId = req.params.id;
    const taskSql = `
    SELECT
        id,
        assigned_by,
        assigned_to
    FROM tasks
    WHERE id = ?
`;
    db.query(taskSql, [taskId], (err, taskResult) => {

        if (err) {
            console.log(err);

            return res.status(500).json({ message: "Database error" });
        }

        if (taskResult.length === 0) {
            return res.status(404).json({ message: "Task not found" });
        }
        const task = taskResult[0];

        // Employee and Butler can only see history of their task
        if (req.user.role === "Employee") {

            if (Number(task.assigned_by) !== Number(req.user.id)) {
                return res.status(403).json({
                    message: "You cannot view this task history"
                });
            }
        }

        if (req.user.role === "Butler") {

            if (Number(task.assigned_to) !== Number(req.user.id)) {
                return res.status(403).json({
                    message: "You cannot view this task history"
                });
            }
        }
        const sql = `
                SELECT
                    task_status_history.id,
                    task_status_history.old_status,
                    task_status_history.new_status,
                    task_status_history.changed_at,
                    users.name AS changed_by_name
                FROM task_status_history
                JOIN users
                ON task_status_history.changed_by = users.id
                WHERE task_status_history.task_id = ?
                ORDER BY task_status_history.changed_at ASC `;

        db.query(sql, [taskId], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: "Failed to fetch task history" });
            }
            res.json(result);
        });
    });
}
);

// Assign task to Butler
// Assign / Reassign task to Butler
router.put(
    "/:id/assign",
    authMiddleware,
    authorizeRoles("Admin", "Manager"),
    (req, res) => {

        const taskId = req.params.id;
        const { assigned_to } = req.body;

        if (!assigned_to) {
            return res.status(400).json({
                message: "Butler is required"
            });
        }

        const userSql = `
            SELECT
                users.id,
                users.name,
                roles.name AS role
            FROM users
            JOIN roles
                ON users.role_id = roles.id
            WHERE users.id = ?
        `;

        db.query(userSql, [assigned_to], (err, userResult) => {

            if (err) {
                console.log("User lookup error:", err);

                return res.status(500).json({
                    message: "Database error"
                });
            }

            if (userResult.length === 0) {
                return res.status(404).json({
                    message: "Butler not found"
                });
            }

            const user = userResult[0];

            if (user.role !== "Butler") {
                return res.status(400).json({
                    message: "Selected user is not a Butler"
                });
            }

            const taskSql = `
                SELECT
                    id,
                    assigned_to,
                    status
                FROM tasks
                WHERE id = ?
            `;

            db.query(taskSql, [taskId], (err, taskResult) => {

                if (err) {
                    console.log("Task lookup error:", err);

                    return res.status(500).json({
                        message: "Database error"
                    });
                }

                if (taskResult.length === 0) {
                    return res.status(404).json({
                        message: "Task not found"
                    });
                }

                const task = taskResult[0];
                if (task.status !== "Submitted") {
                    return res.status(400).json({
                        message: `Only submitted tasks can be assigned. Current status: ${task.status}`
                    });
                }

                if (
                    Number(task.assigned_to) ===
                    Number(assigned_to)
                ) {
                    return res.status(400).json({
                        message:
                            "Task is already assigned to this Butler"
                    });
                }

                const oldAssignee = task.assigned_to;
                const oldStatus = task.status;

                const updateSql = `
    UPDATE tasks
    SET
        assigned_to = ?,
        status = 'Assigned'
    WHERE id = ?
`;

                db.query(
                    updateSql,
                    [assigned_to, taskId],
                    (err) => {

                        if (err) {
                            console.log("Assign Butler error:", err);

                            return res.status(500).json({
                                message: "Failed to assign task"
                            });
                        }

                        // Save assignment history
                        const assignmentHistorySql = `
            INSERT INTO task_assignment_history
            (
                task_id,
                old_assigned_to,
                new_assigned_to,
                assigned_by
            )
            VALUES (?, ?, ?, ?)
        `;

                        db.query(
                            assignmentHistorySql,
                            [
                                taskId,
                                oldAssignee,
                                assigned_to,
                                req.user.id
                            ],
                            (err) => {

                                if (err) {
                                    console.log(
                                        "Assignment history error:",
                                        err
                                    );

                                    return res.status(500).json({
                                        message:
                                            "Task assigned but assignment history could not be saved"
                                    });
                                }

                                // Save status history
                                const historySql = `
                    INSERT INTO task_status_history
                    (
                        task_id,
                        changed_by,
                        old_status,
                        new_status
                    )
                    VALUES (?, ?, ?, ?)
                `;

                                db.query(
                                    historySql,
                                    [
                                        taskId,
                                        req.user.id,
                                        oldStatus,
                                        "Assigned"
                                    ],
                                    (err) => {

                                        if (err) {
                                            console.log(
                                                "Status history error:",
                                                err
                                            );

                                            return res.status(500).json({
                                                message:
                                                    "Task assigned but status history could not be saved"
                                            });
                                        }

                                        return res.json({
                                            message:
                                                "Task assigned successfully",

                                            taskId: taskId,

                                            assigned_to: user.id,

                                            assigned_to_name:
                                                user.name,

                                            status: "Assigned"
                                        });

                                    }
                                );

                            }
                        );

                    }
                );

            });

        });

    }
);

router.put(
    "/:id/accept",
    authMiddleware,
    authorizeRoles("Butler"),
    (req, res) => {

        const taskId = req.params.id;

        // Get task
        const taskSql = `
            SELECT
                id,
                assigned_to,
                status
            FROM tasks
            WHERE id = ?
        `;

        db.query(taskSql, [taskId], (err, result) => {

            if (err) {
                console.log("Accept task lookup error:", err);

                return res.status(500).json({
                    message: "Database error"
                });
            }

            if (result.length === 0) {
                return res.status(404).json({
                    message: "Task not found"
                });
            }

            const task = result[0];

            // Butler can accept only their own assigned task
            if (
                Number(task.assigned_to) !==
                Number(req.user.id)
            ) {
                return res.status(403).json({
                    message:
                        "You can only accept tasks assigned to you"
                });
            }

            // Task must be Assigned
            if (task.status !== "Assigned") {
                return res.status(400).json({
                    message:
                        `Only assigned tasks can be accepted. Current status: ${task.status}`
                });
            }

            const oldStatus = task.status;

            // Update task status
            const updateSql = `
                UPDATE tasks
                SET status = 'Accepted'
                WHERE id = ?
            `;

            db.query(
                updateSql,
                [taskId],
                (err) => {

                    if (err) {
                        console.log(
                            "Accept task update error:",
                            err
                        );

                        return res.status(500).json({
                            message:
                                "Failed to accept task"
                        });
                    }

                    // Save status history
                    const historySql = `
                        INSERT INTO task_status_history
                        (
                            task_id,
                            changed_by,
                            old_status,
                            new_status
                        )
                        VALUES (?, ?, ?, ?)
                    `;

                    db.query(
                        historySql,
                        [
                            taskId,
                            req.user.id,
                            oldStatus,
                            "Accepted"
                        ],
                        (err) => {

                            if (err) {
                                console.log(
                                    "Accept history error:",
                                    err
                                );

                                return res.status(500).json({
                                    message:
                                        "Task accepted but status history could not be saved"
                                });
                            }

                            return res.json({
                                message:
                                    "Task accepted successfully",

                                taskId: taskId,

                                oldStatus:
                                    oldStatus,

                                newStatus:
                                    "Accepted"
                            });

                        }
                    );

                }
            );

        });

    }
);

router.put(
    "/:id/start",
    authMiddleware,
    authorizeRoles("Butler"),
    (req, res) => {

        const taskId = req.params.id;

        const taskSql = `
            SELECT
                id,
                assigned_to,
                status
            FROM tasks
            WHERE id = ?
        `;

        db.query(taskSql, [taskId], (err, result) => {

            if (err) {
                console.log("Start task lookup error:", err);

                return res.status(500).json({
                    message: "Database error"
                });
            }

            if (result.length === 0) {
                return res.status(404).json({
                    message: "Task not found"
                });
            }

            const task = result[0];

            // Butler can start only their own task
            if (
                Number(task.assigned_to) !==
                Number(req.user.id)
            ) {
                return res.status(403).json({
                    message:
                        "You can only start tasks assigned to you"
                });
            }

            // Task must be Accepted
            if (task.status !== "Accepted") {
                return res.status(400).json({
                    message:
                        `Only accepted tasks can be started. Current status: ${task.status}`
                });
            }

            const oldStatus = task.status;

            const updateSql = `
                UPDATE tasks
                SET status = 'In-Progress'
                WHERE id = ?
            `;

            db.query(
                updateSql,
                [taskId],
                (err) => {

                    if (err) {
                        console.log(
                            "Start task update error:",
                            err
                        );

                        return res.status(500).json({
                            message:
                                "Failed to start task"
                        });
                    }

                    const historySql = `
                        INSERT INTO task_status_history
                        (
                            task_id,
                            changed_by,
                            old_status,
                            new_status
                        )
                        VALUES (?, ?, ?, ?)
                    `;

                    db.query(
                        historySql,
                        [
                            taskId,
                            req.user.id,
                            oldStatus,
                            "In-Progress"
                        ],
                        (err) => {

                            if (err) {
                                console.log(
                                    "Start history error:",
                                    err
                                );

                                return res.status(500).json({
                                    message:
                                        "Task started but status history could not be saved"
                                });
                            }

                            return res.json({
                                message:
                                    "Task started successfully",

                                taskId: taskId,

                                oldStatus:
                                    oldStatus,

                                newStatus:
                                    "In-Progress"
                            });

                        }
                    );

                }
            );

        });

    }
);



router.put(
    "/:id/complete",
    authMiddleware,
    authorizeRoles("Butler"),
    (req, res) => {

        const taskId = req.params.id;

        // Completion notes are optional
        const completion_notes =
            req.body.completion_notes &&
                req.body.completion_notes.trim() !== ""
                ? req.body.completion_notes.trim()
                : null;


        // ==========================================
        // GET TASK
        // ==========================================

        const taskSql = `
            SELECT
                id,
                assigned_to,
                status
            FROM tasks
            WHERE id = ?
        `;

        db.query(taskSql, [taskId], (err, result) => {

            if (err) {

                console.log(
                    "Complete task lookup error:",
                    err
                );

                return res.status(500).json({
                    message: "Database error"
                });
            }


            // Task doesn't exist
            if (result.length === 0) {

                return res.status(404).json({
                    message: "Task not found"
                });
            }


            const task = result[0];


            // ==========================================
            // CHECK BUTLER
            // ==========================================

            if (
                Number(task.assigned_to) !==
                Number(req.user.id)
            ) {

                return res.status(403).json({
                    message:
                        "You can only complete tasks assigned to you"
                });
            }


            // ==========================================
            // CHECK STATUS
            // ==========================================

            if (task.status !== "In-Progress") {

                return res.status(400).json({
                    message:
                        `Only In-Progress tasks can be completed. Current status: ${task.status}`
                });
            }


            const oldStatus = task.status;


            // ==========================================
            // UPDATE TASK
            // ==========================================

            const updateSql = `
                UPDATE tasks
                SET
                    status = 'Completed',
                    completion_notes = ?
                WHERE id = ?
            `;

            db.query(
                updateSql,
                [
                    completion_notes,
                    taskId
                ],
                (err, result) => {

                    if (err) {

                        console.log(
                            "Complete task update error:",
                            err
                        );

                        return res.status(500).json({
                            message:
                                "Failed to complete task"
                        });
                    }


                    // ==========================================
                    // SAVE STATUS HISTORY
                    // ==========================================

                    const historySql = `
                        INSERT INTO task_status_history
                        (
                            task_id,
                            changed_by,
                            old_status,
                            new_status
                        )
                        VALUES (?, ?, ?, ?)
                    `;

                    db.query(
                        historySql,
                        [
                            taskId,
                            req.user.id,
                            oldStatus,
                            "Completed"
                        ],
                        (err, historyResult) => {

                            if (err) {

                                console.log(
                                    "Complete history error:",
                                    err
                                );

                                return res.status(500).json({
                                    message:
                                        "Task completed but status history could not be saved"
                                });
                            }


                            // ==========================================
                            // SUCCESS
                            // ==========================================

                            return res.json({

                                message:
                                    "Task completed successfully",

                                taskId: taskId,

                                oldStatus:
                                    oldStatus,

                                newStatus:
                                    "Completed",

                                completion_notes:
                                    completion_notes

                            });

                        }
                    );

                }
            );

        });

    }
);


router.get(
    "/:id/assignment-history",
    authMiddleware,
    async (req, res) => {

        const taskId = req.params.id;

        const sql = `
            SELECT
                tah.id,
                tah.task_id,
                old_user.name AS old_assignee,
                new_user.name AS new_assignee,
                changed_user.name AS changed_by_name,
                tah.assigned_at
            FROM task_assignment_history tah

            LEFT JOIN users old_user
                ON tah.old_assigned_to = old_user.id

            JOIN users new_user
                ON tah.new_assigned_to = new_user.id

            JOIN users changed_user
                ON tah.assigned_by = changed_user.id

            WHERE tah.task_id = ?

            ORDER BY tah.assigned_at DESC
        `;

        db.query(sql, [taskId], (err, result) => {

            if (err) {
                console.log(err);

                return res.status(500).json({
                    message: "Failed to load assignment history"
                });
            }

            res.json(result);
        });
    }
);
export default router;