// AirQuality.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  SafeAreaView,
  useColorScheme,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Colors from '../constants/Colors'; // your Colors file

const {width} = Dimensions.get('window');

const AirQuality = () => {
  const colorScheme = useColorScheme(); // 'light' | 'dark' | null
  const scheme = colorScheme === 'light' ? 'light' : 'dark';
  const colors = Colors[scheme] || Colors.dark;
  const isDark = scheme === 'dark';

  const styles = createStyles(colors, isDark);

  // theme-specific images (replace filenames with your actual assets)
  const backIcon = isDark
    ? require('../Images/back_dark.png')
    : require('../Images/back_light.png');

  const mapImage = isDark
    ? require('../Images/map.png')
    : require('../Images/map.png');

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.background}]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          //   onPress={() => (navigation ? navigation.goBack() : null)}
        >
          <Image
            source={backIcon}
            style={[styles.icon, {tintColor: colors.text}]} // tintColor only if icon is monochrome PNG
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>AQI</Text>

        <View style={styles.headerRightPlaceholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* Map */}
        <View style={styles.mapCard}>
          <Image source={mapImage} style={styles.mapImage} resizeMode="cover" />
        </View>

        {/* Current Air Quality */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Air Quality</Text>

          <View style={[styles.bigCard, {backgroundColor: colors.card}]}>
            <View style={styles.rowSpace}>
              <View>
                <Text style={[styles.statusText, {color: colors.text}]}>
                  Good
                </Text>
                <Text
                  style={[
                    styles.subText,
                    {color: colors.muted || colors.text},
                  ]}>
                  San Francisco
                </Text>
              </View>

              <View style={styles.aqiBox}>
                <Text style={[styles.aqiValue, {color: colors.primary}]}>
                  35
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Health Advisories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Health Advisories</Text>

          <View style={[styles.bigCard, {backgroundColor: colors.card}]}>
            <Text
              style={[
                styles.advisoryText,
                {color: colors.muted || colors.text},
              ]}>
              Air quality is considered satisfactory, and air pollution poses
              little or no risk.
            </Text>
          </View>
        </View>

        {/* Other Locations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Other Locations</Text>

          <View style={[styles.smallCard, {backgroundColor: colors.card}]}>
            <View style={styles.rowSpace}>
              <View>
                <View
                  style={[styles.pill, {backgroundColor: colors.secondary}]}>
                  <Text style={styles.pillText}>Moderate</Text>
                </View>
                <Text
                  style={[
                    styles.subText,
                    {color: colors.muted || colors.text},
                  ]}>
                  Oakland
                </Text>
              </View>
              <Text style={[styles.smallAqi, {color: colors.primary}]}>65</Text>
            </View>
          </View>

          <View style={[styles.smallCard, {backgroundColor: colors.card}]}>
            <View style={styles.rowSpace}>
              <View>
                <View style={[styles.pill, {backgroundColor: colors.primary}]}>
                  <Text style={styles.pillText}>Good</Text>
                </View>
                <Text
                  style={[
                    styles.subText,
                    {color: colors.muted || colors.text},
                  ]}>
                  Berkeley
                </Text>
              </View>
              <Text style={[styles.smallAqi, {color: colors.primary}]}>40</Text>
            </View>
          </View>
        </View>

        <View style={{height: 40}} />
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (colors, isDark) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      //   height: 56,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 8,
      paddingVertical: 16,
      marginTop:16
    },
    backButton: {
      width: 36,
      height: 36,
      alignItems: 'center',
      justifyContent: 'center',
    },
    icon: {
      width: 20,
      height: 20,
      resizeMode: 'contain',
    },
    headerTitle: {
      color: colors.text,
      fontSize: 18,
      fontWeight: '700',
      textAlign: 'center',
    },
    headerRightPlaceholder: {
      width: 36,
    },

    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: 60,
    },

    mapCard: {
      marginHorizontal: 20,
      borderRadius: 12,
      overflow: 'hidden',
      height: Math.round((width - 40) * 0.5),
      backgroundColor: colors.primary + '20',
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 6},
      shadowOpacity: 0.18,
      shadowRadius: 10,
      elevation: 6,
    },
    mapImage: {
      width: '100%',
      height: '100%',
    },

    section: {
      marginTop: 22,
    },
    sectionTitle: {
      fontSize: 22,
      fontWeight: '800',
      color: colors.text,
      marginHorizontal: 20,
      marginBottom: 12,
    },

    bigCard: {
      marginHorizontal: 20,
      borderRadius: 16,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 6},
      shadowOpacity: 0.12,
      shadowRadius: 10,
      elevation: 4,
    },
    rowSpace: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
    },
    statusText: {
      fontSize: 16,
      fontWeight: '500',
    },
    subText: {
      marginTop: 6,
      fontSize: 14,
      fontWeight: '400',
      opacity: 0.9,
    },
    aqiBox: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    aqiValue: {
      fontSize: 16,
      fontWeight: '600',
    },
    advisoryText: {
      fontSize: 16,
      lineHeight: 22,
    },

    smallCard: {
      marginHorizontal: 20,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 3,
    },
    pill: {
      alignSelf: 'flex-start',
      paddingHorizontal: 14,
      paddingVertical: 6,
      borderRadius: 20,
      marginBottom: 8,
    },
    pillText: {
      fontSize: 13,
      fontWeight: '800',
      color: '#fff',
    },
    smallAqi: {
      fontSize: 32,
      fontWeight: '900',
    },
  });

export default AirQuality;
