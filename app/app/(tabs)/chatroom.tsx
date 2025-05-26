import { KeyboardAvoidingView,Platform, View, TouchableOpacity, Alert} from 'react-native'
import React, { useState, useRef } from 'react'
import PageHeader from '@/components/PageHeader'
import { MessageInterface } from '@/types/types'
import { GestureHandlerRootView, TextInput } from 'react-native-gesture-handler'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { Feather } from '@expo/vector-icons'
import MessageList from '@/components/MessageList'
import { callChatBotAPI } from '@/services/chatBot'
import { useCart } from '@/components/CartContext'


const ChatRoom = () => {
  const {addToCart, emptyCart} = useCart();
  const [messages, setMessages] = useState<MessageInterface[]>([])
  const textRef = useRef('')
  const inputRef = useRef<TextInput>(null)
  const [isTyping, setIsTyping] = useState<boolean>(false);


  const handleSendMessage = async () => {
    let message = textRef.current.trim();
    if (!message) return;
    try {
        // Add the user message to the list of messages
        let InputMessages = [...messages, { content: message, role: 'user' }];

        setMessages(InputMessages);
        textRef.current = ''
        if(inputRef) inputRef?.current?.clear();
        setIsTyping(true)
        let responseMessage = await callChatBotAPI(InputMessages)
        setIsTyping(false)
        setMessages([...InputMessages, responseMessage])
        
        if (responseMessage) {
            if (responseMessage.memory ) {
                if (responseMessage.memory.order) {
                    emptyCart()
                    responseMessage.memory.order.forEach((item: any) => {
                    addToCart(item.item, item.quantity)
                    });
                }
            }
          }
    } catch(err:any ) {
        Alert.alert('Message', err.message)
    }
  };
  
  return (
    <GestureHandlerRootView>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={hp(8)} // tweak as per your header height
      >
        <PageHeader title={"BrewBot"} showHeaderRight={false} bgColor='#C67C4E' />
        <View
          className='flex-1 justify-between bg-neutral-100 overflow-visible'
        >
          <View
            className='flex-1'
          >
            <MessageList
              messages={messages}
              isTyping={isTyping}
            />
          </View>

          <View
            className='flex-row mx-3 mb-8 justify-between border-2 p-3 bg-white border-app_orange_color rounded-2xl pl-5'
          >
            <TextInput
              ref = {inputRef}
              onChangeText={value => textRef.current = value}
              placeholder='Type message...'
              style={{fontSize: hp(2.1)}}
              className='flex-1 mr-2'
            />
            <TouchableOpacity
                className='bg-app_orange_color p-2 mr-1 rounded-full'
                onPress = {handleSendMessage}
            >
              <Feather name="send" size={hp(2.8)} color="white"/>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  )
}

export default ChatRoom

