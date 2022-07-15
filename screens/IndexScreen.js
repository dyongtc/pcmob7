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
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import axios from "axios";
import { API, API_POSTS, API_WHOAMI } from "../constants/API";
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
  const [amount, setAmount] = useState("");

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
      console.log("getPosts");
      console.log(response.data);
      const postData = response.data;
      console.log("postData");
      const usersPosts = await filteredPosts(postData);
      setPosts(usersPosts);
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

  useEffect(() => {
    let total = 0;
    for (let i = 0; i < posts.length; i++) {
      const post=posts[i];
      total = total + post.amount;
    }
    setAmount(total);
  }, [posts]);

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
          <Text style={styles.flatlistText}>{item.date}</Text>
          <Text style={styles.flatlistText}>{item.title}</Text>
          <Text style={styles.flatlistText}>{item.content}</Text>
          <Text style={styles.flatlistText}>$ {item.amount.toFixed(2)}</Text>
          <TouchableOpacity style={{alignItems:"center"}} onPress={() => deletePost(item.id)}>
            <FontAwesome style={styles.icons} name="trash" size={20} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }


  async function filteredPosts(data) {
    console.log("filteredPosts");
  const response = await axios.get(API + API_WHOAMI, {
    headers: { Authorization: `JWT ${token}` },
  });
  console.log(response.data);
  const id = (response.data.id);
  const filteredPosts = data.filter((item) => item.user_id === id);
  return (filteredPosts);
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
      <Text style={styles.dateTitle}>{currentDate}</Text>
      <Text style={commonStyles.totalAmount}> Total Spent: $ {amount} </Text>
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
