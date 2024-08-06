import { StyleSheet, Text, View, StatusBar as bar } from "react-native";
import {StatusBar} from 'expo-status-bar'
export default function SafeStatusBar({safe=true, color = '', children}){
    return <View style={{
      flex: 1,
      paddingTop: safe ? bar.currentHeight : 0,

    }}>
        <StatusBar backgroundColor={color} style={'dark'} />
        {children}
    </View>
}

const styles = StyleSheet.create({
    container: {
      // Adiciona altura da status bar
    },
  });