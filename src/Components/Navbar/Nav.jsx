import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../Redux/Store'; // Assure-toi que c'est bien importé
import logo from '../../assets/logo.png';
import './Nav.css';

const Nav = () => {
  const [navActive, setNavActive] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();

  // 🔹 Récupérer l'état de connexion depuis Redux
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const changeBackground = () => {
    setNavActive(window.scrollY >= 10);
  };

  useEffect(() => {
    window.addEventListener('scroll', changeBackground);
    return () => window.removeEventListener('scroll', changeBackground);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location]);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // 🔹 Fonction pour gérer la déconnexion
  const handleLogout = () => {
    dispatch(logout()); // Supprime l'utilisateur de Redux
    closeMenu();
  };

  return (
    <nav className={navActive ? 'nav active' : 'nav'}>
      <Link to="/" className="logo">
        <img src={logo} alt="Logo" onClick={closeMenu} />
      </Link>
      <input
        className="menu-btn"
        type="checkbox"
        id="menu-btn"
        checked={menuOpen}
        onChange={() => setMenuOpen(!menuOpen)}
      />
      <label className="menu-icon" htmlFor="menu-btn" aria-label="Toggle navigation">
        <span className="nav-icon"></span>
      </label>
      <ul className="menu">
        {isAuthenticated ? (
          <>
           <li>
              <Link to="/" onClick={handleLogout}>
                <strong> تسجيل الخروج</strong>
              </Link>
            </li>
            <li>
              <Link to="/dashboard" onClick={closeMenu}>
                <strong>فضائي الخاص</strong>
              </Link>
            </li>
           
          </>
        ) : (
          <li>
            <Link to="/LoginSignup" onClick={closeMenu}>
              <strong>تسجيل الدخول</strong>
            </Link>
          </li>
        )}
        <li>
          <Link to="/Contact" onClick={closeMenu}>
            <strong>مركز المساعدة</strong>
          </Link>
        </li>
        <li>
          <Link to="/About" onClick={closeMenu}>
            <strong>لماذا ميلز ؟</strong>
          </Link>
        </li>
        <li>
          <Link to="/" onClick={closeMenu}>
            <strong>الرئيسية</strong>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Nav;
