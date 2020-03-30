import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

const AppStack = createStackNavigator();

import Main from './pages/Main';
import Profile from './pages/Profile';

export default function Routes() {
  return(
    <NavigationContainer>
      <AppStack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#7d40e7',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerTitleAlign: 'center',
        }}
      >
        <AppStack.Screen component={Main} name="Main" options={{ title: 'DevRadar' }}/>
        <AppStack.Screen component={Profile} name="Profile" options={{ title: 'Github Profile' }}/>
      </AppStack.Navigator>
    </NavigationContainer>
  )
}