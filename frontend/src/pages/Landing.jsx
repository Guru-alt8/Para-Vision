import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Map, FileText, BarChart3, ShieldCheck, HeartPulse, Building2, UserPlus, ArrowRight, CheckCircle2, Accessibility } from 'lucide-react';
import heroImg from '../assets/hero.png';

const Landing = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <div className="bg-background overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-52 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImg} 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-30 scale-105 blur-[2px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="text-center lg:text-left lg:w-3/5"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold uppercase tracking-widest mb-8">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse mr-2" />
              Empowering India's Differently Abled
            </motion.div>
            
            <motion.h1 variants={itemVariants} className="text-5xl lg:text-7xl font-black text-white leading-[1.1] mb-8">
              Navigate the <br />
              World <span className="text-accent underline decoration-accent/30 underline-offset-8">Without Limits.</span>
            </motion.h1>
            
            <motion.p variants={itemVariants} className="text-xl text-slate-300 mb-12 max-w-xl leading-relaxed">
              Join the mission to map accessibility across India. Find, report, and transform public spaces into inclusive environments for everyone.
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/map" className="btn-primary flex items-center justify-center group py-4 px-10 text-lg">
                Explore the Map
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/report" className="btn-secondary flex items-center justify-center py-4 px-10 text-lg bg-white/5 border-white/10 text-white hover:bg-white/10">
                Report Accessibility
              </Link>
            </motion.div>
          </motion.div>
        </div>

      </section>

      {/* Impact Section */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="w-full">
              <h2 className="text-base text-accent font-bold uppercase tracking-widest mb-4">Our Commitment</h2>
              <h3 className="text-4xl font-black text-slate-900 mb-8 leading-tight">Driving Global Inclusion through Local Action.</h3>
              <p className="text-lg text-muted mb-12">We align our efforts with the United Nations Sustainable Development Goals to ensure no one is left behind in the urban transformation.</p>
              
              <div className="space-y-6">
                {[
                  { icon: <HeartPulse />, title: 'SDG 3: Health & Well-being', desc: 'Ensuring safe access to medical facilities and public healthy spaces.' },
                  { icon: <UserPlus />, title: 'SDG 10: Reduced Inequalities', desc: 'Breaking down physical barriers that exclude disabled citizens.' },
                  { icon: <Building2 />, title: 'SDG 11: Sustainable Cities', desc: 'Building smart, accessible, and inclusive urban infrastructure.' }
                ].map((sdg, i) => (
                  <motion.div 
                    whileHover={{ x: 10 }}
                    key={i} 
                    className="flex items-start gap-5 p-5 rounded-2xl hover:bg-slate-50 transition-colors"
                  >
                    <div className="p-3 bg-slate-900 text-white rounded-xl">
                      {React.cloneElement(sdg.icon, { className: 'w-6 h-6' })}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{sdg.title}</h4>
                      <p className="text-muted text-sm mt-1">{sdg.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-20">
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">The Ecosystem of Inclusion</h2>
          <p className="mt-4 text-xl text-muted max-w-2xl mx-auto">A data-driven approach to solving accessibility challenges across Indian cities.</p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: <Map />, title: 'Dynamic Mapping', desc: 'Real-time accessibility analysis of key POIs using AI-assisted datasets.' },
            { icon: <FileText />, title: 'Crowd Audit', desc: 'Community-verified reporting platform with geo-tagged media support.' },
            { icon: <ShieldCheck />, title: 'Gov Connect', desc: 'Direct administrative bridge for rapid resolution of accessibility violations.' },
            { icon: <BarChart3 />, title: 'City Analytics', desc: 'Advanced inclusion scores for urban planners to track civic progress.' }
          ].map((feature, i) => (
            <motion.div 
              whileHover={{ y: -10 }}
              key={i} 
              className="card p-8 group"
            >
              <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-slate-900 transition-colors">
                {React.cloneElement(feature.icon, { className: 'w-7 h-7' })}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-accent overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl lg:text-6xl font-black text-slate-900 mb-10">Ready to make a difference?</h2>
          <div className="flex flex-wrap justify-center gap-6">
            <Link to="/signup" className="btn-primary bg-slate-900 text-white border-transparent hover:bg-slate-800 py-5 px-12 text-xl">
              Join the Movement
            </Link>
            <Link to="/map" className="btn-secondary border-slate-900/10 bg-white/20 hover:bg-white/40 text-slate-900 py-5 px-12 text-xl backdrop-blur-sm">
              View Online Map
            </Link>
          </div>
        </div>
        {/* Graphic decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 scale-150" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-slate-900/5 rounded-full translate-y-1/2 -translate-x-1/2" />
      </section>

      {/* Footer Minimal */}
      <footer className="py-12 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <Link to="/" className="flex items-center text-slate-900 font-black text-2xl">
            <Accessibility className="h-8 w-8 mr-3 text-accent" />
            Para Vision
          </Link>
          <p className="text-muted text-sm font-medium">© 2026 Para Vision Platform. Building an Inclusive India.</p>
          <div className="flex gap-6 text-sm font-bold text-slate-500 uppercase tracking-widest">
            <a href="#" className="hover:text-accent transition-colors">Privacy</a>
            <a href="#" className="hover:text-accent transition-colors">Terms</a>
            <a href="#" className="hover:text-accent transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
