import { PropsWithChildren, ReactNode } from "react";
import { Text, TextInput, TextInputProps, View } from "react-native";

type InputProps = {
    children: ReactNode
}

function Input({children}: InputProps){
    return(
        <View className="w-full h-14 bg-gray-200 rounded-md ps-2 mt-4">
            {children}
        </View>
    )
}

function InputField({...rest}: TextInputProps){
    return (
        <TextInput 
        className="flex-1 font-normal text-base text-gray-700"
        />
    )
}

Input.Field = InputField;


export {Input}