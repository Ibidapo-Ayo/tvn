"use client";
import { db } from "@/lib/firebase";

import { collection, getDocs } from "firebase/firestore";
import { User } from "@/types/types";

export function useMembers() {
  const getAllMembers = async (): Promise<User[]> => {
    try {
      const membersRef = collection(db, "members");
      const querySnapshot = await getDocs(membersRef);
      const members: User[] = [];
      querySnapshot.forEach((doc) => {
        members.push({ id: doc.id, ...doc.data() } as User);
      });
      return members;
    } catch (error: any) {
      console.error("Failed to fetch members:", error.message);
      throw error;
    }
  };

  return { getAllMembers };
}
