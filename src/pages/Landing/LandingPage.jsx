// Landing Page

import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Make Informed Hiring Decisions
          </h1>
          <p className="hero-subtitle">
            Access verified employee feedback from previous employers before making your next hire
          </p>
          <div className="hero-buttons">
            <Link to="/signup" className="btn-hero-primary">Get Started</Link>
            <Link to="/login" className="btn-hero-secondary">Sign In</Link>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="problem-section">
        <div className="section-container">
          <h2>The Hiring Challenge</h2>
          <div className="problem-grid">
            <div className="problem-card">
              <div className="problem-icon">❌</div>
              <h3>Fake Behavior</h3>
              <p>Candidates often show different behavior during interviews than in actual work</p>
            </div>
            <div className="problem-card">
              <div className="problem-icon">❓</div>
              <h3>No Verification</h3>
              <p>Companies cannot verify actual work quality and professional conduct</p>
            </div>
            <div className="problem-card">
              <div className="problem-icon">💸</div>
              <h3>Bad Hires Cost Money</h3>
              <p>Wrong hiring decisions lead to wasted time, resources, and team disruption</p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="solution-section">
        <div className="section-container">
          <h2>How Goodi Baddi Helps</h2>
          <div className="solution-grid">
            <div className="solution-card">
              <div className="solution-number">1</div>
              <h3>Search Candidates</h3>
              <p>Search by name, email, mobile, or LinkedIn to find candidate profiles</p>
            </div>
            <div className="solution-card">
              <div className="solution-number">2</div>
              <h3>View Feedback</h3>
              <p>See verified feedback from previous employers about work behavior and performance</p>
            </div>
            <div className="solution-card">
              <div className="solution-number">3</div>
              <h3>Make Better Decisions</h3>
              <p>Hire with confidence based on real work history and professional conduct</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-container">
          <h2>Key Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>🔒 Company-Only Access</h3>
              <p>Only verified companies and HR teams can access the platform</p>
            </div>
            <div className="feature-card">
              <h3>✅ Verified Feedback</h3>
              <p>All companies are verified by admin before they can submit feedback</p>
            </div>
            <div className="feature-card">
              <h3>📊 Structured Reviews</h3>
              <p>Standardized feedback categories for consistent evaluation</p>
            </div>
            <div className="feature-card">
              <h3>🔍 Fast Search</h3>
              <p>Find candidate profiles in seconds with multiple search options</p>
            </div>
            <div className="feature-card">
              <h3>📱 Mobile-Friendly</h3>
              <p>Progressive Web App works seamlessly on all devices</p>
            </div>
            <div className="feature-card">
              <h3>🛡️ Secure & Private</h3>
              <p>Enterprise-grade security with role-based access control</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="section-container">
          <h2>How It Works</h2>
          <div className="steps-container">
            <div className="step">
              <div className="step-header">
                <div className="step-number">1</div>
                <h3>Register Your Company</h3>
              </div>
              <p>Sign up with your company details and get verified by our admin team</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step">
              <div className="step-header">
                <div className="step-number">2</div>
                <h3>Add Employee Records</h3>
              </div>
              <p>After employees leave, add their records and professional feedback</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step">
              <div className="step-header">
                <div className="step-number">3</div>
                <h3>Search Before Hiring</h3>
              </div>
              <p>When hiring, search candidates to view their work history and feedback</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Make Better Hiring Decisions?</h2>
          <p>Join the trusted HR ecosystem today</p>
          <Link to="/signup" className="btn-cta">Get Started Free</Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
