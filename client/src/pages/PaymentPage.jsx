import { useParams } from "react-router-dom";
// Assuming your api/paymentApi.js exports createOrder
import { createOrder } from "../api/paymentApi"; 

const PaymentPage = () => {
  // Extract deal_id from URL /pay/:deal_id
  const { deal_id } = useParams(); 

  const handlePayment = async () => {
    try {
      // 1. Create Order on Backend
      const { data } = await createOrder({ deal_id });
x
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: data.amount, // Amount from backend
        currency: "INR",
        name: "Your Company",
        description: "Service Payment",
        order_id: data.id,

        handler: async function (response) {
          // 2. Verify Payment on Backend
          const res = await fetch("http://187.127.131.10:3000/api/v1/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              deal_id: deal_id // Managed by deal_id
            })
          });

          const result = await res.json();
          if (result.success) {
            window.location.href = "/success";
          } else {
            alert("Payment Verification Failed");
          }
        },
        prefill: {
          name: "Customer Name",
          email: "customer@example.com"
        },
        theme: { color: "#3399cc" }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment Error:", error);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Payment for Deal #{deal_id}</h2>
      <button onClick={handlePayment} className="btn-pay">Pay Now</button>
    </div>
  );
};

export default PaymentPage;
