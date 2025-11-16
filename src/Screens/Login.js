// import React, {useState} from 'react';
// import {
//   SafeAreaView,
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   KeyboardAvoidingView,
//   Platform,
//   StatusBar,
// } from 'react-native';
// import Colors from '../constants/Colors.js';
// import {useNavigation} from '@react-navigation/native';

// export default function Login() {
//   const navigation = useNavigation();
//   const [phone, setPhone] = useState('');
//   const [otp, setOtp] = useState('');

//   return (
//     <SafeAreaView style={styles.safe}>
//       <StatusBar
//         barStyle="light-content"
//         backgroundColor={Colors.dark.background}
//       />
//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         style={styles.container}>
//         <View style={styles.inner}>
//           <Text style={styles.title}>Login Information</Text>

//           <View style={styles.field}>
//             <Text style={styles.label}>Phone Number</Text>
//             <TextInput
//               value={phone}
//               onChangeText={setPhone}
//               placeholder="Enter  your Number"
//               placeholderTextColor="rgba(255,255,255,0.35)"
//               keyboardType="phone-pad"
//               style={styles.input}
//             />
//           </View>

//           <View style={styles.field}>
//             <Text style={styles.label}>Enter OTP</Text>
//             <TextInput
//               value={otp}
//               onChangeText={setOtp}
//               placeholder="Enter OTP"
//               placeholderTextColor="rgba(255,255,255,0.35)"
//               keyboardType="numeric"
//               style={styles.input}
//             />
//           </View>

//           <TouchableOpacity
//             onPress={() => {
//               navigation.navigate('BottomNavigation')
//             }}
//             style={styles.button}
//             activeOpacity={0.85}>
//             <Text style={styles.buttonText}>Login</Text>
//           </TouchableOpacity>
//         </View>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safe: {
//     flex: 1,
//     backgroundColor: Colors.dark.background,
//   },
//   container: {
//     flex: 1,
//   },
//   inner: {
//     flex: 1,
//     justifyContent: 'center', // centers vertically
//     alignItems: 'flex-start', // keeps left alignment
//     paddingHorizontal: 24,
//   },
//   title: {
//     color: Colors.dark.text,
//     fontSize: 26,
//     fontWeight: '700',
//     marginBottom: 28,
//   },
//   field: {
//     marginBottom: 18,
//     width: '100%',
//   },
//   label: {
//     color: Colors.dark.text,
//     opacity: 0.9,
//     marginBottom: 8,
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   input: {
//     height: 52,
//     borderRadius: 10,
//     backgroundColor: 'rgba(255,255,255,0.03)',
//     paddingHorizontal: 14,
//     color: Colors.dark.text,
//     fontSize: 16,
//     borderWidth: 1,
//     borderColor: 'rgba(255,255,255,0.04)',
//     width: '100%',
//   },
//   button: {
//     marginTop: 12,
//     height: 52,
//     borderRadius: 10,
//     backgroundColor: Colors.dark.primary,
//     justifyContent: 'center',
//     alignItems: 'center',
//     width: '100%',
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 6},
//     shadowOpacity: 0.12,
//     shadowRadius: 12,
//     elevation: 4,
//   },
//   buttonText: {
//     color: Colors.dark.background,
//     fontWeight: '700',
//     fontSize: 16,
//   },
// });




import React, {useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import Colors from '../constants/Colors.js';
import {useNavigation} from '@react-navigation/native';

const API_BASE_URL = 'https://mediconnect-lemon.vercel.app/api/auth';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export default function Login() {
  const navigation = useNavigation();
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = async () => {
    if (!phone.trim()) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }

    const cleanPhone = phone.replace(/\D/g, '');
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(cleanPhone)) {
      Alert.alert('Error', 'Please enter a valid 10-digit phone number');
      return;
    }

    setIsLoading(true);
    try {
      console.log('Sending OTP request for phone:', cleanPhone);
      
      const response = await api.post('/patient/login', {
        phone_number: cleanPhone,
      });

      console.log('OTP Response:', response.data);

      if (response.data && response.data.success ) {
        // Navigate to OTP screen with user data
        navigation.navigate('OTP', {
          phoneNumber: cleanPhone,
          userId: response.data?.data?.user_id,
          demoOtp: response.data.otp // For testing
        });
        
        Alert.alert('Success', response.data.message || 'OTP sent to your phone number');
      } else {
        throw new Error(response.data.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('OTP Request Error:', error);
      
      let errorMessage = 'Failed to send OTP. Please try again.';
      
      if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout. Please check your connection.';
      } else if (error.response) {
        switch (error.response.status) {
          case 404:
            errorMessage = 'Service temporarily unavailable. Please try again later.';
            break;
          case 500:
            errorMessage = 'Server error. Please try again later.';
            break;
          case 400:
            errorMessage = error.response.data?.message || 'Invalid phone number format.';
            break;
          default:
            errorMessage = error.response.data?.message || `Error: ${error.response.status}`;
        }
      } else if (error.request) {
        errorMessage = 'No response from server. Please check your internet connection.';
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPhoneNumber = (text) => {
    const cleaned = text.replace(/\D/g, '');
    const limited = cleaned.slice(0, 10);
    
    let formatted = limited;
    if (limited.length > 6) {
      formatted = `${limited.slice(0, 5)} ${limited.slice(5)}`;
    } else if (limited.length > 5) {
      formatted = `${limited.slice(0, 5)} ${limited.slice(5)}`;
    } else if (limited.length > 3) {
      formatted = `${limited.slice(0, 5)}`;
    }
    
    setPhone(formatted);
  };



  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Colors.dark.background}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <View style={styles.inner}>
          <Text style={styles.title}>Patient Login</Text>
          <Text style={styles.subtitle}>Enter your phone number to continue</Text>

          <View style={styles.field}>
            <Text style={styles.label}>Phone Number *</Text>
            <TextInput
              value={phone}
              onChangeText={formatPhoneNumber}
              placeholder="Enter your phone number"
              placeholderTextColor="rgba(255,255,255,0.35)"
              keyboardType="phone-pad"
              style={styles.input}
              editable={!isLoading}
              maxLength={11}
            />
          </View>

          <TouchableOpacity
            onPress={handleSendOtp}
            style={[styles.button, isLoading && styles.buttonDisabled]}
            disabled={isLoading}
            activeOpacity={0.85}>
            {isLoading ? (
              <ActivityIndicator color={Colors.dark.background} />
            ) : (
              <Text style={styles.buttonText}>Send OTP</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
  },
  title: {
    color: Colors.dark.text,
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    color: Colors.dark.text,
    opacity: 0.8,
    fontSize: 16,
    marginBottom: 40,
  },
  field: {
    marginBottom: 24,
    width: '100%',
  },
  label: {
    color: Colors.dark.text,
    opacity: 0.9,
    marginBottom: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    height: 56,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 16,
    color: Colors.dark.text,
    fontSize: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    width: '100%',
  },
  button: {
    height: 56,
    borderRadius: 12,
    backgroundColor: Colors.dark.primary,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: Colors.dark.background,
    fontWeight: '700',
    fontSize: 18,
  },
  demoButton: {
    marginTop: 16,
    padding: 16,
    backgroundColor: 'rgba(0, 224, 255, 0.1)',
    borderRadius: 12,
    alignSelf: 'center',
  },
  demoButtonText: {
    color: Colors.dark.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  infoBox: {
    marginTop: 40,
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    width: '100%',
  },
  infoTitle: {
    color: Colors.dark.primary,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  infoText: {
    color: Colors.dark.text,
    opacity: 0.8,
    fontSize: 14,
    marginBottom: 4,
  },
});