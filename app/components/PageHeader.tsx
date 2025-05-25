import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import {router, Stack} from 'expo-router'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';

interface HeaderProps {
    title: string;
    showHeaderRight: boolean;
    bgColor: string;
}


const PageHeader: React.FC<HeaderProps> = ({title, showHeaderRight, bgColor}) => {
  return (
    <Stack.Screen
        options={{
            headerShadowVisible: false,
            headerStyle: {
                backgroundColor: bgColor,
            },
            headerTitleAlign: 'center',
            headerTitle: () => (
                <Text
                    className='text-white text-xl text-[#242424] font-[Sora-SemiBold]'
                >
                    {title}
                </Text>
            ),
            headerRight: showHeaderRight ? () => (
                <TouchableOpacity
                    className = 'pr-2'
                >
                    <MaterialCommunityIcons name="heart-multiple-outline" size={24} color="black" />
                </TouchableOpacity>
            ): undefined,

            headerBackVisible: false,

            headerLeft: () => (
                <GestureHandlerRootView
                    className='flex-row'
                >
                    <TouchableOpacity
                        className='pl-1'
                        onPress={() => router.back()}
                    >
                        <Entypo name="chevron-thin-left" size={24} color="black" />
                    </TouchableOpacity>
                </GestureHandlerRootView>
            ),
        }}
    />
  );
}

export default PageHeader

const styles = StyleSheet.create({})