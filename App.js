import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import WelcomeScreen from "./screens/Welcome";
import LoginScreen from "./screens/Login";
import SignupScreen from "./screens/Signup";
import NotesScreen from "./screens/Notes";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import Ionicons from "react-native-vector-icons/Ionicons";
import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { View, Text, Image, StyleSheet, ActivityIndicator } from "react-native";
import Profile from "./screens/Profile";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

// Custom Drawer Content
function CustomDrawerContent(props) {
  const [userName, setUserName] = useState("");
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

          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserName(userData.username || "User"); 
          } else {
            console.log("No user data found!");
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

  return (
    <DrawerContentScrollView {...props}>
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Image
          source={{
            uri: "https://go-talent.co.uk/sites/default/files/shutterstock_159456308_0.jpg",
          }}
          style={styles.profileImage}
        />
        {loading ? (
          <ActivityIndicator size="small" color="#333" />
        ) : (
          <Text style={styles.profileName}>{userName}</Text>
        )}
      </View>

      {/* Drawer Items */}
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

function UserDrawer() {
  return (
    <Drawer.Navigator
      initialRouteName="Welcome"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerStyle: {
          backgroundColor: "#fff",
          width: 240,
        },
      }}
    >
      <Drawer.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{
          drawerLabel: "Welcome",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Notes"
        component={NotesScreen}
        options={{
          drawerLabel: "Notes",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={Profile}
        options={{
          drawerLabel: "Profile",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />

    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          options={{ headerShown: false }}
          name="Signup"
          component={SignupScreen}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Login"
          component={LoginScreen}
        />
        {/* <Stack.Screen options = {{headerShown: false}} name="Welcome" component={WelcomeScreen} /> 
        <Stack.Screen name="Notes" component={NotesScreen} /> */}
        <Stack.Screen
          name="UserDrawer"
          component={UserDrawer}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}




const styles = StyleSheet.create({
  profileSection: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 50,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
});


