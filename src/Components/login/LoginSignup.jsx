import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../Redux/Store'; // Assure-toi que le chemin est correct
import './loginsignup.css';
import logo from '../../assets/logo2.png';

const LoginSignup = () => {
    const [isSignup, setIsSignup] = useState(true);
    const [loading, setLoading] = useState(false); // Ajout d'un état de chargement
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    // ✅ Met à jour les champs du formulaire
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // ✅ Validation des champs
    const validateForm = () => {
        let newErrors = {};
        if (isSignup) {
            if (!formData.fullName.trim()) newErrors.fullName = 'الاسم الكامل مطلوب';
            if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'رقم الهاتف غير صحيح (10 أرقام)';
        }
        if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'البريد الإلكتروني غير صالح';
        if (formData.password.length < 6) newErrors.password = 'كلمة المرور يجب أن تكون على الأقل 6 أحرف';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ✅ Soumission du formulaire
    const dispatch = useDispatch();

const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
        await axios.get('http://127.0.0.1:8000/sanctum/csrf-cookie', { withCredentials: true });

        const url = `http://127.0.0.1:8000/api/${isSignup ? 'register' : 'login'}`;
        const response = await axios.post(url, formData, { withCredentials: true });

        const userData = response.data.user;

        // 🔹 Mettre à jour Redux et LocalStorage
        dispatch(login(userData));
        localStorage.setItem('user', JSON.stringify(userData));

        alert(response.data.message);
        navigate('/Dashboard');
    } catch (error) {
        if (error.response) {
            setErrors(error.response.data.errors || { general: 'حدث خطأ ما، يرجى المحاولة لاحقًا.' });
        } else {
            setErrors({ general: 'خطأ في الاتصال بالسيرفر. حاول لاحقًا.' });
        }
    } finally {
        setLoading(false);
    }
};


    return (
        <div className="form-container">
            <div className="form-left">
                <h2>{isSignup ? 'إنشاء حساب' : 'تسجيل الدخول'}</h2>
                
                {errors.general && <p className="error">{errors.general}</p>}

                <form onSubmit={handleSubmit}>
                    {isSignup && (
                        <>
                            <label>الاسم الكامل:</label>
                            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} />
                            {errors.fullName && <span className="error">{errors.fullName}</span>}

                            <label>الهاتف:</label>
                            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} />
                            {errors.phone && <span className="error">{errors.phone}</span>}
                        </>
                    )}

                    <label>البريد الإلكتروني:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} />
                    {errors.email && <span className="error">{errors.email}</span>}

                    <label>كلمة المرور:</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} />
                    {errors.password && <span className="error">{errors.password}</span>}

                    <button type="submit" disabled={loading}>
                        {loading ? 'جاري المعالجة...' : isSignup ? 'تسجيل' : 'تسجيل الدخول'}
                    </button>
                </form>

                <button type="button" onClick={() => setIsSignup(!isSignup)} className="switch-button">
                    {isSignup ? 'لديك حساب بالفعل؟ تسجيل الدخول' : 'ليس لديك حساب؟ إنشاء حساب'}
                </button>
            </div>

            <div className="form-right">
                <div className="logo-container">
                    <a href="/"><img className="logo" src={logo} alt="الشعار" /></a>
                </div>
                <h2>{isSignup ? 'مرحبًا بك!' : 'مرحبًا بعودتك!'}</h2>
                <p>{isSignup ? 'أنشئ حسابك للانضمام إلينا والاستفادة من خدماتنا.' : 'سجل الدخول للاستمرار في الاستفادة من خدماتنا.'}</p>
            </div>
        </div>
    );
};

export default LoginSignup;
