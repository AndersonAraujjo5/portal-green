import {Map} from "@/components/Map";
import { useLocalSearchParams } from "expo-router";

export default function mapa(){
    const { param } = useLocalSearchParams<{ param?: string }>();
    return(
        <Map param={param}/>
    )
}