import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import axios from "axios";
import { API, API_POSTS } from "../constants/API";
import { commonStyles, darkStyles, lightStyles } from "../styles/commonStyles";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

export default function IndexScreen({ route }) {
  const navigation = useNavigation();
  const token = useSelector((state) => state.auth.token);
  const isDark = useSelector((state) => state.accountPrefs.isDark);
  const styles = isDark ? darkStyles : lightStyles;
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // This is to set up the top right button
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={addPost}>
          <FontAwesome
            name="plus"
            size={24}
            style={{ color: styles.headerTint, marginRight: 15 }}
          />
        </TouchableOpacity>
      ),
    });
  });

  useEffect(() => {
    console.log("Setting up nav listener");
    // Check for when we come back to this screen
    const removeListener = navigation.addListener("focus", () => {
      console.log("Running nav listener");
      getPosts();
    });
    getPosts();
    return removeListener;
  }, []);

  async function getPosts() {
    try {
      const response = await axios.get(API + API_POSTS, {
        headers: { Authorization: `JWT ${token}` },
      });
      console.log(response.data);
      setPosts(response.data);
      return "completed";
    } catch (error) {
      console.log(error.response.data);
      if ((error.response.data.error = "Invalid token")) {
        navigation.navigate("SignInSignUp");
      }
    }
  }

  async function onRefresh() {
    setRefreshing(true);
    const response = await getPosts();
    setRefreshing(false);
  }
  function addPost() {
    navigation.navigate("Add");
  }

  async function deletePost(id) {
    console.log("Deleting " + id);
    try {
      const response = await axios.delete(API + API_POSTS + `/${id}`, {
        headers: { Authorization: `JWT ${token}` },
      });
      console.log(response);
      setPosts(posts.filter((item) => item.id !== id));
    } catch (error) {
      console.log(error);
    }
  }

  // The function to render each row in our FlatList
  function renderItem({ item }) {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("Details", { id: item.id })}
      >
        <View
          style={{
            padding: 10,
            paddingTop: 20,
            paddingBottom: 20,
            borderBottomColor: "#ccc",
            borderBottomWidth: 1,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text style={styles.text}>{item.title}</Text>
          <TouchableOpacity onPress={() => deletePost(item.id)}>
            <FontAwesome name="trash" size={20} color="#a80000" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }

  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    var date = new Date().getDate(); //Current Date
    var month = new Date().getMonth() + 1; //Current Month
    var year = new Date().getFullYear(); //Current Year
    var hours = new Date().getHours(); //Current Hours
    var min = new Date().getMinutes(); //Current Minutes
    var sec = new Date().getSeconds(); //Current Seconds
    setCurrentDate(
      date + "/" + month + "/" + year
    );
  }, []);

  // function Date() {
  //   const [currentDate, setCurrentDate] = useState("");

  //   useEffect(() => {
  //     var date = new Date().getDate(); //Current Date
  //     var month = new Date().getMonth() + 1; //Current Month
  //     var year = new Date().getFullYear(); //Current Year
  //     setCurrentDate(
  //       date + "/" + month + "/" + year + " "
  //     );
  //   }, []);

  //   return (
  //     <View>
  //       <Text>Current Date</Text>
  //       <Text>{currentDate}</Text>
  //     </View>
  //   );
  // }

  return (
    <View style={styles.container}>
      <Text style={commonStyles.dateTitle}>{currentDate}</Text>
      <Text style={commonStyles.totalAmount}> Total Spent: 'amount' </Text>
      <FlatList
        data={posts}
        renderItem={renderItem}
        style={{ width: "100%" }}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#9Bd35A", "#689F38"]}
          />
        }
      />
    </View>
  );
}
