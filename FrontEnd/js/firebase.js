
// Initialize Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js';
import { getDatabase, ref,set, push, onValue } from 'https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js';
const firebaseConfig = {
    apiKey: "AIzaSyDl4F6oua0Z68vaUkD8LcRzmB7Ykyyrwc4",
    authDomain: "justride-daefc.firebaseapp.com",
    databaseURL: "https://justride-daefc-default-rtdb.firebaseio.com", // Add this line
    projectId: "justride-daefc",
    storageBucket: "justride-daefc.firebasestorage.app",
    messagingSenderId: "325383515601",
    appId: "1:325383515601:web:b5fce67bbdd161f85844f0"
};

// Initialize Firebase App and Database
export const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);


// Export functions to use in other JS files
export { ref, set, push, onValue };