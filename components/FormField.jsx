import { View, Text, TextInput,TouchableOpacity,Image } from 'react-native' 
import React, { useState } from 'react'
import icons from '../constants/icons'


const FormField =({title, value , placeholder , handleChangeText , otherStyles , keyBoardType,...props})=>{
    const [showPassword , setShowPassword] = useState(false)
    return ( 
        <View className= {`space y-2 ${otherStyles} `}>

        <Text className="text-base 
        text-gray-100 font-pmedium">{title}</Text>
        <View className="w-full h-16 px-4 bg-black-100 rounded-2xl border border-black-200 focus:border-secondary flex-row items-center">

        <TextInput 
        className="flex-1 text-white font-psemibold text-base"
        value={value}
        placeholder={placeholder}
        placeholderTextColor="#7b7b8b"
        onChangeText={handleChangeText}
        keyboardType={keyBoardType}
        secureTextEntry={title==='Password' && !showPassword}
        {...props}
        />
        {title === 'Password' && (
          <TouchableOpacity onPress={()=>setShowPassword(!showPassword)}>
            <Image 
              source={showPassword ? icons.eyeHide : icons.eye} 
              className="w-6 h-6" 
              resizeMode="contain" 
            />
          </TouchableOpacity>
        )}
        </View>
        </View>
    )
}

export default FormField