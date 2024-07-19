import { StyleSheet, Text, View, StatusBar as bar } from "react-native";
import {StatusBar} from 'expo-status-bar'
export default function SafeStatusBar({safe=true, style='dark', children}){
    return <View style={{
      flex: 1,
      paddingTop: safe ? bar.currentHeight : 0,

    }}>
        <StatusBar style={style} />
        {children}
    </View>
}

const styles = StyleSheet.create({
    container: {
      // Adiciona altura da status bar
    },
  });