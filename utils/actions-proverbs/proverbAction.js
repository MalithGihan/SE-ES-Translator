import { getDatabase, ref, child, push, set, update, get, remove , query, orderByChild, startAt, endAt } from 'firebase/database';
import { getFirebaseApp } from "../firebaseHelper";

export const addProverb = async (sinhaleseProverb, singlishMeaning, englishTranslation, type) => {
  try {
    const app = getFirebaseApp();
    const dbRef = ref(getDatabase(app));
    const proverbsRef = child(dbRef, 'proverbs');

    const newProverbRef = push(proverbsRef); 
    await set(newProverbRef, {
      sinhaleseProverb,
      singlishMeaning,
      englishTranslation,
      type,
      addedDate: new Date().toISOString(),
    });

    console.log('Proverb added successfully:', { sinhaleseProverb, singlishMeaning, englishTranslation, type });
  } catch (err) {
    console.error('Error adding proverb:', err);
    throw err;
  }
};

export const getProverbs = async () => {
  try {
    const app = getFirebaseApp();

    const dbRef = ref(getDatabase(app));
    const proverbsRef = child(dbRef, 'proverbs');

    const snapshot = await get(proverbsRef);
    const data = snapshot.val();
    
    if (!data) return [];

    return Object.keys(data).map(key => ({ id: key, ...data[key] }));
  } catch (err) {
    console.error('Error fetching proverbs:', err);
    throw err;
  }
};

export const updateProverb = async (id, sinhaleseProverb,singlishMeaning, englishTranslation,type) => {
  try {
    const app = getFirebaseApp();

    const dbRef = ref(getDatabase(app));
    const proverbRef = child(dbRef, `proverbs/${id}`);

    await update(proverbRef, {
      sinhaleseProverb,
      singlishMeaning,
      englishTranslation,
      type,
      updatedDate: new Date().toISOString(),
    });

    console.log('Proverb updated successfully:', { id, sinhaleseProverb,singlishMeaning, englishTranslation,type });
  } catch (err) {
    console.error('Error updating proverb:', err);
    throw err;
  }
};

export const deleteProverb = async (proverbId) => {
    try {
      const app = getFirebaseApp(); 
      const db = getDatabase(app);
      const proverbRef = ref(db, `proverbs/${proverbId}`);
      
      await remove(proverbRef); 
  
      console.log('Proverb deleted successfully:', proverbId);
    } catch (err) {
      console.error('Error deleting proverb:', err);
      throw err;
    }
  };

  export const searchProverbs = async (searchText) => {
    if (!searchText) {
      throw new Error('Search text cannot be empty.');
    }
  
    const app = getFirebaseApp();
    const db = getDatabase(app);
    const proverbsRef = ref(db, 'proverbs');
 
    let results = [];

    const sinhaleseQuery = query(
      proverbsRef,
      orderByChild('sinhaleseProverb'),
      startAt(searchText),
      endAt(searchText + "\uf8ff")
    );
    const sinhaleseSnapshot = await get(sinhaleseQuery);
    if (sinhaleseSnapshot.exists()) {
      const data = sinhaleseSnapshot.val();
      results = results.concat(Object.keys(data).map(key => ({
        id: key,
        ...data[key]
      })));
    }
  
    const singlishQuery = query(
      proverbsRef,
      orderByChild('singlishMeaning'),
      startAt(searchText),
      endAt(searchText + "\uf8ff")
    );
    const singlishSnapshot = await get(singlishQuery);
    if (singlishSnapshot.exists()) {
      const data = singlishSnapshot.val();
      results = results.concat(Object.keys(data).map(key => ({
        id: key,
        ...data[key]
      })));
    }
  
    const englishQuery = query(
      proverbsRef,
      orderByChild('englishTranslation'),
      startAt(searchText),
      endAt(searchText + "\uf8ff")
    );
    const englishSnapshot = await get(englishQuery);
    if (englishSnapshot.exists()) {
      const data = englishSnapshot.val();
      results = results.concat(Object.keys(data).map(key => ({
        id: key,
        ...data[key]
      })));
    }
  
    const uniqueResults = Array.from(new Set(results.map(a => a.id)))
      .map(id => {
        return results.find(a => a.id === id);
      });
  
    return uniqueResults;
  };
  