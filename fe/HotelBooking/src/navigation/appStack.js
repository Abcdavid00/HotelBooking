import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import DetailHotel from '../views/DetailHotel/DetailHotel';
import Map from '../views/DetailHotel/Map';
import AllComments from '../views/DetailHotel/AllComments';
import DetailRoom from '../views/DetalRoom/DetailRoom';
import ImageRoom from '../views/DetalRoom/ImageRoom';
import OrderRoom from '../views/OrderRoom/OrderRoom';
import PaymentMethod from '../views/OrderRoom/PaymentMethod';
import About from '../views/Profile/About';
import ChangeLanguage from '../views/Profile/ChangeLanguage';
import Terms from '../views/Profile/Terms';
import InfoProfile from '../views/Profile/InfoProfile';
import ChangePassword from '../views/Profile/ChangePassword';
import TabNavigator from './tabNavigator';
const Stack = createNativeStackNavigator();

export default function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="TabNavigator"
        component={TabNavigator}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="DetailHotel"
        component={DetailHotel}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="DetailRoom"
        component={DetailRoom}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Map"
        component={Map}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AllComments"
        component={AllComments}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ImageRoom"
        component={ImageRoom}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="OrderRoom"
        component={OrderRoom}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="PaymentMethod"
        component={PaymentMethod}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="About"
        component={About}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Terms"
        component={Terms}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ChangeLanguage"
        component={ChangeLanguage}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="InfoProfile"
        component={InfoProfile}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
