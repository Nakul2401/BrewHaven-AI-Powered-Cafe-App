import React from 'react'
import { Stack, Tabs } from 'expo-router'
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const TabsLayout = () => {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#C67C4E',
        }}
      >
        <Tabs.Screen 
          name='home' 
          options={{ 
            headerShown: false,
            title: 'Home',
            tabBarIcon: ({color}) => (
              <AntDesign name="home" size={24} color={color} />
            )
          }} 
        />

        <Tabs.Screen 
          name='chatroom' 
          options={{ 
            headerShown: true,
            title: 'BrewBot',
            tabBarStyle: {'display': 'none'},
            tabBarIcon: ({color}) => (
              <MaterialCommunityIcons name="robot-outline" size={24} color={color} />
            )
          }}
        />

        <Tabs.Screen 
          name='order' 
          options={{ 
            headerShown: true,
            title: 'Cart',
            tabBarStyle: {'display': 'none'},
            tabBarIcon: ({color}) => (
              <MaterialCommunityIcons name="cart-heart" size={24} color={color} />
            )
          }}
        />
      </Tabs>
    </>

    
  )
}

export default TabsLayout
