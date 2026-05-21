import { doc, setDoc, getDoc, increment } from 'firebase/firestore';
import { db } from './firebase';

export const trackPageView = async () => {
    try {
        await setDoc(doc(db, 'page_views', 'total'), { count: increment(1) }, { merge: true });
    } catch {
        // fire-and-forget: never block the user
    }
};

export const getPageViewCount = async (): Promise<number> => {
    try {
        const snap = await getDoc(doc(db, 'page_views', 'total'));
        return snap.exists() ? (snap.data().count ?? 0) : 0;
    } catch {
        return 0;
    }
};
