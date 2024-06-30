import { SimpleLineIcons } from "@expo/vector-icons";
import { Image, Pressable, Text, View } from "react-native";
import { mapaDefault, mapaRelevo, mapaSatellite } from '@/assets/images'
import { useState } from "react";

export enum StyleURL {
    Street = 'mapbox://styles/mapbox/streets-v11',
    Dark = 'mapbox://styles/mapbox/dark-v10',
    Light = 'mapbox://styles/mapbox/light-v10',
    Outdoors = 'mapbox://styles/mapbox/outdoors-v11',
    Satellite = 'mapbox://styles/mapbox/satellite-v9',
    SatelliteStreet = 'mapbox://styles/mapbox/satellite-streets-v12',
    TrafficDay = 'mapbox://styles/mapbox/navigation-preview-day-v4',
    TrafficNight = 'mapbox://styles/mapbox/navigation-preview-night-v4',
  }

export default function CamadaMap({ setType }:any) {
    const [on, setOn] = useState('hidden');
    return (
        <>
            <View className={`absolute top-5 right-5 ${on == 'hidden' ? 'bg-white' : 'bg-slate-400'} rounded-full p-3`}>
                <Pressable onPress={() => setOn(e => e == 'hidden' ? '' : 'hidden')}>
                    <SimpleLineIcons name="layers" size={20} color="black" />
                </Pressable>
            </View>
            <View className={`${on} w-full h-40 rounded-t-lg bg-white bottom-0 py-5 items-center absolute z-10`}>
                <Text className="items-start">Tipo de mapa</Text>
                <View className="flex-wrap gap-16 my-4">
                    <Pressable onPress={() => setType(StyleURL.Street)}>
                        <Image source={mapaDefault}
                            width={64} height={64} alt="mapa padrão" />
                        <Text className="text-sm text-center">Padrão</Text>
                    </Pressable>
                    <Pressable onPress={() => setType(StyleURL.SatelliteStreet)}>
                        <Image source={mapaSatellite}
                            width={64} height={64} alt="mapa do satelite" />
                        <Text className="text-sm text-center">Satellite</Text>
                    </Pressable>
                    <Pressable onPress={() => setType(StyleURL.Outdoors)}>
                        <Image source={mapaRelevo}
                            width={64} height={64} alt="mapa relevo" />
                        <Text className="text-sm text-center">Livre</Text>
                    </Pressable>
                </View>
            </View>
        </>
    )
}