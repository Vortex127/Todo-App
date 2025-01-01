import { View, Text, StyleSheet, KeyboardAvoidingView, TouchableOpacity, TextInput } from 'react-native'
import React, { useState } from 'react'
import {AntDesign} from "@expo/vector-icons"

export default function AddListModal({closeModal, addList}) {

    const [name, setName] = useState('')
    const [bgcolors, setBgColors] = useState('')
    const Colors = ["#5CD859", "#24A6D9", "#595BD9", "#8022D9", "#D159D8", "#D85963", "#D88559"]

    const renderColors = () => {
        return Colors.map((color) => (
          <TouchableOpacity
            key={color}
            style={[styles.colorSelect, { backgroundColor: color }]}
            onPress={() => setBgColors(color)} // Set selected color in state
          />
        ));
      };

      const createTodo = () => {
        if (!name) return;
        const list = { name, color: bgcolors };
        addList(list); // Call the function passed as a prop
        setName(""); // Reset the input
      };

  return (
    <KeyboardAvoidingView style= {styles.container} behavior='padding'>
        <TouchableOpacity style={{position: "absolute", top: 64, right: 32}} onPress={closeModal}>
            <AntDesign name='close' size={24} color={colors.black}/>
        </TouchableOpacity>

        <View style={{alignSelf: "stretch", marginHorizontal: 32}}>
        <Text style={styles.title}> Create Todo List</Text>
        <TextInput style={styles.input} placeholder="List Name?" onChangeText={(text) => setName(text)}/>

        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 12 }}>
          {renderColors()}
        </View>

        <TouchableOpacity style={[styles.create, {backgroundColor: bgcolors}]} onPress={createTodo} >
            <Text style={{color: colors.white, fontWeight: "600"}}>
                Create!
            </Text>
        </TouchableOpacity>

        </View>
    </KeyboardAvoidingView>
  )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: 28,
        fontWeight: "800",
        color: colors.black,
        alignSelf: "center",
    },
    input: {
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: colors.blue,
        borderRadius: 6,
        height: 50,
        marginTop: 8,
        paddingHorizontal: 16,
        fontSize: 18,
    },
    create: {
        marginTop: 24,
        height: 50,
        borderRadius: 6,
        alignItems: "center",
        justifyContent: "center",
    },
    colorSelect: {
        width: 30,
        height: 30,
        borderRadius: 4,
    },
});