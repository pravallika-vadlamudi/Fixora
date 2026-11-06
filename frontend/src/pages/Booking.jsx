import React from 'react';
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CalendarDays, MapPin, Clock3, ArrowLeft, CheckCircle2 } from "lucide-react";
import api from "../services/api";

export default function Booking() {
  const { serviceId } = useParams(); const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [form, setForm] = useState({ scheduledDate:"", timeSlot:"09:00 AM – 11:00 AM", address:"", notes:"" });
  const [loading, setLoading] = useState(false); const [error, setError] = useState("");
  useEffect(() => { api.get(`/services/${serviceId}`).then(r => setService(r.data.service)).catch(() => setError("Service not found")); }, [serviceId]);
  const update = e => setForm({...form,[e.target.name]:e.target.value});
  const submit = async e => {
    e.preventDefault(); setLoading(true); setError("");
    try { await api.post("/bookings", { ...form, serviceId }); navigate("/dashboard", { state:{notice:"Your booking request has been submitted."} }); }
    catch(err) { setError(err.response?.data?.message || "Could not create booking"); }
    finally { setLoading(false); }
  };
  if (!service) return <div className="page-loader">Preparing your booking…</div>;
  const minDate = new Date().toLocaleDateString("en-CA");
  return <main className="container page-section narrow-page">
    <Link to={`/services/${serviceId}`} className="back-link"><ArrowLeft size={16}/> Back to service</Link>
    <div className="page-intro compact-intro"><span className="eyebrow">LET'S GET IT BOOKED</span><h1>Schedule your<br/><em>{service.name.toLowerCase()}.</em></h1><p>Choose a date and time, then tell us where the work needs to happen.</p></div>
    <div className="booking-layout"><form className="form-card" onSubmit={submit}>
      <h2>Appointment details</h2>
      {error && <div className="alert alert-error">{error}</div>}
      <label>Preferred date <span className="required">*</span><div className="input-icon"><CalendarDays size={17}/><input type="date" name="scheduledDate" min={minDate} required value={form.scheduledDate} onChange={update}/></div></label>
      <label>Time slot <span className="required">*</span><div className="input-icon"><Clock3 size={17}/><select name="timeSlot" value={form.timeSlot} onChange={update}><option>09:00 AM – 11:00 AM</option><option>11:00 AM – 01:00 PM</option><option>01:00 PM – 03:00 PM</option><option>03:00 PM – 05:00 PM</option><option>05:00 PM – 07:00 PM</option></select></div></label>
      <label>Service address <span className="required">*</span><div className="input-icon textarea-icon"><MapPin size={17}/><textarea name="address" rows="3" required minLength="8" placeholder="House / flat number, street, area, city, PIN code" value={form.address} onChange={update}/></div></label>
      <label>Additional notes <small className="muted">(optional)</small><textarea name="notes" rows="3" placeholder="Tell the professional anything useful before arrival…" value={form.notes} onChange={update}/></label>
      <button className="btn btn-primary btn-large full-btn" disabled={loading}>{loading ? "Submitting…" : "Confirm booking request"} <CheckCircle2 size={18}/></button>
      <p className="form-footnote">Your request will be saved and shown in your dashboard. The provider will confirm availability.</p>
    </form>
    <aside className="booking-summary"><span className="eyebrow">BOOKING SUMMARY</span><h3>{service.name}</h3><p>{service.category} · {service.duration}</p><div className="summary-line"><span>Service starting price</span><strong>₹{service.price.toLocaleString("en-IN")}</strong></div><div className="summary-line total"><span>Estimated total</span><strong>₹{service.price.toLocaleString("en-IN")}</strong></div><p className="summary-note">Final charges may vary if additional work is requested. Any changes should be confirmed before work begins.</p></aside></div>
  </main>;
}
