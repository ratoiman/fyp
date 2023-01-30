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
import { addDoc, collection, doc, setDoc } from "firebase/firestore";

const userAuthContext = createContext();
// const users = collection(db, "users");
// const usernameList = collection(db,"usernames")

const setUserEmail = async (userCredential) => {

}

export function UserAuthContextProvider({ children }) {
  const [user, setUser] = useState({});

  function logIn(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function signUp(email, password) {
    return createUserWithEmailAndPassword(auth, email, password).then(
      async (userCredential) => {
        console.log("UID: ", userCredential.user.uid);
        const detailsRef = doc(
          db,
          "users",
          userCredential.user.uid,
          "user_profile",
          "user_details"
        );
        const stateRef = doc(
          db,
          "users",
          userCredential.user.uid,
          "user_profile",
          "user_states"
        );
        await setDoc(detailsRef, {
          email: email,
        });

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
  function googleSignIn() {
    const googleAuthProvider = new GoogleAuthProvider();
    return signInWithPopup(auth, googleAuthProvider);
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
