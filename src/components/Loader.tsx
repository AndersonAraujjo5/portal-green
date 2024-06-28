import Colors from "@/constants/Colors";
import { ActivityIndicator, Text, View } from "react-native";

type LoaderProps = {
  show?: boolean
  text?: string
}

export default function Loader({ show = false, text }:LoaderProps) {
  return (
    <>
      {
        show &&
        <View className="flex-1 absolute w-full h-full z-10">
          <View className="relative">
            <View className="w-screen h-screen top-0 left-0 bg-gray-400 opacity-35"></View>
            <View className="absolute w-full h-full justify-center z-20">
              <ActivityIndicator size={60} color={Colors.green} />
              {text && <Text className="text-center">{text}</Text>}
            </View>
          </View>
        </View>
      }
    </>
  )
}