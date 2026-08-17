import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { auth } from './config';
import { AuthUser } from '../types';

const googleProvider = new GoogleAuthProvider();

export async function loginWithEmail(email: string, password: string): Promise<AuthUser> {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return formatAuthUser(result.user);
}

export async function loginWithGoogle(): Promise<AuthUser> {
  const result = await signInWithPopup(auth, googleProvider);
  return formatAuthUser(result.user);
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

export async function sendResetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

export function onAuthChanged(callback: (user: AuthUser | null) => void): () => void {
  return onAuthStateChanged(auth, (firebaseUser: User | null) => {
    if (firebaseUser) {
      callback(formatAuthUser(firebaseUser));
    } else {
      callback(null);
    }
  });
}

function formatAuthUser(user: User): AuthUser {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || user.email?.split('@')[0] || 'Admin',
    photoURL: user.photoURL,
  };
}
