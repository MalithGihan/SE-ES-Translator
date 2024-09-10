import { getApp, getApps, initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

let firebaseApp;

export const getFirebaseApp = () => {
    if (firebaseApp) {
        return firebaseApp;
    }

    const firebaseConfig = {
        apiKey: "AIzaSyDnEHAVhXE5Ptwp2N6FdMTtr4EC98zOR6c",
        authDomain: "se-translator-a7b97.firebaseapp.com",
        projectId: "se-translator-a7b97",
        storageBucket: "se-translator-a7b97.appspot.com",
        messagingSenderId: "747418139254",
        appId: "1:747418139254:web:0d9ec146a0e54faf2efd57",
        measurementId: "G-DHZXL89H4B"
    };

    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

    initializeAuth(app, {
        persistence: getReactNativePersistence(ReactNativeAsyncStorage)
    });

    firebaseApp = app;

    return app;
};
