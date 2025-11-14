import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, Users, Shield } from 'lucide-react';

const Home = () => {
  const stats = [
    { number: '500+', label: 'حرفي مسجل' },
    { number: '48', label: 'ولاية' },
    { number: '1,000+', label: 'خدمة مكتملة' },
    { number: '4.8/5', label: 'تقييم العملاء' }
  ];

  const features = [
    {
      icon: <Search className="w-8 h-8" />,
      title: 'بحث سريع',
      description: 'ابحث عن الحرفيين حسب المنطقة والتخصص'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'حرفيون موثوقون',
      description: 'جميع الحرفيين يتم التحقق منهم'
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: 'تقييمات حقيقية',
      description: 'اقرأ تجارب العملاء السابقين'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'دعم متعدد',
      description: 'خدمة عملاء على مدار الساعة'
    }
  ];

  return (
    <div>
      {/* قسم الهيرو */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            وجدت الحرفي المثالي
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            منصة ARTIZONE تربطك بأفضل الحرفيين في الجزائر
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/search"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold text-lg hover:bg-blue-50 transition-colors"
            >
              ابحث عن حرفي
            </Link>
            <Link
              to="/register"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-white hover:text-blue-600 transition-colors"
            >
              سجل كحرفي
            </Link>
          </div>
        </div>
      </section>

      {/* الإحصائيات */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="p-6">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* المميزات */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            لماذا تختار ARTIZONE؟
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="text-blue-600 mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* دعوة للعمل */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            انضم إلى منصتنا كحرفي
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            وسع قاعدة عملائك وزد من دخلك مع باقات VIP المميزة
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold text-lg hover:bg-blue-50 transition-colors"
            >
              سجل الآن
            </Link>
            <Link
              to="/vip"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-white hover:text-blue-600 transition-colors"
            >
              اكتشف باقات VIP
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
