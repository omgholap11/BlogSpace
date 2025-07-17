const AdminRoute = ({ isAuthenticated, isAdmin }) => {
  return isAuthenticated && isAdmin ? <Outlet /> : <Navigate to="/unauthorized" />;
};