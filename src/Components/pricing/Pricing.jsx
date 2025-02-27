import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPlans, setStartDate, setSelectedPlan, updatePlan } from "../../Redux/Store";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ar } from 'date-fns/locale';
import './pricing.css';

Modal.setAppElement("#root");

const Pricing = () => {
  const [startDate, setStartDateLocal] = useState(null);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [editData, setEditData] = useState({
    id: "",
    titre: "",
    price: "",
    daysAvailable: "",
    start_date: "",
    end_date: ""
  });
  const adminEmails = ["Houssamkhalil.011@gmail.com", "omarlahmoumi@gmail.com"];


  const dispatch = useDispatch();
  const navigate = useNavigate();

  const plans = useSelector((state) => state.plans.plans);
  const loading = useSelector((state) => state.plans.loading);
  const error = useSelector((state) => state.plans.error);
  const selectedPlan = useSelector((state) => state.order.selectedPlan);

  // Supposons que l'e-mail de l'utilisateur est stocké dans state.auth.user.email
      const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (!plans.length) {
      dispatch(fetchPlans());
    }
  }, [dispatch, plans.length]);

  const handleSelectDate = (date) => {
    if (date) {
      const formattedDate = formatDate(date);
      setStartDateLocal(date);
      dispatch(setStartDate(formattedDate));
    }
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleOrderClick = () => {
    if (startDate) {
      navigate("/Menu");
    } else {
      alert("Veuillez choisir une date avant de continuer.");
    }
  };

  const openEditModal = (plan) => {
    setEditData({
      id: plan.id,
      titre: plan.titre,
      price: plan.price,
      daysAvailable: plan.daysAvailable,
      start_date: plan.start_date,
      end_date: plan.end_date
    });
    setEditModalIsOpen(true);
  };

  const closeEditModal = () => {
    setEditModalIsOpen(false);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSaveChanges = () => {
    if (!editData.titre || !editData.price || !editData.daysAvailable) {
      alert("Tous les champs doivent être remplis !");
      return;
    }

    // Conversion de `price` en nombre flottant
    const updatedData = {
      ...editData,
      price: parseFloat(editData.price),  // Conversion ici
    };

    console.log("Données envoyées :", updatedData);

    dispatch(updatePlan({ planId: updatedData.id, updatedPlan: updatedData }))
      .unwrap()
      .then(() => {
        alert("Modifications enregistrées !");
        setEditModalIsOpen(false);
        dispatch(setSelectedPlan(null)); // Reset le plan sélectionné après modification
      })
      .catch((error) => {
        alert("Erreur lors de la modification : " + error);
      });
  };

  return (
    <>
      <h2>باقات</h2>

      {loading ? (
        <p>Chargement des plans...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <div className="pricing-container">
          {plans.length > 0 ? (
            plans.map((plan, index) => (
              <div key={index} className="pricing-card">
                <div className="pricing-header" style={{ background: "linear-gradient(135deg,rgb(97, 197, 135),rgb(44, 234, 27))" }}>
                  <h3>{plan.titre}</h3>
                  <h2>{plan.price}</h2>
                  <p><strong>درهم/أسبوع</strong></p>
                </div>
                <ul className="pricing-features">
                  <li>غداء ✔</li>
                  <li>مرات في اليوم &lrm;5 ✔</li>
                  <li>شامل التوصيل ✔</li>
                  {plan.titre === "باقة إقتصادية" ? (
                    <li>مطعم عالمي ❌</li>
                  ) : plan.titre === "باقة متوسطة" ? (
                    <li>مطعم عالمي &lrm;1 ✔</li>
                  ) : (
                    <li>مطعم عالمي &lrm;3 ✔</li>
                  )}
                </ul>
                <button
                  className="pricing-button"
                  onClick={() => dispatch(setSelectedPlan(plan))}
                >
                  اطلب هنا
                </button>
                {/* Afficher le bouton "تعديل" seulement si l'email de l'utilisateur correspond */}
                {user && adminEmails.includes(user.email) && (
                  <button className="edit-button" onClick={() => openEditModal(plan)}>
                    تعديل
                  </button>
                )}
              </div>
            ))
          ) : (
            <p>Aucun plan disponible.</p>
          )}
        </div>
      )}

      {/* Modal de sélection du plan */}
      {selectedPlan && (
        <Modal
          isOpen={!!selectedPlan}
          onRequestClose={() => dispatch(setSelectedPlan(null))}
          className="modal-content"
          overlayClassName="modal-overlay"
        >
          <button className="close-button" onClick={() => dispatch(setSelectedPlan(null))}>✖</button>
          <h1>تفاصيل الاشتراك</h1>
          <h2>{selectedPlan.titre}</h2>

          <div>
            <DatePicker
              selected={startDate}
              onChange={handleSelectDate}
              dateFormat="dd MMMM yyyy"
              locale={ar}
              placeholderText="اختر تاريخًا"
            />
            <strong>: تاريخ البدء</strong>
          </div>

          <p><strong> الأيام المتاحة :  </strong> {selectedPlan.daysAvailable}</p>
          <p>&lrm;{selectedPlan.price} <strong>: السعر </strong></p>

          <button className="order-button" onClick={handleOrderClick}>
            اختر وجباتك
          </button>
        </Modal>
      )}

      {/* Modal d'édition des plans */}
      <Modal
        isOpen={editModalIsOpen}
        onRequestClose={closeEditModal}
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <button className="close-button" onClick={closeEditModal}>✖</button>
        <h1>تعديل الباقة</h1>

        <form className="edit-form">
          <label>العنوان:</label>
          <input type="text" name="titre" value={editData.titre} onChange={handleEditChange} />

          <label>السعر:</label>
          <input type="text" name="price" value={editData.price} onChange={handleEditChange} />

          <label>الأيام المتاحة:</label>
          <input type="text" name="daysAvailable" value={editData.daysAvailable} onChange={handleEditChange} />

          {/* Ajout des champs start_date et end_date */}
          <label>تاريخ البدء:</label>
          <input 
            type="date" 
            name="start_date" 
            value={editData.start_date || ''} 
            onChange={handleEditChange} 
          />

          <label>تاريخ الانتهاء:</label>
          <input 
            type="date" 
            name="end_date" 
            value={editData.end_date || ''} 
            onChange={handleEditChange} 
          />

          <button type="button" className="save-button" onClick={handleSaveChanges}>
            حفظ التعديلات
          </button>
        </form>
      </Modal>
    </>
  );
};

export default Pricing;
