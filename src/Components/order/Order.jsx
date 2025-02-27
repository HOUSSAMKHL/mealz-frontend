import {React ,useState} from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setOrderId, addOrder } from "../../Redux/Store"; // Redux store
import "./order.css";

const OrderSummary = () => {
    const dispatch = useDispatch();
    const selectedMeals = useSelector(state => state.order.selectedMeals);
    const startDate = useSelector(state => state.order.startDate);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);


    // ✅ Configure Axios defaults globally
    axios.defaults.baseURL = "https://mealz-backend.onrender.com";
    axios.defaults.withCredentials = true;

    //console.log("startDate", startDate);
    //console.log("Selected Meals before sending:", selectedMeals);


   
   const handleCommanderClick = async () => {
    if (Object.keys(selectedMeals).length !== 5) {
        alert("Veuillez sélectionner exactement 5 repas.");
        return;
    }

    setLoading(true); // Activer l'état de chargement

    try {
        await axios.get("/sanctum/csrf-cookie");

        const orderData = {
            order_day: startDate,
            order_date: startDate,
            order_status: "pending"
        };

        const orderResponse = await axios.post("/api/orders", orderData, {
            headers: {
                "Content-Type": "application/json",
                "X-XSRF-TOKEN": getCookie("XSRF-TOKEN")
            }
        });

        const newOrderId = orderResponse.data.id;
        dispatch(addOrder(orderResponse.data));
        dispatch(setOrderId(newOrderId));

        for (const index in selectedMeals) {
            const meal = selectedMeals[index];
            const meal_id = meal.id;
            const mealDate = getFormattedDate(index);

            const orderMealData = {
                order_id: newOrderId,
                meal_id: meal_id,
                meal_date: mealDate
            };

            await axios.post("/api/order_meal", orderMealData, {
                headers: {
                    "Content-Type": "application/json",
                    "X-XSRF-TOKEN": getCookie("XSRF-TOKEN")
                }
            });
        }

        navigate('/Commander');
    } catch (error) {
        console.error("❌ Erreur lors de la commande :", error.response ? error.response.data : error);
    } finally {
        setLoading(false); // Désactiver le chargement une fois terminé
    }
};


    // ✅ Function to retrieve a cookie by name
    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(";").shift();
        return null;
    };

    // ✅ Function to format the date for each meal
    const getFormattedDate = (dayIndex) => {
        if (!startDate) return "Date inconnue";
        const date = new Date(startDate);
        date.setDate(date.getDate() + parseInt(dayIndex));

        return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    };

    return (
        <div className="order-summary">
            <h2>طلبك</h2>
            <ul>
                {selectedMeals &&
                    Object.entries(selectedMeals).map(([dayIndex, meal]) => (
                        <li key={dayIndex} className="order-item">
                            <span>{meal?.meal_title}</span>
                            <span>{getFormattedDate(dayIndex)}</span>
                        </li>
                    ))}
            </ul>
                <button
                className="order-btn"
                disabled={Object.keys(selectedMeals).length !== 5 || loading} // Désactiver si pas 5 repas ou en cours d'envoi
                onClick={handleCommanderClick}
            >
                {loading ? 'جاري الإرسال...' : 'إرسال الطلب'}
            </button>

        </div>
    );
};

export default OrderSummary;
