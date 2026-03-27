import "./PaymentPage.css";

const ExpiredPage = () => {
  return (
    <div className="payment-container">
      <div className="payment-card">
        <div style={{ color: "#f59e0b", marginBottom: "24px" }}>
          <svg viewBox="0 0 24 24" width="80" height="80" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <h2 style={{ color: "#f59e0b" }}>Link Expired</h2>
        <p className="subtitle">For your security, this payment link has expired. Payment links are only valid for 10 minutes.</p>
        
        <div className="amount-box" style={{ borderColor: "#fef3c7", backgroundColor: "#fffbeb" }}>
          <p style={{ color: "#92400e", fontSize: "14px" }}>Please go back to Bitrix and generate a fresh link to complete your transaction.</p>
        </div>

        <button 
          onClick={() => window.close()} 
          className="pay-button"
          style={{ background: "#f59e0b" }}
        >
          Close Window
        </button>
      </div>
    </div>
  );
};

export default ExpiredPage;
