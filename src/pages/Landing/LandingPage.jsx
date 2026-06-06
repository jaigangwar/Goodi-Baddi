import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ShieldCheck, Search, Users, Zap, CheckCircle2, ChevronRight, Lock, Award } from 'lucide-react';
import './LandingPage.css';

// 3D Tilt Card Component for Landing Page
const LandingTiltCard = ({ children, className }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 400, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 400, damping: 30 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateY, rotateX, transformStyle: "preserve-3d" }}
      whileHover={{ scale: 1.02 }}
    >
      <div style={{ transform: "translateZ(40px)", height: "100%" }}>
        {children}
      </div>
    </motion.div>
  );
};

const LandingPage = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  // Track global mouse position for the background 3D effect
  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 2 - 1, // Range -1 to 1
        y: (e.clientY / window.innerHeight) * 2 - 1
      });
    };
    
    window.addEventListener('mousemove', handleGlobalMouseMove);
    return () => window.removeEventListener('mousemove', handleGlobalMouseMove);
  }, []);

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
      {/* Dynamic 3D Tracking Background */}
      <div className="landing-bg" style={{
         transform: `perspective(1000px) rotateX(${mousePos.y * -5}deg) rotateY(${mousePos.x * 5}deg)`
      }}>
        <motion.div 
          className="glow-orb orb-1"
          animate={{
            x: mousePos.x * -50,
            y: mousePos.y * -50,
          }}
          transition={{ type: 'spring', damping: 50, stiffness: 200 }}
        />
        <motion.div 
          className="glow-orb orb-2"
          animate={{
            x: mousePos.x * 70,
            y: mousePos.y * 70,
          }}
          transition={{ type: 'spring', damping: 40, stiffness: 150 }}
        />
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
          className="landing-bento-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <LandingTiltCard className="landing-bento-card bento-large">
            <motion.div variants={fadeInUp} style={{height: "100%"}}>
              <div className="landing-bento-content">
                <div className="landing-bento-icon blue">
                  <Search size={28} />
                </div>
                <h3>Deep Candidate Search</h3>
                <p>Find candidate profiles instantly using name, email, mobile, or LinkedIn URL. Our fuzzy search algorithm ensures you never miss a record.</p>
              </div>
            </motion.div>
          </LandingTiltCard>

          <LandingTiltCard className="landing-bento-card bento-small">
            <motion.div variants={fadeInUp} style={{height: "100%"}}>
               <div className="landing-bento-icon green">
                <ShieldCheck size={28} />
              </div>
              <h3>Verified Reviews</h3>
              <p>Only admin-approved companies can leave feedback, ensuring 100% authentic data.</p>
            </motion.div>
          </LandingTiltCard>

          <LandingTiltCard className="landing-bento-card bento-small">
             <motion.div variants={fadeInUp} style={{height: "100%"}}>
              <div className="landing-bento-icon purple">
                <Lock size={28} />
              </div>
              <h3>Enterprise Security</h3>
              <p>Bank-grade encryption and Row Level Security keeps your company data private.</p>
            </motion.div>
          </LandingTiltCard>

          <LandingTiltCard className="landing-bento-card bento-medium">
             <motion.div variants={fadeInUp} style={{height: "100%"}}>
              <div className="landing-bento-content">
                <div className="landing-bento-icon orange">
                  <Award size={28} />
                </div>
                <h3>Smart Rating System</h3>
                <p>Automated average rating calculation based on detailed positive and negative feedback points.</p>
              </div>
            </motion.div>
          </LandingTiltCard>

          <LandingTiltCard className="landing-bento-card bento-medium">
             <motion.div variants={fadeInUp} style={{height: "100%"}}>
              <div className="landing-bento-content">
                <div className="landing-bento-icon yellow">
                  <Zap size={28} />
                </div>
                <h3>Seamless Integration</h3>
                <p>Lightning-fast PWA experience that feels like a native app on both desktop and mobile.</p>
              </div>
            </motion.div>
          </LandingTiltCard>
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
