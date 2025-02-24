import React from 'react';
import './modal.css'; // Import the CSS file

const Modal = ({ meal, closeModal, handleAddMeal }) => {
    if (!meal) return null; // Avoid displaying an empty modal

    return (
        <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-btn" onClick={closeModal}>✖</button>
                <img src={meal.meal_img} alt={meal.meal_title} className="modal-img" />
                <h2>{meal.meal_title}</h2>
                <p>{meal.meal_description}</p>
                
                <button className="add-btn" onClick={() => {
                    handleAddMeal(meal);
                    closeModal();
                    
                }}>Ajouter au panier</button>
            </div>
        </div>
    );
};

export default Modal;
