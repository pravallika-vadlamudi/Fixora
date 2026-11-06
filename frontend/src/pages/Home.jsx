import React from 'react';
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, CalendarCheck, BadgeCheck, Sparkles, Zap, Droplets, Wind, Brush, Hammer } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../services/api";
import ServiceCard from "../components/ServiceCard";

const categories = [
  { name: "Electrical", icon: Zap, color: "lavender" },
  { name: "Plumbing", icon: Droplets, color: "blue" },
  { name: "Cleaning", icon: Brush, color: "peach" },
  { name: "Appliance Repair", icon: Wind, color: "mint" },
  { name: "Carpentry", icon: Hammer, color: "sand" }
];
export default function Home() {
  const [services, setServices] = useState([]);
  useEffect(() => { api.get("/services").then(r => setServices(r.data.services.slice(0,3))).catch(() => {}); }, []);
  return <main>
    <section className="hero"><div className="container hero-grid">
      <div className="hero-copy"><span className="eyebrow"><Sparkles size={14}/> HOME CARE, MADE SIMPLE</span>
        <h1>Your home.<br/><em>Our expertise.</em></h1>
        <p className="hero-lead">From quick fixes to deep cleaning, book dependable professionals for the spaces you love.</p>
        <div className="hero-actions"><Link className="btn btn-primary btn-large" to="/services">Explore services <ArrowRight size={18}/></Link><Link className="btn btn-ghost btn-large" to="/register">Create an account</Link></div>
        <div className="hero-trust"><span><ShieldCheck size={17}/> Trusted professionals</span><span><CalendarCheck size={17}/> Easy scheduling</span></div>
      </div>
      <div className="hero-visual"><div className="hero-photo"><img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200" alt="Beautiful home interior" onError={e => e.currentTarget.src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200"}/></div>
        <div className="floating-note"><span className="note-icon"><BadgeCheck size={20}/></span><div><strong>Care you can count on</strong><small>Quality service, made easy</small></div></div>
        <div className="hero-orbit"></div>
      </div>
    </div></section>
    <section className="section container"><div className="section-heading"><div><span className="eyebrow">WHAT DO YOU NEED?</span><h2>Services for every corner</h2><p>Choose a category and let the right professional take it from here.</p></div><Link className="text-link" to="/services">All services <ArrowRight size={16}/></Link></div>
      <div className="category-grid">{categories.map(c => <Link key={c.name} to={`/services?category=${encodeURIComponent(c.name)}`} className="category-card"><span className={`category-icon ${c.color}`}><c.icon size={23}/></span><strong>{c.name}</strong><ArrowRight size={16}/></Link>)}</div>
    </section>
    <section className="section section-soft"><div className="container"><div className="section-heading"><div><span className="eyebrow">POPULAR PICKS</span><h2>Helpful hands, right on time</h2><p>Explore some of the services customers book most.</p></div><Link className="text-link" to="/services">Browse catalogue <ArrowRight size={16}/></Link></div>
      {services.length ? <div className="service-grid">{services.map(s => <ServiceCard key={s._id} service={s}/>)}</div> : <div className="empty-state">Our service catalogue is getting ready. Please check back soon.</div>}
    </div></section>
    <section className="section container"><div className="steps-banner"><div><span className="eyebrow eyebrow-light">A BETTER WAY TO GET IT DONE</span><h2>Three steps to a<br/>happier home.</h2><p>Less searching. Less stress. More time for what matters.</p><Link className="btn btn-white" to="/services">Book your service <ArrowRight size={17}/></Link></div><div className="steps-list"><div><span>01</span><section><h3>Find your service</h3><p>Explore clear service options and upfront starting prices.</p></section></div><div><span>02</span><section><h3>Choose a time</h3><p>Share your address and preferred appointment slot.</p></section></div><div><span>03</span><section><h3>Relax, we've got this</h3><p>Track your request as your service professional takes over.</p></section></div></div></div></section>
  </main>;
}
