import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { User, FoodEntry, ActivityEntry, ProfileFormData } from "@/types";

// Collection references
const usersCollection = collection(db, "users");
const foodLogsCollection = collection(db, "foodLogs");
const activityLogsCollection = collection(db, "activityLogs");

// Helper to convert Firestore timestamp to ISO string
function timestampToISO(timestamp: Timestamp | null): string {
  if (!timestamp) return new Date().toISOString();
  return timestamp.toDate().toISOString();
}

// Get user by UID
export async function getUser(uid: string): Promise<User | null> {
  try {
    const userDoc = await getDoc(doc(usersCollection, uid));
    if (userDoc.exists()) {
      const data = userDoc.data();
      return {
        uid: data.uid,
        username: data.username,
        email: data.email,
        age: data.age,
        weight: data.weight,
        height: data.height ?? null,
        goal: data.goal,
        dailyCalorieIntake: data.dailyCalorieIntake,
        dailyCalorieBurn: data.dailyCalorieBurn,
        createdAt: timestampToISO(data.createdAt),
      } as User;
    }
    return null;
  } catch (error) {
    console.error("Error getting user:", error);
    throw error;
  }
}

// Create or update user
export async function updateUser(
  uid: string,
  data: Partial<User>
): Promise<void> {
  try {
    await setDoc(
      doc(usersCollection, uid),
      {
        ...data,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

// Create user profile after signup
export async function createUserProfile(
  uid: string,
  username: string,
  email: string
): Promise<void> {
  try {
    await setDoc(doc(usersCollection, uid), {
      uid,
      username,
      email,
      age: 0,
      weight: 0,
      height: null,
      goal: "maintain",
      dailyCalorieIntake: 2000,
      dailyCalorieBurn: 400,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error creating user profile:", error);
    throw error;
  }
}

// Add food log entry
export async function addFoodLog(
  uid: string,
  data: { name: string; calories: number; mealType: string }
): Promise<FoodEntry> {
  try {
    const docRef = await addDoc(foodLogsCollection, {
      uid,
      name: data.name,
      calories: data.calories,
      mealType: data.mealType,
      createdAt: serverTimestamp(),
    });

    return {
      id: docRef.id,
      uid,
      name: data.name,
      calories: data.calories,
      mealType: data.mealType as "breakfast" | "lunch" | "dinner" | "snack",
      createdAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error adding food log:", error);
    throw error;
  }
}

// Get food logs for user
export async function getFoodLogs(uid: string): Promise<FoodEntry[]> {
  try {
    const q = query(
      foodLogsCollection,
      where("uid", "==", uid),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        uid: data.uid,
        name: data.name,
        calories: data.calories,
        mealType: data.mealType,
        createdAt: timestampToISO(data.createdAt),
      } as FoodEntry;
    });
  } catch (error) {
    console.error("Error getting food logs:", error);
    throw error;
  }
}

// Delete food log
export async function deleteFoodLog(id: string): Promise<void> {
  try {
    await deleteDoc(doc(foodLogsCollection, id));
  } catch (error) {
    console.error("Error deleting food log:", error);
    throw error;
  }
}

// Add activity log entry
export async function addActivityLog(
  uid: string,
  data: { name: string; duration: number; calories: number }
): Promise<ActivityEntry> {
  try {
    const docRef = await addDoc(activityLogsCollection, {
      uid,
      name: data.name,
      duration: data.duration,
      calories: data.calories,
      createdAt: serverTimestamp(),
    });

    return {
      id: docRef.id,
      uid,
      name: data.name,
      duration: data.duration,
      calories: data.calories,
      createdAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error adding activity log:", error);
    throw error;
  }
}

// Get activity logs for user
export async function getActivityLogs(uid: string): Promise<ActivityEntry[]> {
  try {
    const q = query(
      activityLogsCollection,
      where("uid", "==", uid),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        uid: data.uid,
        name: data.name,
        duration: data.duration,
        calories: data.calories,
        createdAt: timestampToISO(data.createdAt),
      } as ActivityEntry;
    });
  } catch (error) {
    console.error("Error getting activity logs:", error);
    throw error;
  }
}

// Delete activity log
export async function deleteActivityLog(id: string): Promise<void> {
  try {
    await deleteDoc(doc(activityLogsCollection, id));
  } catch (error) {
    console.error("Error deleting activity log:", error);
    throw error;
  }
}

// Update user profile with onboarding data
export async function completeOnboarding(
  uid: string,
  data: ProfileFormData
): Promise<void> {
  try {
    await setDoc(
      doc(usersCollection, uid),
      {
        ...data,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error("Error completing onboarding:", error);
    throw error;
  }
}
