import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Colors from '../constants/Colors.js';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Image URLs for different services
const imageUrls = {
  profile: 'https://randomuser.me/api/portraits/men/32.jpg',
  heart: 'https://cdn-icons-png.flaticon.com/512/2589/2589175.png',
  lungs: 'https://cdn-icons-png.flaticon.com/512/3050/3050153.png',
  help_icon: 'https://cdn-icons-png.flaticon.com/512/4320/4320374.png',
  chemist: 'https://cdn-icons-png.flaticon.com/512/3020/3020734.png',
  pharmacy: 'https://cdn-icons-png.flaticon.com/512/3022/3022555.png',
  lab: 'https://cdn-icons-png.flaticon.com/512/3022/3022565.png',
};

export default function Home() {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const userDataString = await AsyncStorage.getItem('user_data');
      if (userDataString) {
        const parsedData = JSON.parse(userDataString);
        setUserData(parsedData);
      }
    } catch (error) {
      console.error('Error fetching user data from AsyncStorage:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get user's display name
  const getUserDisplayName = () => {
    if (!userData) return 'User';

    return (
      userData?.details?.full_name ||
      userData.username ||
      userData.email ||
      'User'
    );
  };

  // Get user's profile picture
  const getUserProfilePicture = () => {
    if (!userData) return imageUrls.profile;

    return userData.profile_picture || userData.avatar || imageUrls.profile;
  };

  // Show loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={Colors.dark.background}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.dark.primary} />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Colors.dark.background}
      />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Image
            source={{uri: getUserProfilePicture()}}
            style={styles.profileImage}
            defaultSource={{
              uri: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
            }}
          />
          <View style={styles.greeting}>
            <Text style={styles.welcome}>Welcome back</Text>
            <Text style={styles.username}>{getUserDisplayName()}</Text>
          </View>
        </View>
        {/* Health Checkup Cards */}
        <TouchableOpacity style={styles.healthCard} activeOpacity={0.9}>
          <View style={styles.healthCardContent}>
            <View style={styles.healthCardLeft}>
              <View style={[styles.healthIconWrap, styles.heartIcon]}>
                <Image
                  source={{uri: imageUrls.heart}}
                  style={styles.healthIcon}
                  defaultSource={{
                    uri: 'https://cdn-icons-png.flaticon.com/512/2589/2589175.png',
                  }}
                />
              </View>
              <View style={styles.healthTextContent}>
                <Text style={styles.healthCardTitle}>Heart Checkup</Text>
                <Text style={styles.healthCardSubtitle}>
                  Comprehensive heart health analysis and monitoring
                </Text>
              </View>
            </View>
            <View style={styles.healthCardRight}>
              <Text style={styles.startText}>Start</Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.healthCard} activeOpacity={0.9}>
          <View style={styles.healthCardContent}>
            <View style={styles.healthCardLeft}>
              <View style={[styles.healthIconWrap, styles.lungsIcon]}>
                <Image
                  source={{uri: imageUrls.lungs}}
                  style={styles.healthIcon}
                  defaultSource={{
                    uri: 'https://cdn-icons-png.flaticon.com/512/3050/3050153.png',
                  }}
                />
              </View>
              <View style={styles.healthTextContent}>
                <Text style={styles.healthCardTitle}>Lungs Testing</Text>
                <Text style={styles.healthCardSubtitle}>
                  Lung capacity and respiratory health assessment
                </Text>
              </View>
            </View>
            <View style={styles.healthCardRight}>
              <Text style={styles.startText}>Start</Text>
            </View>
          </View>
        </TouchableOpacity>
        {/* Consult a Doctor Card */}
        <TouchableOpacity
          style={styles.consultCard}
          activeOpacity={0.9}
          onPress={() => {
            navigation.navigate('AiChat');
          }}>
          <View style={styles.consultCardContent}>
            <View style={styles.consultLeft}>
              <View style={styles.consultIconWrap}>
                <Image
                  source={{uri: imageUrls.help_icon}}
                  style={styles.consultIcon}
                  defaultSource={{
                    uri: 'https://cdn-icons-png.flaticon.com/512/4320/4320374.png',
                  }}
                />
              </View>
              <View style={styles.consultTextContent}>
                <Text style={styles.consultTitle}>Consult A Doctor</Text>
                <Text style={styles.consultSubtitle}>
                  Connect with a doctor instantly for video consultation
                </Text>
              </View>
            </View>
            <View style={styles.scheduleBtn}>
              <Text style={styles.scheduleBtnText}>Schedule Now</Text>
            </View>
          </View>
        </TouchableOpacity>
       
        {/* Service Provider Cards */}
        <View style={styles.servicesHeader}>
          <Text style={styles.servicesTitle}>Find Service Providers</Text>
        </View>
        <View style={styles.servicesContainer}>
          <TouchableOpacity
            style={styles.serviceCard}
            onPress={() =>
              navigation.navigate('Chemists', {serviceType: 'chemists'})
            }>
            <View style={[styles.serviceIconWrap, styles.chemistIcon]}>
              <Image
                source={{uri: imageUrls.chemist}}
                style={styles.serviceIcon}
                defaultSource={{
                  uri: 'https://cdn-icons-png.flaticon.com/512/3020/3020734.png',
                }}
              />
            </View>
            <Text style={styles.serviceTitle}>Chemists</Text>
            <Text style={styles.serviceSubtitle}>Find nearby chemists</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.serviceCard}
            onPress={() =>
              navigation.navigate('Pharmacists', {serviceType: 'pharmacists'})
            }>
            <View style={[styles.serviceIconWrap, styles.pharmacyIcon]}>
              <Image
                source={{uri: imageUrls.pharmacy}}
                style={styles.serviceIcon}
                defaultSource={{
                  uri: 'https://cdn-icons-png.flaticon.com/512/3022/3022555.png',
                }}
              />
            </View>
            <Text style={styles.serviceTitle}>Pharmacists</Text>
            <Text style={styles.serviceSubtitle}>Professional pharmacists</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.serviceCard}
            onPress={() => navigation.navigate('Labs', {serviceType: 'labs'})}>
            <View style={[styles.serviceIconWrap, styles.labIcon]}>
              <Image
                source={{uri: imageUrls.lab}}
                style={styles.serviceIcon}
                defaultSource={{
                  uri: 'https://cdn-icons-png.flaticon.com/512/3022/3022565.png',
                }}
              />
            </View>
            <Text style={styles.serviceTitle}>Labs</Text>
            <Text style={styles.serviceSubtitle}>Diagnostic labs & tests</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  scroll: {
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.dark.background,
  },
  loadingText: {
    color: Colors.dark.text,
    fontSize: 16,
    marginTop: 12,
  },

  /* Header */
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
  },
  greeting: {
    flexDirection: 'column',
  },
  welcome: {
    color: Colors.dark.text,
    opacity: 0.8,
    fontSize: 14,
  },
  username: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: '700',
  },

  /* Health Cards */
  healthCard: {
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)',
  },
  healthCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  healthCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  healthIconWrap: {
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  heartIcon: {
    backgroundColor: 'rgba(220, 53, 69, 0.2)',
  },
  lungsIcon: {
    backgroundColor: 'rgba(32, 201, 151, 0.2)',
  },
  healthIcon: {
    width: 30,
    height: 30,
  },
  healthTextContent: {
    flex: 1,
  },
  healthCardTitle: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  healthCardSubtitle: {
    color: Colors.dark.text,
    opacity: 0.7,
    fontSize: 14,
    lineHeight: 18,
  },
  healthCardRight: {
    marginLeft: 12,
  },
  startText: {
    color: Colors.dark.primary,
    fontWeight: '700',
    fontSize: 14,
  },

  /* Consult Doctor Card */
  consultCard: {
    backgroundColor: Colors.dark.primary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
  },
  consultCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  consultLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  consultIconWrap: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  consultIcon: {
    width: 28,
    height: 28,
  },
  consultTextContent: {
    flex: 1,
  },
  consultTitle: {
    color: Colors.dark.background,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  consultSubtitle: {
    color: Colors.dark.background,
    opacity: 0.9,
    fontSize: 14,
    lineHeight: 18,
  },
  scheduleBtn: {
    backgroundColor: Colors.dark.background,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginLeft: 12,
  },
  scheduleBtnText: {
    color: Colors.dark.primary,
    fontWeight: '700',
    fontSize: 14,
  },

  /* Services Section */
  servicesHeader: {
    marginBottom: 16,
  },
  servicesTitle: {
    color: Colors.dark.text,
    fontSize: 20,
    fontWeight: '700',
  },
  servicesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  serviceCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 16,
    padding: 8,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)',
  },
  serviceIconWrap: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  chemistIcon: {
    backgroundColor: 'rgba(108, 117, 125, 0.2)',
  },
  pharmacyIcon: {
    backgroundColor: 'rgba(13, 110, 253, 0.2)',
  },
  labIcon: {
    backgroundColor: 'rgba(111, 66, 193, 0.2)',
  },
  serviceIcon: {
    width: 24,
    height: 24,
  },
  serviceTitle: {
    color: Colors.dark.text,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
    textAlign: 'center',
  },
  serviceSubtitle: {
    color: Colors.dark.text,
    opacity: 0.7,
    fontSize: 12,
    textAlign: 'center',
  },
});
