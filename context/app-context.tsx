"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from "react";
import {
  onIdTokenChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  type User as FirebaseAuthUser,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  getUser,
  createUserProfile,
  updateUser,
  addFoodLog,
  getFoodLogs,
  deleteFoodLog,
  addActivityLog,
  getActivityLogs,
  deleteActivityLog,
} from "@/lib/firestore";
import {
  User,
  FoodEntry,
  ActivityEntry,
  Credentials,
  ProfileFormData,
} from "@/types";
import toast from "react-hot-toast";

function isProfileComplete(user: User | null): boolean {
  if (!user) return false;

  return Boolean(
    user.onboardingCompleted ||
      (user.age && user.age > 0 && user.weight && user.weight > 0 && user.goal)
  );
}

function getFallbackUsername(firebaseUser: FirebaseAuthUser) {
  return (
    firebaseUser.displayName?.trim() ||
    firebaseUser.email?.split("@")[0] ||
    "PulseFit User"
  );
}

interface AppContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  isUserFetched: boolean;
  onboardingCompleted: boolean;
  setOnboardingCompleted: Dispatch<SetStateAction<boolean>>;
  allFoodLogs: FoodEntry[];
  setAllFoodLogs: Dispatch<SetStateAction<FoodEntry[]>>;
  allActivityLogs: ActivityEntry[];
  setAllActivityLogs: Dispatch<SetStateAction<ActivityEntry[]>>;
  login: (credentials: Credentials) => Promise<void>;
  signup: (credentials: Credentials) => Promise<void>;
  logout: () => Promise<void>;
  fetchUser: (uid: string) => Promise<void>;
  fetchFoodLogs: (uid: string) => Promise<void>;
  fetchActivityLogs: (uid: string) => Promise<void>;
  addFoodEntry: (data: {
    name: string;
    calories: number;
    mealType: string;
  }) => Promise<FoodEntry | null>;
  removeFoodEntry: (id: string) => Promise<void>;
  addActivityEntry: (data: {
    name: string;
    duration: number;
    calories: number;
  }) => Promise<ActivityEntry | null>;
  removeActivityEntry: (id: string) => Promise<void>;
  updateUserProfile: (data: ProfileFormData) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isUserFetched, setIsUserFetched] = useState(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const [allFoodLogs, setAllFoodLogs] = useState<FoodEntry[]>([]);
  const [allActivityLogs, setAllActivityLogs] = useState<ActivityEntry[]>([]);

  const syncServerSession = async (idToken: string) => {
    const response = await fetch("/api/auth/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idToken }),
    });

    if (!response.ok) {
      throw new Error("Failed to sync auth session");
    }
  };

  const clearServerSession = async () => {
    try {
      await fetch("/api/auth/session", {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Failed to clear auth session:", error);
    }
  };

  const fetchUser = async (uid: string) => {
    try {
      const userData = await getUser(uid);
      setUser(userData);
      setOnboardingCompleted(isProfileComplete(userData));
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const fetchFoodLogs = async (uid: string) => {
    try {
      const logs = await getFoodLogs(uid);
      setAllFoodLogs(logs);
    } catch (error) {
      console.error("Error fetching food logs:", error);
    }
  };

  const fetchActivityLogs = async (uid: string) => {
    try {
      const logs = await getActivityLogs(uid);
      setAllActivityLogs(logs);
    } catch (error) {
      console.error("Error fetching activity logs:", error);
    }
  };

  const ensureUserProfile = async (
    firebaseUser: FirebaseAuthUser,
    preferredUsername?: string
  ): Promise<User | null> => {
    let userData = await getUser(firebaseUser.uid);

    if (userData) {
      return userData;
    }

    await createUserProfile(
      firebaseUser.uid,
      preferredUsername?.trim() || getFallbackUsername(firebaseUser),
      firebaseUser.email || ""
    );

    userData = await getUser(firebaseUser.uid);
    return userData;
  };

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        await clearServerSession();
        setUser(null);
        setOnboardingCompleted(false);
        setAllFoodLogs([]);
        setAllActivityLogs([]);
        setIsUserFetched(true);
        return;
      }

      try {
        const idToken = await firebaseUser.getIdToken();
        await syncServerSession(idToken);

        const userData = await ensureUserProfile(firebaseUser);
        setUser(userData);
        setOnboardingCompleted(isProfileComplete(userData));

        await Promise.all([
          fetchFoodLogs(firebaseUser.uid),
          fetchActivityLogs(firebaseUser.uid),
        ]);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("We couldn't restore your session cleanly. Please try again.");
      } finally {
        setIsUserFetched(true);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (credentials: Credentials) => {
    try {
      await signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );
      toast.success("Welcome back!");
    } catch (error: any) {
      console.error("Login error:", error);
      const errorMessage =
        error.code === "auth/invalid-credential"
          ? "Invalid email or password"
          : error.code === "auth/user-not-found"
          ? "User not found"
          : "Login failed. Please try again.";
      toast.error(errorMessage);
      throw error;
    }
  };

  const signup = async (credentials: Credentials) => {
    try {
      const { user: firebaseUser } = await createUserWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );

      await ensureUserProfile(firebaseUser, credentials.username);
      await fetchUser(firebaseUser.uid);

      toast.success("Account created successfully!");
    } catch (error: any) {
      console.error("Signup error:", error);
      const errorMessage =
        error.code === "auth/email-already-in-use"
          ? "Email already in use"
          : error.code === "auth/weak-password"
          ? "Password should be at least 6 characters"
          : "Signup failed. Please try again.";
      toast.error(errorMessage);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await Promise.all([clearServerSession(), signOut(auth)]);
      setUser(null);
      setOnboardingCompleted(false);
      setAllFoodLogs([]);
      setAllActivityLogs([]);
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  const addFoodEntry = async (data: {
    name: string;
    calories: number;
    mealType: string;
  }): Promise<FoodEntry | null> => {
    if (!user) return null;

    try {
      const newEntry = await addFoodLog(user.uid, data);
      setAllFoodLogs((prev) => [newEntry, ...prev]);
      toast.success("Food entry added!");
      return newEntry;
    } catch (error) {
      console.error("Error adding food entry:", error);
      toast.error("Failed to add food entry");
      return null;
    }
  };

  const removeFoodEntry = async (id: string) => {
    try {
      await deleteFoodLog(id);
      setAllFoodLogs((prev) => prev.filter((entry) => entry.id !== id));
      toast.success("Entry deleted");
    } catch (error) {
      console.error("Error deleting food entry:", error);
      toast.error("Failed to delete entry");
    }
  };

  const addActivityEntry = async (data: {
    name: string;
    duration: number;
    calories: number;
  }): Promise<ActivityEntry | null> => {
    if (!user) return null;

    try {
      const newEntry = await addActivityLog(user.uid, data);
      setAllActivityLogs((prev) => [newEntry, ...prev]);
      toast.success("Activity logged!");
      return newEntry;
    } catch (error) {
      console.error("Error adding activity entry:", error);
      toast.error("Failed to add activity");
      return null;
    }
  };

  const removeActivityEntry = async (id: string) => {
    try {
      await deleteActivityLog(id);
      setAllActivityLogs((prev) => prev.filter((entry) => entry.id !== id));
      toast.success("Activity deleted");
    } catch (error) {
      console.error("Error deleting activity entry:", error);
      toast.error("Failed to delete activity");
    }
  };

  const updateUserProfile = async (data: ProfileFormData) => {
    if (!user) return;

    try {
      await updateUser(user.uid, {
        ...data,
        onboardingCompleted: true,
      });
      const updatedUser = await getUser(user.uid);
      if (updatedUser) {
        setUser(updatedUser);
        setOnboardingCompleted(isProfileComplete(updatedUser));
      }
      toast.success("Profile updated!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        isUserFetched,
        onboardingCompleted,
        setOnboardingCompleted,
        allFoodLogs,
        setAllFoodLogs,
        allActivityLogs,
        setAllActivityLogs,
        login,
        signup,
        logout,
        fetchUser,
        fetchFoodLogs,
        fetchActivityLogs,
        addFoodEntry,
        removeFoodEntry,
        addActivityEntry,
        removeActivityEntry,
        updateUserProfile,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext(): AppContextType {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
