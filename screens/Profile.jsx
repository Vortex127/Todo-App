import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { doc, getDoc, onSnapshot, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

const ProfileScreen = ({ userId }) => {
  const [userData, setUserData] = useState({
    username: 'User',
    imageUrl: null,
    about: '',
    skills: [], // Ensure this is initialized as an array
  });
  const [newSkill, setNewSkill] = useState('');
  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [isEditingSkills, setIsEditingSkills] = useState(false);

  useEffect(() => {
    console.log('User ID:', userId); // Debugging
  }, [userId]);
  
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const userDocRef = doc(db, 'users', userId);
        const userSnapshot = await getDoc(userDocRef);
    
        if (userSnapshot.exists()) {
          console.log('User Data:', userSnapshot.data()); // Debugging
          setUserData((prev) => ({
            ...prev,
            username: userSnapshot.data().username || 'User',
          }));
        } else {
          console.error('User document not found.');
        }
    
        const profileDocRef = doc(db, 'profile', userId);
        const unsubscribe = onSnapshot(profileDocRef, (snapshot) => {
          if (snapshot.exists()) {
            console.log('Profile Data:', snapshot.data()); // Debugging
            const profileData = snapshot.data();
            setUserData((prev) => ({
              ...prev,
              about: profileData.about || '',
              skills: profileData.skills || [],
              imageUrl: profileData.imageUrl || null,
            }));
          } else {
            console.log('Profile document not found. Initializing default data.');
            setDoc(profileDocRef, { about: '', skills: [], imageUrl: null });
          }
        });
    
        return () => unsubscribe();
      } catch (error) {
        console.error('Error fetching profile data:', error.message);
      }
    };
    
    fetchProfileData();
  }, [userId]);

  const handleAddSkill = async () => {
    if (newSkill.trim()) {
      const updatedSkills = [...userData.skills, newSkill.trim()];
      try {
        const profileDocRef = doc(db, 'profile', userId);
        await updateDoc(profileDocRef, { skills: updatedSkills });
        setUserData((prev) => ({
          ...prev,
          skills: updatedSkills,
        }));
        setNewSkill('');
      } catch (error) {
        console.error('Error adding skill:', error.message);
        Alert.alert('Error', 'Failed to add skill.');
      }
    }
  };

  const handleDeleteSkill = async (skillToDelete) => {
    const updatedSkills = userData.skills.filter((skill) => skill !== skillToDelete);
    try {
      const profileDocRef = doc(db, 'profile', userId);
      await updateDoc(profileDocRef, { skills: updatedSkills });
      setUserData((prev) => ({
        ...prev,
        skills: updatedSkills,
      }));
    } catch (error) {
      console.error('Error deleting skill:', error.message);
      Alert.alert('Error', 'Failed to delete skill.');
    }
  };

  const handleSaveAbout = async () => {
    try {
      const profileDocRef = doc(db, 'profile', userId);
      await updateDoc(profileDocRef, { about: userData.about });
      setIsEditingAbout(false);
    } catch (error) {
      console.error('Error saving about section:', error.message);
      Alert.alert('Error', 'Failed to save about section.');
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      try {
        const profileDocRef = doc(db, 'profile', userId);
        await updateDoc(profileDocRef, { imageUrl: result.assets[0].uri });
        setUserData((prev) => ({
          ...prev,
          imageUrl: result.assets[0].uri,
        }));
      } catch (error) {
        console.error('Error updating profile image:', error.message);
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
          {userData.imageUrl ? (
            <Image source={{ uri: userData.imageUrl }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {userData.username.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <View style={styles.cameraIconContainer}>
            <Ionicons name="camera" size={20} color="#fff" />
          </View>
        </TouchableOpacity>
        <Text style={styles.username}>{userData.username}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        {isEditingAbout ? (
          <TextInput
            style={styles.input}
            multiline
            value={userData.about}
            onChangeText={(text) => setUserData((prev) => ({ ...prev, about: text }))}
            onBlur={handleSaveAbout}
          />
        ) : (
          <TouchableOpacity onPress={() => setIsEditingAbout(true)}>
            <Text style={styles.sectionContent}>{userData.about || 'Add a short bio'}</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Skills</Text>
        <View style={styles.skillsContainer}>
          {userData.skills.map((skill, index) => (
            <View key={index} style={styles.skillItem}>
              <Text style={styles.skillText}>{skill}</Text>
              <TouchableOpacity onPress={() => handleDeleteSkill(skill)}>
                <Ionicons name="close-circle" size={20} color="#6a11cb" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
        {isEditingSkills ? (
          <View style={styles.addSkillContainer}>
            <TextInput
              style={styles.skillInput}
              value={newSkill}
              onChangeText={setNewSkill}
              placeholder="Add a skill"
              placeholderTextColor="#999"
            />
            <TouchableOpacity style={styles.addButton} onPress={handleAddSkill}>
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.addSkillButton}
            onPress={() => setIsEditingSkills(true)}
          >
            <Ionicons name="add-circle" size={24} color="#6a11cb" />
            <Text style={styles.addSkillButtonText}>Add Skill</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e1e1e1',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#6a11cb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 48,
    color: '#fff',
  },
  cameraIconContainer: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#6a11cb',
    borderRadius: 15,
    padding: 5,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  usernameInput: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#6a11cb',
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  editButton: {
    backgroundColor: '#6a11cb',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 20,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6a11cb',
    marginBottom: 10,
  },
  sectionContent: {
    fontSize: 16,
    color: '#333',
  },
  input: {
    fontSize: 16,
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#6a11cb',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  skillText: {
    color: '#333',
    marginRight: 5,
  },
  addSkillContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  skillInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#6a11cb',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#6a11cb',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  addSkillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  addSkillButtonText: {
    color: '#6a11cb',
    marginLeft: 5,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
