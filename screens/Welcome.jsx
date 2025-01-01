import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons'; // Icon library
import { doc, getDoc } from "firebase/firestore"; // Firestore methods
import { useRoute } from '@react-navigation/native'; // For accessing route parameters
import { db } from "../firebase"; // Your Firebase config

export default function WelcomeScreen({ navigation }) {
  const route = useRoute();
  const { uid } = route.params || {}; // Retrieve UID passed from the previous screen
  const [username, setUsername] = useState(''); // State to hold the username
  const animatedValue = useRef(new Animated.Value(0)).current;

  // Fetch username from Firestore
  useEffect(() => {
    const fetchUsername = async () => {
      if (!uid) {
        console.error('User ID not provided!');
        return;
      }

      try {
        const userDoc = doc(db, "users", uid); // Use uid from params
        const userSnapshot = await getDoc(userDoc);

        if (userSnapshot.exists()) {
          setUsername(userSnapshot.data().username); // Assuming "username" is stored in Firestore
        } else {
          console.error('No user found!');
        }
      } catch (error) {
        console.error('Error fetching username:', error);
      }
    };

    fetchUsername();
  }, [uid]); // Fetch data whenever uid changes

  useEffect(() => {
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 6000,
        easing: Easing.linear,
        useNativeDriver: false,
      })
    ).start();
  }, []);

  const gradientColors = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [
      'rgba(232, 72, 229, 1)', // Start Color
      'rgba(82, 24, 250, 1)',  // End Color
    ],
  });

  return (
    <Animated.View style={[styles.container, { backgroundColor: gradientColors }]}>
      <LinearGradient
        colors={['#e848e5', '#5218fa']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <Text style={styles.welcomeText}>
        Welcome, {username || 'Guest'}!
      </Text>
      <Text style={styles.subText}>
        Discover amazing features and enhance your experience.
      </Text>

      {/* <TouchableOpacity
        onPress={() => navigation.navigate('Profile')}
        style={styles.primaryButton}
      >
        <LinearGradient
          colors={['#f7b733', '#fc4a1a']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientButton}
        >
          <Text style={styles.buttonText}>Go to Profile</Text>
        </LinearGradient>
      </TouchableOpacity> */}

      <MagicNavbar navigation={navigation} />
    </Animated.View>
  );
}

const MagicNavbar = ({ navigation }) => {
  return (
    <View style={styles.navbar}>
      <TouchableOpacity onPress={() => navigation.navigate('Welcome')} style={styles.navButton}>
        <FontAwesome5 name="home" size={24} color="#6a11cb" />
        <Text style={styles.navText}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Notes')} style={styles.navButton}>
        <MaterialIcons name="edit-note" size={24} color="#6a11cb" />
        <Text style={styles.navText}>Notes</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('API')} style={styles.navButton}>
        <MaterialIcons name="person" size={24} color="#6a11cb" />
        <Text style={styles.navText}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subText: {
    fontSize: 16,
    color: '#eee',
    textAlign: 'center',
    marginBottom: 40,
  },
  primaryButton: {
    width: '80%',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  gradientButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  navbar: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: '100%',
    height: 70,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  navButton: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    color: '#6a11cb',
    marginTop: 5,
  },
});
