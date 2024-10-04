import { getDatabase, ref, push, set, update, get , remove  } from 'firebase/database';
import { getFirebaseApp } from "../firebaseHelper";
import { Alert } from 'react-native';

export const AddCWord = async (inputs) => {
    const nonEmptyInputs = inputs.filter(input => input.trim().length > 0);
    if (nonEmptyInputs.length > 0) {
        try {
            const app = getFirebaseApp();
            const db = getDatabase(app);
            const WordsRef = ref(db, 'Culturalwords');

            const timestamp = new Date().toISOString();
            const Cwords = {
                headings: nonEmptyInputs,
                createdAt: timestamp,
            };

            const newWordsRef = push(WordsRef);

            await set(newWordsRef, {
                ...Cwords,
                id: newWordsRef.key,
            });

            console.log('Word added successfully:', Cwords);

            return {
                id: newWordsRef.key,
                headings: nonEmptyInputs,
            };

        } catch (error) {
            console.error('Error adding Word:', error);
            throw new Error('Error adding Word: ' + error.message);
        }
    } else {
        throw new Error('Please enter at least one non-empty input.');
    }
};

export const UpdateCword = async (id, headings, navigation) => {
    console.log('ID:', id);
    console.log('Headings:', headings);

    if (!id) {
        throw new Error('ID is required for updating a word');
    }

    if (!Array.isArray(headings)) {
        throw new Error('Headings must be an array');
    }

    const nonEmptyHeadings = headings.filter(heading => heading && heading.trim().length > 0);

    if (nonEmptyHeadings.length === 0) {
        throw new Error('At least one non-empty heading is required');
    }

    try {
        const app = getFirebaseApp();
        const db = getDatabase(app);
        const wordRef = ref(db, `Culturalwords/${id}`);

        await update(wordRef, { headings: nonEmptyHeadings });

        console.log('Word updated successfully:', nonEmptyHeadings);
        if (navigation && typeof navigation.navigate === 'function') {
            navigation.navigate("Edit_words");
        }
    } catch (error) {
        console.error('Error updating Word:', error);
        throw new Error('Error updating Word: ' + error.message);
    }
};

export const RetrieveAllCWords = async () => {
    try {
        const app = getFirebaseApp();
        const db = getDatabase(app);
        const wordsRef = ref(db, 'Culturalwords');

        const snapshot = await get(wordsRef);

        if (!snapshot.exists()) {
            throw new Error('No cultural words found in the database');
        }

        const data = snapshot.val();
        console.log('All words retrieved successfully:', data);

        return data;

    } catch (error) {
        console.error('Error retrieving all words:', error);
        throw new Error('Error retrieving all words: ' + error.message);
    }
};
export const DeleteCword = async (id) => {
    try {
        const app = getFirebaseApp();
        const db = getDatabase(app);
        const wordRef = ref(db, `Culturalwords/${id}`);

        await remove(wordRef);

        console.log('Word deleted successfully');
    } catch (error) {
        console.error('Error deleting word:', error);
        throw new Error('Error deleting word: ' + error.message);
    }
};

export const saveTranslation = async (userId, enteredtext, translatedtext, fromLang, toLang) => {
    try {
      const app = getFirebaseApp();
      const db = getDatabase(app); 
  
      const translationsRef = ref(db, `user/${userId}/translations`); 
      const newTranslation = {
        enteredtext,
        translatedtext,
        fromLang,
        toLang,
        timestamp: new Date().toISOString(), 
      };
      await push(translationsRef, newTranslation); 
      Alert.alert("Saved", "Translation saved to the database."); 
    } catch (error) {
      console.error("Error saving translation:", error); 
      Alert.alert("Error", "Failed to save translation. Please try again."); 
    }
  };
  