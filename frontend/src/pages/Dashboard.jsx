import React from 'react';
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { CalendarDays, ClipboardList, Users, Wrench, CheckCircle2, Clock3, XCircle, ArrowRight, Star } from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const statusClass = s => `status status-${s}`;
function BookingList({ bookings, role, onChange, onReview }) {
  if (!bookings.length) return <div className="empty-state"><ClipboardList size={28}/><h3>No bookings yet</h3><p>When a service is booked, it will appear here.</p></div>;
  return <div className="booking-list">{bookings.map(b => <article className="booking-card" key={b._id}>
    <div className="booking-card-top"><div><span className="eyebrow">{b.service?.category || "HOME SERVICE"}</span><h3>{b.service?.name || "Service"}</h3></div><span className={statusClass(b.status)}>{b.status.replace("-", " ")}</span></div>
    <div className="booking-info"><span><CalendarDays size={15}/>{new Date(b.scheduledDate).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}</span><span><Clock3 size={15}/>{b.timeSlot}</span></div>
    <p className="booking-address">{b.address}</p>
    <div className="booking-card-bottom"><strong>₹{Number(b.priceAtBooking).toLocaleString("en-IN")}</strong>
      <div className="inline-actions">
        {role === "customer" && b.status === "pending" && <button className="btn btn-small btn-outline danger-text" onClick={() => onChange(b._id,"cancel")}>Cancel</button>}
        {role === "provider" && b.status === "pending" && <><button className="btn btn-small btn-outline" onClick={() => onChange(b._id,"rejected")}>Decline</button><button className="btn btn-small btn-primary" onClick={() => onChange(b._id,"accepted")}>Accept</button></>}
        {role === "provider" && b.status === "accepted" && <button className="btn btn-small btn-primary" onClick={() => onChange(b._id,"in-progress")}>Start job</button>}
        {role === "provider" && b.status === "in-progress" && <button className="btn btn-small btn-primary" onClick={() => onChange(b._id,"completed")}>Mark complete</button>}
        {role === "customer" && b.status === "completed" && <button className="btn btn-small btn-outline" onClick={() => onReview(b)}> <Star size={14}/> Review</button>}
      </div>
    </div>
  </article>)}</div>;
}
export default function Dashboard() {
  const { user } = useAuth(); const location = useLocation();
  const [bookings,setBookings] = useState([]); const [stats,setStats] = useState(null); const [users,setUsers] = useState([]);
  const [services,setServices] = useState([]); const [error,setError] = useState(""); const [notice,setNotice] = useState(location.state?.notice || "");
  const [review,setReview] = useState(null); const [rating,setRating] = useState(5); const [comment,setComment] = useState("");
  const [serviceForm,setServiceForm] = useState({name:"",category:"Electrical",description:"",price:"",duration:"1 hour",image:""});
  const [assign,setAssign] = useState({});
  const load = async () => {
    try {
      if (user.role === "admin") {
        const [s,b,u,sv] = await Promise.all([api.get("/admin/stats"),api.get("/bookings"),api.get("/admin/users"),api.get("/services")]);
        setStats(s.data.stats);setBookings(b.data.bookings);setUsers(u.data.users);setServices(sv.data.services);
      } else {
        const r = await api.get("/bookings/my"); setBookings(r.data.bookings);
      }
    } catch(e) { setError(e.response?.data?.message || "Could not load dashboard"); }
  };
  useEffect(() => { load(); }, [user]);
  const updateBooking = async (id, action) => {
    try {
      if (action === "cancel") await api.patch(`/bookings/${id}/cancel`,{});
      else await api.patch(`/bookings/${id}/status`,{status:action});
      setNotice("Booking updated successfully."); load();
    } catch(e) { setError(e.response?.data?.message || "Unable to update booking"); }
  };
  const submitReview = async e => {
    e.preventDefault();
    try { await api.post("/reviews",{bookingId:review._id,rating,comment});setReview(null);setNotice("Thank you for your feedback."); }
    catch(e) { setError(e.response?.data?.message || "Could not submit review"); }
  };
  const createService = async e => {
    e.preventDefault();
    try { await api.post("/services",{...serviceForm,price:Number(serviceForm.price)});setServiceForm({name:"",category:"Electrical",description:"",price:"",duration:"1 hour",image:""});setNotice("Service added.");load(); }
    catch(e) { setError(e.response?.data?.message || "Could not add service"); }
  };
  const deleteService = async id => { if(!confirm("Archive this service?")) return; try {await api.delete(`/services/${id}`);load();} catch(e){setError(e.response?.data?.message || "Unable to archive service");} };
  const assignProvider = async bookingId => { try {await api.patch(`/bookings/${bookingId}/assign`,{providerId:assign[bookingId]});setNotice("Provider assigned.");load();} catch(e){setError(e.response?.data?.message || "Could not assign provider");} };
  return <main className="container page-section dashboard-page">
    <div className="dashboard-heading"><div><span className="eyebrow">YOUR FIXORA SPACE</span><h1>Hello, {user.name.split(" ")[0]}<span className="brand-dot">.</span></h1><p>{user.role === "admin" ? "Here's what's happening across the platform." : user.role === "provider" ? "Manage your service requests and appointments." : "Keep track of your home service requests in one place."}</p></div><span className="role-chip">{user.role}</span></div>
    {notice && <div className="alert alert-success">{notice}<button onClick={()=>setNotice("")}>×</button></div>}
    {error && <div className="alert alert-error">{error}<button onClick={()=>setError("")}>×</button></div>}
    {user.role === "admin" ? <>
      <div className="stats-grid">{Object.entries(stats || {}).map(([k,v])=><div className="stat-card" key={k}><span>{k}</span><strong>{v}</strong></div>)}</div>
      <section className="dashboard-panel"><div className="panel-heading"><div><span className="eyebrow">SERVICE CATALOGUE</span><h2>Manage services</h2></div></div>
        <form className="admin-service-form" onSubmit={createService}><input required placeholder="Service name" value={serviceForm.name} onChange={e=>setServiceForm({...serviceForm,name:e.target.value})}/><select value={serviceForm.category} onChange={e=>setServiceForm({...serviceForm,category:e.target.value})}>{["Electrical","Plumbing","Cleaning","Appliance Repair","Carpentry","Painting"].map(x=><option key={x}>{x}</option>)}</select><input required type="number" min="0" placeholder="Price ₹" value={serviceForm.price} onChange={e=>setServiceForm({...serviceForm,price:e.target.value})}/><input required placeholder="Description" value={serviceForm.description} onChange={e=>setServiceForm({...serviceForm,description:e.target.value})}/><button className="btn btn-primary btn-small">Add service</button></form>
        <div className="admin-service-list">{services.map(s=><div key={s._id}><span><strong>{s.name}</strong><small>{s.category} · ₹{s.price}</small></span><button className="btn btn-small btn-outline danger-text" onClick={()=>deleteService(s._id)}>Archive</button></div>)}</div>
      </section>
      <section className="dashboard-panel"><div className="panel-heading"><div><span className="eyebrow">OPERATIONS</span><h2>All bookings</h2></div></div>
        <div className="admin-booking-list">{bookings.map(b=><div className="admin-booking-row" key={b._id}><div><strong>{b.service?.name}</strong><small>{b.customer?.name} · {new Date(b.scheduledDate).toLocaleDateString("en-IN")} · {b.status}</small></div><div className="assign-control"><select value={assign[b._id] || b.provider?._id || ""} onChange={e=>setAssign({...assign,[b._id]:e.target.value})}><option value="">Select provider</option>{users.filter(u=>u.role==="provider").map(u=><option value={u._id} key={u._id}>{u.name}</option>)}</select><button className="btn btn-small btn-outline" onClick={()=>assignProvider(b._id)}>Assign</button></div></div>)}</div>
      </section>
      <section className="dashboard-panel"><div className="panel-heading"><div><span className="eyebrow">COMMUNITY</span><h2>Registered users</h2></div></div><div className="admin-booking-list">{users.map(u=><div className="admin-booking-row" key={u._id}><div><strong>{u.name}</strong><small>{u.email}</small></div><span className="role-chip">{u.role}</span></div>)}</div></section>
    </> : <><div className="dashboard-summary"><div className="summary-highlight"><span className="summary-icon"><ClipboardList/></span><div><strong>{bookings.length}</strong><span>{user.role === "provider" ? "Assigned requests" : "Total bookings"}</span></div></div><div className="summary-highlight"><span className="summary-icon"><CheckCircle2/></span><div><strong>{bookings.filter(b=>b.status==="completed").length}</strong><span>Completed</span></div></div><div className="summary-highlight"><span className="summary-icon"><Clock3/></span><div><strong>{bookings.filter(b=>["pending","accepted","in-progress"].includes(b.status)).length}</strong><span>Active requests</span></div></div></div>
      <section className="dashboard-panel"><div className="panel-heading"><div><span className="eyebrow">{user.role === "provider" ? "WORK QUEUE" : "YOUR ACTIVITY"}</span><h2>{user.role === "provider" ? "Service requests" : "Your bookings"}</h2></div></div>
        <BookingList bookings={bookings} role={user.role} onChange={updateBooking} onReview={b=>{setReview(b);setRating(5);setComment("");}}/>
      </section>
    </>}
    {review && <div className="modal-backdrop"><form className="review-modal" onSubmit={submitReview}><button type="button" className="modal-close" onClick={()=>setReview(null)}>×</button><span className="eyebrow">SHARE YOUR EXPERIENCE</span><h2>How did we do?</h2><p>{review.service?.name}</p><label>Rating<select value={rating} onChange={e=>setRating(Number(e.target.value))}>{[5,4,3,2,1].map(n=><option value={n} key={n}>{n} star{n>1?"s":""}</option>)}</select></label><label>Your feedback<textarea rows="4" maxLength="500" value={comment} onChange={e=>setComment(e.target.value)} placeholder="Tell us about your experience…"/></label><button className="btn btn-primary btn-large full-btn">Submit review</button></form></div>}
  </main>;
}
