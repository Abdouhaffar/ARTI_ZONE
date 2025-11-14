import React from 'react';
import { Crown, Star, Zap, Users } from 'lucide-react';

const VIP = () => {
  const plans = [
    {
      duration: 'شهر واحد',
      price: '300 د.ج',
      originalPrice: '300 د.ج',
      features: [
        'الظهور في أعلى نتائج البحث',
        'علامة VIP على الملف الشخصي',
        '5 صور إضافية',
        'دعم فني مخصص'
      ]
    },
    {
      duration: '6 أشهر',
      price: '1,500 د.ج',
      originalPrice: '1,800 د.ج',
      features: [
        'جميع مزايا الشهرية',
        'توفير 300 د.ج',
        'أولوية في العرض',
        'إحصائيات متقدمة'
      ],
      popular: true
    },
    {
      duration: '12 شهر',
      price: '2,500 د.ج',
      originalPrice: '3,600 د.ج',
      features: [
        'جميع مزايا النصف سنوية',
        'توفير 1,100 د.ج',
        'ظهور مميز في الصفحة الرئيسية',
        'دعم فني 24/7'
      ]
    }
  ];

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'ظهور مميز',
      description: 'ظهور في أعلى نتائج البحث وفي الصفحة الرئيسية'
    },
    {
      icon: <Crown className="w-6 h-6" />,
      title: 'علامة VIP',
      description: 'علامة مميزة تظهر ثقة العملاء بك'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'عملاء أكثر',
      description: 'زيادة في عدد العملاء والطلبات'
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: 'مصداقية أعلى',
      description: 'ثقة أكبر من قبل العملاء'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* العنوان */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            باقات <span className="text-yellow-600">VIP</span> المميزة
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            احصل على ظهور أكبر وعملاء أكثر مع باقات VIP المميزة
          </p>
        </div>

        {/* المميزات */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-yellow-600 mb-4 flex justify-center">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* الباقات */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-white rounded-xl shadow-lg border-2 ${
                plan.popular ? 'border-yellow-400 transform scale-105' : 'border-gray-200'
              } p-8 relative`}
            >
              {plan.popular && (
                <div className="absolute -top-4 right-1/2 transform translate-x-1/2">
                  <span className="bg-yellow-400 text-white text-sm font-bold py-1 px-4 rounded-full">
                    الأكثر شعبية
                  </span>
                </div>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.duration}</h3>
                
                <div className="flex items-center justify-center mb-2">
                  <span className="text-3xl font-bold text-green-600">{plan.price}</span>
                  {plan.originalPrice !== plan.price && (
                    <span className="text-gray-500 line-through text-lg mr-2">
                      {plan.originalPrice}
                    </span>
                  )}
                </div>
                
                {plan.originalPrice !== plan.price && (
                  <p className="text-green-600 text-sm font-medium">
                    وفرت {parseInt(plan.originalPrice) - parseInt(plan.price)} د.ج
                  </p>
                )}
              </div>
              
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-sm">
                    <span className="text-green-500 ml-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <button className="w-full bg-yellow-500 text-white py-3 px-4 rounded-lg font-bold hover:bg-yellow-600 transition-colors">
                اختيار الباقة
              </button>
            </div>
          ))}
        </div>

        {/* ملاحظات */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-2xl mx-auto">
          <h3 className="text-lg font-bold text-blue-800 mb-3">ملاحظات مهمة:</h3>
          <ul className="text-blue-700 space-y-2">
            <li>• الباقات VIP محدودة بـ 3 حسابات لكل بلدية</li>
            <li>• سيتم مراجعة طلبك من قبل الإدارة خلال 24 ساعة</li>
            <li>• يمكنك الإلغاء في أي وقت واسترداد المبلغ المتبقي</li>
            <li>• الدفع متاح عبر CIB، بريدي موبيل، والحساب البريدي</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VIP;
