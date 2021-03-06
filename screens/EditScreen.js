import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
import { API, API_POSTS } from "../constants/API";
import axios from "axios";
import { useSelector } from "react-redux";
import { commonStyles, darkStyles, lightStyles } from "../styles/commonStyles";

export default function EditScreen({ navigation, route }) {
  const isDark = useSelector((state) => state.accountPrefs.isDark);
  const styles = { ...commonStyles, ...(isDark ? darkStyles : lightStyles) };

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");

  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const post = route.params.post
    setTitle(post.title);
    setContent(post.content);
    setDate(post.date);
    setAmount(String(post.amount));
  }, [])

  async function editPost() {
    const post = {
      "title": title,
      "content": content,
      "date": date,
      "amount": amount,
    }
    // const token = await AsyncStorage.getItem("token");
    const id = route.params.post.id
    try {
      console.log(token);
      const response = await axios.put(API + API_POSTS + "/" + id, post, {
        headers: { Authorization: `JWT ${token}` },
      })
      console.log(response.data)
      navigation.navigate("Index")
    } catch (error) {
      console.log(error)
    }
  }


  return (
    <View style={styles.container}>
      <View style={{ margin: 20 }}>
        <Text style={[additionalStyles.label, styles.text]}>Edit Title:</Text>
        <TextInput
          style={additionalStyles.input}
          value={title}
          onChangeText={text => setTitle(text)}
        />
        <Text style={[additionalStyles.label, styles.text]}>Edit Description:</Text>
        <TextInput
          style={additionalStyles.input}
          value={content}
          onChangeText={text => setContent(text)}
        />
        <Text style={[additionalStyles.label, styles.text]}>Edit Date:</Text>
        <TextInput
          style={additionalStyles.input}
          value={date}
          onChangeText={text => setDate(text)}
        />
        <Text style={[additionalStyles.label, styles.text]}>Edit Amount:</Text>
        <TextInput
          style={additionalStyles.input}
          value={amount}
          onChangeText={text => Number(setAmount(text))}
        />
      <TouchableOpacity style={[styles.button, {marginTop: 20}]} onPress={editPost}>
        <Text style={styles.buttonText}>
          Save
        </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const additionalStyles = StyleSheet.create({
  input: {
    fontSize: 24,
    borderWidth: 1,
    borderColor: "black",
    marginBottom: 15,
  },
  label: {
    fontSize: 28,
    marginBottom: 10,
    marginLeft: 5
  }
});