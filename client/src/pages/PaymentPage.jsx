import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { createOrder, verifyPayment } from "../api/paymentApi"; // ← import verify too!

const PaymentPage = () => {
  const [searchParams] = useSearchParams();
  const deal_id = searchParams.get("deal_id");
  const amountStr = searchParams.get("amount"); // e.g. "80" or "5000"

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // Convert string → number → paise (×100)
  const amountInRupees = Number(amountStr) || 0;
  const amountInPaise = Math.round(amountInRupees * 100); // safe rounding

  const handlePayment = async () => {
    if (!deal_id || amountInRupees <= 0) {
      setErrorMsg("Invalid payment details (deal or amount missing)");
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      // 1. Create Razorpay Order (backend handles real amount creation)
      const { data } = await createOrder({
        deal_id,
        amount: amountInPaise,          // send in paise!
      });

      // data should return: { id: "order_xxx", amount: 8000, currency: "INR" }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_xxxxxxxxxxxxxx", // fallback for debug
        amount: data.amount,           // trust backend value (in paise)
        currency: data.currency || "INR",
        name: "Heden Healthcare",      // ← change to your brand
        description: `Payment for Deal #${deal_id}`,
        order_id: data.id,             // very important!
        handler: async function (response) {
          try {
            // Use your api helper instead of raw fetch
            const verifyRes = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              deal_id,
            });

            if (verifyRes.data?.success) {
              window.location.href = "/success"; // or use navigate()
            } else {
              alert(verifyRes.data?.message || "Payment verification failed");
            }
          } catch (verifyErr) {
            console.error("Verify failed:", verifyErr);
            alert("Verification error – contact support");
          }
        },
        prefill: {
          name: "Sumeet",              // ← personalize if you have user data
          email: "sumeet@example.com",
          contact: "Your phone if known",
        },
        theme: { color: "#3399cc" },
        modal: {
          ondismiss: () => setLoading(false),
        },
      };

      // Check if Razorpay is loaded
      if (typeof window.Razorpay === "undefined") {
        throw new Error("Razorpay SDK not loaded. Check internet / script.");
      }

      const rzp = new window.Razorpay(options);
      rzp.open(); // ← this opens the popup!
    } catch (err) {
      console.error("Payment initiation failed:", err);
      setErrorMsg(
        err.message?.includes("SDK")
          ? "Razorpay not loaded – refresh page"
          : "Failed to start payment. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!deal_id || !amountStr) {
    return (
      <div style={{ textAlign: "center", marginTop: "80px", padding: "20px" }}>
        <h2>Invalid Payment Link</h2>
        <p>Missing deal_id or amount in the URL.</p>
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center", marginTop: "80px", padding: "20px" }}>
      <h2>Complete Payment for Deal #{deal_id}</h2>
      <h3 style={{ color: "#2c3e50", margin: "20px 0" }}>
        Amount: ₹{amountInRupees.toFixed(2)}
      </h3>

      {errorMsg && (
        <p style={{ color: "red", margin: "20px 0", fontWeight: "bold" }}>
          {errorMsg}
        </p>
      )}

      <button
        onClick={handlePayment}
        disabled={loading}
        style={{
          padding: "14px 40px",
          fontSize: "18px",
          backgroundColor: loading ? "#95a5a6" : "#3498db",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: loading ? "not-allowed" : "pointer",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        }}
      >
        {loading ? "Processing..." : "Pay Now with Razorpay"}
      </button>

      <p style={{ marginTop: "30px", color: "#7f8c8d", fontSize: "14px" }}>
        Secured payments powered by Razorpay
      </p>
    </div>
  );
};

export default PaymentPage;