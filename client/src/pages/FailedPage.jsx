import "./PaymentPage.css";

const FailedPage = () => {
  return (
    <div className="payment-container">
      <div className="payment-card">
        <div style={{ color: "#dc2626", marginBottom: "24px" }}>
          <svg viewBox="0 0 24 24" width="80" height="80" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
        </div>
        <h2 style={{ color: "#dc2626" }}>Payment Failed</h2>
        <p className="subtitle">Unfortunately, your transaction could not be processed. Please check your card details or try again later.</p>
        
        <div className="amount-box expired-box">
          <p style={{ color: "#64748b", fontSize: "14px" }}>No funds were deducted. Please use the original link in Bitrix to restart the payment process.</p>
        </div>

        <button 
          onClick={() => window.close()} 
          className="pay-button"
          style={{ background: "#4b5563" }}
        >
          Close Window
        </button>
      </div>
    </div>
  );
};

export default FailedPage;