import { Text, View } from 'react-native'
import DeliveryToggle from './DeliveryToggle'
import React from 'react'

const CartHeader = () => {
  return (
    <View>
        <DeliveryToggle />

        <Text
        className=" mx-7 mt-7 text-[#242424] text-lg font-[Sora-SemiBold]"
        >
        Delivery Address
        </Text>
        <Text
        className=" mx-7 mt-4 text-[#242424] text-base font-[Sora-SemiBold] mb-2"
        >
        Royal Residences
        </Text>
        <Text
        className=" mx-7 text-[#A2A2A2] text-xs font-[Sora-SemiBold] mb-3"
        >
        Apt. 20, Sector 17, Chandigarh.
        </Text>

        <View className="mx-12 border-b border-gray-400 my-4 " />
    </View>
  )
}

export default CartHeader