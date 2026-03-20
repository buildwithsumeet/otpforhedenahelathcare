import { createBrowserRouter } from "react-router-dom"
import PaymentPage from "./pages/PaymentPage"
import SuccessPage from "./pages/SuccessPage"
import FailedPage from "./pages/FailedPage"
import App from "./App"

export const router = createBrowserRouter([

    {
        path:"/",
        element: <App />
    },
  {
    path: "/pay/:booking_id",
    element: <PaymentPage />
  },
  {
    path: "/success",
    element: <SuccessPage />
  },
  {
    path: "/failed",
    element: <FailedPage />
  }
])