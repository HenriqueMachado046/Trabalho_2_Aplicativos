import 'setimmediate';
import 'react-native-get-random-values';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { AuthProvider } from './src/context/AuthContext';
import Post from './src/screens/Post';
import Home from './src/screens/Home';
import Login from './src/screens/Login';
import Register from './src/screens/Register';
import { initDB } from './src/database/Database';

const Stack = createStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={Login} options={{ title: 'Login' }} />
            <Stack.Screen name="Register" component={Register} options={{ title: 'Cadastrar' }} />
            <Stack.Screen name="Home" component={Home} options={{ title: 'Posts' }} />
            <Stack.Screen name="Post" component={Post} options={{ title: 'Criar novo post' }} />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </AuthProvider>
  );
}
