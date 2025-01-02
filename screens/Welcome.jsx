import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView
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

const Welcome = ({ navigation }) => {
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
      <Text style={styles.welcomeText}>Welcome</Text>
      <Text style={styles.userName}>{userData.username}</Text>

      <TouchableOpacity style={styles.discoverCard}>
        <View>
          <Text style={styles.discoverText}>Discover</Text>
          <Text style={styles.recipeText}>Today's top scored recipe!</Text>
        </View>
        <Image
          source={{
            uri: "https://go-talent.co.uk/sites/default/files/shutterstock_159456308_0.jpg",
          }}
          style={styles.sushiImage}
        />
      </TouchableOpacity>

      <ScrollView style={styles.recipeList}>
        <TouchableOpacity style={styles.recipeItem}>
          <View style={[styles.iconContainer, { backgroundColor: "#FFE8F7" }]}>
            <Image
              source={{
                uri: "https://go-talent.co.uk/sites/default/files/shutterstock_159456308_0.jpg",
              }}
              style={styles.recipeIcon}
            />
          </View>
          <View style={styles.recipeInfo}>
            <Text style={styles.recipeTitle}>Pink Castle Cake</Text>
            <Text style={styles.recipeCount}>24 recipes</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.recipeItem}>
          <View style={[styles.iconContainer, { backgroundColor: "#FFF5E8" }]}>
            <Image
              source={{
                uri: "https://go-talent.co.uk/sites/default/files/shutterstock_159456308_0.jpg",
              }}
              style={styles.recipeIcon}
            />
          </View>
          <View style={styles.recipeInfo}>
            <Text style={styles.recipeTitle}>Cheese Pizza</Text>
            <Text style={styles.recipeCount}>17 recipes</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.recipeItem}>
          <View style={[styles.iconContainer, { backgroundColor: "#F3E8FF" }]}>
            <Image
              source={{
                uri: "https://go-talent.co.uk/sites/default/files/shutterstock_159456308_0.jpg",
              }}
              style={styles.recipeIcon}
            />
          </View>
          <View style={styles.recipeInfo}>
            <Text style={styles.recipeTitle}>Donut Cookies</Text>
            <Text style={styles.recipeCount}>24 recipes</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#000" />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 40,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  welcomeText: {
    fontSize: 16,
    color: "#666",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 5,
  },
  discoverCard: {
    backgroundColor: "#E8E3FF",
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  discoverText: {
    color: "#fff",
    fontSize: 16,
  },
  recipeText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
    marginTop: 5,
    maxWidth: 200,
  },
  sushiImage: {
    width: 80,
    height: 80,
  },
  recipeList: {
    marginTop: 20,
  },
  recipeItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 10,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  recipeIcon: {
    width: 40,
    height: 40,
  },
  recipeInfo: {
    flex: 1,
    marginLeft: 15,
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  recipeCount: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
});

export default Welcome;
