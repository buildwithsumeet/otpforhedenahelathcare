import { useState } from 'react'
import './App.css'

function App() {
  return (
    <div className="payment-container">
      <div className="payment-card" style={{ maxWidth: '600px' }}>
        <img src="/illustration.png" alt="Heden Healthcare" className="illustration" style={{ width: '120px' }} />
        <h1>Welcome to Heden Healthcare</h1>
        <p className="subtitle" style={{ fontSize: '18px' }}>Your trusted partner in professional healthcare services and secure digital connectivity.</p>
        
        <div id="center" style={{ padding: '0', gap: '15px' }}>
          <div className="amount-box" style={{ textAlign: 'left' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#1a1a1a' }}>Secure Payment Portal</h3>
            <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.6' }}>
              This platform enables secure, encrypted payment processing for Heden Healthcare services. 
              Payments are triggered directly from our Bitrix24 CRM to ensure accuracy and security.
            </p>
          </div>
          
          <div className="amount-box" style={{ textAlign: 'left', borderLeft: '4px solid #3b82f6' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#1a1a1a' }}>How it works</h3>
            <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.6' }}>
              1. Receive a secure payment link via SMS or Email.<br/>
              2. Verify the deal details and service amount.<br/>
              3. Complete payment securely via Razorpay.<br/>
              4. Receive instant confirmation and start your service.
            </p>
          </div>
        </div>

        <div className="footer-text" style={{ marginTop: '40px' }}>
          <svg viewBox="0 0 24 24" className="lock-icon" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '16px' }}>
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
          </svg>
          Environment: Production | Secure SSL Encrypted
        </div>
      </div>
    </div>
  )
}

export default App
