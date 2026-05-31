// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, QueryDocumentSnapshot, DocumentData, SnapshotOptions, initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { TopicNode, StudentProfile, Reflection, SocraticSession } from "./types";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firestore with persistent cache to handle network flakes
const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
});

const auth = getAuth(app);

// Firestore Data Converters
export const studentProfileConverter = {
  toFirestore: (profile: StudentProfile): DocumentData => {
    return { ...profile };
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions): StudentProfile => {
    const data = snapshot.data(options);
    return data as StudentProfile;
  }
};

export const topicNodeConverter = {
  toFirestore: (node: TopicNode): DocumentData => {
    return { ...node };
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions): TopicNode => {
    const data = snapshot.data(options);
    return { ...data, id: snapshot.id } as TopicNode;
  }
};

export const reflectionConverter = {
  toFirestore: (reflection: Reflection): DocumentData => {
    return { ...reflection };
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Reflection => {
    const data = snapshot.data(options);
    return { ...data, id: snapshot.id } as Reflection;
  }
};

export const socraticSessionConverter = {
  toFirestore: (session: SocraticSession): DocumentData => {
    return { ...session };
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot, options: SnapshotOptions): SocraticSession => {
    const data = snapshot.data(options);
    return data as SocraticSession;
  }
};

export { app, analytics, db, auth };
