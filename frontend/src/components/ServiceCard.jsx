import React from 'react';
import { Link } from "react-router-dom";
import { ArrowUpRight, Clock3 } from "lucide-react";
const fallback = "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=900";
export default function ServiceCard({ service }) {
  return <article className="service-card">
    <Link to={`/services/${service._id}`} className="service-image-wrap">
      <img src={service.image || fallback} alt={service.name} onError={e => { e.currentTarget.src = fallback; }}/>
      <span className="category-pill">{service.category}</span>
    </Link>
    <div className="service-card-body">
      <div><h3>{service.name}</h3><p>{service.description}</p></div>
      <div className="service-card-meta"><strong>₹{service.price.toLocaleString("en-IN")}</strong><span><Clock3 size={14}/> {service.duration}</span></div>
      <Link className="card-link" to={`/services/${service._id}`}>View details <ArrowUpRight size={16}/></Link>
    </div>
  </article>;
}
