import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Users, Crown, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

const Dashboard = () => {
  const [artisans, setArtisans] = useState([]);
  const [pendingArtisans, setPendingArtisans] = useState([]);
  const [vipRequests, setVipRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // جلب جميع الحرفيين
      const artisansRef = collection(db, 'artisans');
      const artisansQuery = query(artisansRef, orderBy('createdAt', 'desc'));
      const artisansSnapshot = await getDocs(artisansQuery);
      
      const artisansData = artisansSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setArtisans(artisansData);
      setPendingArtisans(artisansData.filter(a => !a.approved));
      setVipRequests(artisansData.filter(a => a.vipRequested && !a.vip));
      
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const approveArtisan = async (artisanId) => {
    try {
      await updateDoc(doc(db, 'artisans', artisanId), {
        approved: true,
        approvedAt: new Date()
      });
      await fetchData();
    } catch (error) {
      console.error('Error approving artisan:', error);
    }
  };

  const rejectArtisan = async (artisanId) => {
    try {
      await deleteDoc(doc(db, 'artisans', artisanId));
      await fetchData();
    } catch (error) {
      console.error('Error rejecting artisan:', error);
    }
  };

  const approveVIP = async (artisanId, plan) => {
    try {
      const expiryDate = new Date();
      if (plan === 'monthly') expiryDate.setMonth(expiryDate.getMonth() + 1);
      else if (plan === '6months') expiryDate.setMonth(expiryDate.getMonth() + 6);
      else if (plan === 'yearly') expiryDate.setFullYear(expiryDate.getFullYear() + 1);

      await updateDoc(doc(db, 'artisans', artisanId), {
        vip: true,
        vipExpiry: expiryDate,
        vipRequested: false,
        vipPlan: plan
      });
      await fetchData();
    } catch (error) {
      console.error('Error approving VIP:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: 'إجمالي الحرفيين',
      value: artisans.length,
      icon: Users,
      color: 'blue'
    },
    {
      title: 'طلبات في انتظار الموافقة',
      value: pendingArtisans.length,
      icon: AlertCircle,
      color: 'yellow'
    },
    {
      title: 'طلبات VIP',
      value: vipRequests.length,
      icon: Crown,
      color: 'purple'
    },
    {
      title: 'حسابات VIP نشطة',
      value: artisans.filter(a => a.vip).length,
      icon: CheckCircle,
      color: 'green'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* الشريط العلوي */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">لوحة التحكم</h1>
            <button 
              onClick={fetchData}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              تحديث البيانات
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* الإحصائيات */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                    <IconComponent className={`h-6 w-6 text-${stat.color}-600`} />
                  </div>
                  <div className="mr-4">
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* التبويبات */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {[
                { id: 'overview', name: 'نظرة عامة' },
                { id: 'pending', name: `في انتظار الموافقة (${pendingArtisans.length})` },
                { id: 'vip', name: `طلبات VIP (${vipRequests.length})` },
                { id: 'all', name: 'جميع الحرفيين' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'pending' && (
              <PendingArtisansList 
                artisans={pendingArtisans}
                onApprove={approveArtisan}
                onReject={rejectArtisan}
              />
            )}

            {activeTab === 'vip' && (
              <VIPRequestsList 
                requests={vipRequests}
                onApprove={approveVIP}
              />
            )}

            {activeTab === 'all' && (
              <AllArtisansList artisans={artisans} />
            )}

            {activeTab === 'overview' && (
              <OverviewTab 
                pendingArtisans={pendingArtisans}
                vipRequests={vipRequests}
                artisans={artisans}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// مكون قائمة الحرفيين المنتظرين
const PendingArtisansList = ({ artisans, onApprove, onReject }) => {
  if (artisans.length === 0) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
        <p className="mt-4 text-gray-500">لا توجد طلبات في انتظار الموافقة</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {artisans.map(artisan => (
        <div key={artisan.id} className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 space-x-reverse">
              {artisan.photos && artisan.photos.length > 0 && (
                <img 
                  src={artisan.photos[0]} 
                  alt={artisan.firstName}
                  className="w-12 h-12 rounded-full object-cover"
                />
              )}
              <div>
                <h3 className="font-bold">{artisan.firstName} {artisan.lastName}</h3>
                <p className="text-gray-600">{artisan.profession}</p>
                <p className="text-sm text-gray-500">{artisan.phone}</p>
              </div>
            </div>
            <div className="flex space-x-2 space-x-reverse">
              <button
                onClick={() => onApprove(artisan.id)}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                قبول
              </button>
              <button
                onClick={() => onReject(artisan.id)}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                رفض
              </button>
            </div>
          </div>
          {artisan.description && (
            <p className="mt-2 text-gray-700">{artisan.description}</p>
          )}
        </div>
      ))}
    </div>
  );
};

// مكون قائمة طلبات VIP
const VIPRequestsList = ({ requests, onApprove }) => {
  if (requests.length === 0) {
    return (
      <div className="text-center py-8">
        <Crown className="mx-auto h-12 w-12 text-purple-500" />
        <p className="mt-4 text-gray-500">لا توجد طلبات VIP</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map(artisan => (
        <div key={artisan.id} className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 space-x-reverse">
              {artisan.photos && artisan.photos.length > 0 && (
                <img 
                  src={artisan.photos[0]} 
                  alt={artisan.firstName}
                  className="w-12 h-12 rounded-full object-cover"
                />
              )}
              <div>
                <h3 className="font-bold">{artisan.firstName} {artisan.lastName}</h3>
                <p className="text-gray-600">{artisan.profession} - {artisan.wilayaName}</p>
                <p className="text-sm text-yellow-600">الباقة المطلوبة: {artisan.vipPlan}</p>
              </div>
            </div>
            <div className="flex space-x-2 space-x-reverse">
              <button
                onClick={() => onApprove(artisan.id, artisan.vipPlan)}
                className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
              >
                تفعيل VIP
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// مكون جميع الحرفيين
const AllArtisansList = ({ artisans }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              الحرفي
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              المهنة
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              الموقع
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              الحالة
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {artisans.map(artisan => (
            <tr key={artisan.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {artisan.photos && artisan.photos.length > 0 && (
                    <img 
                      src={artisan.photos[0]} 
                      alt={artisan.firstName}
                      className="w-8 h-8 rounded-full object-cover ml-3"
                    />
                  )}
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {artisan.firstName} {artisan.lastName}
                    </div>
                    <div className="text-sm text-gray-500">{artisan.phone}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {artisan.profession}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {artisan.wilayaName} - {artisan.baladiyaName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  artisan.vip 
                    ? 'bg-purple-100 text-purple-800'
                    : artisan.approved
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {artisan.vip ? 'VIP' : artisan.approved ? 'مفعل' : 'بانتظار الموافقة'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button className="text-red-600 hover:text-red-900">حذف</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// مكون النظرة العامة
const OverviewTab = ({ pendingArtisans, vipRequests, artisans }) => {
  const recentArtisans = artisans.slice(0, 5);
  const vipArtisans = artisans.filter(a => a.vip).slice(0, 5);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* الحرفيين المضافين حديثاً */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-bold mb-4">الحرفيين المضافين حديثاً</h3>
        <div className="space-y-3">
          {recentArtisans.map(artisan => (
            <div key={artisan.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
              <div className="flex items-center space-x-3 space-x-reverse">
                {artisan.photos && artisan.photos.length > 0 && (
                  <img 
                    src={artisan.photos[0]} 
                    alt={artisan.firstName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                )}
                <div>
                  <p className="font-medium">{artisan.firstName} {artisan.lastName}</p>
                  <p className="text-sm text-gray-500">{artisan.profession}</p>
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${
                artisan.approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {artisan.approved ? 'مفعل' : 'بانتظار'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* حسابات VIP النشطة */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-bold mb-4">حسابات VIP النشطة</h3>
        <div className="space-y-3">
          {vipArtisans.length > 0 ? (
            vipArtisans.map(artisan => (
              <div key={artisan.id} className="flex items-center justify-between p-3 bg-white rounded-lg border-l-4 border-purple-500">
                <div className="flex items-center space-x-3 space-x-reverse">
                  {artisan.photos && artisan.photos.length > 0 && (
                    <img 
                      src={artisan.photos[0]} 
                      alt={artisan.firstName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <p className="font-medium">{artisan.firstName} {artisan.lastName}</p>
                    <p className="text-sm text-gray-500">{artisan.profession}</p>
                  </div>
                </div>
                <Crown className="h-5 w-5 text-purple-500" />
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">لا توجد حسابات VIP نشطة</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
