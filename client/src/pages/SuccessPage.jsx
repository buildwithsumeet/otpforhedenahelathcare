import "./PaymentPage.css";

const SuccessPage = () => {
  return (
    <div className="payment-container">
      <div className="payment-card">
        <div style={{ color: "#059669", marginBottom: "24px" }}>
          <svg viewBox="0 0 24 24" width="80" height="80" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
        <h2 style={{ color: "#059669" }}>Payment Successful</h2>
        <p className="subtitle">Thank you for choosing Heden Healthcare. Your transaction has been completed successfully.</p>
        
        <div className="amount-box">
          <p style={{ color: "#64748b", fontSize: "14px" }}>You can now close this window or return to Bitrix.</p>
        </div>

        <button 
          onClick={() => window.close()} 
          className="pay-button"
          style={{ background: "#059669" }}
        >
          Close Window
        </button>
      </div>
    </div>
  );
};

export default SuccessPage;