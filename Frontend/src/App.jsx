import CreateTask from "./pages/CreateTask";
import "./App.css";
import TaskDetails from "./pages/TaskDetails";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes
} from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
// import Templates from "./pages/Templates";
// import Users from "./pages/Users";
// import Reports from "./pages/Reports";
import ProtectedRoute from "./components/ProtectedRoute";
import ButlerDesk from "./pages/ButlerDesk";
import AddUser from "./pages/AddUser";
import EditUser from "./pages/EditUser";
import Users from "./pages/Users";
import Layout from "./components/Layout";
import EditTask from "./pages/EditTask";
import TaskTemplates from "./pages/TaskTemplates";
import Notifications from "./pages/Notifications";
import CreateTemplate from "./pages/CreateTemplate";


function App() {

  return (

 <BrowserRouter>

    <Routes>

        {/* PUBLIC */}
        <Route
            path="/login"
            element={<Login />}
        />

        <Route
            path="/"
            element={
                <Navigate
                    to="/login"
                    replace
                />
            }
        />

        {/* EVERYTHING BELOW HERE IS PROTECTED */}
        <Route
            element={
                <ProtectedRoute>
                    <Layout />
                </ProtectedRoute>
            }
        >

            <Route
                path="/dashboard"
                element={<Dashboard />}
            />

            <Route
                path="/notifications"
                element={<Notifications />}
            />

            <Route
                path="/tasks"
                element={<Tasks />}
            />

            <Route
                path="/tasks/:id"
                element={<TaskDetails />}
            />

            <Route
                path="/tasks/:id/edit"
                element={<EditTask />}
            />

            <Route
                path="/users"
                element={<Users />}
            />

            <Route
                path="/users/:id/edit"
                element={<EditUser />}
            />

            <Route
                path="/users/create"
                element={<AddUser />}
            />

            <Route
                path="/task-templates"
                element={<TaskTemplates />}
            />

            <Route
                path="/tasks/create"
                element={
                    <ProtectedRoute
                        allowedRoles={[
                            "Admin",
                            "Manager",
                            "Employee"
                        ]}
                    >
                        <CreateTask />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/task-templates/create"
                element={
                    <ProtectedRoute
                        allowedRoles={[
                            "Admin",
                            "Manager",
                            "Employee"
                        ]}
                    >
                        <CreateTemplate />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/butler-desk"
                element={
                    <ProtectedRoute
                        allowedRoles={["Butler"]}
                    >
                        <ButlerDesk />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/butler-desk/:id"
                element={
                    <ProtectedRoute
                        allowedRoles={["Butler"]}
                    >
                        <ButlerDesk />
                    </ProtectedRoute>
                }
            />

        </Route>

    </Routes>

</BrowserRouter>

  );
}


export default App;