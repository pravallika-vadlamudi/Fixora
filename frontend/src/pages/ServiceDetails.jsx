import React from 'react';
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Clock3, ShieldCheck, CalendarDays, CheckCircle2 } from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function ServiceDetails() {
  const { id } = useParams(); const { user } = useAuth();
  const [service, setService] = useState(null); const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    api.get(`/services/${id}`).then(r => setService(r.data.service)).catch(e => setError(e.response?.data?.message || "Service not found"));
    api.get(`/reviews/service/${id}`).then(r => setReviews(r.data.reviews)).catch(() => {});
  }, [id]);
  if (error) return <main className="container page-section"><div className="alert alert-error">{error}</div></main>;
  if (!service) return <div className="page-loader">Loading service…</div>;
  return <main className="container page-section">
    <Link to="/services" className="back-link"><ArrowLeft size={16}/> Back to services</Link>
    <div className="detail-layout"><div className="detail-image"><img src={service.image} alt={service.name}/></div><div className="detail-copy">
      <span className="category-pill static-pill">{service.category}</span><h1>{service.name}</h1><p>{service.description}</p>
      <div className="detail-price">₹{service.price.toLocaleString("en-IN")} <small>starting price</small></div>
      <div className="detail-facts"><span><Clock3 size={17}/> {service.duration}</span><span><ShieldCheck size={17}/> Professional service</span><span><CalendarDays size={17}/> Flexible scheduling</span></div>
      {user?.role === "customer" ? <Link className="btn btn-primary btn-large full-btn" to={`/book/${service._id}`}>Book this service <CheckCircle2 size={18}/></Link> : !user ? <Link className="btn btn-primary btn-large full-btn" to="/login">Log in to book <CheckCircle2 size={18}/></Link> : <p className="muted">Customer accounts can place bookings.</p>}
    </div></div>
    <section className="review-section"><h2>Customer feedback</h2>{reviews.length ? reviews.map(r => <div className="review-row" key={r._id}><strong>{r.customer?.name || "Customer"}</strong><span className="stars">{"★".repeat(r.rating)}{"☆".repeat(5-r.rating)}</span><p>{r.comment || "Great service."}</p></div>) : <p className="muted">No reviews yet. Be the first to share feedback after your completed booking.</p>}</section>
  </main>;
}
