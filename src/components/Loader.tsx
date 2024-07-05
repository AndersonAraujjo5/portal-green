import Colors from "@/constants/Colors";
import { ActivityIndicator, Dimensions, StyleSheet, Text, View } from "react-native";

type LoaderProps = {
  show?: boolean
  text?: string
}

const { width, height } = Dimensions.get('window');
export default function Loader({ show = false, text }:LoaderProps) {
  return (
    <>
      {
        show &&
        <View style={styles.container}>
          <View style={{position: 'relative'}}>

            <View style={styles.box}>
              <ActivityIndicator size={60} color={Colors.green} />
              {text && <Text style={{textAlign: 'center'}}>{text}</Text>}
            </View>
          </View>
        </View>
      }
    </>
  )
}
const styles = StyleSheet.create({
  container:{
    flex: 1,
    position: 'absolute',
    width: width,
    height: height,
    zIndex: 10,
    marginTop:25,
    backgroundColor: 'rgba(156, 163, 175,0.5)'
  }, 
  box:{
    position: 'absolute',
    width: width,
    height:height,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    zIndex: 20,
  }
})