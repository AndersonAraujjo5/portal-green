import { SimpleLineIcons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { mapaDefault, mapaRelevo, mapaSatellite } from '@/assets/images'
import { useState } from "react";
import { MotiView } from 'moti'
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

export default function CamadaMap({ setType }: any) {
    const [on, setOn] = useState('hidden');
    return (
        <>
            <View
                style={{
                    position: 'absolute',
                    top: 20,
                    right: 12,
                    backgroundColor: on === 'hidden' ? 'white' : '#94a3b8',
                    borderRadius: 9999,
                    padding: 10
                }}>
                <Pressable onPress={() => setOn(e => e == 'hidden' ? '' : 'hidden')}>
                    <SimpleLineIcons name="layers" size={25} color="black" />
                </Pressable>
            </View>
            {
                on !== 'hidden' &&
                <MotiView
                    from={{
                        opacity: 0,
                        translateY: 40
                    }}
                    animate={{
                        opacity: 1,
                        translateY: 0
                    }}
                >
                    <View style={styles.container}
                    >

                        <Text style={styles.title}>Tipo de mapa</Text>
                        <View style={styles.box}>
                            <Pressable onPress={() => setType(StyleURL.Street)}>
                                <Image source={mapaDefault}
                                    width={64} height={64} alt="mapa padrão" />
                                <Text style={styles.text}>Padrão</Text>
                            </Pressable>
                            <Pressable onPress={() => setType(StyleURL.SatelliteStreet)}>
                                <Image source={mapaSatellite}
                                    width={64} height={64} alt="mapa do satelite" />
                                <Text style={styles.text}>Satellite</Text>
                            </Pressable>
                            <Pressable onPress={() => setType(StyleURL.Outdoors)}>
                                <Image source={mapaRelevo}
                                    width={64} height={64} alt="mapa relevo" />
                                <Text style={styles.text}>Livre</Text>
                            </Pressable>
                        </View>
                    </View>
                </MotiView>
            }
        </>
    )
}
const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 160,
        backgroundColor: 'white',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        bottom: 0,
        alignItems: 'center',
        position: 'absolute',
        zIndex: 10,
    },
    title: {
        alignItems: 'flex-start',
        marginBottom: 18,
        marginTop: 18
    },
    box: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: 64,
        marginTop: 4,
        marginBottom: 4,
    },
    text: {
        textAlign: 'center',
        fontSize: 14,
        lineHeight: 20,
    }
})