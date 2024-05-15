import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'
import SignUpForm from './components/SignUpForm';
import SignInForm from './components/SignInForm';
import EventList from './components/EventList';
import CreateEvent from './components/CreateEvent';
import SearchEvents from './components/SearchEvents';
import Settings from './components/Settings';

const Tab = createBottomTabNavigator();

export default function App() {
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const handleRegistrationSuccess = (userData) => {
    setUser(userData);
    setUserLoggedIn(true);
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setUserLoggedIn(true);
  };

  const handleLogout = () => {
    setUser(null);
    setUserLoggedIn(false);
  };

  return (
    <NavigationContainer>
      {userLoggedIn ? (
        <Tab.Navigator>
          <Tab.Screen
            name="EventList"
            options={{
              title: 'Tapahtumat',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="list" size={size} color={color} />
              ),
            }}>
            {() => <EventList user={user} />}
          </Tab.Screen>
          <Tab.Screen
            name="Search"
            component={SearchEvents}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="search" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="CreateEvent"
            component={CreateEvent}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="add-circle" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Settings"
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="settings" size={size} color={color} />
              ),
            }}>
            {() => <Settings onLogout={handleLogout} />}
          </Tab.Screen>
        </Tab.Navigator>
      ) : (
        <View style={styles.container}>
          <SignInForm onLoginSuccess={handleLoginSuccess} />
          <SignUpForm onRegistrationSuccess={handleRegistrationSuccess} />
        </View>
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
});