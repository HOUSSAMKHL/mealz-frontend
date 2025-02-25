import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";

const Dashboard = () => {
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/LoginSignup");
    }
  }, [isAuthenticated, navigate]);

  // Vérification de l'email pour définir le statut
  const adminEmails = ["Houssamkhalil.011@gmail.com", "omarlahmoumi@gmail.com"];
  const status = adminEmails.includes(user?.email) ? "Admin" : "Client";
  console.log("Email connecté :", user?.email);
console.log("Admin list :", adminEmails);

  
  return (
    <div className="dashboard-container">
      <h1>👋 Bienvenue, {user?.name} !</h1>
      <h2>Email : {user?.email}</h2>
      <p>Status : {status}</p>
    </div>
  );
};

export default Dashboard;
