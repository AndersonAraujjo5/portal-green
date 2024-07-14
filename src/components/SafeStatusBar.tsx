import { StyleSheet, Text, View, StatusBar as bar } from "react-native";
import {StatusBar} from 'expo-status-bar'
export default function SafeStatusBar({children}){
    return <View style={styles.container}>
        <StatusBar style="dark" />
        {children}
    </View>
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: bar.currentHeight, // Adiciona altura da status bar
    },
  });