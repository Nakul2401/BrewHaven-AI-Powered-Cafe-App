import { Text, View,Image } from 'react-native'
import React from 'react'
import Octicons from '@expo/vector-icons/Octicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';


interface DetailsHeaderInterface {
    image_url: string;
    name: string;
    type: string;
    rating: number;
}

const DetailsHeader = ({image_url,name,type,rating}:DetailsHeaderInterface) => {
  return (
    <>
        <Image 
            source = {{ uri: image_url}}
            className='w-full  h-[225] rounded-2xl mt-5'
        />

        <View>
            <Text
                className="text-[#242424] text-2xl font-[Sora-SemiBold] ml-1 mt-4"
                >{name}
            </Text>

            <View
                className='flex-row w-full justify-between mt-2'
            >
                <Text
                    className="text-[#A2A2A2] text-sm font-[Sora-Regular] ml-1 mt-2"
                >
                    {type}
                </Text>

                <View className='flex-row -mr-1'>
                    <View
                        className='bg-[#ECECEC] p-2 rounded-xl mr-2'
                    >
                        <MaterialIcons 
                        name="delivery-dining" size={24} color="#C67C4E"/>
                    </View>

                    <View
                        className='bg-[#ECECEC] p-2 rounded-xl mr-2'
                    >
                        <FontAwesome 
                        name="coffee" size={24} color="#C67C4E"/>
                    </View>

                    <View
                        className='bg-[#ECECEC] p-2 rounded-xl mr-2'
                    >
                        <MaterialCommunityIcons 
                        name="food-croissant"  size={24} color="#C67C4E"/>
                    </View>
                </View>

            </View>
        
            <View
                className='flex-row ml-1' 
                >
                <Octicons name="star-fill" size={24} color="#FBBE21" />
                <Text 
                className='pl-2 text-xl -mt-1 font-[Sora-SemiBold] text-[#2A2A2A]'
                >
                {rating}
                </Text>
            </View>

            <View className='items-center'>
                <View className='w-[90%] border-b-2 border-[#ECECEC] my-4' />
            </View>
        </View>
    </>
  )
}

export default DetailsHeader