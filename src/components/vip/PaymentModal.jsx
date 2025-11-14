import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';

const PaymentModal = ({ isOpen, onClose, artisan, plan }) => {
  const [paymentMethod, setPaymentMethod] = useState('cib');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const planPrices = {
    monthly: { price: 300, duration: 'شهر واحد' },
    '6months': { price: 1500, duration: '6 أشهر' },
    yearly: { price: 2500, duration: '12 شهر' }
  };

  const currentPlan = planPrices[plan];

  const handlePayment = async () => {
    if (!artisan) return;

    setLoading(true);
    try {
      // في التطبيق الحقيقي، هنا ستتكامل مع بوابة الدفع
      // حالياً، سنقوم فقط بتحديث حالة طلب VIP
      await updateDoc(doc(db, 'artisans', artisan.id), {
        vipRequested: true,
        vipPlan: plan,
        vipRequestedAt: new Date()
      });

      alert('تم إرسال طلب VIP بنجاح! سيتم مراجعته من قبل الإدارة.');
      onClose();
    } catch (error) {
      console.error('Error requesting VIP:', error);
      alert('حدث خطأ أثناء معالجة الطلب. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-2xl font-bold mb-4">الدفع وتفعيل VIP</h2>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <h3 className="font-bold text-yellow-800">الباقة المختارة</h3>
          <p className="text-yellow-700">{currentPlan.duration} - {currentPlan.price} د.ج</p>
        </div>

        <div className="mb-6">
          <h3 className="font-bold mb-3">اختر طريقة الدفع:</h3>
          
          <div className="space-y-2">
            <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="paymentMethod"
                value="cib"
                checked={paymentMethod === 'cib'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="ml-3"
              />
              <div>
                <p className="font-medium">بطاقة CIB</p>
                <p className="text-sm text-gray-500">الدفع بالبطاقة البنكية</p>
              </div>
            </label>

            <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="paymentMethod"
                value="baridi"
                checked={paymentMethod === 'baridi'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="ml-3"
              />
              <div>
                <p className="font-medium">بريدي موبيل</p>
                <p className="text-sm text-gray-500">الدفع عبر بريدي موبيل</p>
              </div>
            </label>

            <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="paymentMethod"
                value="ccp"
                checked={paymentMethod === 'ccp'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="ml-3"
              />
              <div>
                <p className="font-medium">الحساب البريدي</p>
                <p className="text-sm text-gray-500">الدفع عبر الحساب البريدي</p>
              </div>
            </label>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h4 className="font-bold text-blue-800 mb-2">ملاحظات مهمة:</h4>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• سيتم مراجعة طلبك من قبل الإدارة خلال 24 ساعة</li>
            <li>• الباقات VIP محدودة بـ 3 حسابات لكل بلدية</li>
            <li>• يمكنك الإلغاء في أي وقت</li>
          </ul>
        </div>

        <div className="flex space-x-3 space-x-reverse">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
          >
            إلغاء
          </button>
          <button
            onClick={handlePayment}
            disabled={loading}
            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'جاري المعالجة...' : 'تأكيد الدفع'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
