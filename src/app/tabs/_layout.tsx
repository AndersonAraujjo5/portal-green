import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import {  Tabs } from 'expo-router';
import { AntDesign, Entypo, Feather } from '@expo/vector-icons';
import LoginBD from '@/database/LoginBD';
import Colors from '@/constants/Colors';

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
        name="home"
        options={{
          headerShown: false,
          title: 'Inicio',
          tabBarInactiveTintColor: Colors.gray,
          tabBarActiveTintColor: Colors.green,
          tabBarIcon: ({ color }) => <AntDesign name="home" size={25} color={color} />
        }}
      />
      <Tabs.Screen
        name="cadastro/fisica"
        options={{
          href: null,
          headerShown: false
        }}
      />
      <Tabs.Screen
        name="cadastro/juridico"
        options={{
          href: null,
          headerShown: false
        }}
      />
      <Tabs.Screen
        name="mapa"
        options={{
          title: 'Mapa',
          headerShown: false,
          tabBarInactiveTintColor: Colors.gray,
          tabBarActiveTintColor: Colors.green,
          tabBarIcon: ({ color }) => <Entypo name="location" size={25} color={color} />,
        }}
      />
      <Tabs.Screen
        name="clientes"
        options={{
          title: 'Clientes',
          headerShown: false,
          tabBarInactiveTintColor: Colors.gray,
          tabBarActiveTintColor: Colors.green,
          tabBarIcon: ({ color }) => <Feather name="align-left" size={25} color={color} />,
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: LoginBD.find()?.usuario.nome,
          tabBarInactiveTintColor: Colors.gray,
          tabBarActiveTintColor: Colors.green,
          tabBarIcon: ({ color }) => <AntDesign name="user" size={25} color={color} />,
        }}
      />
    </Tabs>
  );
}
