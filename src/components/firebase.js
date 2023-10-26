// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyARlGPptVjYdSM_HCzqQBYYzAVDUGJgMMw",
  authDomain: "react-weather-web-application.firebaseapp.com",
  projectId: "react-weather-web-application",
  storageBucket: "react-weather-web-application.appspot.com",
  messagingSenderId: "413911197062",
  appId: "1:413911197062:web:112c6462bf4f7801943807",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export { auth };

// Create a function to get the user auth state
export function useFirebaseAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        // User is signed in.
        setUser(authUser);
      } else {
        // User is signed out.
        setUser(null);
      }
    });

    // Unsubscribe when the component unmounts.
    return () => unsubscribe();
  }, []);

  return user;
}
