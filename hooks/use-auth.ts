"use client";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { CreateMemberData } from "@/types/types";

export function useAuth() {
  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("User credential:", userCredential);
      const uid = userCredential.user.uid;

      const docRef = doc(db, "leaders", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        const idToken = await userCredential.user.getIdToken();
        document.cookie = `authToken=${idToken}; path=/; max-age=${
          60 * 60 * 24 * 7
        }; SameSite=Lax`;
        localStorage.setItem("user", JSON.stringify({ ...userData, uid }));

        return userData;
      } else {
        console.error("No user document found in Firestore for this user");
        return null;
      }
    } catch (error: any) {
      console.error("Login failed:", error.message);
      throw error;
    }
  };

  const register = async (
    email: string,
    password: string,
    userData: {
      name: string;
      role?: "admin" | "pastor" | "leader" | "member";
      phone?: string;
      [key: string]: any;
    }
  ) => {
    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const uid = userCredential.user.uid;

      // Create user document in Firestore
      const userDoc = {
        ...userData,
        email,
        role: userData.role || "member",
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(db, "leaders", uid), userDoc);
      console.log("User registered successfully:", userDoc);

      // Get the Firebase ID token
      const idToken = await userCredential.user.getIdToken();

      // Store token in cookies (expires in 7 days)
      document.cookie = `authToken=${idToken}; path=/; max-age=${
        60 * 60 * 24 * 7
      }; SameSite=Lax`;

      // Store user data in localStorage
      localStorage.setItem("user", JSON.stringify({ ...userDoc, uid }));

      return userDoc;
    } catch (error: any) {
      console.error("Registration failed:", error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Sign out from Firebase
      await auth.signOut();

      // Clear the auth token cookie
      document.cookie = "authToken=; path=/; max-age=0";

      // Clear localStorage
      localStorage.removeItem("user");

      console.log("User logged out successfully");

      // Redirect to login page
      window.location.href = "/";
    } catch (error: any) {
      console.error("Logout failed:", error.message);
      throw error;
    }
  };

  const createMember = async (memberData: CreateMemberData) => {
    try {
      // Generate a unique member ID
      const memberId = `TVN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      // Prepare the member document with all fields from the schema
      const memberDoc = {
        // Personal Information
        name: memberData.name || "",
        email: memberData.email || "",
        dob: memberData.dob || "",
        birthday: memberData.birthday || memberData.dob || "",
        gender: memberData.gender || "",
        nationality: memberData.nationality || "",
        nin: memberData.nin || "",
        
        // Family Information
        family_size: memberData.family_size || "",
        family_position: memberData.family_position || "",
        
        // Education Information
        education_level: memberData.education_level || "",
        school: memberData.school || "",
        university: memberData.university || "",
        
        // Location Information
        state_of_origin: memberData.state_of_origin || "",
        lga_of_origin: memberData.lga_of_origin || "",
        state_of_residence: memberData.state_of_residence || "",
        lga_of_residence: memberData.lga_of_residence || "",
        city_of_residence: memberData.city_of_residence || "",
        address: memberData.address || "",
        
        // Church Information
        community: memberData.community || "",
        department: memberData.department || "",
        category: memberData.category || "",
        
        // Contact Information
        phone_number: memberData.phone_number || "",
        phone_contact: memberData.phone_contact || memberData.phone_number || "",
        guardian_contact: memberData.guardian_contact || "",
        
        // Next of Kin
        next_of_kin: memberData.next_of_kin || "",
        
        // Attachments & Security
        picture_url: memberData.picture_url || "",
        fingerprint_data: memberData.fingerprint_data || "",
        
        // Account Details
        account_details: memberData.account_details || "",
        
        // Role
        role: memberData.role || "member",
        
        // Metadata
        createdAt: new Date().toISOString(),
      };

      // Save to Firestore "members" collection
      await setDoc(doc(db, "members", memberId), memberDoc);
      
      console.log("Member created successfully:", { id: memberId, ...memberDoc });
      
      return { id: memberId, ...memberDoc };
    } catch (error: any) {
      console.error("Member creation failed:", error.message);
      throw error;
    }
  };

  return {
    login,
    register,
    logout,
    createMember,
  };
}
