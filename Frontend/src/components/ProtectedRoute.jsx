// import { Navigate } from "react-router-dom";

// function ProtectedRoute({ allowedRoles, children }) {

//     const token = localStorage.getItem("token");
//     const user = JSON.parse(localStorage.getItem("user"));

//     // Not logged in
//     if (!token) {
//         return <Navigate to="/login" replace />;
//     }

//     // Get logged-in user's role
//     const userRole = user?.role;

//     // Check whether role is allowed
//     if (!allowedRoles.includes(userRole)) {
//         return <Navigate to="/tasks" replace />;
//     }

//     return children;
// }

// export default ProtectedRoute;

import { Navigate } from "react-router-dom";

function ProtectedRoute({ allowedRoles = [], children }) {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");

    // Not logged in
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Get logged-in user's role
    const userRole = user?.role;

    // No roles specified = allow any logged-in user
    if (allowedRoles.length === 0) {
        return children;
    }

    // Check whether role is allowed
    if (!allowedRoles.includes(userRole)) {
        return <Navigate to="/tasks" replace />;
    }

    return children;
}

export default ProtectedRoute;