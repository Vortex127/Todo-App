import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  StyleSheet, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Animated
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase'; // Import Firebase auth
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { doc, setDoc } from "firebase/firestore"; // Add Firestore import
import { db } from "../firebase"; // Ensure Firestore instance is imported

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUserName] = useState('');
  const [passwordcheck, setPasswordCheck] = useState('');
  const [loading, setLoading] = useState(false);
  const [shake] = useState(new Animated.Value(0));

  const handleSignup = async () => {
    console.log('handleSignup called');
  
    if (password.length < 6) {
      console.log('Password length error');
      Alert.alert('Error', 'Password must be at least 6 characters long');
      shakeAnimation();
      return;
    }
  
    if (password !== passwordcheck) {
      console.log('Password mismatch error');
      Alert.alert('Error', 'Passwords do not match');
      shakeAnimation();
      return;
    }
  
    setLoading(true); // Start loading
  
    try {
      console.log('Creating user with email and password');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('User created');
  
      if (userCredential && userCredential.user) {
        const user = userCredential.user;

        console.table({ user });

        // Save username and email in Firestore
        try {
          console.log("Saving user data to Firestore");
          await setDoc(doc(db, "users", user.uid), {
            username: username,
            email: email,
            password: password,
          });
          console.log("Document successfully written!");
        } catch (error) {
          console.error("Error adding document: ", error);
        }

        Alert.alert("Success", `Welcome ${username}`);

        // Navigate to WelcomeScreen with uid and username
        navigation.navigate("Login");

        // Clear form fields
        setEmail("");
        setPassword("");
        setUserName("");
        setPasswordCheck("");
      } else {
        console.error("Error creating user: userCredential is null");
      }
    } catch (error) {
      console.error("Error creating user: ", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const shakeAnimation = () => {
    Animated.sequence([
      Animated.timing(shake, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -10, duration: 100, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 0, duration: 100, useNativeDriver: true })
    ]).start();
  };

  return (
    <LinearGradient
      colors={['#f5f5f5', '#d1d1d1']}
      style={styles.gradient}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === "android" ? "padding" : "height"}
        style={styles.container}
      >
        <Animated.View style={[styles.formContainer, { transform: [{ translateX: shake }] }]}>
          <Text style={styles.header}>Sign Up</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#757575" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              placeholderTextColor="#999"
            />
          </View>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="#757575" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={username}
              onChangeText={setUserName}
              placeholderTextColor="#999"
            />
          </View>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#757575" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor="#999"
            />
          </View>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#757575" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              value={passwordcheck}
              onChangeText={setPasswordCheck}
              secureTextEntry
              placeholderTextColor="#999"
            />
          </View>
          {loading ? (
            <ActivityIndicator size="large" color="#6a11cb" />
          ) : (
            <TouchableOpacity style={styles.button} onPress={handleSignup}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.link}>Already have an account? Login</Text>
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  formContainer: {
    width: '100%',
    maxWidth: 350,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#f9f9f9',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    color: '#333',
    fontSize: 14,
  },
  button: {
    width: '100%',
    backgroundColor: '#6a11cb',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 20,
    color: '#6a11cb',
    fontSize: 14,
  },
});
