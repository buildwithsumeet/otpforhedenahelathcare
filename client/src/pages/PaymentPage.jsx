import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { createOrder, verifyPayment } from "../api/paymentApi";
import "./PaymentPage.css";

const PaymentPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const deal_id = searchParams.get("deal_id");
  const amountStr = searchParams.get("amount"); 
  const expiresAt = searchParams.get("expires_at");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);

  // Check Expiry (10 mins)
  const isExpired = expiresAt && Date.now() > Number(expiresAt);

  // Auto-redirect if expired
  useEffect(() => {
    if (isExpired) {
       navigate("/expired");
    }
  }, [isExpired, navigate]);

  // Timer logic for better UX
  useEffect(() => {
    if (!expiresAt || isExpired) return;

    const interval = setInterval(() => {
      const remaining = Number(expiresAt) - Date.now();
      if (remaining <= 0) {
        clearInterval(interval);
        navigate("/expired");
      } else {
        const mins = Math.floor(remaining / 60000);
        const secs = Math.floor((remaining % 60000) / 1000);
        setTimeLeft(`${mins}:${secs < 10 ? "0" : ""}${secs}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, isExpired, navigate]);

  const amountInRupees = Number(amountStr) || 0;
  const amountInPaise = Math.round(amountInRupees * 100);

  const handlePayment = async () => {
    if (isExpired) {
      navigate("/expired");
      return;
    }
    setLoading(true);
    setErrorMsg(null);

    try {
      const { data } = await createOrder({
        deal_id,
        amount: amountInPaise,
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_SRrZ8YKuF5tkyr",
        amount: data.amount,
        currency: data.currency || "INR",
        name: "Heden Healthcare",
        description: `Healthcare Payment #${deal_id}`,
        image: "/illustration.png",
        order_id: data.id,
        handler: async function (response) {
          try {
            const verifyRes = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              deal_id,
            });

            if (verifyRes.data?.success) {
              navigate("/success");
            } else {
              setErrorMsg(verifyRes.data?.message || "Verification failed");
            }
          } catch (verifyErr) {
            setErrorMsg("Verification error – contact support");
          }
        },
        prefill: {
          name: "Customer",
          email: "",
          contact: "",
        },
        theme: { color: "#2563eb" },
        modal: { ondismiss: () => setLoading(false) },
      };

      if (typeof window.Razorpay === "undefined") {
        throw new Error("Razorpay SDK not loaded");
      }

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      const serverMsg = err.response?.data?.message;
      if (serverMsg?.includes("already completed")) {
         navigate("/paid");
      } else if (serverMsg?.includes("expired")) {
         navigate("/expired");
      } else {
         setErrorMsg(serverMsg || "Failed to start payment. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!deal_id || !amountStr) {
    return (
      <div className="payment-container">
        <div className="payment-card">
          <div className="error-container">
            <svg viewBox="0 0 24 24" className="lock-icon" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4m0 4h.01" />
            </svg>
            <span>Invalid Payment Link Details Missing.</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-container">
      <div className="payment-card">
        <img src="/illustration.png" alt="Payment illustration" className="illustration" />
        
        <h2>Secure Checkout</h2>
        <p className="subtitle">Heden Healthcare Professional Services</p>

        <div className="amount-box">
          <div className="amount-label">Total Amount Payable</div>
          <div className="amount-value">₹{amountInRupees.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
        </div>

        {errorMsg && (
          <div className="error-container">
             <svg viewBox="0 0 24 24" className="lock-icon" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
             </svg>
             <span>{errorMsg}</span>
          </div>
        )}

        <button
          onClick={handlePayment}
          disabled={loading || isExpired}
          className="pay-button"
        >
          {loading ? (
            <div className="spinner"></div>
          ) : (
            <>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
              </svg>
              {isExpired ? "Link Expired" : "Pay Securely Now"}
            </>
          )}
        </button>

        {!isExpired && timeLeft && (
          <p style={{ marginTop: '16px', fontSize: '13px', color: '#64748b' }}>
            Link expires in <span style={{ fontWeight: 600, color: '#2563eb' }}>{timeLeft}</span>
          </p>
        )}

        <div className="footer-text">
          <svg viewBox="0 0 24 24" className="lock-icon" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
          </svg>
          256-bit Encrypted Secure Payment
        </div>
        <p style={{ marginTop: '8px', fontSize: '12px', color: '#cbd5e1' }}>
          Powered by Razorpay
        </p>
      </div>
    </div>
  );
};

export default PaymentPage;