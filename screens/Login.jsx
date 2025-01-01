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
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, query, where, getDocs, getDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebase";

export default function LoginScreen({ navigation }) {
  const [input, setInput] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [shake] = useState(new Animated.Value(0));

  const handleLogin = async () => {
    setLoading(true);
    try {
      let email;
  
      if (input.includes('@')) {
        // If input is an email, use it directly
        email = input;
      } else {
        // If input is a username, query Firestore for the corresponding email
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("username", "==", input));
        const querySnapshot = await getDocs(q);
  
        if (!querySnapshot.empty) {
          email = querySnapshot.docs[0].data().email;
        } else {
          throw new Error('Username not found');
        }
      }
  
      // Sign in the user with the determined email
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Fetch additional user details if needed (e.g., username, email)
      const userDoc = doc(db, "users", user.uid);
      const userSnapshot = await getDoc(userDoc);
      let username = input; // Default to input
      if (userSnapshot.exists()) {
        username = userSnapshot.data().username || username;
      }
  
      // Navigate to WelcomeScreen with uid and username
      navigation.navigate('Welcome', { uid: user.uid, username });
  
      // Alert.alert('Success', `Welcome back ${username}`);
      setInput('');
      setPassword('');
    } catch (error) {
      Alert.alert('Error', error.message);
      shakeAnimation();
    } finally {
      setLoading(false);
    }
  };
  
  
  const shakeAnimation = () => {
    Animated.sequence([
      Animated.timing(shake, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -10, duration: 100, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 0, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  return (
    <LinearGradient colors={['#f5f5f5', '#d1d1d1']} style={styles.gradient}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <Animated.View style={[styles.formContainer, { transform: [{ translateX: shake }] }]}>
          <Text style={styles.header}>Login</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="#757575" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Email or Username"
              value={input}
              onChangeText={setInput}
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
          {loading ? (
            <ActivityIndicator size="large" color="#6a11cb" />
          ) : (
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.link}>Don't have an account? Sign Up</Text>
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
