import React from 'react';

const VIPPricing = () => {
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

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-8">باقات VIP</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`bg-white rounded-lg shadow-lg border-2 ${
              plan.popular ? 'border-yellow-400 transform scale-105' : 'border-gray-200'
            } p-6`}
          >
            {plan.popular && (
              <div className="bg-yellow-400 text-white text-center py-1 px-3 rounded-full text-sm font-bold mb-4">
                الأكثر شعبية
              </div>
            )}
            
            <h3 className="text-xl font-bold text-center mb-2">{plan.duration}</h3>
            
            <div className="text-center mb-4">
              <span className="text-3xl font-bold text-green-600">{plan.price}</span>
              {plan.originalPrice !== plan.price && (
                <span className="text-gray-500 line-through text-sm mr-2">
                  {plan.originalPrice}
                </span>
              )}
            </div>
            
            <ul className="space-y-2 mb-6">
              {plan.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
            
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
              اختيار الباقة
            </button>
          </div>
        ))}
      </div>
      
      <div className="mt-8 text-center text-gray-600">
        <p>ملاحظة: الباقات VIP محدودة بـ 3 حسابات لكل بلدية</p>
      </div>
    </div>
  );
};

export default VIPPricing;
