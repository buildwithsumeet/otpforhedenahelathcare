import { createBrowserRouter } from "react-router-dom"
import PaymentPage from "./pages/PaymentPage"
import SuccessPage from "./pages/SuccessPage"
import FailedPage from "./pages/FailedPage"
import ExpiredPage from "./pages/ExpiredPage"
import AlreadyPaidPage from "./pages/AlreadyPaidPage"
import App from "./App"

export const router = createBrowserRouter([
    {
        path:"/",
        element: <App />
    },
  {
    path: "/pay",
    element: <PaymentPage />
  },
  {
    path: "/success",
    element: <SuccessPage />
  },
  {
    path: "/failed",
    element: <FailedPage />
  },
  {
    path: "/expired",
    element: <ExpiredPage />
  },
  {
    path: "/paid",
    element: <AlreadyPaidPage />
  }
], { basename: "/" })  // ← Yeh add karo