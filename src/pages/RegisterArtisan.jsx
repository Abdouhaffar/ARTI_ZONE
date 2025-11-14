import React, { useState } from 'react';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase/config';
import { algeriaData } from '../data/algeriaData';

const RegisterArtisan = () => {
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
      const wilayaName = algeriaData.wilayas.find(w => w.id === parseInt(formData.wilaya))?.name;
      const dairaName = algeriaData.dairas.find(d => d.id === parseInt(formData.daira))?.name;
      const baladiyaName = algeriaData.baladiyat.find(b => b.id === parseInt(formData.baladiya))?.name;

      const docRef = await addDoc(collection(db, 'artisans'), {
        ...formData,
        wilayaName,
        dairaName,
        baladiyaName,
        approved: false,
        vip: false,
        vipExpiry: null,
        rating: 0,
        reviews: [],
        createdAt: new Date()
      });

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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-center mb-6">تسجيل حرفي جديد</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الاسم</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">اللقب</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الولاية</label>
                <select
                  name="wilaya"
                  value={formData.wilaya}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">الدائرة</label>
                <select
                  name="daira"
                  value={formData.daira}
                  onChange={handleInputChange}
                  required
                  disabled={!formData.wilaya}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">البلدية</label>
                <select
                  name="baladiya"
                  value={formData.baladiya}
                  onChange={handleInputChange}
                  required
                  disabled={!formData.daira}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">المهنة</label>
              <select
                name="profession"
                value={formData.profession}
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">سنوات الخبرة</label>
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                required
                min="0"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">وصف العمل</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="صف خبرتك وأعمالك السابقة..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                صور الأعمال (حد أقصى 5 صور)
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {selectedFiles.length > 0 && (
                <p className="mt-2 text-sm text-gray-600">
                  {selectedFiles.length} صورة محددة
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'جاري التسجيل...' : 'تسجيل الحرفي'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterArtisan;
