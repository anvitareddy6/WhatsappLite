import React from 'react';
import { LogBox, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ChatScreen from './src/screens/ChatScreen';
import ChatsListScreen from './src/screens/ChatsListScreen';
import CreateGroupScreen from './src/screens/CreateGroupScreen';
import SelectCharactersScreen from './src/screens/SelectCharactersScreen';

LogBox.ignoreAllLogs(true);
console.log = () => {};
console.warn = () => {};
console.error = () => {};
console.info = () => {};
console.debug = () => {};

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar 
        backgroundColor="#075E54" 
        barStyle="light-content" 
        translucent={false}
      />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="ChatsList"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#075E54',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: '600',
            },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen
            name="ChatsList"
            component={ChatsListScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Chat"
            component={ChatScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CreateGroup"
            component={CreateGroupScreen}
            options={{
              title: 'New Group',
              headerBackTitle: 'Back',
            }}
          />
          <Stack.Screen
            name="SelectCharacters"
            component={SelectCharactersScreen}
            options={{
              title: 'Add Characters',
              headerBackTitle: 'Back',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}