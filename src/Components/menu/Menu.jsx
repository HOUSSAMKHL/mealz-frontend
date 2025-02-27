// Menu.js
import React, { useState, useEffect } from 'react';
import './menu.css';
import del from '/delete.png';
import edit from '/edt.png';
import { useSelector, useDispatch } from "react-redux";
import { format, addDays, isWeekend } from 'date-fns';
import { ar } from 'date-fns/locale';
import OrderSummary from '../order/Order';
import { addMealToDay, setSelectedDay, resetCompletedDays, fetchMeals, deleteMeal, updateMeal } from '../../Redux/Store';
import Modal from './Modal';

const Menu = () => {
    // Pas besoin d'initialiser avec useState ici
    const [Menudata, setMenuData] = useState({
        promotionsitems: [],
        topVentes: [],
        combos: [],
        Boissons: [],
        plats: [],
        fullBox: []
    });
    // 🔹 Récupérer l'état de connexion depuis Redux
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const user = useSelector((state) => state.auth.user);
    const adminEmails = ["Houssamkhalil.011@gmail.com", "omarlahmoumi@gmail.com"];
    const isAdmin = adminEmails.includes(user?.email);
    
    const meals = useSelector((state) => state.order.meals); // AccÃ©der aux donnÃ©es depuis Redux
    const loading = useSelector((state) => state.order.loading);
    const error = useSelector((state) => state.order.error);

    const startDateString = useSelector((state) => state.order.startDate);
    const [startDateObj, setStartDateObj] = useState(startDateString ? new Date(startDateString) : null);
    const [weekDays, setWeekDays] = useState([]);
    const selectedDayIndex = useSelector((state) => state.order.selectedDayIndex);
    const completedDays = useSelector((state) => state.order.completedDays);
    const dispatch = useDispatch();
    const [selectedMeal, setSelectedMeal] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editMeal, setEditMeal] = useState(null);


    useEffect(() => {
        dispatch(fetchMeals()); // RÃ©cupÃ©rer les repas lors du montage du composant
    }, [dispatch]);

    useEffect(() => {
        // Filtrer et catÃ©goriser les repas une fois qu'ils sont chargÃ©s depuis Redux
        if (meals && meals.length > 0) {
            // console.log(meals)
            const transformedData = {
                promotionsitems: meals.filter(item => item.meal_categorie === 'promotions'),
                topVentes: meals.filter(item => item.meal_categorie === 'topVentes'),
                combos: meals.filter(item => item.meal_categorie === 'combos'),
                Boissons: meals.filter(item => item.meal_categorie === 'boissons'),
                plats: meals.filter(item => item.meal_categorie === 'plats'),
                fullBox: meals.filter(item => item.meal_categorie === 'fullBox')
            };
            setMenuData(transformedData);

        }
    }, [meals]); // DÃ©pendance Ã  'meals' pour se mettre Ã  jour lorsque les donnÃ©es changent

    useEffect(() => {

        if (startDateString) {
            const start = new Date(startDateString);
            const week = [];
            let dayCounter = 0;
            let currentDay = start;

            while (week.length < 5 && dayCounter < 30) {
                if (!isWeekend(currentDay)) {
                    week.push(currentDay);
                }
                currentDay = addDays(currentDay, 1);
                dayCounter++;
            }
            setWeekDays(week);
            setStartDateObj(new Date(startDateString));
            dispatch(resetCompletedDays());
        } else {
            // Si startDateString n'est pas encore dÃ©fini, garde weekDays vide
            setWeekDays([]);
            setStartDateObj(null);
        }
    }, [startDateString, dispatch]);
    const handleAddMeal = (meal) => {
        dispatch(addMealToDay({ dayIndex: selectedDayIndex, meal: meal }));

        if (selectedDayIndex === null || selectedDayIndex < 0) {
            dispatch(setSelectedDay(0));
        } else if (selectedDayIndex < weekDays.length - 1) {
            dispatch(setSelectedDay(selectedDayIndex + 1));
        }
    };

    const handleDayClick = (dayIndex) => {
        dispatch(setSelectedDay(dayIndex));
    };

    const openModal = (meal) => {
        setSelectedMeal(meal);
        setIsModalOpen(true);
        document.body.classList.add("modal-open");
    };

    const closeModal = () => {
        setSelectedMeal(null);
        setIsModalOpen(false);
        document.body.classList.remove("modal-open");
        setEditMeal(null); // Reset editMeal when closing the modal
    };
    const handleEdit = (meal) => {
        window.scrollTo(0, 0); // Fait défiler la page jusqu'en haut
        setEditMeal(meal); // Charge le repas à modifier
    };
    const handleCancelEdit = () => {
        setEditMeal(null);
    };

    const handleDelete = (mealId) => {
        dispatch(deleteMeal(mealId))
            .then(() => {
                // After successful deletion, refresh the meals list
                dispatch(fetchMeals());
            })
            .catch((error) => {
                // Handle error if deletion fails
                console.error("Error deleting meal:", error);
            });
    };
    const handleUpdate = (e) => {
        e.preventDefault();
        if (editMeal) {
            dispatch(updateMeal({ mealId: editMeal.id, updatedMeal: editMeal }))
                .then(() => {
                    dispatch(fetchMeals()); // Récupérer la liste mise à jour des repas
                    closeModal();
                })
                .catch((error) => {
                    console.error("Error updating meal:", error);
                });
        }
    };
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditMeal(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    const renderMenuItems = (items) => {
        if (!Array.isArray(items) || items.length === 0) {
            return <p>No items available.</p>;
        }
        return items.map((item, index) => (
            <ul key={index}>
                <li>
                    <img className='addbtn' onClick={() => handleAddMeal(item)} src='/add.svg' alt="add" />
                </li>
                <li>
                    <img
                        src={item.meal_img}
                        alt={item.meal_title}
                        onClick={() => openModal(item)}
                        style={{ cursor: 'pointer' }}
                    />
                </li>
                <li><strong>{item.meal_title}</strong></li>
                <li>{item.meal_description}</li>
                <div className="operations">
                     {isAdmin && isAuthenticated ? (
                    <>
                        <li><button className='editbtn' onClick={() => handleEdit(item)}><img src={edit} alt='edit'style={{ width: '20px', height: '20px' }}/></button></li>
                        <li><button className ='delbtn' onClick={() => handleDelete(item.id)}><img src={del} alt='delete' style={{ width: '20px', height: '20px' }}/></button></li>
                    </>
                ) : null}
                </div>
               
            </ul>
        ));
    };

    return (
        <>
            <div className="menu-container">

                <div className="sections">
                    <p><a href="#promotions">العروض</a></p>
                    <p><a href="#topVentes">الأكثر مبيعًا</a></p>
                    <p><a href="#combos">تشكيلات</a></p>
                    <p><a href="#Boissons">المشروبات</a></p>
                    <p><a href="#plats">الأطباق الرئيسية</a></p>
                    <p><a href="#full-box">الصندوق الكامل</a></p>
                </div>

                <div className="main-content">
                    <div id="days-container">
                        <ul className="days">
                            {weekDays.map((day, index) => (
                                <li key={index} onClick={() => handleDayClick(index)}
                                    className={index === selectedDayIndex ? 'selected' : ''}>
                                    <input
                                        type="radio"
                                        name="selectedDay"
                                        checked={index === selectedDayIndex}
                                        readOnly
                                        style={{
                                            backgroundColor: completedDays.includes(index) ? 'lightgreen' : '',
                                        }}
                                    />
                                    {format(day, 'dd MMM', { locale: ar })}
                                </li>
                            ))}
                        </ul>
                    </div>
                    {loading && <p>جارٍ تحميل الوجبات...</p>}
                    {error && <p>خطأ: {error}</p>}
                    {/* Champs de modification directement visibles si un repas est en cours de modification */}
                {editMeal && (
                    <div className="edit-meal">
                        <h2>تعديل الوجبة</h2>
                        <form onSubmit={handleUpdate}>
                            <button className="close-btn" onClick={handleCancelEdit}>X</button>

                            <div>
                                <label>العنوان:</label>
                                <input
                                    type="text"
                                    name="meal_title"
                                    value={editMeal.meal_title}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <label>الوصف:</label>
                                <textarea
                                    name="meal_description"
                                    value={editMeal.meal_description}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <label>الصورة:</label>
                                <input
                                    type="text"
                                    name="meal_img"
                                    value={editMeal.meal_img}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <button type="submit">تحديث</button>
                        </form>
                    </div>
                )}

                    <h1>العروض</h1>
                    <div className="promotions" id="promotions">
                        {renderMenuItems(Menudata.promotionsitems)}
                    </div>
                    <h1>الأكثر مبيعًا</h1>
                    <div className="topVentes" id="topVentes">
                        {renderMenuItems(Menudata.topVentes)}
                    </div>
                    <h1 id="combos">تشكيلات</h1>
                    <div className="combos">
                        {renderMenuItems(Menudata.combos)}
                    </div>
                    <h1>المشروبات</h1>
                    <div className="Boissons" id="Boissons">
                        {renderMenuItems(Menudata.Boissons)}
                    </div>
                    <h1>الأطباق</h1>
                    <div className="plats" id="plats">
                        {renderMenuItems(Menudata.plats)}
                    </div>
                    <h1>الصندوق الكامل</h1>
                    <div className="full-box" id="full-box">
                        {renderMenuItems(Menudata.fullBox)}
                    </div>
                </div>
                <OrderSummary />
            </div>
            {isModalOpen && (
                <Modal meal={selectedMeal} closeModal={closeModal} handleAddMeal={handleAddMeal}
                    editMeal={editMeal}
                    handleUpdate={handleUpdate}
                    handleInputChange={handleInputChange} />
            )}
        </>
    );
}

export default Menu;
