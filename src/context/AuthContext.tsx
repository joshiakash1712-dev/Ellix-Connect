import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  updatePassword,
  updateProfile,
  linkWithCredential,
  linkWithPopup,
  EmailAuthProvider,
  PhoneAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../lib/firebase';

export type ProfileRole =
  | 'super_admin'
  | 'ellix_admin'
  | 'client'
  | 'crew'
  // Legacy compatibility
  | 'retailer'
  | 'wholesaler'
  | 'admin'
  | 'employee';

export interface UserProfile {
  uid: string;
  name?: string;
  email?: string;
  emailVerified: boolean;
  phoneNumber?: string;
  phoneVerified: boolean;
  displayName?: string;
  photoURL?: string;
  role: ProfileRole;
  clientId?: string;
  assignedStoreIds?: string[];
  status?: 'active' | 'pending_approval' | 'suspended';
  linkedProviders: string[]; // e.g. ['google.com', 'password', 'phone']
  passwordSynchronized: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type AuthModalMode = 'login' | 'register' | 'phone' | 'forgot_password';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAuthModalOpen: boolean;
  authModalMode: AuthModalMode;
  isSyncHubOpen: boolean;
  openAuthModal: (mode?: AuthModalMode) => void;
  closeAuthModal: () => void;
  setIsSyncHubOpen: (open: boolean) => void;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (
    email: string,
    password: string,
    displayName: string,
    role?: ProfileRole
  ) => Promise<void>;
  setUpPhoneRecaptcha: (containerId: string) => RecaptchaVerifier;
  sendPhoneOtp: (phoneNumber: string, recaptchaVerifier: RecaptchaVerifier) => Promise<ConfirmationResult>;
  confirmPhoneOtp: (
    confirmationResult: ConfirmationResult,
    otpCode: string,
    displayName?: string,
    role?: ProfileRole
  ) => Promise<void>;
  linkGoogleAccount: () => Promise<void>;
  linkEmailAndPassword: (email: string, password: string) => Promise<void>;
  linkPhoneOtp: (confirmationResult: ConfirmationResult, otpCode: string) => Promise<void>;
  synchronizeMasterPassword: (newPassword: string) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
  loginWithDemoRole: (role: ProfileRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<AuthModalMode>('login');
  const [isSyncHubOpen, setIsSyncHubOpen] = useState<boolean>(false);

  // Sync or create user profile document in Firestore
  const syncProfileDoc = useCallback(async (
    user: FirebaseUser,
    additionalData?: Partial<UserProfile>
  ): Promise<UserProfile> => {
    const userDocRef = doc(db, 'users', user.uid);
    const linkedProviders = user.providerData.map(p => p.providerId);
    
    // Check if password provider exists or if synchronized
    const hasPassword = linkedProviders.includes('password');
    const isEmailVerified = user.emailVerified || linkedProviders.includes('google.com');
    const hasPhone = Boolean(user.phoneNumber) || linkedProviders.includes('phone');

    try {
      const snap = await getDoc(userDocRef);
      const nowIso = new Date().toISOString();

      const isAdminUser = user.email === 'joshiakash1712@gmail.com';

      if (snap.exists()) {
        const existingData = snap.data() as UserProfile;
        const mergedProviders = Array.from(new Set([...linkedProviders, ...(existingData.linkedProviders || [])]));
        
        // Preserve authoritative role already saved in Firestore; only allow dev overrides in development mode
        const authoritativeRole: ProfileRole =
          existingData.role ||
          ((import.meta as any).env?.DEV ? additionalData?.role : undefined) ||
          (isAdminUser ? 'super_admin' : 'client');

        const { role: _ignoredRole, ...safeAdditionalData } = additionalData || {};

        const updates: Partial<UserProfile> = {
          ...safeAdditionalData,
          email: user.email || existingData.email || '',
          emailVerified: isEmailVerified,
          phoneNumber: user.phoneNumber || existingData.phoneNumber || '',
          phoneVerified: hasPhone,
          displayName: user.displayName || existingData.displayName || (user.email ? user.email.split('@')[0] : 'Merchant'),
          photoURL: user.photoURL || existingData.photoURL || '',
          role: authoritativeRole,
          clientId: existingData.clientId || safeAdditionalData.clientId || 'client-001',
          assignedStoreIds: existingData.assignedStoreIds || safeAdditionalData.assignedStoreIds || ['store-1', 'store-2'],
          status: existingData.status || 'active',
          linkedProviders: mergedProviders,
          passwordSynchronized: existingData.passwordSynchronized ?? hasPassword,
          updatedAt: nowIso
        };

        await updateDoc(userDocRef, updates);
        const updatedProfile = { ...existingData, ...updates } as UserProfile;
        setUserProfile(updatedProfile);
        return updatedProfile;
      } else {
        const requestedRole = additionalData?.role;
        const initialRole: ProfileRole = isAdminUser
          ? 'super_admin'
          : ((import.meta as any).env?.DEV && requestedRole)
          ? requestedRole
          : (requestedRole && requestedRole !== 'super_admin' && requestedRole !== 'ellix_admin' && requestedRole !== 'admin')
          ? requestedRole
          : 'client';

        const { role: _ignoredRole, ...safeAdditionalData } = additionalData || {};

        const newProfile: UserProfile = {
          ...safeAdditionalData,
          uid: user.uid,
          email: user.email || '',
          emailVerified: isEmailVerified,
          phoneNumber: user.phoneNumber || '',
          phoneVerified: hasPhone,
          displayName: user.displayName || safeAdditionalData.displayName || (user.email ? user.email.split('@')[0] : 'Merchant'),
          photoURL: user.photoURL || '',
          role: initialRole,
          clientId: safeAdditionalData.clientId || 'client-001',
          assignedStoreIds: safeAdditionalData.assignedStoreIds || ['store-1', 'store-2'],
          status: 'active',
          linkedProviders: linkedProviders.length > 0 ? linkedProviders : ['anonymous'],
          passwordSynchronized: hasPassword,
          createdAt: nowIso,
          updatedAt: nowIso
        };

        await setDoc(userDocRef, newProfile);
        setUserProfile(newProfile);
        return newProfile;
      }
    } catch (error: any) {
      console.warn('[AuthContext] Firestore syncProfile notice:', error?.message || error);
      if (error?.code === 'permission-denied') {
        handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
      }
      // Fallback local representation if Firestore throws
      const fallbackProfile: UserProfile = {
        uid: user.uid,
        email: user.email || '',
        emailVerified: user.emailVerified,
        phoneNumber: user.phoneNumber || '',
        phoneVerified: Boolean(user.phoneNumber),
        displayName: user.displayName || 'Merchant',
        photoURL: user.photoURL || '',
        role: (user.email === 'joshiakash1712@gmail.com') ? 'admin' : (additionalData?.role || 'retailer'),
        linkedProviders,
        passwordSynchronized: hasPassword,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setUserProfile(fallbackProfile);
      return fallbackProfile;
    }
  }, []);

  const refreshUserProfile = useCallback(async () => {
    if (!auth.currentUser) {
      setUserProfile(null);
      return;
    }
    await syncProfileDoc(auth.currentUser);
  }, [syncProfileDoc]);

  // Listen to Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await syncProfileDoc(user);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [syncProfileDoc]);

  const openAuthModal = (mode: AuthModalMode = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  // 1. Google 1-Click Login
  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await syncProfileDoc(result.user, {
        emailVerified: true
      });
      closeAuthModal();
    } catch (error: any) {
      const code = error?.code || '';
      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        console.info('[Auth] Google Sign-In popup closed or cancelled by user.');
      } else {
        console.error('[Auth] Google Sign-In Error:', error);
      }
      throw error;
    }
  };

