import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [artisans, setArtisans] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    wilaya: '',
    daira: '',
    baladiya: '',
    profession: ''
  });

  // جلب جميع الحرفيين
  const fetchArtisans = async () => {
    setLoading(true);
    try {
      const artisansRef = collection(db, 'artisans');
      const q = query(artisansRef, where('approved', '==', true));
      const querySnapshot = await getDocs(q);
      
      const artisansData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setArtisans(artisansData);
    } catch (error) {
      console.error('Error fetching artisans:', error);
    } finally {
      setLoading(false);
    }
  };

  // البحث عن الحرفيين
  const searchArtisans = async (searchFilters) => {
    setLoading(true);
    try {
      let q = collection(db, 'artisans');
      
      const conditions = [where('approved', '==', true)];
      
      if (searchFilters.wilaya) {
        conditions.push(where('wilaya', '==', searchFilters.wilaya));
      }
      if (searchFilters.profession) {
        conditions.push(where('profession', '==', searchFilters.profession));
      }
      
      q = query(q, ...conditions, orderBy('vip', 'desc'), orderBy('rating', 'desc'));
      
      const querySnapshot = await getDocs(q);
      const results = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching artisans:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtisans();
  }, []);

  const value = {
    artisans,
    searchResults,
    loading,
    filters,
    setFilters,
    searchArtisans,
    fetchArtisans
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
