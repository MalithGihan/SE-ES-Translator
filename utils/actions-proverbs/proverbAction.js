import { getDatabase, ref, child, push, set, update, get, remove , query, orderByChild, startAt, endAt } from 'firebase/database';
import { getFirebaseApp } from "../firebaseHelper";

export const addProverb = async (sinhaleseProverb,singlishMeaning, englishTranslation) => {
  try {
    const app = getFirebaseApp();

    const proverbData = {
      sinhaleseProverb,
      singlishMeaning,
      englishTranslation,
      addedDate: new Date().toISOString(),
    };

    const dbRef = ref(getDatabase(app));
    const proverbsRef = child(dbRef, 'proverbs');

    const newProverbRef = push(proverbsRef);

    await set(newProverbRef, {
      ...proverbData,
      id: newProverbRef.key, 
    });

    console.log('Proverb added successfully:', proverbData);
    return { ...proverbData, id: newProverbRef.key };
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

export const updateProverb = async (id, sinhaleseProverb,singlishMeaning, englishTranslation) => {
  try {
    const app = getFirebaseApp();

    const dbRef = ref(getDatabase(app));
    const proverbRef = child(dbRef, `proverbs/${id}`);

    await update(proverbRef, {
      sinhaleseProverb,
      singlishMeaning,
      englishTranslation,
      updatedDate: new Date().toISOString(),
    });

    console.log('Proverb updated successfully:', { id, sinhaleseProverb,singlishMeaning, englishTranslation });
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
  
    // Create an array to store results from different queries
    let results = [];
  
    // Query by Sinhalese Proverb
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
  
    // Query by Singlish Meaning
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
  
    // Query by English Translation
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
  
    // Remove duplicate results based on 'id'
    const uniqueResults = Array.from(new Set(results.map(a => a.id)))
      .map(id => {
        return results.find(a => a.id === id);
      });
  
    return uniqueResults;
  };
  