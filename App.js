import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {
  LoginScreen,
  BackpackScreen,
  RegistrationScreen,
  TextEditor,
  CameraScreen,
  VideoScreen,
  AudioScreen,
  CanvasScreen,
} from './src/screens';
import auth from '@react-native-firebase/auth';
import {decode, encode} from 'base-64';
if (!global.btoa) {
  global.btoa = encode;
}
if (!global.atob) {
  global.atob = decode;
}

const Stack = createStackNavigator();

export default function App() {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  // Handle user state changes
  function onAuthStateChanged(usercred) {
    setUser(usercred);
    if (initializing) {
      setInitializing(false);
    }
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  });

  if (initializing) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <>
            <Stack.Screen
              name="Backpack"
              component={BackpackScreen}
              initialParams={{uid: user.uid}}
            />
            <Stack.Screen
              name="TextEditor"
              component={TextEditor}
              initialParams={{uid: user.uid}}
            />
            <Stack.Screen
              name="Camera"
              component={CameraScreen}
              initialParams={{uid: user.uid}}
            />
            <Stack.Screen
              name="Video"
              component={VideoScreen}
              initialParams={{uid: user.uid}}
            />
            <Stack.Screen
              name="Audio"
              component={AudioScreen}
              initialParams={{uid: user.uid}}
            />
            <Stack.Screen
              name="Canvas"
              component={CanvasScreen}
              options={{headerShown: false}}
              initialParams={{uid: user.uid}}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Registration" component={RegistrationScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

/*<Stack.Screen name="Backpack">
              {(props) => <Backpack {...props} extraData={user} />}
            </Stack.Screen>*/
