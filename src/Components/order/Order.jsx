import React from "react";
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

    // ✅ Configure Axios defaults globally
    axios.defaults.baseURL = "https://mealz-backend.onrender.com";
    axios.defaults.withCredentials = true;

    //console.log("startDate", startDate);
    //console.log("Selected Meals before sending:", selectedMeals);


   
    const handleCommanderClick = async () => {
        // Validate that exactly 5 meals are selected
        if (Object.keys(selectedMeals).length !== 5) {
            alert("Veuillez sélectionner exactement exactement 5 repas.");
            return;
        }
    
        try {
            // Step 1: Get CSRF token
            await axios.get("/sanctum/csrf-cookie");
    
            // Step 2: Prepare order data
            const orderData = {
                order_day: startDate,
                order_date: startDate,
                order_status: "pending"
            };
    
            // Step 3: Send order request
            const orderResponse = await axios.post("/api/orders", orderData, {
                headers: {
                    "Content-Type": "application/json",
                    "X-XSRF-TOKEN": getCookie("XSRF-TOKEN")
                }
            });
    
           // console.log("✅ Commande créée :", orderResponse.data);
            const newOrderId = orderResponse.data.id; // Get the new order ID
            dispatch(addOrder(orderResponse.data));
            dispatch(setOrderId(newOrderId)); // Store the order ID in Redux
    
            // Step 4: Add meals to order_meal table
            for (const index in selectedMeals) {
                const meal = selectedMeals[index]; // Access each meal by index
                const meal_id = meal.id; // Assuming each meal object has an 'id' property
    
                // Calculate meal date based on startDate and index
                const mealDate = getFormattedDate(index); // Use your existing function to get the date
    
                const orderMealData = {
                    order_id: newOrderId,
                    meal_id: meal_id,
                    meal_date: mealDate
                };
    
              //  console.log("Sending orderMealData:", orderMealData); // Log the data being sent
    
                // Send request to create an entry in the order_meal table
                try {
                    await axios.post("/api/order_meal", orderMealData, {
                        headers: {
                            "Content-Type": "application/json",
                            "X-XSRF-TOKEN": getCookie("XSRF-TOKEN")
                        }
                    });
                   // console.log(`✅ Added meal ${meal_id} to order ${newOrderId} for date ${mealDate}`);
                } catch (error) {
                    //console.error(`❌ Error adding meal ${meal_id} to order ${newOrderId}:`, error.response ? error.response.data : error);
                }
            }
    
            // Navigate to the next page after processing all meals
            navigate('/Commander');
    
        } catch (error) {
            console.error("❌ Erreur lors de la commande :", error.response ? error.response.data : error);
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
                disabled={Object.keys(selectedMeals).length !== 5} // Disable button if not exactly 5 meals selected
                onClick={handleCommanderClick}
            >
                تأكيد الطلب
            </button>
        </div>
    );
};

export default OrderSummary;
