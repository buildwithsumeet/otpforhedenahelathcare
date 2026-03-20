import { useParams } from "react-router-dom"
import { createOrder } from "../api/paymentApi"

const PaymentPage = () => {

  const { booking_id: deal_id } = useParams()

  const handlePayment = async () => {

    const { data } = await createOrder(deal_id)

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      amount: data.data.amount,
      currency: "INR",
      name: "Your Company",
      description: "Service Payment",
      order_id: data.data.order_id,

      handler: async function (response) {

        await fetch("http://localhost:3000/api/v1/payment/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...response,
            booking_id: deal_id   // 👈 SAME ID
          })
        })

        window.location.href = "/success"
      }
    }

    const rzp = new window.Razorpay(options)
    rzp.open()
  }

  return (
    <div>
      <h2>Pay for Deal #{deal_id}</h2>
      <button onClick={handlePayment}>Pay Now</button>
    </div>
  )
}

export default PaymentPage