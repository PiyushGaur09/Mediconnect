import React, {useState, useEffect, useRef} from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../constants/Colors.js';
import {useNavigation, useRoute} from '@react-navigation/native';

const API_BASE_URL = 'https://mediconnect-lemon.vercel.app/api/auth';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export default function OTP() {
  const navigation = useNavigation();
  const route = useRoute();
  const {phoneNumber, userId, demoOtp} = route.params || {};

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef([]);

  useEffect(() => {
    // Start countdown when component mounts
    startCountdown();

    // Auto-fill demo OTP if available
    if (demoOtp) {
      const demoOtpArray = demoOtp.split('').slice(0, 6);
      setOtp(demoOtpArray);
    }
  }, []);

  // Focus on first input when component mounts
  useEffect(() => {
    if (inputRefs.current[0]) {
      setTimeout(() => {
        inputRefs.current[0].focus();
      }, 100);
    }
  }, []);

  const startCountdown = () => {
    setCanResend(false);
    setCountdown(30);

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Handle OTP input change
  const handleOtpChange = (text, index) => {
    // Only allow numbers
    const numericText = text.replace(/[^0-9]/g, '');

    const newOtp = [...otp];
    newOtp[index] = numericText;
    setOtp(newOtp);

    // Auto-focus next input
    if (numericText && index < 5) {
      inputRefs.current[index + 1].focus();
    }

    // Auto-submit when all digits are filled
    if (numericText && index === 5) {
      const fullOtp = newOtp.join('');
      if (fullOtp.length === 6) {
        handleVerifyOtp(fullOtp);
      }
    }
  };

  // Handle backspace
  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // Move to previous input on backspace
        inputRefs.current[index - 1].focus();
      }
    }
  };

  // Store user data in AsyncStorage
  const storeUserData = async userData => {
    try {
      await AsyncStorage.setItem('user_data', JSON.stringify(userData));
      console.log('User data stored successfully:', userData);
      return true;
    } catch (error) {
      console.error('Error storing user data:', error);
      return false;
    }
  };

  const handleVerifyOtp = async (otpValue = null) => {
    const otpToVerify = otpValue || otp.join('');

    if (!otpToVerify.trim()) {
      Alert.alert('Error', 'Please enter the OTP');
      return;
    }

    if (otpToVerify.length !== 6) {
      Alert.alert('Error', 'OTP must be 6 digits');
      return;
    }

    if (!userId) {
      Alert.alert('Error', 'Invalid session. Please start over.');
      navigation.goBack();
      return;
    }

    setIsLoading(true);
    try {
      console.log('Verifying OTP:', {
        user_id: userId,
        otp: otpToVerify,
      });

      const response = await api.post('/validate-otp', {
        user_id: userId,
        otp: otpToVerify,
      });

      console.log('OTP Validation Response:', response.data);

      if (response.data && response.data.success) {
        // Store user data in AsyncStorage
        const userData = response.data?.data?.user || {
          userId: userId,
          phone: phoneNumber,
          role: response.data.role || 'patient',
          token: response.data.token,
        };

        const storageSuccess = await storeUserData(userData);

        if (storageSuccess) {
          Alert.alert('Success', response.data.message || 'Login successful!', [
            {
              text: 'OK',
              onPress: () => {
                // Navigate to main app
                navigation.reset({
                  index: 0,
                  routes: [{name: 'BottomNavigation'}],
                });
              },
            },
          ]);
        } else {
          Alert.alert(
            'Warning',
            'Login successful but failed to save user data locally.',
          );
          navigation.reset({
            index: 0,
            routes: [{name: 'BottomNavigation'}],
          });
        }
      } else {
        throw new Error(response.data.message || 'OTP validation failed');
      }
    } catch (error) {
      console.error('OTP Validation Error:', error);

      let errorMessage = 'Invalid OTP. Please try again.';

      if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout. Please check your connection.';
      } else if (error.response) {
        switch (error.response.status) {
          case 404:
            errorMessage = 'Validation service unavailable. Please try again.';
            break;
          case 400:
            errorMessage =
              error.response.data?.message || 'Invalid OTP format.';
            break;
          case 401:
            errorMessage = 'Invalid OTP. Please check and try again.';
            break;
          default:
            errorMessage =
              error.response.data?.message ||
              `Validation error: ${error.response.status}`;
        }
      } else if (error.request) {
        errorMessage =
          'No response from server. Please check your internet connection.';
      }

      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) {
      Alert.alert(
        'Wait',
        `Please wait ${countdown} seconds before resending OTP`,
      );
      return;
    }

    setIsLoading(true);
    try {
      console.log('Resending OTP for phone:', phoneNumber);

      const response = await api.post('/patient/login', {
        phone_number: phoneNumber,
      });

      console.log('Resend OTP Response:', response.data);

      if (response.data && response.data.success && response.data.user_id) {
        startCountdown();
        Alert.alert(
          'Success',
          response.data.message || 'OTP resent to your phone number',
        );

        // Update demo OTP if available
        if (response.data.otp) {
          const newOtpArray = response.data.otp.split('').slice(0, 6);
          setOtp(newOtpArray);
        }
      } else {
        throw new Error(response.data.message || 'Failed to resend OTP');
      }
    } catch (error) {
      console.error('Resend OTP Error:', error);
      const errorMessage =
        error.response?.data?.message ||
        'Failed to resend OTP. Please try again.';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const formatPhoneNumber = phone => {
    if (!phone) return '';
    return `${phone.slice(0, 5)} ${phone.slice(5)}`;
  };

  // Clear all OTP inputs
  const clearOtp = () => {
    setOtp(['', '', '', '', '', '']);
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
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
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
              <Text style={styles.backButtonText}>‹</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Enter OTP</Text>
          </View>

          <Text style={styles.subtitle}>
            We've sent a 6-digit OTP to{'\n'}
            <Text style={styles.phoneNumber}>
              +91 {formatPhoneNumber(phoneNumber)}
            </Text>
          </Text>

          {/* OTP Input Boxes */}
          <View style={styles.field}>
            <Text style={styles.label}>Enter OTP *</Text>
            <View style={styles.otpContainer}>
              {[0, 1, 2, 3, 4, 5].map(index => (
                <TextInput
                  key={index}
                  ref={ref => (inputRefs.current[index] = ref)}
                  value={otp[index]}
                  onChangeText={text => handleOtpChange(text, index)}
                  onKeyPress={e => handleKeyPress(e, index)}
                  placeholder="0"
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  keyboardType="numeric"
                  style={[
                    styles.otpInput,
                    otp[index] && styles.otpInputFilled,
                    isLoading && styles.otpInputDisabled,
                  ]}
                  editable={!isLoading}
                  maxLength={1}
                  selectTextOnFocus={true}
                />
              ))}
            </View>

            {/* Clear OTP Button */}
            <TouchableOpacity
              onPress={clearOtp}
              style={styles.clearButton}
              disabled={isLoading}>
              <Text style={styles.clearButtonText}>Clear OTP</Text>
            </TouchableOpacity>
          </View>

          {/* Resend OTP */}
          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Didn't receive the OTP? </Text>
            <TouchableOpacity
              onPress={handleResendOtp}
              disabled={!canResend || isLoading}>
              <Text
                style={[
                  styles.resendLink,
                  (!canResend || isLoading) && styles.resendLinkDisabled,
                ]}>
                {canResend ? 'Resend OTP' : `Resend in ${countdown}s`}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Verify Button */}
          <TouchableOpacity
            onPress={() => handleVerifyOtp()}
            style={[styles.button, isLoading && styles.buttonDisabled]}
            disabled={isLoading || otp.join('').length !== 6}
            activeOpacity={0.85}>
            {isLoading ? (
              <ActivityIndicator color={Colors.dark.background} />
            ) : (
              <Text style={styles.buttonText}>
                {otp.join('').length === 6 ? 'Verify OTP' : 'Enter 6-digit OTP'}
              </Text>
            )}
          </TouchableOpacity>

          {/* Demo Info */}
          {demoOtp && (
            <View style={styles.demoInfo}>
              <Text style={styles.demoTitle}>Demo Mode:</Text>
              <Text style={styles.demoText}>OTP: {demoOtp}</Text>
              <Text style={styles.demoText}>
                User ID: {userId?.substring(0, 8)}...
              </Text>
            </View>
          )}

          
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
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  backButtonText: {
    color: Colors.dark.text,
    fontSize: 24,
    fontWeight: 'bold',
  },
  title: {
    color: Colors.dark.text,
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    color: Colors.dark.text,
    opacity: 0.8,
    fontSize: 16,
    marginBottom: 40,
    textAlign: 'center',
    lineHeight: 24,
  },
  phoneNumber: {
    color: Colors.dark.primary,
    fontWeight: '600',
  },
  field: {
    marginBottom: 24,
    width: '100%',
    alignItems: 'center',
  },
  label: {
    color: Colors.dark.text,
    opacity: 0.9,
    marginBottom: 20,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
  otpInput: {
    width: 50,
    height: 60,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
    color: Colors.dark.text,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  otpInputFilled: {
    borderColor: Colors.dark.primary,
    backgroundColor: 'rgba(0, 224, 255, 0.1)',
  },
  otpInputDisabled: {
    opacity: 0.5,
  },
  clearButton: {
    padding: 8,
    marginTop: 8,
  },
  clearButtonText: {
    color: Colors.dark.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  resendText: {
    color: Colors.dark.text,
    opacity: 0.8,
    fontSize: 14,
  },
  resendLink: {
    color: Colors.dark.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  resendLinkDisabled: {
    color: 'rgba(255,255,255,0.3)',
  },
  button: {
    height: 56,
    borderRadius: 12,
    backgroundColor: Colors.dark.primary,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
    backgroundColor: Colors.dark.muted,
  },
  buttonText: {
    color: Colors.dark.background,
    fontWeight: '700',
    fontSize: 18,
  },
  demoInfo: {
    marginTop: 24,
    padding: 16,
    backgroundColor: 'rgba(0, 224, 255, 0.1)',
    borderRadius: 12,
    width: '100%',
  },
  demoTitle: {
    color: Colors.dark.primary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  demoText: {
    color: Colors.dark.text,
    opacity: 0.8,
    fontSize: 12,
    marginBottom: 2,
  },
  helpInfo: {
    marginTop: 32,
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    width: '100%',
  },
  helpText: {
    color: Colors.dark.text,
    opacity: 0.7,
    fontSize: 12,
    lineHeight: 18,
  },
});
