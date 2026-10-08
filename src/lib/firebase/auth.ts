/**
 * DocuMind AI - Authentication Services
 * Supports Firebase Auth with Google, Email/Password, and Instant Demo Login
 */

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  User,
} from 'firebase/auth';
import { auth, isLiveFirebaseConfigured } from './config';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: 'user' | 'admin';
}

export const DEMO_USER: AuthUser = {
  uid: 'demo_user',
  email: 'priyan@documind.cloud',
  displayName: 'Priyan',
  photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&auto=format&fit=crop&q=80',
  role: 'user',
};

export const DEMO_ADMIN: AuthUser = {
  uid: 'demo_admin',
  email: 'admin@documind-admin.internal',
  displayName: 'Admin Priyan',
  photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=128&auto=format&fit=crop&q=80',
  role: 'admin',
};

export async function loginWithEmail(email: string, pass: string): Promise<AuthUser> {
  if (isLiveFirebaseConfigured && auth) {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    return mapFirebaseUser(cred.user);
  }
  // Offline/Demo authentication
  if (email.includes('admin')) {
    return DEMO_ADMIN;
  }
  return {
    ...DEMO_USER,
    email,
    displayName: email.split('@')[0],
  };
}

export async function registerWithEmail(email: string, pass: string, name: string): Promise<AuthUser> {
  if (isLiveFirebaseConfigured && auth) {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    return {
      ...mapFirebaseUser(cred.user),
      displayName: name,
    };
  }
  return {
    uid: `user_${Date.now()}`,
    email,
    displayName: name || email.split('@')[0],
    photoURL: null,
    role: 'user',
  };
}

export async function loginWithGoogle(): Promise<AuthUser> {
  if (isLiveFirebaseConfigured && auth) {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    return mapFirebaseUser(cred.user);
  }
  return DEMO_USER;
}

export async function logoutUser(): Promise<void> {
  if (isLiveFirebaseConfigured && auth) {
    await firebaseSignOut(auth);
  }
  if (typeof window !== 'undefined') {
    localStorage.removeItem('documind_auth_user');
  }
}

export async function resetUserPassword(email: string): Promise<void> {
  if (isLiveFirebaseConfigured && auth) {
    await sendPasswordResetEmail(auth, email);
  }
}

export function mapFirebaseUser(user: User): AuthUser {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || user.email?.split('@')[0] || 'User',
    photoURL: user.photoURL,
    role: user.email?.includes('admin') ? 'admin' : 'user',
  };
}
