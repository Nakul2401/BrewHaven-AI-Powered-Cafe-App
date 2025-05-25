import { Text, View, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import React from 'react';

interface DetailsInterface {
    description: string;
}

const DescriptionSection = ({ description }: DetailsInterface) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <View>
            <Text className="text-[#242424] text-lg font-[Sora-SemiBold] ml-1">
                Description
            </Text>

            <View className="ml-1 mr-1 mt-2">
                <Text numberOfLines={expanded ? undefined : 3} className="text-[#A2A2A2] text-sm font-[Sora-Regular] text-justify">
                    {expanded ? description : `${description.slice(0, 100)}...`}
                    <TouchableOpacity onPress={() => setExpanded(!expanded)}>
                        <Text className="text-app_orange_color text-xs font-[Sora-SemiBold] -mb-1 ml-1">
                            {expanded ? ' Read Less' : ' Read More'}
                        </Text>
                    </TouchableOpacity>
                </Text>
            </View>
        </View>
    );
};

export default DescriptionSection;
