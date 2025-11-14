import React, { useState } from 'react';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase/config';
import { algeriaData } from '../../data/algeriaData';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    wilaya: '',
    daira: '',
    baladiya: '',
    profession: '',
    experience: '',
    description: '',
    photos: []
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const uploadPhotos = async (artisanId) => {
    const photoUrls = [];
    
    for (const file of selectedFiles) {
      const photoRef = ref(storage, `artisans/${artisanId}/${file.name}`);
      await uploadBytes(photoRef, file);
      const downloadURL = await getDownloadURL(photoRef);
      photoUrls.push(downloadURL);
    }
    
    return photoUrls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // إضافة الحرفي إلى Firestore
      const docRef = await addDoc(collection(db, 'artisans'), {
        ...formData,
        approved: false,
        vip: false,
        vipExpiry: null,
        rating: 0,
        reviews: [],
        createdAt: new Date()
      });

      // رفع الصور
      if (selectedFiles.length > 0) {
        const photoUrls = await uploadPhotos(docRef.id);
        await updateDoc(docRef, { photos: photoUrls });
      }

      alert('تم تسجيل طلبك بنجاح! سيتم مراجعته من قبل الإدارة.');
      setFormData({
        firstName: '',
        lastName: '',
        phone: '',
        wilaya: '',
        daira: '',
        baladiya: '',
        profession: '',
        experience: '',
        description: '',
        photos: []
      });
      setSelectedFiles([]);
    } catch (error) {
      console.error('Error registering artisan:', error);
      alert('حدث خطأ أثناء التسجيل. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const filteredDairas = algeriaData.dairas.filter(
    daira => daira.wilayaId === parseInt(formData.wilaya)
  );

  const filteredBaladiyat = algeriaData.baladiyat.filter(
    baladiya => baladiya.dairaId === parseInt(formData.daira)
  );

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">تسجيل حرفي جديد</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">الاسم</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">اللقب</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">رقم الهاتف</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">الولاية</label>
            <select
              name="wilaya"
              value={formData.wilaya}
              onChange={handleInputChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">اختر الولاية</option>
              {algeriaData.wilayas.map(wilaya => (
                <option key={wilaya.id} value={wilaya.id}>
                  {wilaya.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">الدائرة</label>
            <select
              name="daira"
              value={formData.daira}
              onChange={handleInputChange}
              required
              disabled={!formData.wilaya}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">اختر الدائرة</option>
              {filteredDairas.map(daira => (
                <option key={daira.id} value={daira.id}>
                  {daira.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">البلدية</label>
            <select
              name="baladiya"
              value={formData.baladiya}
              onChange={handleInputChange}
              required
              disabled={!formData.daira}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">اختر البلدية</option>
              {filteredBaladiyat.map(baladiya => (
                <option key={baladiya.id} value={baladiya.id}>
                  {baladiya.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">المهنة</label>
          <select
            name="profession"
            value={formData.profession}
            onChange={handleInputChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">اختر المهنة</option>
            {algeriaData.professions.map(profession => (
              <option key={profession} value={profession}>
                {profession}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">سنوات الخبرة</label>
          <input
            type="number"
            name="experience"
            value={formData.experience}
            onChange={handleInputChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">وصف العمل</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="4"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">صور الأعمال (حد أقصى 5 صور)</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'جاري التسجيل...' : 'تسجيل الحرفي'}
        </button>
      </form>
    </div>
  );
};

export default RegistrationForm;
