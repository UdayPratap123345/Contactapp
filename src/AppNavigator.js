import {View, Text} from 'react-native';
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import AddUser from './screens/AddUser';
import ContactList from './screens/ContactList';
import UpdateContactList from './screens/UpdateUser';
import FavoriteScreen from './screens/Favouritescreen';
const Stack = createStackNavigator();
const AppNavigator = () => {
    
  return (
    <NavigationContainer>
        <Stack.Navigator initial="AddUser">
        <Stack.Screen
              component={AddUser}
              name={'AddUser'}
              options={{headerShown: false}}
            />
        <Stack.Screen
              component={ContactList}
              name={'ContactList'}
              options={{headerShown: false}}
            />
            <Stack.Screen
              component={UpdateContactList}
              name={'UpdateContactList'}
              options={{headerShown: false}}
            />
            
          </Stack.Navigator>
      
    </NavigationContainer>
  );
};

export default AppNavigator;
