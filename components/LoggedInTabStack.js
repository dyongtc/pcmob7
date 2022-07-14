import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import BlogStack from '../components/BlogStack';
import AccountStack from '../components/AccountStack';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons'; 
import { useSelector } from "react-redux";

const Tab = createBottomTabNavigator();

export default function LoggedInStack() {
  const isDark = useSelector((state) => state.accountPrefs.isDark);
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: isDark ? "#181818" : "white", 
        },
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === '$pent') {
            iconName = "dollar-sign"
          } else if (route.name === 'Account') {
            iconName = "user"
          }
          // You can return any component that you like here!
          return <FontAwesome5 name={iconName} size={size} color={color} />;
        },
      })}
      >
        <Tab.Screen name="$pent" component={BlogStack} />
        <Tab.Screen name="Account" component={AccountStack} />
      </Tab.Navigator>
  )
}