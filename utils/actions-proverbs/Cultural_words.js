import { getDatabase, ref, child, push, set, update, get, remove, query, orderByChild, startAt, endAt } from 'firebase/database';
import { getFirestore, collection, doc, orderBy, onSnapshot, deleteDoc } from 'firebase/firestore';
import { getFirebaseApp } from "../firebaseHelper";

export const AddCWord = async (inputs) => {
    const nonEmptyInputs = inputs.filter(input => input.trim().length > 0);
    if (nonEmptyInputs.length > 0) {
        try {
            const app = getFirebaseApp();
            const db = getDatabase(app);
            const WordsRef = ref(db, 'todos');

            const timestamp = new Date().toISOString();
            const todoData = {
                headings: nonEmptyInputs,
                createdAt: timestamp,
            };

            const newWordsRef = push(WordsRef);

            await set(newWordsRef, {
                ...todoData,
                id: newWordsRef.key,
            });

            console.log('Word added successfully:', todoData);

            // Return the new word data to be used in navigation or any other logic
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

export const UpdateCword = async (id, headings) => {
    if (headings.length > 0) {
        try {
            const app = getFirebaseApp();
            const db = getFirestore(app);
            const docRef = doc(db, 'todos', id);

            await update(docRef, { headings });

            console.log('Word updated successfully:', headings);
            // Navigate after successful update
            navigation.navigate("EditWord");
        } catch (error) {
            console.error('Error updating Word:', error);
            throw new Error('Error updating Word: ' + error.message);
        }
    } else {
        alert('At least one heading is required');
    }
};

export const fetchTodos = (setTodos, setFilteredTodos, setLoading, setError) => {
    try {
        const app = getFirebaseApp();
        const db = getFirestore(app);
        const todoRef = collection(db, 'todos');

        return onSnapshot(
            query(todoRef, orderBy('createdAt', 'desc')),
            (querySnapshot) => {
                const todos = [];
                querySnapshot.forEach(doc => {
                    const data = doc.data();
                    if (data && Array.isArray(data.headings)) {
                        todos.push({
                            id: doc.id,
                            headings: data.headings,
                        });
                    } else {
                        console.warn('Document', doc.id, 'has unexpected structure:', data);
                    }
                });
                setTodos(todos);
                setFilteredTodos(todos);
                setLoading(false);
                console.log('Todos loaded:', todos.length);
            },
            (err) => {
                console.error("Firebase query error:", err);
                setError(err.message);
                setLoading(false);
            }
        );
    } catch (error) {
        console.error('Error fetching todos:', error);
        setError(error.message);
        setLoading(false);
    }
};

export const deleteTodo = async (todo, setTodos, setFilteredTodos) => {
    try {
        const app = getFirebaseApp();
        const db = getFirestore(app);
        const todoDocRef = doc(db, 'todos', todo.id);

        await deleteDoc(todoDocRef);

        alert("Deleted Successfully");
        setTodos(prevTodos => prevTodos.filter(t => t.id !== todo.id));
        setFilteredTodos(prevFiltered => prevFiltered.filter(t => t.id !== todo.id));

    } catch (error) {
        console.error('Error deleting todo:', error);
        alert("Error deleting todo: " + error.message);
    }
};
