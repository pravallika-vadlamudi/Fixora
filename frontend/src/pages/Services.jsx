import React from 'react';
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal } from "lucide-react";
import api from "../services/api";
import ServiceCard from "../components/ServiceCard";

export default function Services() {
  const [params, setParams] = useSearchParams();
  const [services, setServices] = useState([]);
  const [query, setQuery] = useState(params.get("q") || "");
  const [category, setCategory] = useState(params.get("category") || "All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    setLoading(true); setError("");
    api.get("/services", { params: { q: query, category } })
      .then(r => setServices(r.data.services)).catch(e => setError(e.response?.data?.message || "Unable to load services. Check that the backend is running."))
      .finally(() => setLoading(false));
  }, [query, category]);
  const categories = ["All","Electrical","Plumbing","Cleaning","Appliance Repair","Carpentry","Painting"];
  return <main className="container page-section">
    <div className="page-intro"><span className="eyebrow">THE FIXORA COLLECTION</span><h1>Find the right help<br/><em>for your home.</em></h1><p>Thoughtful service options, transparent starting prices, and professionals ready to help.</p></div>
    <div className="catalogue-toolbar"><div className="search-box"><Search size={18}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search cleaning, plumbing, repairs…"/></div><div className="filter-label"><SlidersHorizontal size={16}/> Filter by</div></div>
    <div className="filter-chips">{categories.map(c => <button key={c} onClick={() => {setCategory(c); setParams(c === "All" ? {} : {category:c});}} className={category === c ? "filter-chip active" : "filter-chip"}>{c}</button>)}</div>
    {loading ? <div className="page-loader">Finding services…</div> : error ? <div className="alert alert-error">{error}</div> : services.length ? <div className="service-grid">{services.map(s => <ServiceCard key={s._id} service={s}/>)}</div> : <div className="empty-state"><h3>No services found</h3><p>Try a different search or category.</p><button className="btn btn-outline" onClick={() => {setQuery("");setCategory("All");}}>Clear filters</button></div>}
  </main>;
}
