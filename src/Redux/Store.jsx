// store.js
import { configureStore, createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Configuration d'Axios avec baseURL et CSRF token
const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

const api = axios.create({
    baseURL: "https://mealz-backend.onrender.com",
    headers: {
        "X-XSRF-TOKEN": csrfToken,
    },
});

// 🎯 Action asynchrone pour récupérer les repas
export const fetchMeals = createAsyncThunk("meals/fetchMeals", async (_, thunkAPI) => {
    try {
        const response = await api.get("api/meals");
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

// 🎯 Action asynchrone pour supprimer un repas
export const deleteMeal = createAsyncThunk(
    "meals/deleteMeal",
    async (mealId, thunkAPI) => {
        try {
            await api.delete(`api/meals/${mealId}`);
            return mealId; // Return the deleted meal ID to update the state
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// 🎯 Action asynchrone pour mettre à jour un repas
export const updateMeal = createAsyncThunk(
    "meals/updateMeal",
    async ({ mealId, updatedMeal }, thunkAPI) => {
        try {
            const response = await api.put(`api/meals/${mealId}`, updatedMeal);
            return response.data; // Return the updated meal data
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// 🎯 Action asynchrone pour récupérer les clients
export const fetchClients = createAsyncThunk("clients/fetchClients", async (_, thunkAPI) => {
    try {
        const response = await api.get("api/clients");
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

// 🎯 Action asynchrone pour récupérer les plans
export const fetchPlans = createAsyncThunk("plans/fetchPlans", async (_, thunkAPI) => {
    try {
        const response = await api.get("api/Plans");
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});
export const updatePlan = createAsyncThunk(
    "plans/updatePlan",
    async ({ planId, updatedPlan }, thunkAPI) => {
        try {
            const response = await api.put(`api/plans/${planId}`, updatedPlan);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);


// 🛒 Slice pour gérer les commandes
const orderSlice = createSlice({
    name: "order",
    initialState: {
        startDate: null,
        selectedMeals: {},
        selectedDayIndex: null,
        completedDays: [],
        meals: [],
        loading: false,
        error: null,
        orders: [],
        clientName: "",
        clientAddress: "",
        clientPhone: "",
        selectedPlan: null,
        orderId: null,
    },
    reducers: {
        setStartDate: (state, action) => {
            state.startDate = action.payload;
            state.selectedMeals = {};
            state.selectedDayIndex = 0;
            state.completedDays = [];
            state.orderId = null;
        },
        addMealToDay: (state, action) => {
            const { dayIndex, meal } = action.payload;
            state.selectedMeals[dayIndex] = meal;
            if (!state.completedDays.includes(dayIndex)) {
                state.completedDays.push(dayIndex);
            }
        },
        setSelectedDay: (state, action) => {
            state.selectedDayIndex = action.payload;
        },
        resetCompletedDays: (state) => {
            state.completedDays = [];
        },
        addOrder: (state, action) => {
            state.orders.push(action.payload);
        },
        setClientName: (state, action) => {
            state.clientName = action.payload;
        },
        setClientAddress: (state, action) => {
            state.clientAddress = action.payload;
        },
        setClientPhone: (state, action) => {
            state.clientPhone = action.payload;
        },
        setSelectedPlan: (state, action) => {
            state.selectedPlan = action.payload;
        },
        setOrderId: (state, action) => {
            state.orderId = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMeals.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMeals.fulfilled, (state, action) => {
                state.loading = false;
                state.meals = action.payload;
            })
            .addCase(fetchMeals.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // extraReducers for deleteMeal
            .addCase(deleteMeal.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteMeal.fulfilled, (state, action) => {
                state.loading = false;
                // Remove the deleted meal from the state
                state.meals = state.meals.filter((meal) => meal.id !== action.payload);
            })
            .addCase(deleteMeal.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // extraReducers for updateMeal
            .addCase(updateMeal.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateMeal.fulfilled, (state, action) => {
                state.loading = false;
                // Update the meal in the state with the updated data
                state.meals = state.meals.map((meal) =>
                    meal.id === action.payload.id ? action.payload : meal
                );
            })
            .addCase(updateMeal.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchClients.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchClients.fulfilled, (state, action) => {
                state.loading = false;
                state.clients = action.payload;
            })
            .addCase(fetchClients.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

// 📋 Slice pour gérer les plans
const planSlice = createSlice({
    name: "plans",
    initialState: {
        plans: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPlans.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPlans.fulfilled, (state, action) => {
                state.loading = false;
                state.plans = action.payload;
            })
            .addCase(fetchPlans.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(updatePlan.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatePlan.fulfilled, (state, action) => {
                state.loading = false;
                state.plans = state.plans.map((plan) =>
                    plan.id === action.payload.id ? action.payload : plan
                );
            })
            .addCase(updatePlan.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

// 🏠 Slice pour gérer les clients
const clientSlice = createSlice({
    name: "clients",
    initialState: {
        clients: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchClients.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchClients.fulfilled, (state, action) => {
                state.loading = false;
                state.clients = action.payload;
            })
            .addCase(fetchClients.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});
const user = JSON.parse(localStorage.getItem("user"));

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: user || null, // Stocker l'utilisateur s'il est connecté
        isAuthenticated: !!user, // Vérifier s'il est connecté

    },
    reducers: {
        login: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            localStorage.setItem("user", JSON.stringify(action.payload));
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            localStorage.removeItem("user");
        },
    },
});

export const { login, logout } = authSlice.actions;



// 🏪 Configuration du store Redux
const store = configureStore({
    reducer: {
        order: orderSlice.reducer,
        plans: planSlice.reducer,
        clients: clientSlice.reducer,
        auth: authSlice.reducer, // Renommé de "user" à "auth"
    },
});


// 🏗 Export des actions
export const {
    addOrder,
    setStartDate,
    setSelectedDay,
    addMealToDay,
    resetCompletedDays,
    setClientName,
    setClientAddress,
    setClientPhone,
    setSelectedPlan,
    setOrderId,
} = orderSlice.actions;

// 🏪 Export du store
export default store;
