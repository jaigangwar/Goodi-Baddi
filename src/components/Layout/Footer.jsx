// Footer Component

import { Link } from 'react-router-dom';
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
              <li><Link to="/">About Us</Link></li>
              <li><Link to="/">How It Works</Link></li>
              <li><Link to="/">Contact</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Legal</h4>
            <ul>
              <li><Link to="/">Terms of Service</Link></li>
              <li><Link to="/">Privacy Policy</Link></li>
              <li><Link to="/">Content Guidelines</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Support</h4>
            <ul>
              <li><Link to="/">Help Center</Link></li>
              <li><Link to="/">FAQ</Link></li>
              <li><Link to="/">Contact Support</Link></li>
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
