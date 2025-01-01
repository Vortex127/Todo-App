import React, { useState, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  Text,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Alert,
  Modal
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import Colors from '../Colors';

export default function TodoModal({ list, closeModal }) {
  const [newTodo, setNewTodo] = useState("");
  const [todos, setTodos] = useState(list.todos);
  const [isRenameModalVisible, setRenameModalVisible] = useState(false);
  const [renameIndex, setRenameIndex] = useState(null);
  const [renameText, setRenameText] = useState("");
  const swipeableRefs = useRef({});

  const taskCount = todos.length;
  const completedCount = todos.filter(todo => todo.completed).length;

  const toggleTodoCompleted = index => {
    const newTodos = [...todos];
    newTodos[index].completed = !newTodos[index].completed;
    setTodos(newTodos);
  };

  const addTodo = () => {
    if (newTodo.trim().length > 0) {
      const newTodos = [
        ...todos,
        { title: newTodo.trim(), completed: false }
      ];
      setTodos(newTodos);
      setNewTodo("");
      Keyboard.dismiss();
    }
  };

  const deleteTodo = (index) => {
    const newTodos = todos.filter((_, i) => i !== index);
    setTodos(newTodos);
  };

  const renameTodo = () => {
    if (renameText.trim().length > 0) {
      const newTodos = [...todos];
      newTodos[renameIndex].title = renameText.trim();
      setTodos(newTodos);
      setRenameModalVisible(false);
      setRenameText("");
    }
  };

  const renderRightActions = (progress, dragX, index) => {
    return (
      <TouchableOpacity
        style={styles.rightAction}
        onPress={() => {
          swipeableRefs.current[index].close();
          setRenameIndex(index);
          setRenameText(todos[index].title);
          setRenameModalVisible(true);
        }}
      >
        <Text style={styles.actionText}>Rename</Text>
      </TouchableOpacity>
    );
  };

  const renderLeftActions = (progress, dragX, index) => {
    return (
      <TouchableOpacity
        style={styles.leftAction}
        onPress={() => {
          swipeableRefs.current[index].close();
          Alert.alert(
            "Delete Todo",
            "Are you sure you want to delete this todo?",
            [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
              },
              { text: "OK", onPress: () => deleteTodo(index) }
            ]
          );
        }}
      >
        <Text style={styles.actionText}>Delete</Text>
      </TouchableOpacity>
    );
  };

  const renderTodo = (todo, index) => {
    return (
      <Swipeable
        ref={ref => swipeableRefs.current[index] = ref}
        renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, index)}
        renderLeftActions={(progress, dragX) => renderLeftActions(progress, dragX, index)}
      >
        <TouchableOpacity 
          style={styles.todoContainer}
          onPress={() => toggleTodoCompleted(index)}
          activeOpacity={0.8}
        >
          <View style={[
            styles.checkbox, 
            { borderColor: list.color },
            todo.completed && { backgroundColor: list.color }
          ]} />
          <Text style={[
            styles.todo, 
            todo.completed && styles.completedTodo
          ]}>
            {todo.title}
          </Text>
        </TouchableOpacity>
      </Swipeable>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <SafeAreaView style={styles.container}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={closeModal}
          >
            <AntDesign name="close" size={24} color={Colors.black} />
          </TouchableOpacity>

          <View style={[styles.section, styles.header, { borderBottomColor: list.color }]}>
            <View>
              <Text style={styles.title}>{list.name}</Text>
              <Text style={styles.taskCount}>
                {completedCount} of {taskCount} tasks
              </Text>
            </View>
          </View>

          <View style={[styles.section, styles.todos]}>
            <FlatList
              data={todos}
              renderItem={({ item, index }) => renderTodo(item, index)}
              keyExtractor={(_, index) => index.toString()}
              contentContainerStyle={{ paddingHorizontal: 32, paddingVertical: 64 }}
              showsVerticalScrollIndicator={false}
            />
          </View>

          <View style={[styles.section, styles.footer]}>
            <TextInput
              style={[styles.input, { borderColor: list.color }]}
              placeholder="Add a todo..."
              onChangeText={text => setNewTodo(text)}
              value={newTodo}
              onSubmitEditing={addTodo}
              returnKeyType="done"
            />
            <TouchableOpacity 
              style={[styles.addTodo, { backgroundColor: list.color }]}
              onPress={addTodo}
            >
              <AntDesign name="plus" size={16} color={Colors.white} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isRenameModalVisible}
        onRequestClose={() => {
          setRenameModalVisible(!isRenameModalVisible);
        }}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Rename Todo</Text>
          <TextInput
            style={styles.modalInput}
            onChangeText={setRenameText}
            value={renameText}
          />
          <TouchableOpacity
            style={[styles.button, styles.buttonClose]}
            onPress={renameTodo}
          >
            <Text style={styles.textStyle}>Save</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  closeButton: {
    position: 'absolute',
    top: 64,
    right: 32,
    zIndex: 10,
  },
  section: {
    flex: 1,
    alignSelf: 'stretch',
  },
  header: {
    justifyContent: 'flex-end',
    marginLeft: 64,
    borderBottomWidth: 3,
    paddingTop: 16,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: Colors.black,
    paddingBottom: 8
  },
  taskCount: {
    marginTop: 4,
    marginBottom: 16,
    color: Colors.gray,
    fontWeight: "600"
  },
  footer: {
    paddingHorizontal: 32,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16
  },
  input: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderRadius: 6,
    marginRight: 8,
    paddingHorizontal: 8
  },
  addTodo: {
    borderRadius: 4,
    padding: 16,
    alignItems: "center",
    justifyContent: "center"
  },
  todoContainer: {
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
  },
  todo: {
    color: Colors.black,
    fontWeight: "700",
    fontSize: 16,
    marginLeft: 16,
  },
  completedTodo: {
    textDecorationLine: "line-through",
    color: Colors.gray,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderRadius: 6
  },
  todos: {
    marginVertical: 8,
  },
  leftAction: {
    flex: 1,
    backgroundColor: '#dd2c00',
    justifyContent: 'center',
  },
  rightAction: {
    flex: 1,
    backgroundColor: "green",
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  actionText: {
    color: '#fff',
    fontWeight: '600',
    padding: 20,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  modalInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '100%',
    paddingHorizontal: 10,
    marginBottom: 15
  }
});