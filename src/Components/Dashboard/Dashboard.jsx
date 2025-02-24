import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./dashboard.css";

const Dashboard = () => {
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/LoginSignup");
    } else {
      fetchOrders();
    }
  }, [isAuthenticated, navigate]);

  const fetchOrders = async () => {
    if (!user?.client_id) return; // ✅ Vérifier si le client_id existe

    try {
      const response = await axios.get(`http://localhost:8000/api/user-orders`, { withCredentials: true });
      setOrders(response.data.orders);
    } catch (error) {
      console.error("Erreur lors du chargement des commandes :", error);
    }
  };

  // Vérification de l'email pour définir le statut
  const status = user?.email === "Houssamkhalil.011@gmail.com" ? "Admin" : "Client";

  return (
    <div className="dashboard-container">
      <h1>👋 Bienvenue, {user?.name} !</h1>
      <h2>Email : {user?.email}</h2>
      <p>Status : {status}</p>

      {/* <h2>📦 Mes Commandes</h2>
      {orders.length === 0 ? (
        <p>Vous n'avez pas encore passé de commande.</p>
      ) : (
        <ul className="orders-list">
          {orders.map(order => (
            <li key={order.id} className="order-item">
              <p><strong>Commande #{order.id}</strong></p>
              <p>📅 Date : {new Date(order.created_at).toLocaleDateString()}</p>
              <p>🍽️ Repas :</p>
              <ul>
                {order.meals.map(meal => (
                  <li key={meal.id}>- {meal.nom}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )} */}
    </div>
  );
};

export default Dashboard;
