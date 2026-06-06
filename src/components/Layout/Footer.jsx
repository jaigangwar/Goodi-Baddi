// Footer Component

import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Goodi Baddi</h3>
            <p>Trusted HR hiring ecosystem for companies</p>
          </div>
          
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/about">About Us</a></li>
              <li><a href="/how-it-works">How It Works</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Legal</h4>
            <ul>
              <li><a href="/terms">Terms of Service</a></li>
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/guidelines">Content Guidelines</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Support</h4>
            <ul>
              <li><a href="/help">Help Center</a></li>
              <li><a href="/faq">FAQ</a></li>
              <li><a href="/support">Contact Support</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2026 Goodi Baddi. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
