import React, { useState } from 'react';
import axios from 'axios';
import './Commander.css';
import logo from '../../assets/logo2.png';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setClientName, setClientPhone, setClientAddress } from '../../Redux/Store';

const Commander = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const selectedPlan = useSelector((state) => state.order.selectedPlan);
    const orderId = useSelector((state) => state.order.orderId); // Accessing orderId from Redux

    const [formData, setFormData] = useState({
        nomcomplet: '',
        telephone: '',
        Adresse: '',
        order_id: orderId
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        if (name === 'nomcomplet') dispatch(setClientName(value));
        if (name === 'telephone') dispatch(setClientPhone(value));
        if (name === 'Adresse') dispatch(setClientAddress(value));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.nomcomplet || !formData.telephone || !formData.Adresse || !selectedPlan) {
            alert('يرجى ملء جميع الحقول وإضافة وجبات قبل تأكيد الطلب.');
            console.log("Erreur : Champs incomplets.");
            return;
        }

        try {
            // ✅ Créer d'abord le client
            const clientData = {
                full_name: formData.nomcomplet,
                phone: formData.telephone,
                adresse: formData.Adresse,
                plan_id: selectedPlan.id,
                order_id: orderId

            };

           // console.log("✅ Données du client : ", clientData);
           const clientResponse = await axios.post("https://mealz-backend.onrender.com/api/clients", clientData, { withCredentials: true });
           const clientId = clientResponse.data.id; // 🔥 Récupérer l'ID du client

          //console.log("✅ Client créé avec ID:", clientId);
          
        } catch (error) {
            console.error("❌ Erreur lors de l'envoi:", error);
            if (error.response) {
                console.log("Erreur réponse du serveur : ", error.response);
                alert("⚠️ Erreur du serveur, veuillez réessayer.");
            } else if (error.request) {
                console.log("Erreur requête envoyée : ", error.request);
                alert("⚠️ Problème avec la requête, veuillez réessayer.");
            } else {
                console.log("Erreur inconnue : ", error.message);
                alert("⚠️ Une erreur est survenue, essayez encore.");
            }
        }
    };
    const success = () => {
        alert("Commande créée avec succès");
        setTimeout(() => {
            navigate('/'); 
        }, 400);
    };
    
    

    return (
        <div className="form-container">
            <div className="form-left">
                <h2>أطلب</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="nomcomplet">: الاسم الكامل</label>
                    <input type="text" id="nomcomplet" name="nomcomplet" value={formData.nomcomplet} onChange={handleChange} required />
                    <label htmlFor="telephone" id='phone'>: الهاتف</label>
                    <input type="number" id="telephone" name="telephone" value={formData.telephone} onChange={handleChange} required />
                    <label htmlFor="Adresse">: العنوان</label>
                    <input type="text" id="Adresse" name="Adresse" value={formData.Adresse} onChange={handleChange} required />
                    <label htmlFor="selectedPlan">: الباقة </label>
                    <input type="text" id="selectedPlan" name="selectedPlan" value={selectedPlan ? selectedPlan.titre : ''} readOnly />
                    <label htmlFor="OrderId">: رقم الطلب </label>
                    <input type="text" id="OrderId" name="OrderId" value={orderId ? orderId : ''} readOnly /> {/* Displaying orderId */}
                    <button type="submit" onClick={()=>success()} >تأكيد</button>
                </form>
            </div>
            <div className="form-right">
                <div className="logo-container">
                    <a href="/"><img className="logo" src={logo} alt="الشعار" /></a>
                </div>
                <h2>هل أنت مستعد للطلب؟</h2>
                <p>املأ الإستمارة وقدم طلبك بسرعة.</p>
            </div>
        </div>
    );
};

export default Commander;
