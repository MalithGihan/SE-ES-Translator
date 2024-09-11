import { getDatabase, ref, push, set, update } from 'firebase/database';
import { getFirebaseApp } from "../firebaseHelper";

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
            navigation.navigate("AddWord");
        }
    } catch (error) {
        console.error('Error updating Word:', error);
        throw new Error('Error updating Word: ' + error.message);
    }
};
