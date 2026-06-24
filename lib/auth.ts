import { auth, db } from '@/lib/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

const googleProvider = new GoogleAuthProvider();

export async function registerWithEmail(email: string, password: string, name: string) {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  await setDoc(doc(db, 'users', result.user.uid), {
    name,
    email,
    role: 'user',
    createdAt: serverTimestamp(),
  });
  return result.user;
}

export async function loginWithEmail(email: string, password: string) {
  return await signInWithEmailAndPassword(auth, email, password);
}

export async function loginWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  const userRef = doc(db, 'users', result.user.uid);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) {
    await setDoc(userRef, {
      name: result.user.displayName,
      email: result.user.email,
      role: 'user',
      createdAt: serverTimestamp(),
    });
  }
  return result.user;
}

export async function getUserRole(uid: string): Promise<string> {
  const userSnap = await getDoc(doc(db, 'users', uid));
  return userSnap.exists() ? userSnap.data().role : 'user';
}

export async function logoutUser() {
  await signOut(auth);
}