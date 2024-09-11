import { getDatabase, ref, child, push, set, update, get, remove , query, orderByChild, startAt, endAt } from 'firebase/database';
import { getFirebaseApp } from "../firebaseHelper";


export const AddCWord = async (inputs) => {
    const nonEmptyInputs = inputs.filter(input => input.trim().length > 0);
    if (nonEmptyInputs.length > 0) {
        try {
            const app = getFirebaseApp();
            const dbRef = ref(getDatabase(app));
            const todosRef = child(dbRef, 'todos');

            const timestamp = new Date().toISOString();
            const todoData = {
                headings: nonEmptyInputs,
                createdAt: timestamp,
            };

            const newTodoRef = push(todosRef);

            await set(newTodoRef, {
                ...todoData,
                id: newTodoRef.key,
            });

            console.log('Todo added successfully:', todoData);

            // Return the newTodo to be used in navigation or any other logic
            return {
                id: newTodoRef.key,
                headings: nonEmptyInputs,
            };

        } catch (error) {
            console.error('Error adding todo:', error);
            throw new Error('Error adding todo: ' + error.message);
        }
    } else {
        throw new Error('Please enter at least one non-empty input.');
    }
};
