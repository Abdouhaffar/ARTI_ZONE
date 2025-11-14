import React from 'react';
import { Link } from 'react-router-dom';
import { Search, User, Crown } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* الشعار */}
          <Link to="/" className="flex items-center space-x-2 space-x-reverse">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">ARTIZONE</h1>
              <p className="text-sm text-gray-600">ربط الحرفيين بالمواطنين</p>
            </div>
          </Link>

          {/* روابط التنقل */}
          <nav className="hidden md:flex items-center space-x-8 space-x-reverse">
            <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">
              الرئيسية
            </Link>
            <Link to="/search" className="text-gray-700 hover:text-blue-600 font-medium">
              البحث عن حرفيين
            </Link>
            <Link to="/vip" className="flex items-center text-yellow-600 hover:text-yellow-700 font-medium">
              <Crown className="w-4 h-4 ml-1" />
              باقات VIP
            </Link>
            <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium">
              سجل كحرفي
            </Link>
          </nav>

          {/* أيقونات */}
          <div className="flex items-center space-x-4 space-x-reverse">
            <Link to="/search" className="p-2 text-gray-600 hover:text-blue-600">
              <Search className="w-5 h-5" />
            </Link>
            <Link to="/admin" className="p-2 text-gray-600 hover:text-blue-600">
              <User className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
