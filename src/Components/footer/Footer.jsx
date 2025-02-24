import React from 'react';
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from 'react-icons/fa';
import './footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-links">
        <div> <h4>خدمة توصيل الوجبات</h4><ul>
            <li>
            <address>
            المغرب، الدار البيضاء، سيدي معروف<br />
            <a href="mailto:info@dailymealz.com">info@dailymealz.com</a><br />
            <a href="tel:+212XXXXXXXXX">+212XXXXXXXXX</a>
          </address></li>
            </ul>
</div>
       
          
          <div>
            <h4>المزيد</h4>
            <ul>
              <li>كيف يعمل ديلي ميلز</li>
              <li>حول ديلي ميلز</li>
              <li>تعلم المزيد عن اشتراكاتنا</li>
              <li>مواقع مراكز التوصيل</li>
            </ul>
          </div>
          <div>
            <h4>تواصل معنا</h4>
            <ul>
              <li>اتصل بنا</li>
            </ul>
            <h4>انضم إلينا</h4>
            <ul>
              <li>كن سفيرًا لوجبات ديلي ميلز</li>
              <li>شارك في حملاتنا</li>
            </ul>
          </div>
          <div>
            <h4>الأخبار</h4>
            <ul>
              <li>منشوراتنا</li>
              <li>الأسئلة الشائعة</li>
              <li>سياسة الخصوصية</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-social">
        <a href="https://www.facebook.com/dailymealz" target="_blank" rel="noopener noreferrer">
          <FaFacebook />
        </a>
        <a href="https://www.instagram.com/dailymealz" target="_blank" rel="noopener noreferrer">
          <FaInstagram />
        </a>
        <a href="https://www.twitter.com/dailymealz" target="_blank" rel="noopener noreferrer">
          <FaTwitter />
        </a>
        <a href="https://www.linkedin.com/company/dailymealz" target="_blank" rel="noopener noreferrer">
          <FaLinkedin />
        </a>
      </div>

      <div className="footer-bottom">
        <p>©2024 ديلي ميلز | <a href="#">اتصل بنا</a> | <a href="#">سياسة الخصوصية</a></p>
      </div>
    </footer>
  );
}

export default Footer;
