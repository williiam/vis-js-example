import { createBrowserRouter } from "react-router-dom";
import VisGraph from "./components/VisGraph";
import Login from "./routes/Login";

export const router = createBrowserRouter([
  {
    path: "/",
    index: true,
    element: <Login />,
  },
  {
    path: "/network",
    element: <VisGraph />,
  },
]);
