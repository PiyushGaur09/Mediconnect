import React from 'react';
import { View, Image, Platform, StyleSheet, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import Colors from '../constants/Colors';

import Home from '../Screens/Home';
import Notification from '../Screens/Notification';
import Booking from '../Screens/Booking';
import Profile from '../Screens/Profile';

const Tab = createBottomTabNavigator();

const BottomNavigation = () => {
  const deviceScheme = useColorScheme();

  // Allow automatic theme detection
  const scheme = deviceScheme === 'light' ? 'dark' : 'dark';
  const theme = Colors[scheme] || Colors.dark || {};

  const palette = {
    background: theme.background ?? (scheme === 'dark' ? '#0A1830' : '#FFFFFF'),
    card: theme.card ?? (scheme === 'dark' ? '#0F2034' : '#F8F8F8'),
    primary: theme.primary ?? '#8337B2',
    muted: theme.muted ?? '#6B7280',
    border: theme.border ?? (scheme === 'dark' ? '#243142' : '#E5E5E5'),
    label: theme.text ?? (scheme === 'dark' ? '#FFFFFF' : '#000000'),
    inactiveBg: scheme === 'dark' ? '#0F2034' : '#FFFFFF',
    inactiveLabel: scheme === 'dark' ? '#FFFFFF' : '#6B7280',
  };

  const ICON_WRAPPER_SIZE = 40;
  const ICON_SIZE = 24;

  const getIconForRoute = (routeName, scheme) => {
    try {
      if (routeName === 'Home') {
        return scheme === 'dark'
          ? require('../Images/icons/home-dark.png')
          : require('../Images/icons/home-light.png');
      }
      if (routeName === 'Notification') {
        return scheme === 'dark'
          ? require('../Images/icons/notification-dark.png')
          : require('../Images/icons/notification-light.png');
      }
      if (routeName === 'Booking') {
        return scheme === 'dark'
          ? require('../Images/icons/booking-dark.png')
          : require('../Images/icons/booking-light.png');
      }
      if (routeName === 'Profile') {
        return scheme === 'dark'
          ? require('../Images/icons/profile-dark.png')
          : require('../Images/icons/profile-light.png');
      }
    } catch (e) {
      if (routeName === 'Home')
        return require('../Images/icons/home-light.png');
      if (routeName === 'Notification')
        return require('../Images/icons/notification-light.png');
      if (routeName === 'Booking')
        return require('../Images/icons/booking-light.png');
      if (routeName === 'Profile')
        return require('../Images/icons/profile-light.png');
    }
    return require('../Images/icons/home-light.png');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: palette.background }}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: [
            styles.tabBar,
            {
              backgroundColor: palette.card,
              borderTopColor: palette.border,
              height: Platform.OS === 'ios' ? 86 : 74,
              paddingBottom: Platform.OS === 'ios' ? 10 : 10,
            },
          ],
          tabBarIcon: ({ focused }) => {
            const iconSource = getIconForRoute(route.name, scheme);
            const circleColor = focused
              ? palette.primary
              : palette.inactiveBg;
            const labelColor = focused
              ? palette.primary
              : palette.inactiveLabel;

            return (
              <View style={styles.tabItemContainer}>
                <View
                  style={[
                    styles.iconCircle,
                    {
                      width: ICON_WRAPPER_SIZE,
                      height: ICON_WRAPPER_SIZE,
                      borderRadius: ICON_WRAPPER_SIZE / 2,
                      backgroundColor: circleColor,
                      ...(focused ? styles.iconCircleShadow : {}),
                    },
                  ]}
                >
                  <Image
                    source={iconSource}
                    style={{
                      width: ICON_SIZE,
                      height: ICON_SIZE,
                      resizeMode: 'contain',
                    }}
                  />
                </View>

                <View>
                  <Text style={[styles.tabLabel, { color: labelColor }]}>
                    {route.name}
                  </Text>
                </View>
              </View>
            );
          },
        })}
      >
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Notification" component={Notification} />
        <Tab.Screen name="Booking" component={Booking} />
        <Tab.Screen name="Profile" component={Profile} />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    paddingTop: 8,
    // borderTopWidth: 1,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  tabItemContainer: {
    width: 84,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  iconCircle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 4,
  },
});

export default BottomNavigation;
