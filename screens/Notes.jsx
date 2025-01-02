import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { AntDesign } from "@expo/vector-icons";
import colors from "../Colors";
import TodoList from "../components/TodoList";
import AddListModal from "../components/AddListModal";
import { db, auth } from "../firebase"; // Import Firebase configuration
import { doc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";

export default function NotesScreen() {
  const [addTodoVisible, setAddTodoVisible] = useState(false);
  const [todos, setTodos] = useState([]);
  const user = auth.currentUser;

 useEffect(() => {
   if (user) {
     const unsubscribe = onSnapshot(doc(db, "notes", user.uid), (docSnap) => {
       if (docSnap.exists()) {
         const data = docSnap.data();
         const mergedTasks = Object.values(data).flat();
         setTodos(mergedTasks);
       } else {
         // Initialize user notes document if it doesn't exist
         setDoc(doc(db, "notes", user.uid), {});
       }
     });

     // Cleanup listener on unmount
     return () => unsubscribe();
   }
 }, [user]);

  const toggleAddTodoModal = () => {
    setAddTodoVisible(!addTodoVisible);
  };

  // const fetchNotes = async () => {
  //   try {
  //     const docRef = doc(db, "notes", user.uid);
  //     const docSnap = await getDoc(docRef);

  //     if (docSnap.exists()) {
  //       const data = docSnap.data();
  //       const mergedTasks = Object.values(data).flat();
  //       setTodos(mergedTasks);
  //     } else {
  //       // Initialize user notes document if it doesn't exist
  //       await setDoc(docRef, {});
  //     }
  //   } catch (error) {
  //     Alert.alert("Error", "Failed to fetch notes.");
  //   }
  // };

  const addTodoList = async (list) => {
    const newTaskKey = `task${todos.length + 1}`;
    const newTask = [
      {
        id: newTaskKey,
        name: list.name,
        color: list.color,
        todos: [],
      },
    ];

    try {
      const docRef = doc(db, "notes", user.uid);
      await updateDoc(docRef, {
        [newTaskKey]: newTask,
      });
      setTodos((prev) => [...prev, ...newTask]);
      toggleAddTodoModal();
    } catch (error) {
      Alert.alert("Error", "Failed to add note.");
    }
  };

  const renderList = (list) => {
    return <TodoList list={list} />;
  };

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        visible={addTodoVisible}
        onRequestClose={() => toggleAddTodoModal()}
      >
        <AddListModal
          closeModal={() => toggleAddTodoModal()}
          addList={addTodoList}
        />
      </Modal>

      <View style={{ flexDirection: "row" }}>
        <View style={styles.divider} />
        <Text style={styles.title}>
          Todo{" "}
          <Text style={{ fontWeight: "300", color: colors.blue }}>Lists</Text>
        </Text>
        <View style={styles.divider} />
      </View>

      <View style={{ marginVertical: 38 }}>
        <TouchableOpacity
          style={styles.addList}
          onPress={() => toggleAddTodoModal()}
        >
          <AntDesign name="plus" size={16} color={colors.blue} />
        </TouchableOpacity>
        <Text style={styles.add}>Add List</Text>
      </View>

      <View style={{ height: 275, paddingLeft: 32 }}>
        <FlatList
          data={todos}
          keyExtractor={(item, index) => `${item.name}-${index}`}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => renderList(item)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  divider: {
    backgroundColor: colors.lightblue,
    height: 1,
    flex: 1,
    alignSelf: "center",
  },
  title: {
    fontSize: 38,
    fontWeight: "800",
    color: colors.black,
    paddingHorizontal: 64,
  },
  addList: {
    borderWidth: 2,
    borderColor: colors.lightblue,
    borderRadius: 4,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  add: {
    color: colors.blue,
    fontWeight: "600",
    fontSize: 14,
    marginTop: 8,
  },
});
