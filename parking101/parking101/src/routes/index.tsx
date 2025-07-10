import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import AdminDashboard from "../pages/admin/AdminDashboard";
import Layout from "../pages/admin/Layout";
import Drivers from "../pages/admin/Drivers";
import ParkingSystem from "../pages/admin/ParkingSystem";
import Reservations from "../pages/admin/Reservations";
import Payments from "../pages/admin/Payments";
import Analytics from "../pages/admin/Analytics";
import Settings from "../pages/admin/Settings";
import UserManagement from "../pages/admin/UserManagement";
import DriverDetails from "../pages/admin/DriverDetails";
import NewDriver from "../pages/admin/NewDriver";
import ParkingOperations from "../pages/admin/ParkingOperations";
import CreateReservation from "../pages/admin/CreateReservation";
import ReservationDetails from "../pages/admin/ReservationDetail";
import SearchReservations from "../pages/admin/SearchReservation";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/auth",
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
    ],
  },
  {
    path: "/admin",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <AdminDashboard />,
      },{
        path: "user-management",
        element: <UserManagement/>
      },
      {
        path: "drivers",
        element: <Drivers />,
      },
      {
        path:"drivers/new",
        element:<NewDriver/>
      },
      {
        path:"/admin/drivers/:id",
        element: <DriverDetails/>
      },
      {
        path: "parking-system",
        element: <ParkingSystem />,
      },
      {
        path: "parking-system/operations",
        element: <ParkingOperations />
      },
      {
        path: "reservations",
        element: <Reservations />,
      },
      {
        path: "reservations/create",
        element: <CreateReservation />,
      },
      {
        path: "reservations/:id",
        element: <ReservationDetails />,
      },
      {
        path: "reservations/search",
        element: <SearchReservations />,
      },
      {
        path: "payments",
        element: <Payments />,
      },
      {
        path: "analytics",
        element: <Analytics />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
    ],
  },
]);

export const Routes = () => <RouterProvider router={router} />;
