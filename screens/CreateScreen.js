import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { lightStyles, darkStyles, commonStyles } from "../styles/commonStyles";
import axios from "axios";
import { API, API_POSTS, API_CREATE } from "../constants/API";
import { useSelector } from "react-redux";


export default function CreateScreen({ navigation }) {
  const token = useSelector((state) => state.auth.token);
  const isDark = useSelector((state) => state.accountPrefs.isDark);
  const styles = { ...commonStyles, ...(isDark ? darkStyles : lightStyles) };

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  
  async function savePost() {
    const post = {
      title: title,
      content: content,
      date: date,
      amount: amount,
    };
    try {
      console.log(token);
      const response = await axios.post(API + API_CREATE, post, {
        headers: { Authorization: `JWT ${token}` },
      });
      console.log(response.data);
      navigation.navigate("Index", { post: post });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <View style={styles.container}>
      <View style={{ margin: 20 }}>
        <Text style={[additionalStyles.label, styles.text]}>Spend:</Text>
        <TextInput
          style={additionalStyles.input}
          value={title}
          onChangeText={(text) => setTitle(text)}
        />
        <Text style={[additionalStyles.label, styles.text]}>
          Spend Description:
        </Text>
        <TextInput
          style={additionalStyles.input}
          value={content}
          onChangeText={(text) => setContent(text)}
        />
        <Text style={[additionalStyles.label, styles.text]}>
          Spend Date:
        </Text>
        <TextInput
          style={additionalStyles.input}
          value={date}
          onChangeText={(text) => setDate(text)}
        />
        <Text style={[additionalStyles.label, styles.text]}>
          Amount:
        </Text>
        <TextInput
          style={additionalStyles.input}
          value={amount}
          onChangeText={(text) => setAmount(text)}
        />

        <TouchableOpacity
          style={[styles.button, { marginTop: 20 }]}
          onPress={savePost}
        >
          <Text style={styles.buttonText}>Save</Text>
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
    marginLeft: 5,
  },
});