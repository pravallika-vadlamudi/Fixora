import React from 'react';
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Wrench, Menu, X, UserCircle, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const signOut = () => { logout(); setOpen(false); navigate("/"); };
  return <header className="navbar">
    <div className="container nav-inner">
      <Link className="brand" to="/"><span className="brand-mark"><Wrench size={19}/></span>fixora<span className="brand-dot">.</span></Link>
      <button className="mobile-menu" onClick={() => setOpen(!open)} aria-label="Toggle menu">{open ? <X/> : <Menu/>}</button>
      <nav className={open ? "nav-links show" : "nav-links"}>
        <NavLink to="/" onClick={() => setOpen(false)}>Home</NavLink>
        <NavLink to="/services" onClick={() => setOpen(false)}>Services</NavLink>
        {user && <NavLink to="/dashboard" onClick={() => setOpen(false)}>Dashboard</NavLink>}
        {user ? <><span className="nav-user"><UserCircle size={17}/> {user.name.split(" ")[0]}</span><button className="btn btn-small btn-outline" onClick={signOut}><LogOut size={15}/> Logout</button></> :
          <><Link to="/login" onClick={() => setOpen(false)}>Log in</Link><Link className="btn btn-small btn-primary" to="/register" onClick={() => setOpen(false)}>Get started</Link></>}
      </nav>
    </div>
  </header>;
}
