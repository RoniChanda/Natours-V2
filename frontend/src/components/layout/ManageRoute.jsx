import { Outlet } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import RestrictedRoute from "./RestrictedRoute";

export default function ManageRoute({ restrictTo }) {
  return (
    <ProtectedRoute>
      <RestrictedRoute type="role" restrictTo={restrictTo || ["admin"]}>
        <Outlet />
      </RestrictedRoute>
    </ProtectedRoute>
  );
}
