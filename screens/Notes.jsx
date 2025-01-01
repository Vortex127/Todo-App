import { View, Text, StyleSheet,TouchableOpacity, FlatList, Modal } from 'react-native'
import React, { useState, useEffect } from 'react'
import { AntDesign } from "@expo/vector-icons"
import colors from "../Colors"
import tempData from '../Temp_data'
import TodoList from '../components/TodoList'
import AddListModal from '../components/AddListModal'

export default function NotesScreen() {

  const [addTodoVisible, setAddTodoVisible] = useState(false);
  const [todos, setTodos] = useState(tempData);

  const toggleAddTodoModal = () => {
    setAddTodoVisible(!addTodoVisible);
  };

  const renderList = (list) => {
    return <TodoList list={list} />;
    };

  const addTodoList = (list) => {
    setTodos([...todos, { ...list, todos: [] }]); // Add new list to todos
    toggleAddTodoModal();
  };
    return (
    <View style={styles.container}>
      <Modal animationType='slide' visible={addTodoVisible} onRequestClose={()=> toggleAddTodoModal()}> 
      <AddListModal closeModal={() => toggleAddTodoModal()} addList={addTodoList} />
      </Modal>
     <View style={{flexDirection: "row"}}>
        <View style={styles.divider}/>
        <Text Text style = {styles.title}>
        Todo <Text style= {{fontWeight: "300", color: colors.blue}}>Lists 
        </Text>
        </Text>
        <View style={styles.divider}/>
      </View>

      <View style= {{marginVertical: 38}}>
        <TouchableOpacity style = {styles.addList} onPress={() => toggleAddTodoModal()}>
            <AntDesign name="plus" size={16} color={colors.blue}/>
        </TouchableOpacity>

        <Text style={styles.add}> Add List </Text>
      </View>

      <View style={{height: 275, paddingLeft: 32}} >
        <FlatList 
          data={todos} 
          keyExtractor={item=> item.name} 
          horizontal={true} 
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => renderList(item)}
         />
      </View>

    </View>
  )
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
        justifyContent: "center"
    },
    add: {
        color: colors.blue,
        fontWeight: "600",
        fontSize: 14,
        marginTop: 8,
    },

});