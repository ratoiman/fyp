import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth, db } from "../utils/firebase";
import { addDoc, collection, doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";

const userAuthContext = createContext();


export function UserAuthContextProvider({ children }) {
  const [user, setUser] = useState({});

  function logIn(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function signUp(email, password) {
    return createUserWithEmailAndPassword(auth, email, password).then(
      async (userCredential) => {
        console.log("UID: ", userCredential.user.uid);
        const stateRef = doc(
          db,
          "users",
          userCredential.user.uid,
          "user_profile",
          "user_states"
        );
        await setDoc(stateRef, {
          userSetUp: false,
        });

        // await setDoc(doc(db, "usernames", username), {});
      }
    );

    // addDoc(collection(db, "users"), { email: email, username: username})
  }
  function logOut() {
    return signOut(auth);
  }
  const navigate = useNavigate();

  function googleSignIn() {
    const googleAuthProvider = new GoogleAuthProvider();
    return signInWithPopup(auth, googleAuthProvider).then(
      async (userCredential) => {
        console.log("UID: ", userCredential.user.uid);
        const userRef = doc(db, "users", userCredential.user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.data() === undefined) {
          const stateRef = doc(
            db,
            "users",
            userCredential.user.uid,
            "user_profile",
            "user_states"
          );
          await setDoc(stateRef, {
            userSetUp: false,
          });
          console.log("after setDoc");
          navigate("userdetails");

          console.log("after navigate");
        } else {
          console.log("User Doc", userDoc.data());
        }
      }
    );
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentuser) => {
      setUser(currentuser);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <userAuthContext.Provider
      value={{ user, logIn, signUp, logOut, googleSignIn }}
    >
      {children}
    </userAuthContext.Provider>
  );
}

export function useUserAuth() {
  return useContext(userAuthContext);
}
