import { createBrowserRouter, RouterProvider } from "react-router-dom";

import UnprotectedRoute from "./components/layout/UnprotectedRoute";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import RootLayout from "./components/layout/RootLayout";
import Error from "./components/layout/Error";

import Overview from "./pages/tour/Overview";
import TourDetails from "./pages/tour/TourDetails";
import Signup from "./pages/user/Signup";
import Login from "./pages/user/Login";
import ForgotPassword from "./pages/user/ForgotPassword";
import CodeVerification from "./pages/user/CodeVerification";
import ResetPassword from "./pages/user/ResetPassword";
import MyDetails from "./pages/user/MyDetails";
import UpdateMyDetails from "./pages/user/UpdateMyDetails";
import Security from "./pages/user/Security";
import ValidateTwoFactor from "./pages/user/ValidateTwoFactor";
import ChooseTwoFactorMethod from "./pages/user/ChooseTwoFactorMethod";
import MyBookings from "./pages/user/MyBookings";
import MyReviews from "./pages/user/MyReviews";
import ManageUsers from "./pages/management/ManageUsers";
import EditUser from "./pages/management/EditUser";
import UserDetails from "./pages/management/UserDetails";
import ManageReviews from "./pages/management/ManageReviews";
import ManageBookings from "./pages/management/ManageBookings";
import ManageTours from "./pages/management/ManageTours";
import CreateTour from "./pages/management/CreateTour";
import EditTour from "./pages/management/EditTour";

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      errorElement: <Error />,
      children: [
        {
          index: true,
          element: (
            <UnprotectedRoute>
              <Overview />
            </UnprotectedRoute>
          ),
        },
        {
          path: "tours/:id",
          element: (
            <UnprotectedRoute>
              <TourDetails />
            </UnprotectedRoute>
          ),
        },
        {
          path: "verifyCode",
          element: (
            <UnprotectedRoute>
              <CodeVerification />
            </UnprotectedRoute>
          ),
        },
        {
          // Auth routes
          path: "auth",
          element: <ProtectedRoute reverse />,
          children: [
            {
              path: "signup",
              element: <Signup />,
            },
            {
              path: "login",
              element: <Login />,
            },
            {
              path: "twoFactor/authApp",
              element: <ValidateTwoFactor />,
            },
            {
              path: "twoFactor/chooseMethod",
              element: <ChooseTwoFactorMethod />,
            },
            {
              path: "forgotPassword",
              element: <ForgotPassword />,
            },
            {
              path: "passwordReset/:token?",
              element: <ResetPassword />,
            },
          ],
        },
        {
          // Me routes
          path: "me",
          children: [
            {
              path: "profile",
              children: [
                {
                  index: true,
                  element: (
                    <ProtectedRoute>
                      <MyDetails />
                    </ProtectedRoute>
                  ),
                },
                {
                  path: "update",
                  element: (
                    <ProtectedRoute type="provider" restrictTo={["local"]}>
                      <UpdateMyDetails />
                    </ProtectedRoute>
                  ),
                },
              ],
            },
            {
              path: "security",
              element: (
                <ProtectedRoute>
                  <Security />
                </ProtectedRoute>
              ),
            },
            {
              path: "bookings",
              element: (
                <ProtectedRoute>
                  <MyBookings />
                </ProtectedRoute>
              ),
            },
            {
              path: "reviews",
              element: (
                <ProtectedRoute type="role" restrictTo={["user"]}>
                  <MyReviews />
                </ProtectedRoute>
              ),
            },
          ],
        },
        {
          // Manage  routes
          path: "manage",
          children: [
            {
              path: "tours",
              element: (
                <ProtectedRoute
                  type="role"
                  restrictTo={["admin", "lead-guide"]}
                />
              ),
              children: [
                {
                  index: true,
                  element: <ManageTours />,
                },
                {
                  path: "create",
                  element: <CreateTour />,
                },
                {
                  path: "edit/:id",
                  element: <EditTour />,
                },
              ],
            },
            {
              path: "users",
              element: <ProtectedRoute type="role" restrictTo={["admin"]} />,
              children: [
                {
                  index: true,
                  element: <ManageUsers />,
                },
                {
                  path: "profile/:id",
                  element: <UserDetails />,
                },
                {
                  path: "edit/:id",
                  element: <EditUser />,
                },
              ],
            },
            {
              path: "reviews",
              element: (
                <ProtectedRoute type="role" restrictTo={["admin"]}>
                  <ManageReviews />
                </ProtectedRoute>
              ),
            },
            {
              path: "bookings",
              element: (
                <ProtectedRoute
                  type="role"
                  restrictTo={["admin", "lead-guide"]}
                >
                  <ManageBookings />
                </ProtectedRoute>
              ),
            },
          ],
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}
