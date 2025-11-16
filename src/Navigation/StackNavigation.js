// import React from 'react';
// import {createStackNavigator} from '@react-navigation/stack';
// import SignUp from '../Screens/Signup';
// import Login from '../Screens/Login';
// import Home from '../Screens/Home';
// import BottomNavigation from './BottomNavigation';
// import AiChat from '../Screens/AiChat';
// import {SafeAreaProvider} from 'react-native-safe-area-context';
// import AllDoctorsList from '../Screens/AllDoctorsList';
// import DoctorsDetails from '../Screens/DoctorsDetails';
// import BookSlot from '../Screens/BookSlot';
// import OTP from '../Screens/OTP';
// import ServiceListScreen from '../Screens/ServiceListScreen';
// import Colors from '../constants/Colors'; // Fix import path
// import VideoCallScreen from '../Screens/VideoCallScreen';

// const Stack = createStackNavigator();

// const StackNavigation = () => {
//   return (
//     <SafeAreaProvider>
//       <Stack.Navigator initialRouteName="Login">
//         <Stack.Screen
//           name="Login"
//           component={Login}
//           options={{headerShown: false}}
//         />
//         <Stack.Screen
//           name="SignUp"
//           component={SignUp}
//           options={{headerShown: false}}
//         />
//         <Stack.Screen
//           name="OTP"
//           component={OTP}
//           options={{headerShown: false}}
//         />
//         <Stack.Screen
//           name="BottomNavigation"
//           component={BottomNavigation}
//           options={{headerShown: false}}
//         />
//         <Stack.Screen
//           name="AiChat"
//           component={AiChat}
//           options={{headerShown: false}}
//         />
//         <Stack.Screen
//           name="AllDoctorsList"
//           component={AllDoctorsList}
//           options={{headerShown: false}}
//         />
//         <Stack.Screen
//           name="DoctorsDetails"
//           component={DoctorsDetails}
//           options={{headerShown: false}}
//         />
//         <Stack.Screen
//           name="BookSlot"
//           component={BookSlot}
//           options={{headerShown: false}}
//         />
//         <Stack.Screen
//           name="Chemists"
//           component={ServiceListScreen}
//           options={{
//             headerShown: true,
//             title: 'Chemists',
//             headerStyle: {
//               backgroundColor: Colors.dark.background,
//             },
//             headerTintColor: Colors.dark.text,
//             headerTitleStyle: {
//               fontWeight: 'bold',
//             },
//           }}
//           initialParams={{ serviceType: 'chemists' }} // Add initialParams
//         />
//         <Stack.Screen
//           name="Pharmacists"
//           component={ServiceListScreen}
//           options={{
//             headerShown: true,
//             title: 'Pharmacists',
//             headerStyle: {
//               backgroundColor: Colors.dark.background,
//             },
//             headerTintColor: Colors.dark.text,
//             headerTitleStyle: {
//               fontWeight: 'bold',
//             },
//           }}
//           initialParams={{ serviceType: 'pharmacists' }} // Add initialParams
//         />
//         <Stack.Screen
//           name="Labs"
//           component={ServiceListScreen}
//           options={{
//             headerShown: true,
//             title: 'Diagnostic Labs',
//             headerStyle: {
//               backgroundColor: Colors.dark.background,
//             },
//             headerTintColor: Colors.dark.text,
//             headerTitleStyle: {
//               fontWeight: 'bold',
//             },
//           }}
//           initialParams={{ serviceType: 'labs' }} // Add initialParams
//         />
//         <Stack.Screen
//           name="VideoCallScreen"
//           component={VideoCallScreen}
//           options={{headerShown: false}}
//         />
//       </Stack.Navigator>
//     </SafeAreaProvider>
//   );
// };

// export default StackNavigation;

import React, {useState, useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {ActivityIndicator, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SignUp from '../Screens/Signup';
import Login from '../Screens/Login';
import Home from '../Screens/Home';
import BottomNavigation from './BottomNavigation';
import AiChat from '../Screens/AiChat';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AllDoctorsList from '../Screens/AllDoctorsList';
import DoctorsDetails from '../Screens/DoctorsDetails';
import BookSlot from '../Screens/BookSlot';
import OTP from '../Screens/OTP';
import ServiceListScreen from '../Screens/ServiceListScreen';
import Colors from '../constants/Colors';
import VideoCallScreen from '../Screens/VideoCallScreen';

const Stack = createStackNavigator();

const StackNavigation = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState('Login');

  useEffect(() => {
    checkUserAuth();
  }, []);

  const checkUserAuth = async () => {
    try {
      const userData = await AsyncStorage.getItem('user_data');
      console.log('User data from AsyncStorage:', userData);

      if (userData) {
        const parsedData = JSON.parse(userData);
        // Check if user data has required fields (id or userId)
        if (parsedData?.id || parsedData?.userId) {
          console.log('User is authenticated, navigating to BottomNavigation');
          setInitialRoute('BottomNavigation');
        } else {
          console.log('User data incomplete, navigating to Login');
          setInitialRoute('Login');
        }
      } else {
        console.log('No user data found, navigating to Login');
        setInitialRoute('Login');
      }
    } catch (error) {
      console.error('Error checking user authentication:', error);
      setInitialRoute('Login');
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <SafeAreaProvider>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: Colors.dark.background,
          }}>
          <ActivityIndicator size="large" color={Colors.dark.primary} />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="OTP"
          component={OTP}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="BottomNavigation"
          component={BottomNavigation}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="AiChat"
          component={AiChat}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="AllDoctorsList"
          component={AllDoctorsList}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="DoctorsDetails"
          component={DoctorsDetails}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="BookSlot"
          component={BookSlot}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Chemists"
          component={ServiceListScreen}
          options={{
            headerShown: true,
            title: 'Chemists',
            headerStyle: {
              backgroundColor: Colors.dark.background,
            },
            headerTintColor: Colors.dark.text,
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
          initialParams={{serviceType: 'chemists'}}
        />
        <Stack.Screen
          name="Pharmacists"
          component={ServiceListScreen}
          options={{
            headerShown: true,
            title: 'Pharmacists',
            headerStyle: {
              backgroundColor: Colors.dark.background,
            },
            headerTintColor: Colors.dark.text,
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
          initialParams={{serviceType: 'pharmacists'}}
        />
        <Stack.Screen
          name="Labs"
          component={ServiceListScreen}
          options={{
            headerShown: true,
            title: 'Diagnostic Labs',
            headerStyle: {
              backgroundColor: Colors.dark.background,
            },
            headerTintColor: Colors.dark.text,
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
          initialParams={{serviceType: 'labs'}}
        />
        <Stack.Screen
          name="VideoCall"
          component={VideoCallScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </SafeAreaProvider>
  );
};

export default StackNavigation;