  // 2. Email & Password Login
  const loginWithEmail = async (email: string, pass: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email.trim(), pass);
      await syncProfileDoc(result.user, {
        passwordSynchronized: true
      });
      closeAuthModal();
    } catch (error: any) {
      console.error('[Auth] Email Login Error:', error);
      throw error;
    }
  };

  // 3. Email & Password Registration with Verification
  const registerWithEmail = async (
    email: string,
    pass: string,
    displayName: string,
    role: 'retailer' | 'wholesaler' | 'admin' | 'employee' = 'retailer'
  ) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      
      // Update display name
      await updateProfile(result.user, {
        displayName: displayName.trim()
      });

      // Send verification email
      try {
        await sendEmailVerification(result.user);
      } catch (err) {
        console.warn('[Auth] Verification email dispatch deferred:', err);
      }

      await syncProfileDoc(result.user, {
        displayName: displayName.trim(),
        role,
        passwordSynchronized: true,
        emailVerified: false
      });

      closeAuthModal();
    } catch (error: any) {
      console.error('[Auth] Email Registration Error:', error);
      throw error;
    }
  };

  // 3b. Quick Demo Account Login / Auto-Registration for Testing (Development Only)
  const loginWithDemoRole = async (role: ProfileRole) => {
    if (!(import.meta as any).env?.DEV) {
      throw new Error('Demo role login is disabled in production builds.');
    }
    let demoEmail = '';
    const demoPass = 'EllixSecure2026!';
    let demoName = '';

    if (role === 'super_admin') {
      demoEmail = 'superadmin@ellixconnect.com';
      demoName = 'Akash Joshi (Super Admin)';
    } else if (role === 'ellix_admin' || role === 'admin') {
      demoEmail = 'admin@ellixconnect.com';
      demoName = 'Siddharth Admin (Ellix Connect)';
    } else if (role === 'client' || role === 'retailer') {
      demoEmail = 'client@ellixconnect.com';
      demoName = 'Vikram Malhotra (Client Owner)';
    } else if (role === 'crew' || role === 'employee') {
      demoEmail = 'crew@ellixconnect.com';
      demoName = 'Rahul Sharma (Store Crew)';
    } else if (role === 'wholesaler') {
      demoEmail = 'wholesaler@ellixconnect.com';
      demoName = 'Metro Wholesaler (Supplier)';
    } else {
      demoEmail = 'client@ellixconnect.com';
      demoName = 'Vikram Malhotra (Client Owner)';
    }

    try {
      // 1. Try standard sign in
      const result = await signInWithEmailAndPassword(auth, demoEmail, demoPass);
      await syncProfileDoc(result.user, {
        displayName: demoName,
        role,
        emailVerified: true
      });
      closeAuthModal();
    } catch (err: any) {
      const code = err?.code || '';
      if (code === 'auth/user-not-found' || code === 'auth/invalid-credential' || code === 'auth/invalid-login-credentials') {
        try {
          // 2. If not registered in Firebase yet, auto-create this demo user account
          const regResult = await createUserWithEmailAndPassword(auth, demoEmail, demoPass);
          await updateProfile(regResult.user, { displayName: demoName });
          await syncProfileDoc(regResult.user, {
            displayName: demoName,
            role,
            emailVerified: true,
            passwordSynchronized: true
          });
          closeAuthModal();
        } catch (regErr: any) {
          if (regErr?.code === 'auth/email-already-in-use') {
            const fallbackResult = await signInWithEmailAndPassword(auth, demoEmail, demoPass);
            await syncProfileDoc(fallbackResult.user, { displayName: demoName, role });
            closeAuthModal();
          } else {
            console.error('[Auth] Demo auto-registration error:', regErr);
            throw regErr;
          }
        }
      } else {
        console.error('[Auth] Demo login error:', err);
        throw err;
      }
    }
  };

  // 4. Phone Recaptcha & OTP Verification
  const setUpPhoneRecaptcha = (containerId: string): RecaptchaVerifier => {
    const existingVerifier = (window as any).recaptchaVerifier;
    if (existingVerifier) {
      try {
        existingVerifier.clear();
      } catch {
        // ignore
      }
    }

    const verifier = new RecaptchaVerifier(auth, containerId, {
      size: 'invisible',
      callback: () => {
        // reCAPTCHA solved - will allow signInWithPhoneNumber
      },
      'expired-callback': () => {
        console.warn('[Auth] Recaptcha expired.');
      }
    });

    (window as any).recaptchaVerifier = verifier;
    return verifier;
  };

  const sendPhoneOtp = async (
    phoneNumber: string,
    recaptchaVerifier: RecaptchaVerifier
  ): Promise<ConfirmationResult> => {
    try {
      // E.164 sanitization (ensure starts with +)
      const cleanPhone = phoneNumber.trim().startsWith('+')
        ? phoneNumber.trim()
        : `+${phoneNumber.trim()}`;
      
      const confirmationResult = await signInWithPhoneNumber(auth, cleanPhone, recaptchaVerifier);
      return confirmationResult;
    } catch (error: any) {
      console.error('[Auth] Phone OTP dispatch failed:', error);
      throw error;
    }
  };

  const confirmPhoneOtp = async (
    confirmationResult: ConfirmationResult,
    otpCode: string,
    displayName?: string,
    role: 'retailer' | 'wholesaler' | 'admin' | 'employee' = 'retailer'
  ) => {
    try {
      const result = await confirmationResult.confirm(otpCode.trim());
      if (displayName) {
        await updateProfile(result.user, { displayName });
      }
      await syncProfileDoc(result.user, {
        displayName: displayName || result.user.displayName || 'Verified Phone User',
        phoneVerified: true,
        role
      });
      closeAuthModal();
    } catch (error: any) {
      console.error('[Auth] Confirm Phone OTP Error:', error);
      throw error;
    }
  };

  // 5. Account Synchronization: Link Google Account
  const linkGoogleAccount = async () => {
    if (!auth.currentUser) throw new Error('No authenticated user to link');
    try {
      const result = await linkWithPopup(auth.currentUser, googleProvider);
      await syncProfileDoc(result.user, { emailVerified: true });
    } catch (error: any) {
      const code = error?.code || '';
      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        console.info('[Auth] Link Google popup closed or cancelled by user.');
      } else {
        console.error('[Auth] Link Google Error:', error);
      }
      throw error;
    }
  };

  // 6. Account Synchronization: Link Email and Password with synchronized password
  const linkEmailAndPassword = async (email: string, pass: string) => {
    if (!auth.currentUser) throw new Error('No authenticated user to link');
    try {
      const credential = EmailAuthProvider.credential(email.trim(), pass);
      const result = await linkWithCredential(auth.currentUser, credential);
      
      // Update profile with email
      await updateProfile(result.user, {
        displayName: result.user.displayName || email.split('@')[0]
      });

      // Send email verification
      try {
        await sendEmailVerification(result.user);
      } catch (e) {
        console.warn('[Auth] Verification email dispatch note:', e);
      }

      await syncProfileDoc(result.user, {
        email: email.trim(),
        passwordSynchronized: true
      });
    } catch (error: any) {
      console.error('[Auth] Link Email & Password Error:', error);
      throw error;
    }
  };

  // 7. Account Synchronization: Link Phone with OTP
  const linkPhoneOtp = async (
    confirmationResult: ConfirmationResult,
    otpCode: string
  ) => {
    if (!auth.currentUser) throw new Error('No authenticated user to link');
    try {
      const credential = PhoneAuthProvider.credential(
        confirmationResult.verificationId,
        otpCode.trim()
      );
      const result = await linkWithCredential(auth.currentUser, credential);
      await syncProfileDoc(result.user, {
        phoneVerified: true,
        phoneNumber: result.user.phoneNumber || undefined
      });
    } catch (error: any) {
      console.error('[Auth] Link Phone Error:', error);
      throw error;
    }
  };

  // 8. Synchronize Master Password Across All Methods
  const synchronizeMasterPassword = async (newPassword: string) => {
    if (!auth.currentUser) throw new Error('No authenticated user active');
    try {
      await updatePassword(auth.currentUser, newPassword);
      await syncProfileDoc(auth.currentUser, {
        passwordSynchronized: true
      });
    } catch (error: any) {
      console.error('[Auth] Synchronize Password Error:', error);
      throw error;
    }
  };

  // 9. Email Verification Dispatch
  const resendVerificationEmail = async () => {
    if (!auth.currentUser) throw new Error('No authenticated user found');
    await sendEmailVerification(auth.currentUser);
  };

  // 10. Password Reset Dispatch
  const sendPasswordReset = async (email: string) => {
    await sendPasswordResetEmail(auth, email.trim());
  };

  // 11. Sign Out
  const logout = async () => {
    await signOut(auth);
    setUserProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        loading,
        isAuthModalOpen,
        authModalMode,
        isSyncHubOpen,
        openAuthModal,
        closeAuthModal,
        setIsSyncHubOpen,
        loginWithGoogle,
        loginWithEmail,
        registerWithEmail,
        setUpPhoneRecaptcha,
        sendPhoneOtp,
        confirmPhoneOtp,
        linkGoogleAccount,
        linkEmailAndPassword,
        linkPhoneOtp,
        synchronizeMasterPassword,
        resendVerificationEmail,
        sendPasswordReset,
        logout,
        refreshUserProfile,
        loginWithDemoRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
