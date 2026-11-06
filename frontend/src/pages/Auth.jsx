import React from 'react';
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Wrench, ArrowRight, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Auth({ mode }) {
  const isRegister = mode === "register"; const { login, register } = useAuth();
  const navigate = useNavigate(); const location = useLocation();
  const [form, setForm] = useState({ name:"", email:"", phone:"", password:"" });
  const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  const update = e => setForm({...form,[e.target.name]:e.target.value});
  const submit = async e => {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      if (isRegister) await register(form); else await login({email:form.email,password:form.password});
      navigate(location.state?.from || "/dashboard", { replace:true });
    } catch(err) { setError(err.response?.data?.message || "Something went wrong. Please try again."); }
    finally { setLoading(false); }
  };
  return <main className="auth-page"><div className="auth-card"><div className="auth-brand"><span className="brand-mark"><Wrench size={20}/></span><span>fixora<span className="brand-dot">.</span></span></div>
    <span className="eyebrow">{isRegister ? "START WITH FIXORA" : "WELCOME BACK"}</span><h1>{isRegister ? "Make home care easier." : "Good to see you again."}</h1><p className="auth-sub">{isRegister ? "Create your account and book trusted help for your home." : "Sign in to manage your home service bookings."}</p>
    {error && <div className="alert alert-error">{error}</div>}
    <form onSubmit={submit} className="auth-form">
      {isRegister && <><label>Full name<input name="name" required minLength="2" placeholder="Your name" value={form.name} onChange={update}/></label><label>Phone number<input name="phone" placeholder="Optional contact number" value={form.phone} onChange={update}/></label></>}
      <label>Email address<input name="email" type="email" required placeholder="you@example.com" value={form.email} onChange={update}/></label>
      <label>Password<input name="password" type="password" required minLength="8" placeholder="At least 8 characters" value={form.password} onChange={update}/></label>
      <button className="btn btn-primary btn-large full-btn" disabled={loading}>{loading ? "Please wait…" : isRegister ? "Create account" : "Sign in"} <ArrowRight size={18}/></button>
    </form>
    <div className="auth-switch">{isRegister ? "Already have an account?" : "New to Fixora?"} <Link to={isRegister ? "/login" : "/register"}>{isRegister ? "Log in" : "Create an account"}</Link></div>
    <div className="secure-note"><ShieldCheck size={16}/> Your account is protected with encrypted passwords.</div>
  </div><div className="auth-aside"><div><span className="eyebrow eyebrow-light">A LITTLE HELP GOES A LONG WAY</span><h2>More time for the things you love.</h2><p>Let Fixora connect you with help for the everyday jobs that make a house feel like home.</p></div><img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200" alt="Calm, welcoming home"/></div></main>;
}
