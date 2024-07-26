import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createSwitchNavigator } from '@react-navigation/native';
import { AuthProvider, AuthContext } from './src/contexts/AuthContext';

import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import ArtifactsScreen from './src/screens/ArtifactsScreen';
import PodScreen from './src/screens/PodScreen';
import ProposalScreen from './src/screens/ProposalScreen';
import EventScreen from './src/screens/EventScreen';
import ResourceScreen from './src/screens/ResourceScreen';

const AuthStack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Switch = createSwitchNavigator();

const AuthNavigator = () => (
  <AuthStack.Navigator>
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Register" component={RegisterScreen} />
  </AuthStack.Navigator>
);

const MainTabNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen 
      name="Home" 
      component={HomeScreen} 
      options={{ 
        tabBarIcon: ({ color, size }) => (
          // Add icon component here
        ),
      }}
    />
    <Tab.Screen 
      name="Pods" 
      component={PodScreen} 
      options={{ 
        tabBarIcon: ({ color, size }) => (
          // Add icon component here
        ),
      }}
    />
    <Tab.Screen 
      name="Proposals" 
      component={ProposalScreen} 
      options={{ 
        tabBarIcon: ({ color, size }) => (
          // Add icon component here
        ),
      }}
    />
    <Tab.Screen 
      name="Events" 
      component={EventScreen} 
      options={{ 
        tabBarIcon: ({ color, size }) => (
          // Add icon component here
        ),
      }}
    />
    <Tab.Screen 
      name="Resources" 
      component={ResourceScreen} 
      options={{ 
        tabBarIcon: ({ color, size }) => (
          // Add icon component here
        ),
      }}
    />
  </Tab.Navigator>
);

const App = () => {
  const { isLoading, userToken } = useContext(AuthContext);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      {userToken == null ? (
        <AuthNavigator />
      ) : (
        <MainTabNavigator />
      )}
    </NavigationContainer>
  );
};

const AppWithAuth = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

export default AppWithAuth;