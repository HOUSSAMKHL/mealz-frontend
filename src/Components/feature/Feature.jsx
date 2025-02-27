import React from 'react';
import Featurebox from './Featurebox';
import img1 from '../../assets/steps/pizza-icon.png';
import img2 from '../../assets/steps/pointing-icon.png';
import img3 from '../../assets/steps/icon-compressed-calendar.png';
import img4 from '../../assets/steps/icon-trust-compressed.png';
import './feature.css';

const features = [
  { image: img4, title: 'وبالعافية عليك', description:'وجباتك توصلك يوميًا وأنت مرتاح، وتقدر تجدد اشتراكك في نهاية المدة بضغطة واحدة. '},
  { image: img1, title: 'حدد مدة الاشتراك' , description:"مدد اشتراك أسبوعية وشهرية، مع تحكم كامل طوال فترة الاشتراك." },
  { image: img3, title: 'اختر الباقة' , description:"اختر نوع الباقة المناسبة لك، صحي، كيتو، دايت، فاست فود.. أو ميكس."},
  { image: img2, title: 'اختر وجباتك' , description:'اختر وجباتك من منيو متنوع يضم أفضل مطاعم المملكة، وحدد موعد وعنوان التوصيل.' },
];

function Features() {
  // Reverse the features array
  const reversedFeatures = [...features].reverse();

  return (
    <>
      <h1>كيف يعمل</h1>

      <div className="feature-container">
        {reversedFeatures.map((feature, index) => (
          <Featurebox
            key={index}
            image={feature.image}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </>
  );
}

export default Features;
