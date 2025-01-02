import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";

const Profile = ({ navigation }) => {
     const [userData, setUserData] = useState(null);
     const [loading, setLoading] = useState(true);

      useEffect(() => {
        const fetchUserData = async () => {
          try {
            const auth = getAuth();
            const user = auth.currentUser;

           if (user) {
             const db = getFirestore();
             const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);

             if (userDoc.exists) {
               setUserData(userDoc.data());
             }
           }
          } catch (error) {
            console.error("Error fetching user data:", error);
          } finally {
            setLoading(false);
          }
        };

        fetchUserData();
      }, []);


  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#6B4EFF" />
      </View>
    );
  }

    if (!userData) {
      return (
        <View style={styles.container}>
          <Text>No user data available</Text>
        </View>
      );
    }
    
  return (
    <View style={styles.container}>
      <View style={styles.profileSection}>
        <Image
          source={{
            uri: "https://go-talent.co.uk/sites/default/files/shutterstock_159456308_0.jpg",
          }}
          style={styles.profileImage}
        />
        <Text style={styles.name}>{userData.username}</Text>
        <Text style={styles.email}>{userData.email}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={[styles.statBox, { backgroundColor: "#E8E3FF" }]}>
          <Text style={[styles.statNumber, { color: "#6B4EFF" }]}>14</Text>
          <Text style={[styles.statLabel, { color: "#6B4EFF" }]}>Active</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: "#F8F8F8" }]}>
          <Text style={styles.statNumber}>06</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: "#F8F8F8" }]}>
          <Text style={styles.statNumber}>25</Text>
          <Text style={styles.statLabel}>Complete</Text>
        </View>
      </View>

      <View style={styles.menuSection}>
        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuLeft}>
            <View style={[styles.menuIcon, { backgroundColor: "#E8E3FF" }]}>
              <Ionicons name="person-outline" size={20} color="#6B4EFF" />
            </View>
            <View>
              <Text style={styles.menuTitle}>Username</Text>
              <Text style={styles.menuSubtitle}>@cooper_bessie</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuLeft}>
            <View style={[styles.menuIcon, { backgroundColor: "#FFE8E8" }]}>
              <Ionicons
                name="notifications-outline"
                size={20}
                color="#FF4E4E"
              />
            </View>
            <View>
              <Text style={styles.menuTitle}>Notifications</Text>
              <Text style={styles.menuSubtitle}>Mute Push, Email</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuLeft}>
            <View style={[styles.menuIcon, { backgroundColor: "#E8FFF7" }]}>
              <Ionicons name="settings-outline" size={20} color="#4EFF91" />
            </View>
            <View>
              <Text style={styles.menuTitle}>Settings</Text>
              <Text style={styles.menuSubtitle}>Security, Privacy</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  profileSection: {
    alignItems: "center",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: "#666",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
    marginBottom: 30,
  },
  statBox: {
    width: "30%",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#666",
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  menuSection: {
    marginTop: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  menuSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
});

export default Profile;
