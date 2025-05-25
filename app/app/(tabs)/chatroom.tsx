import { StyleSheet, Text, View, TouchableOpacity, Alert} from 'react-native'
import React, { useState, useRef } from 'react'
import PageHeader from '@/components/PageHeader'
import { MessageInterface } from '@/types/types'
import { GestureHandlerRootView, TextInput } from 'react-native-gesture-handler'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { Feather } from '@expo/vector-icons'

const ChatRoom = () => {

  const [messages, setMesssages] = useState<MessageInterface[]>([])
  const inputRef = useRef<TextInput>(null)

  
  return (
    <GestureHandlerRootView>
      <PageHeader title={"BrewBot"} showHeaderRight={false} bgColor='#F9F9F9' />
      <View
        className='flex-1 justify-between bg-neutral-100 overflow-visible'
      >
        <View
          className='flex-1'
        >

        </View>

        <View
          className='flex-row mx-3 mb-8 justify-between border-2 p-3 bg-white border-app_orange_color rounded-2xl pl-5'
        >
          <TextInput
            ref = {inputRef}
            placeholder='Type message...'
            style={{fontSize: hp(2)}}
            className='flex-1 mr-2'
          />
          <TouchableOpacity
              // onPress = {handleSendMessage}
              className='bg-app_orange_color p-2 mr-1 rounded-full'
          >
            <Feather name="send" size={hp(2.7)} color="white"/>
          </TouchableOpacity>
          {/* Continue from here */}


         

        </View>

      </View>
    </GestureHandlerRootView>
  )
}

export default ChatRoom

