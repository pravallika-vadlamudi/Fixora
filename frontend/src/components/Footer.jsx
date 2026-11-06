import React from 'react';
import { Link } from "react-router-dom";
import { Wrench, Mail, MapPin, Phone } from "lucide-react";
export default function Footer() {
  return <footer className="footer"><div className="container footer-grid">
    <div><Link className="brand footer-brand" to="/"><span className="brand-mark"><Wrench size={18}/></span>fixora<span className="brand-dot">.</span></Link><p>Reliable home services, thoughtfully delivered. Your home deserves the right hands.</p></div>
    <div><h4>Explore</h4><Link to="/services">All services</Link><Link to="/register">Create account</Link><Link to="/login">Sign in</Link></div>
    <div><h4>Contact</h4><span><Mail size={15}/> hello@fixora.example</span><span><Phone size={15}/> +91 90000 00000</span><span><MapPin size={15}/> Serving your neighbourhood</span></div>
  </div><div className="container footer-bottom">© {new Date().getFullYear()} Fixora. Academic project prototype.</div></footer>;
}
