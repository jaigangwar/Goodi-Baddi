import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Search, Users, Zap, CheckCircle2, ChevronRight, Lock, Award } from 'lucide-react';
import './LandingPage.css';

const LandingPage = () => {
  // Animation Variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  return (
    <div className="premium-landing">
      {/* Dynamic Background */}
      <div className="landing-bg">
        <div className="glow-orb orb-1"></div>
        <div className="glow-orb orb-2"></div>
        <div className="grid-overlay"></div>
      </div>

      {/* Hero Section */}
      <section className="hero-section">
        <motion.div 
          className="hero-container"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="hero-badge">
            <ShieldCheck size={16} className="badge-icon" />
            <span>The #1 Verified HR Ecosystem</span>
          </motion.div>
          
          <motion.h1 variants={fadeInUp} className="hero-title">
            Hire with absolute <br />
            <span className="text-gradient">Confidence.</span>
          </motion.h1>
          
          <motion.p variants={fadeInUp} className="hero-subtitle">
            Access verified employee feedback from previous employers before making your next hire. Eliminate fake behavior and build a world-class team.
          </motion.p>
          
          <motion.div variants={fadeInUp} className="hero-actions">
            <Link to="/signup" className="btn-primary-glow">
              Get Started Free <ChevronRight size={18} />
            </Link>
            <Link to="/login" className="btn-outline">
              Sign In to Dashboard
            </Link>
          </motion.div>

          <motion.div variants={fadeInUp} className="hero-stats">
            <div className="stat-item">
              <span className="stat-num">500+</span>
              <span className="stat-label">Verified Companies</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-num">10k+</span>
              <span className="stat-label">Trusted Reviews</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-num">100%</span>
              <span className="stat-label">Data Privacy</span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Bento Grid */}
      <section className="features-section">
        <div className="section-header">
          <h2>Why Top Companies Choose Us</h2>
          <p>Everything you need to verify candidates in one seamless platform.</p>
        </div>
        
        <motion.div 
          className="bento-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div className="bento-card bento-large" variants={fadeInUp}>
            <div className="bento-content">
              <div className="bento-icon-wrapper blue">
                <Search size={28} />
              </div>
              <h3>Deep Candidate Search</h3>
              <p>Find candidate profiles instantly using name, email, mobile, or LinkedIn URL. Our fuzzy search algorithm ensures you never miss a record.</p>
            </div>
          </motion.div>

          <motion.div className="bento-card bento-small" variants={fadeInUp}>
            <div className="bento-icon-wrapper green">
              <ShieldCheck size={28} />
            </div>
            <h3>Verified Reviews</h3>
            <p>Only admin-approved companies can leave feedback, ensuring 100% authentic data.</p>
          </motion.div>

          <motion.div className="bento-card bento-small" variants={fadeInUp}>
            <div className="bento-icon-wrapper purple">
              <Lock size={28} />
            </div>
            <h3>Enterprise Security</h3>
            <p>Bank-grade encryption and Row Level Security keeps your company data private.</p>
          </motion.div>

          <motion.div className="bento-card bento-medium" variants={fadeInUp}>
            <div className="bento-content">
              <div className="bento-icon-wrapper orange">
                <Award size={28} />
              </div>
              <h3>Smart Rating System</h3>
              <p>Automated average rating calculation based on detailed positive and negative feedback points.</p>
            </div>
          </motion.div>

          <motion.div className="bento-card bento-medium" variants={fadeInUp}>
            <div className="bento-content">
              <div className="bento-icon-wrapper yellow">
                <Zap size={28} />
              </div>
              <h3>Seamless Integration</h3>
              <p>Lightning-fast PWA experience that feels like a native app on both desktop and mobile.</p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* How it Works */}
      <section className="workflow-section">
        <div className="section-header">
          <h2>How Goodi Baddi Works</h2>
        </div>
        
        <div className="workflow-container">
          {[
            { step: "01", title: "Register & Verify", desc: "Create a company profile. Our team verifies your business to maintain ecosystem integrity." },
            { step: "02", title: "Contribute Data", desc: "Add honest feedback and work history for employees departing your organization." },
            { step: "03", title: "Hire Smart", desc: "Search candidates applying to your company to read their actual past performance reviews." }
          ].map((item, index) => (
            <motion.div 
              key={index}
              className="workflow-step"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
            >
              <div className="step-number">{item.step}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="final-cta">
        <motion.div 
          className="cta-glass-box"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <h2>Stop Guessing. Start Knowing.</h2>
          <p>Join hundreds of HR professionals making data-driven hiring decisions today.</p>
          <Link to="/signup" className="btn-primary-glow btn-large">
            Create Your Free Account
          </Link>
          <ul className="cta-checks">
            <li><CheckCircle2 size={18} /> No credit card required</li>
            <li><CheckCircle2 size={18} /> Instant access</li>
            <li><CheckCircle2 size={18} /> 24/7 Support</li>
          </ul>
        </motion.div>
      </section>
    </div>
  );
};

export default LandingPage;
