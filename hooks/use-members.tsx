"use client";
import { db } from "@/lib/firebase";
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  query,
  orderBy
} from "firebase/firestore";
import { Member } from "@/types/types";

const processMemberData = (data: any): Member => {
  let dobString = "";
  if (data.dob && typeof data.dob === 'object' && 'seconds' in data.dob) {
    const date = new Date(data.dob.seconds * 1000);
    dobString = date.toISOString();
  } else if (typeof data.dob === 'string') {
    dobString = data.dob;
  }

  let createdAtString = data.createdAt;
  if (data.createdAt && typeof data.createdAt === 'object' && 'seconds' in data.createdAt) {
    createdAtString = new Date(data.createdAt.seconds * 1000).toISOString();
  }

  return {
    ...data,
    dob: dobString,
    createdAt: createdAtString,
  } as Member;
};

export function useMembers() {
  const getAllMembers = async (): Promise<Member[]> => {
    try {
      const membersRef = collection(db, "members");
      const querySnapshot = await getDocs(membersRef);
      const members: Member[] = [];
      querySnapshot.forEach((doc) => {
        const memberData = processMemberData({ id: doc.id, ...doc.data() });
        members.push(memberData);
      });
      return members;
    } catch (error: any) {
      throw error;
    }
  };

  const getRecentMembers = async (limit: number = 10): Promise<Member[]> => {
    try {
      const membersRef = collection(db, "members");
      const q = query(membersRef, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const members: Member[] = [];
      let count = 0;
      querySnapshot.forEach((doc) => {
        if (count < limit) {
          const memberData = processMemberData({ id: doc.id, ...doc.data() });
          members.push(memberData);
          count++;
        }
      });
      return members;
    } catch (error: any) {
      throw error;
    }
  };

  const createMember = async (memberData: Omit<Member, "id">): Promise<Member> => {
    try {
      const memberDoc = {
        ...memberData,
        createdAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, "members"), memberDoc);
      return processMemberData({ id: docRef.id, ...memberDoc });
    } catch (error: any) {
      throw error;
    }
  };

  const updateMember = async (memberId: string, memberData: Partial<Member>): Promise<void> => {
    try {
      const memberRef = doc(db, "members", memberId);
      await updateDoc(memberRef, {
        ...memberData,
        updatedAt: new Date().toISOString(),
      });
    } catch (error: any) {
      throw error;
    }
  };

  const deleteMember = async (memberId: string): Promise<void> => {
    try {
      const memberRef = doc(db, "members", memberId);
      await deleteDoc(memberRef);
    } catch (error: any) {
      throw error;
    }
  };

  return { 
    getAllMembers, 
    getRecentMembers,
    createMember,
    updateMember,
    deleteMember
  };
}
