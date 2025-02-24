import React from 'react';
import pack from '../../assets/pack.jpg';
import './Home.css';
import macdo from '../../assets/partenariat/macdo.png';
import burgerking from '../../assets/partenariat/burgerking.png';
import kfc from '../../assets/partenariat/kfc.png';
import tacosdelion from '../../assets/partenariat/tacosdelion.png';
import Feature from '../feature/Feature';
import Pricing from '../pricing/Pricing';

const imageData = [
  { id: 1, img: macdo, alt: "McDonald's" },
  { id: 2, img: burgerking, alt: "Burger King" },
  { id: 6, img: kfc, alt: "KFC" },
  { id: 11, img: tacosdelion, alt: "Tacos de Lyon" },

];


const Home = () => {
  return (
    <>
      <div id="main">
        <div className="content">
          <div className="imgsection">
            <img src={pack} alt="Pack DailyMealz" />
          </div>
          <div className="text-section">
            <h1>اشتراك وجبات متنوعــة توصلك يوميًا من أكثر من <span>200 مطعم</span></h1>
            <div className="buttons">
            <a href="#Pricing-Section" className="btn">إختر الباقة</a>

            </div>
          </div>
        </div>
      </div>

      <div className="partenariat-container">
        <h1 id='Pricing-Section'><strong>عملائنا</strong></h1>
        <div className="partenariat">
          {imageData.map((imgd) => (
            <div key={imgd.id} className="partner-logo">
              <img src={imgd.img} alt={imgd.alt} />
            </div>
          ))}
        </div>
      </div>

      <section >
      <Pricing/>
      </section>

      <section>
      <Feature/>
      </section>

    </>
  );
};

export default Home;

