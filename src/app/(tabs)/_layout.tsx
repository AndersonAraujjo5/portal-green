import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { AntDesign, Entypo, Feather } from '@expo/vector-icons';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {

  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          title: 'Cadastro',
          tabBarIcon: ({ color }) => <AntDesign name="solution1" size={25} color={color} />
        }}
      />
      <Tabs.Screen
        name="mapa"
        options={{
          title: 'Mapa',
          headerShown: false,
          tabBarIcon: ({ color }) => <Entypo name="location" size={25} color={color} />,
        }}
      />
      <Tabs.Screen
        name="clientes"
        options={{
          title: 'Clientes',
          tabBarIcon: ({ color }) => <Feather name="align-left" size={25} color={color} />,
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <AntDesign name="user" size={25} color={color} />,
        }}
      />
    </Tabs>
  );
}
