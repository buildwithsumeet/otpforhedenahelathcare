import "./PaymentPage.css";

const AlreadyPaidPage = () => {
  return (
    <div className="payment-container">
      <div className="payment-card">
        <div style={{ color: "#3b82f6", marginBottom: "24px" }}>
          <svg viewBox="0 0 24 24" width="80" height="80" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2 style={{ color: "#3b82f6" }}>Payment Already Recorded</h2>
        <p className="subtitle">Our records show that this transaction has already been successfully completed. There is no further action required.</p>
        
        <div className="amount-box" style={{ borderColor: "#dbeafe", backgroundColor: "#eff6ff" }}>
          <p style={{ color: "#1e40af", fontSize: "14px" }}>A confirmation was sent to your registered contact at the time of the original payment.</p>
        </div>

        <button 
          onClick={() => window.close()} 
          className="pay-button"
          style={{ background: "#3b82f6" }}
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
};

export default AlreadyPaidPage;
