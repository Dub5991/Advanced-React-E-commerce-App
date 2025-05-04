// Part 3: User Management
// Implement CRUD operations for user data in Firestore

import React, { useEffect, useState } from "react";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { deleteUser } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Profile: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);
  const [name, setName] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserData(data);
            setName(data.name || "");
            setAddress(data.address || "");
          }
        }
        console.error("Error fetching user data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleUpdate = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, { name, address });
        alert("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };
  const handleDeleteAccount = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        await deleteDoc(doc(db, "users", user.uid));
        await deleteUser(user);
        alert("Account deleted successfully!");
        navigate("/register");
      }
    } catch (err) {
      console.error("Error deleting account:", err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mt-4">
      <h1>Profile</h1>
      {userData ? (
        <div>
          <p>Email: {userData.email}</p>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
          />
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Address"
          />
          <button onClick={handleUpdate}>Update Profile</button>
          <button onClick={handleDeleteAccount}>Delete Account</button>
        </div>
      ) : (
        <p>No user data found.</p>
      )}
    </div>
  );
};

export default Profile;