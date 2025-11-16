// // SignUp.js
// import React from 'react';
// import {
//   SafeAreaView,
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   StatusBar,
//   Image,
// } from 'react-native';
// import Colors from '../constants/Colors.js'; // adjust path as needed
// import {useNavigation} from '@react-navigation/native';

// export default function SignUp() {
//   const navigation = useNavigation();
//   return (
//     <SafeAreaView style={styles.safe}>
//       <StatusBar
//         barStyle="light-content"
//         backgroundColor={Colors.dark.background}
//       />
//       <View style={styles.container}>
//         <Text style={styles.title}>Let’s Get You In</Text>

//         <View style={styles.buttonsContainer}>
//           {/* Google Button */}
//           <TouchableOpacity style={styles.oauthButton} activeOpacity={0.85}>
//             <View style={styles.iconWrap}>
//               <Image
//                 source={require('../Images/google.png')}
//                 style={styles.iconImage}
//                 resizeMode="contain"
//               />
//             </View>
//             <Text style={styles.oauthText}>Continue With Google</Text>
//           </TouchableOpacity>

//           {/* Apple Button */}
//           <TouchableOpacity style={styles.oauthButton} activeOpacity={0.85}>
//             <View style={styles.iconWrap}>
//               <Image
//                 source={require('../Images/apple.png')}
//                 style={styles.iconImage}
//                 resizeMode="contain"
//               />
//             </View>
//             <Text style={styles.oauthText}>Continue With Apple</Text>
//           </TouchableOpacity>

//           {/* OR Divider */}
//           <Text style={styles.orText}>Or</Text>

//           {/* Sign Up Button */}
//           <TouchableOpacity style={styles.signUpButton} activeOpacity={0.9}>
//             <Text style={styles.signUpText}>Sign Up</Text>
//           </TouchableOpacity>

//           {/* Footer */}
//           <TouchableOpacity
//             onPress={() => {
//               navigation.navigate('Login');
//             }}
//             style={styles.footerRow}>
//             <Text style={styles.footerText}>I already have an account</Text>
//             <View style={styles.circleIcon}>
//               <Image
//                 source={require('../Images/RightButton.png')}
//                 style={styles.arrowIcon}
//                 resizeMode="contain"
//               />
//             </View>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// }

// const BUTTON_BG = 'rgba(255,255,255,0.03)';

// const styles = StyleSheet.create({
//   safe: {
//     flex: 1,
//     backgroundColor: Colors.dark.background,
//   },
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 28,
//   },
//   title: {
//     fontSize: 36,
//     fontWeight: '800',
//     color: Colors.dark.text,
//     marginBottom: 32,
//     textAlign: 'center',
//   },
//   buttonsContainer: {
//     width: '100%',
//     alignItems: 'center',
//   },
//   oauthButton: {
//     width: '100%',
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: BUTTON_BG,
//     paddingVertical: 14,
//     paddingHorizontal: 16,
//     borderRadius: 12,
//     marginBottom: 14,
//   },
//   iconWrap: {
//     width: 36,
//     height: 36,
//     borderRadius: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   iconImage: {
//     width: 22,
//     height: 22,
//   },
//   oauthText: {
//     color: Colors.dark.text,
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   orText: {
//     color: Colors.dark.text,
//     marginVertical: 10,
//     fontSize: 18,
//     fontWeight: '600',
//   },
//   signUpButton: {
//     width: '100%',
//     backgroundColor: Colors.dark.primary,
//     paddingVertical: 14,
//     borderRadius: 12,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginVertical: 8,
//   },
//   signUpText: {
//     color: Colors.dark.background,
//     fontSize: 16,
//     fontWeight: '800',
//   },
//   footerRow: {
//     marginTop: 14,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   footerText: {
//     color: Colors.dark.text,
//     opacity: 0.8,
//     marginRight: 10,
//   },
//   circleIcon: {
//     width: 34,
//     height: 34,
//     borderRadius: 34 / 2,
//     // backgroundColor: Colors.dark.primary,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   arrowIcon: {
//     width: 30,
//     height: 30,
//     // tintColor: Colors.dark.background,
//   },
// });

// import React, {useState} from 'react';
// import {
//   SafeAreaView,
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   StatusBar,
//   Image,
//   TextInput,
//   ScrollView,
//   Alert,
//   ActivityIndicator,
//   Modal,
//   TouchableWithoutFeedback,
//   Platform,
// } from 'react-native';
// import axios from 'axios';
// import Colors from '../constants/Colors.js';
// import {useNavigation} from '@react-navigation/native';

// const API_BASE_URL = 'https://mediconnect-lemon.vercel.app/api/auth';

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   timeout: 10000,
// });

// export default function SignUp() {
//   const navigation = useNavigation();

//   // Form state
//   const [formData, setFormData] = useState({
//     phone_number: '',
//     full_name: '',
//     email: '',
//     gender: '',
//     date_of_birth: '',
//     address: '',
//   });

//   const [isLoading, setIsLoading] = useState(false);
//   const [showGenderModal, setShowGenderModal] = useState(false);
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [errors, setErrors] = useState({});

//   // Gender options
//   const genderOptions = [
//     {label: 'Male', value: 'male'},
//     {label: 'Female', value: 'female'},
//     {label: 'Other', value: 'other'},
//   ];

//   // Update form data
//   const updateFormData = (field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: value,
//     }));
//     // Clear error when user starts typing
//     if (errors[field]) {
//       setErrors(prev => ({
//         ...prev,
//         [field]: '',
//       }));
//     }
//   };

//   // Format phone number
//   const formatPhoneNumber = text => {
//     const cleaned = text.replace(/\D/g, '');
//     const limited = cleaned.slice(0, 10);

//     let formatted = limited;
//     if (limited.length > 6) {
//       formatted = `${limited.slice(0, 5)} ${limited.slice(5)}`;
//     } else if (limited.length > 5) {
//       formatted = `${limited.slice(0, 5)} ${limited.slice(5)}`;
//     }

//     updateFormData('phone_number', formatted);
//   };

//   // Validate form
//   const validateForm = () => {
//     const newErrors = {};

//     // Phone validation
//     const cleanPhone = formData.phone_number.replace(/\D/g, '');
//     const phoneRegex = /^[6-9]\d{9}$/;
//     if (!cleanPhone) {
//       newErrors.phone_number = 'Phone number is required';
//     } else if (!phoneRegex.test(cleanPhone)) {
//       newErrors.phone_number = 'Please enter a valid 10-digit phone number';
//     }

//     // Name validation
//     if (!formData.full_name.trim()) {
//       newErrors.full_name = 'Full name is required';
//     } else if (formData.full_name.trim().length < 2) {
//       newErrors.full_name = 'Name must be at least 2 characters';
//     }

//     // Email validation
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!formData.email.trim()) {
//       newErrors.email = 'Email is required';
//     } else if (!emailRegex.test(formData.email)) {
//       newErrors.email = 'Please enter a valid email address';
//     }

//     // Gender validation
//     if (!formData.gender) {
//       newErrors.gender = 'Please select gender';
//     }

//     // Date of birth validation
//     if (!formData.date_of_birth) {
//       newErrors.date_of_birth = 'Date of birth is required';
//     } else {
//       const dob = new Date(formData.date_of_birth);
//       const today = new Date();
//       const age = today.getFullYear() - dob.getFullYear();
//       if (age < 1 || age > 120) {
//         newErrors.date_of_birth = 'Please enter a valid date of birth';
//       }
//     }

//     // Address validation
//     if (!formData.address.trim()) {
//       newErrors.address = 'Address is required';
//     } else if (formData.address.trim().length < 10) {
//       newErrors.address = 'Address must be at least 10 characters';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // Handle sign up
//   const handleSignUp = async () => {
//     if (!validateForm()) {
//       Alert.alert('Error', 'Please fix the errors in the form');
//       return;
//     }

//     setIsLoading(true);
//     try {
//       // Prepare data for API
//       const submitData = {
//         phone_number: formData.phone_number.replace(/\D/g, ''),
//         full_name: formData.full_name.trim(),
//         email: formData.email.trim(),
//         gender: formData.gender,
//         date_of_birth: formData.date_of_birth,
//         address: formData.address.trim(),
//       };

//       console.log('Sending signup request:', submitData);

//       const response = await api.post('/patient/register', submitData);

//       console.log('Signup Response:', response.data);

//       if (response.data && response.data.success) {
//         Alert.alert(
//           'Success',
//           response.data.message || 'Account created successfully!',
//           [
//             {
//               text: 'OK',
//               onPress: () => {
//                 // Navigate to login or OTP verification
//                 navigation.navigate('PhoneLogin');
//               },
//             },
//           ],
//         );
//       } else {
//         throw new Error(response.data.message || 'Registration failed');
//       }
//     } catch (error) {
//       console.error('Signup Error:', error);

//       let errorMessage = 'Registration failed. Please try again.';

//       if (error.code === 'ECONNABORTED') {
//         errorMessage = 'Request timeout. Please check your connection.';
//       } else if (error.response) {
//         switch (error.response.status) {
//           case 400:
//             errorMessage =
//               error.response.data?.message || 'Invalid data provided.';
//             break;
//           case 409:
//             errorMessage = 'Phone number or email already exists.';
//             break;
//           case 500:
//             errorMessage = 'Server error. Please try again later.';
//             break;
//           default:
//             errorMessage =
//               error.response.data?.message || `Error: ${error.response.status}`;
//         }
//       } else if (error.request) {
//         errorMessage =
//           'No response from server. Please check your internet connection.';
//       }

//       Alert.alert('Error', errorMessage);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Simple date picker (you might want to use a proper date picker library)
//   const showDatePickerModal = () => {
//     // For a real app, use @react-native-community/datetimepicker
//     // This is a simple implementation
//     const today = new Date();
//     const maxDate = new Date(
//       today.getFullYear() - 1,
//       today.getMonth(),
//       today.getDate(),
//     );
//     const minDate = new Date(
//       today.getFullYear() - 120,
//       today.getMonth(),
//       today.getDate(),
//     );

//     // Simple alert-based date selection
//     Alert.alert(
//       'Select Date of Birth',
//       'Please enter your date of birth in YYYY-MM-DD format',
//       [
//         {text: 'Cancel', style: 'cancel'},
//         {
//           text: 'OK',
//           onPress: () => {
//             // In a real app, use a proper date picker
//             // This is just for demonstration
//             const demoDate = '1990-01-01';
//             updateFormData('date_of_birth', demoDate);
//           },
//         },
//       ],
//     );
//   };

//   // Fill demo data for testing
//   const fillDemoData = () => {
//     setFormData({
//       phone_number: '9876543212',
//       full_name: 'Ankit Sharma',
//       email: 'ankit.sharma@example.com',
//       gender: 'male',
//       date_of_birth: '1992-04-25',
//       address: '123, Park View Apartments, New Delhi',
//     });
//     setErrors({});
//     Alert.alert('Demo', 'Demo data filled. You can now test the signup.');
//   };

//   return (
//     <SafeAreaView style={styles.safe}>
//       <StatusBar
//         barStyle="light-content"
//         backgroundColor={Colors.dark.background}
//       />

//       <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
//         <Text style={styles.title}>Create Your Account</Text>
//         <Text style={styles.subtitle}>
//           Join thousands of patients using our platform
//         </Text>

//         {/* Form Fields */}
//         <View style={styles.formContainer}>
//           {/* Phone Number */}
//           <View style={styles.field}>
//             <Text style={styles.label}>Phone Number *</Text>
//             <TextInput
//               value={formData.phone_number}
//               onChangeText={formatPhoneNumber}
//               placeholder="Enter your phone number"
//               placeholderTextColor="rgba(255,255,255,0.35)"
//               keyboardType="phone-pad"
//               style={[styles.input, errors.phone_number && styles.inputError]}
//               editable={!isLoading}
//               maxLength={11}
//             />
//             {errors.phone_number && (
//               <Text style={styles.errorText}>{errors.phone_number}</Text>
//             )}
//           </View>

//           {/* Full Name */}
//           <View style={styles.field}>
//             <Text style={styles.label}>Full Name *</Text>
//             <TextInput
//               value={formData.full_name}
//               onChangeText={text => updateFormData('full_name', text)}
//               placeholder="Enter your full name"
//               placeholderTextColor="rgba(255,255,255,0.35)"
//               style={[styles.input, errors.full_name && styles.inputError]}
//               editable={!isLoading}
//             />
//             {errors.full_name && (
//               <Text style={styles.errorText}>{errors.full_name}</Text>
//             )}
//           </View>

//           {/* Email */}
//           <View style={styles.field}>
//             <Text style={styles.label}>Email Address *</Text>
//             <TextInput
//               value={formData.email}
//               onChangeText={text => updateFormData('email', text)}
//               placeholder="Enter your email"
//               placeholderTextColor="rgba(255,255,255,0.35)"
//               keyboardType="email-address"
//               autoCapitalize="none"
//               style={[styles.input, errors.email && styles.inputError]}
//               editable={!isLoading}
//             />
//             {errors.email && (
//               <Text style={styles.errorText}>{errors.email}</Text>
//             )}
//           </View>

//           {/* Gender */}
//           <View style={styles.field}>
//             <Text style={styles.label}>Gender *</Text>
//             <TouchableOpacity
//               style={[
//                 styles.input,
//                 styles.pickerInput,
//                 errors.gender && styles.inputError,
//               ]}
//               onPress={() => setShowGenderModal(true)}
//               disabled={isLoading}>
//               <Text
//                 style={
//                   formData.gender
//                     ? styles.pickerTextSelected
//                     : styles.pickerText
//                 }>
//                 {formData.gender
//                   ? genderOptions.find(g => g.value === formData.gender)?.label
//                   : 'Select Gender'}
//               </Text>
//               <Text style={styles.pickerArrow}>▼</Text>
//             </TouchableOpacity>
//             {errors.gender && (
//               <Text style={styles.errorText}>{errors.gender}</Text>
//             )}
//           </View>

//           {/* Date of Birth */}
//           <View style={styles.field}>
//             <Text style={styles.label}>Date of Birth *</Text>
//             <TouchableOpacity
//               style={[
//                 styles.input,
//                 styles.pickerInput,
//                 errors.date_of_birth && styles.inputError,
//               ]}
//               onPress={showDatePickerModal}
//               disabled={isLoading}>
//               <Text
//                 style={
//                   formData.date_of_birth
//                     ? styles.pickerTextSelected
//                     : styles.pickerText
//                 }>
//                 {formData.date_of_birth || 'Select Date of Birth'}
//               </Text>
//               <Text style={styles.pickerArrow}>📅</Text>
//             </TouchableOpacity>
//             {errors.date_of_birth && (
//               <Text style={styles.errorText}>{errors.date_of_birth}</Text>
//             )}
//           </View>

//           {/* Address */}
//           <View style={styles.field}>
//             <Text style={styles.label}>Address *</Text>
//             <TextInput
//               value={formData.address}
//               onChangeText={text => updateFormData('address', text)}
//               placeholder="Enter your complete address"
//               placeholderTextColor="rgba(255,255,255,0.35)"
//               style={[styles.textArea, errors.address && styles.inputError]}
//               editable={!isLoading}
//               multiline
//               numberOfLines={3}
//               textAlignVertical="top"
//             />
//             {errors.address && (
//               <Text style={styles.errorText}>{errors.address}</Text>
//             )}
//           </View>
//         </View>

//         {/* Sign Up Button */}
//         <TouchableOpacity
//           onPress={handleSignUp}
//           style={[styles.signUpButton, isLoading && styles.buttonDisabled]}
//           disabled={isLoading}
//           activeOpacity={0.9}>
//           {isLoading ? (
//             <ActivityIndicator color={Colors.dark.background} />
//           ) : (
//             <Text style={styles.signUpText}>Create Account</Text>
//           )}
//         </TouchableOpacity>

//         {/* Demo Button */}
//         <TouchableOpacity
//           onPress={fillDemoData}
//           style={styles.demoButton}
//           disabled={isLoading}>
//           <Text style={styles.demoButtonText}>Fill Demo Data</Text>
//         </TouchableOpacity>

//         {/* Footer */}
//         <TouchableOpacity
//           onPress={() => navigation.navigate('PhoneLogin')}
//           style={styles.footerRow}>
//           <Text style={styles.footerText}>Already have an account?</Text>
//           <View style={styles.circleIcon}>
//             <Image
//               source={require('../Images/RightButton.png')}
//               style={styles.arrowIcon}
//               resizeMode="contain"
//             />
//           </View>
//         </TouchableOpacity>
//       </ScrollView>

//       {/* Gender Selection Modal */}
//       <Modal
//         visible={showGenderModal}
//         transparent
//         animationType="slide"
//         onRequestClose={() => setShowGenderModal(false)}>
//         <TouchableWithoutFeedback onPress={() => setShowGenderModal(false)}>
//           <View style={styles.modalOverlay}>
//             <TouchableWithoutFeedback>
//               <View style={styles.modalContent}>
//                 <Text style={styles.modalTitle}>Select Gender</Text>
//                 {genderOptions.map(option => (
//                   <TouchableOpacity
//                     key={option.value}
//                     style={[
//                       styles.modalOption,
//                       formData.gender === option.value &&
//                         styles.modalOptionSelected,
//                     ]}
//                     onPress={() => {
//                       updateFormData('gender', option.value);
//                       setShowGenderModal(false);
//                     }}>
//                     <Text
//                       style={[
//                         styles.modalOptionText,
//                         formData.gender === option.value &&
//                           styles.modalOptionTextSelected,
//                       ]}>
//                       {option.label}
//                     </Text>
//                   </TouchableOpacity>
//                 ))}
//                 <TouchableOpacity
//                   style={styles.modalCancel}
//                   onPress={() => setShowGenderModal(false)}>
//                   <Text style={styles.modalCancelText}>Cancel</Text>
//                 </TouchableOpacity>
//               </View>
//             </TouchableWithoutFeedback>
//           </View>
//         </TouchableWithoutFeedback>
//       </Modal>
//     </SafeAreaView>
//   );
// }

// const BUTTON_BG = 'rgba(255,255,255,0.03)';

// const styles = StyleSheet.create({
//   safe: {
//     flex: 1,
//     backgroundColor: Colors.dark.background,
//   },
//   container: {
//     flex: 1,
//     paddingHorizontal: 24,
//   },
//   title: {
//     fontSize: 32,
//     fontWeight: '800',
//     color: Colors.dark.text,
//     marginTop: 40,
//     marginBottom: 8,
//     textAlign: 'center',
//   },
//   subtitle: {
//     fontSize: 16,
//     color: Colors.dark.text,
//     opacity: 0.8,
//     textAlign: 'center',
//     marginBottom: 40,
//   },
//   formContainer: {
//     marginBottom: 24,
//   },
//   field: {
//     marginBottom: 20,
//   },
//   label: {
//     color: Colors.dark.text,
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 8,
//   },
//   input: {
//     height: 56,
//     borderRadius: 12,
//     backgroundColor: BUTTON_BG,
//     paddingHorizontal: 16,
//     color: Colors.dark.text,
//     fontSize: 16,
//     borderWidth: 1,
//     borderColor: 'rgba(255,255,255,0.1)',
//   },
//   textArea: {
//     height: 80,
//     borderRadius: 12,
//     backgroundColor: BUTTON_BG,
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     color: Colors.dark.text,
//     fontSize: 16,
//     borderWidth: 1,
//     borderColor: 'rgba(255,255,255,0.1)',
//     textAlignVertical: 'top',
//   },
//   inputError: {
//     borderColor: Colors.dark.danger,
//   },
//   errorText: {
//     color: Colors.dark.danger,
//     fontSize: 12,
//     marginTop: 4,
//     marginLeft: 4,
//   },
//   pickerInput: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   pickerText: {
//     color: 'rgba(255,255,255,0.35)',
//     fontSize: 16,
//   },
//   pickerTextSelected: {
//     color: Colors.dark.text,
//     fontSize: 16,
//   },
//   pickerArrow: {
//     color: Colors.dark.text,
//     fontSize: 12,
//   },
//   signUpButton: {
//     width: '100%',
//     backgroundColor: Colors.dark.primary,
//     paddingVertical: 16,
//     borderRadius: 12,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 16,
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 4},
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   buttonDisabled: {
//     opacity: 0.6,
//   },
//   signUpText: {
//     color: Colors.dark.background,
//     fontSize: 18,
//     fontWeight: '700',
//   },
//   demoButton: {
//     padding: 12,
//     backgroundColor: 'rgba(0, 224, 255, 0.1)',
//     borderRadius: 8,
//     alignItems: 'center',
//     marginBottom: 24,
//   },
//   demoButtonText: {
//     color: Colors.dark.primary,
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   footerRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 40,
//   },
//   footerText: {
//     color: Colors.dark.text,
//     opacity: 0.8,
//     marginRight: 10,
//     fontSize: 16,
//   },
//   circleIcon: {
//     width: 34,
//     height: 34,
//     borderRadius: 17,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   arrowIcon: {
//     width: 30,
//     height: 30,
//   },
//   debugInfo: {
//     padding: 12,
//     backgroundColor: 'rgba(255,255,255,0.05)',
//     borderRadius: 8,
//     marginBottom: 20,
//   },
//   debugTitle: {
//     color: Colors.dark.primary,
//     fontSize: 12,
//     fontWeight: '600',
//     marginBottom: 4,
//   },
//   debugText: {
//     color: Colors.dark.text,
//     opacity: 0.7,
//     fontSize: 10,
//     marginBottom: 2,
//   },
//   // Modal Styles
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     justifyContent: 'flex-end',
//   },
//   modalContent: {
//     backgroundColor: Colors.dark.card,
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     padding: 20,
//     paddingBottom: Platform.OS === 'ios' ? 40 : 20,
//   },
//   modalTitle: {
//     color: Colors.dark.text,
//     fontSize: 20,
//     fontWeight: '600',
//     marginBottom: 16,
//     textAlign: 'center',
//   },
//   modalOption: {
//     padding: 16,
//     borderRadius: 8,
//     marginBottom: 8,
//   },
//   modalOptionSelected: {
//     backgroundColor: Colors.dark.primary,
//   },
//   modalOptionText: {
//     color: Colors.dark.text,
//     fontSize: 16,
//     textAlign: 'center',
//   },
//   modalOptionTextSelected: {
//     color: Colors.dark.background,
//     fontWeight: '600',
//   },
//   modalCancel: {
//     padding: 16,
//     borderRadius: 8,
//     backgroundColor: BUTTON_BG,
//     marginTop: 8,
//   },
//   modalCancelText: {
//     color: Colors.dark.text,
//     fontSize: 16,
//     textAlign: 'center',
//     fontWeight: '600',
//   },
// });

import React, {useState, useRef, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import axios from 'axios';
import Colors from '../constants/Colors.js';
import {useNavigation} from '@react-navigation/native';
// Native DateTime picker
import DateTimePicker from '@react-native-community/datetimepicker';

const API_BASE_URL = 'https://mediconnect-lemon.vercel.app/api/auth';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Replace with your actual Google Places API Key
const GOOGLE_PLACES_API_KEY = 'AIzaSyAonK15hotzDslX4ePjIbmizRii-7Ng4QE';

export default function SignUp() {
  const navigation = useNavigation();
  const addressRef = useRef(null);

  // Form state
  const [formData, setFormData] = useState({
    phone_number: '',
    full_name: '',
    email: '',
    gender: '',
    date_of_birth: '',
    address: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [manualAddress, setManualAddress] = useState('');
  const [errors, setErrors] = useState({});

  // Custom places state
  const [predictions, setPredictions] = useState([]);
  const [showPredictions, setShowPredictions] = useState(false);
  const debounceTimer = useRef(null);

  // Date picker state
  // For Android: showAndroidPicker toggles whether to render DateTimePicker (which opens system dialog)
  // For iOS: we show a themed modal (showIOSPicker) containing the spinner/datepicker
  const [showAndroidPicker, setShowAndroidPicker] = useState(false);
  const [showIOSPicker, setShowIOSPicker] = useState(false);
  const [iosPickerDate, setIosPickerDate] = useState(new Date());

  // Gender options
  const genderOptions = [
    {label: 'Male', value: 'male'},
    {label: 'Female', value: 'female'},
    {label: 'Other', value: 'other'},
  ];

  // Update form data
  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  // Format phone number
  const formatPhoneNumber = text => {
    const cleaned = text.replace(/\D/g, '');
    const limited = cleaned.slice(0, 10);

    let formatted = limited;
    if (limited.length > 6) {
      formatted = `${limited.slice(0, 5)} ${limited.slice(5)}`;
    } else if (limited.length > 5) {
      formatted = `${limited.slice(0, 5)} ${limited.slice(5)}`;
    }

    updateFormData('phone_number', formatted);
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Phone validation
    const cleanPhone = formData.phone_number.replace(/\D/g, '');
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!cleanPhone) {
      newErrors.phone_number = 'Phone number is required';
    } else if (!phoneRegex.test(cleanPhone)) {
      newErrors.phone_number = 'Please enter a valid 10-digit phone number';
    }

    // Name validation
    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required';
    } else if (formData.full_name.trim().length < 2) {
      newErrors.full_name = 'Name must be at least 2 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Gender validation
    if (!formData.gender) {
      newErrors.gender = 'Please select gender';
    }

    // Date of birth validation
    if (!formData.date_of_birth) {
      newErrors.date_of_birth = 'Date of birth is required';
    } else {
      const dob = new Date(formData.date_of_birth);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      if (age < 1 || age > 120) {
        newErrors.date_of_birth = 'Please enter a valid date of birth';
      }
    }

    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    } else if (formData.address.trim().length < 10) {
      newErrors.address = 'Address must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle sign up
  const handleSignUp = async () => {
    if (!validateForm()) {
      Alert.alert('Error', 'Please fix the errors in the form');
      return;
    }

    setIsLoading(true);
    try {
      // Prepare data for API
      const submitData = {
        phone_number: formData.phone_number.replace(/\D/g, ''),
        full_name: formData.full_name.trim(),
        email: formData.email.trim(),
        gender: formData.gender,
        date_of_birth: formData.date_of_birth,
        address: formData.address.trim(),
      };

      console.log('Sending signup request:', submitData);

      const response = await api.post('/patient/register', submitData);

      console.log('Signup Response:', response.data);

      if (response.data && response.data.success) {
        Alert.alert(
          'Success',
          response.data.message || 'Account created successfully!',
          [
            {
              text: 'OK',
              onPress: () => {
                navigation.navigate('OTP', {
                  phoneNumber: response.data?.data?.phone_number,
                  userId: response.data?.data?.user_id,
                  demoOtp: response.data.otp,
                });
              },
            },
          ],
        );
      } else {
        throw new Error(response.data?.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Signup Error:', error);

      let errorMessage = 'Registration failed. Please try again.';

      if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout. Please check your connection.';
      } else if (error.response) {
        switch (error.response.status) {
          case 400:
            errorMessage =
              error.response.data?.message || 'Invalid data provided.';
            break;
          case 409:
            errorMessage = 'Phone number or email already exists.';
            break;
          case 500:
            errorMessage = 'Server error. Please try again later.';
            break;
          default:
            errorMessage =
              error.response.data?.message || `Error: ${error.response.status}`;
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

  // Simple fallback/demo date setter
  const showDatePickerModal = () => {
    // For platform-specific behavior: show native dialog on Android; modal on iOS
    if (Platform.OS === 'android') {
      // show native Android dialog
      setShowAndroidPicker(true);
    } else {
      // show themed modal for iOS
      // initialize iosPickerDate from current DOB if available
      const existing = formData.date_of_birth
        ? new Date(formData.date_of_birth)
        : new Date(1990, 0, 1);
      setIosPickerDate(existing);
      setShowIOSPicker(true);
    }
  };

  // Format date to YYYY-MM-DD
  const formatDateToYMD = dateObj => {
    if (!dateObj) return '';
    const y = dateObj.getFullYear();
    const m = `${dateObj.getMonth() + 1}`.padStart(2, '0');
    const d = `${dateObj.getDate()}`.padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  // Android onChange for DateTimePicker (native dialog)
  const onAndroidDateChange = (event, selectedDate) => {
    // hide the dialog for any event (selected or dismissed)
    setShowAndroidPicker(false);

    if (event.type === 'set' || selectedDate) {
      // user selected a date
      const finalDate = selectedDate || new Date();
      const ymd = formatDateToYMD(finalDate);
      updateFormData('date_of_birth', ymd);
    } else {
      // dismissed, no action
    }
  };

  // iOS handlers: keep date in state until user presses Done
  const onIosPickerChange = (event, selectedDate) => {
    // when spinning the picker on iOS, update temporary state so user sees selection
    if (selectedDate) setIosPickerDate(selectedDate);
  };
  const onIosDone = () => {
    const ymd = formatDateToYMD(iosPickerDate);
    updateFormData('date_of_birth', ymd);
    setShowIOSPicker(false);
  };
  const onIosCancel = () => {
    setShowIOSPicker(false);
  };

  // Custom Google Places Autocomplete (predictions)
  const fetchPredictions = async input => {
    if (!input || input.length < 3) {
      setPredictions([]);
      setShowPredictions(false);
      return;
    }

    // debounce
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(async () => {
      try {
        const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json`;
        const params = {
          input,
          key: GOOGLE_PLACES_API_KEY,
          components: 'country:in',
          language: 'en',
        };

        const resp = await axios.get(url, {params, timeout: 8000});
        if (
          resp.data &&
          resp.data.predictions &&
          resp.data.predictions.length > 0
        ) {
          setPredictions(resp.data.predictions);
          setShowPredictions(true);
        } else {
          setPredictions([]);
          setShowPredictions(false);
        }
      } catch (err) {
        console.error('Autocomplete fetch error', err);
        setPredictions([]);
        setShowPredictions(false);
      }
    }, 300);
  };

  const fetchPlaceDetailsAndSet = async (place_id, fallbackDescription) => {
    try {
      const url = `https://maps.googleapis.com/maps/api/place/details/json`;
      const params = {
        place_id,
        key: GOOGLE_PLACES_API_KEY,
        language: 'en',
        fields: 'formatted_address',
      };
      const resp = await axios.get(url, {params, timeout: 8000});
      const formatted_address = resp.data?.result?.formatted_address;
      if (formatted_address) {
        updateFormData('address', formatted_address);
        setManualAddress(formatted_address);
        setShowPredictions(false);
      } else if (fallbackDescription) {
        updateFormData('address', fallbackDescription);
        setManualAddress(fallbackDescription);
        setShowPredictions(false);
      } else {
        console.warn(
          'No formatted_address from place details and no fallback available',
        );
      }
    } catch (err) {
      console.error('Place details error', err);
      if (fallbackDescription) {
        updateFormData('address', fallbackDescription);
        setManualAddress(fallbackDescription);
        setShowPredictions(false);
      }
    }
  };

  // Handle manual address input
  const handleManualAddressChange = text => {
    setManualAddress(text);
    updateFormData('address', text);
    // fetch predictions
    fetchPredictions(text);
  };

  // Focus on address input
  const focusAddressInput = () => {
    if (addressRef.current) {
      addressRef.current.focus();
    }
  };

  // cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  // Render address input with custom suggestions
  const renderAddressInput = () => (
    <View style={styles.field}>
      <Text style={styles.label}>Address *</Text>

      {/* Manual Address Input */}
      <TextInput
        ref={addressRef}
        value={manualAddress}
        onChangeText={handleManualAddressChange}
        placeholder="Start typing your address..."
        placeholderTextColor="rgba(255,255,255,0.35)"
        style={[styles.textArea, errors.address && styles.inputError]}
        editable={!isLoading}
        multiline
        numberOfLines={2}
        textAlignVertical="top"
        onFocus={() => setShowPredictions(manualAddress.length > 2)}
      />

      {/* Custom Predictions List */}
      {showPredictions && predictions.length > 0 && (
        <View style={[styles.placesContainer, {zIndex: 2000}]}>
          <ScrollView style={styles.placesListView}>
            {predictions.map(p => (
              <TouchableOpacity
                key={p.place_id}
                style={styles.placesRow}
                onPress={() =>
                  fetchPlaceDetailsAndSet(p.place_id, p.description)
                }>
                <Text style={styles.placesDescription}>{p.description}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}

      {/* Address Help Text */}
      <Text style={styles.addressHelpText}>
        Start typing to see address suggestions from Google Maps
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Colors.dark.background}
      />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Create Your Account</Text>
        <Text style={styles.subtitle}>
          Join thousands of patients using our platform
        </Text>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          {/* Phone Number */}
          <View style={styles.field}>
            <Text style={styles.label}>Phone Number *</Text>
            <TextInput
              value={formData.phone_number}
              onChangeText={formatPhoneNumber}
              placeholder="Enter your phone number"
              placeholderTextColor="rgba(255,255,255,0.35)"
              keyboardType="phone-pad"
              style={[styles.input, errors.phone_number && styles.inputError]}
              editable={!isLoading}
              maxLength={11}
            />
            {errors.phone_number && (
              <Text style={styles.errorText}>{errors.phone_number}</Text>
            )}
          </View>

          {/* Full Name */}
          <View style={styles.field}>
            <Text style={styles.label}>Full Name *</Text>
            <TextInput
              value={formData.full_name}
              onChangeText={text => updateFormData('full_name', text)}
              placeholder="Enter your full name"
              placeholderTextColor="rgba(255,255,255,0.35)"
              style={[styles.input, errors.full_name && styles.inputError]}
              editable={!isLoading}
            />
            {errors.full_name && (
              <Text style={styles.errorText}>{errors.full_name}</Text>
            )}
          </View>

          {/* Email */}
          <View style={styles.field}>
            <Text style={styles.label}>Email Address *</Text>
            <TextInput
              value={formData.email}
              onChangeText={text => updateFormData('email', text)}
              placeholder="Enter your email"
              placeholderTextColor="rgba(255,255,255,0.35)"
              keyboardType="email-address"
              autoCapitalize="none"
              style={[styles.input, errors.email && styles.inputError]}
              editable={!isLoading}
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}
          </View>

          {/* Gender */}
          <View style={styles.field}>
            <Text style={styles.label}>Gender *</Text>
            <TouchableOpacity
              style={[
                styles.input,
                styles.pickerInput,
                errors.gender && styles.inputError,
              ]}
              onPress={() => setShowGenderModal(true)}
              disabled={isLoading}>
              <Text
                style={
                  formData.gender
                    ? styles.pickerTextSelected
                    : styles.pickerText
                }>
                {formData.gender
                  ? genderOptions.find(g => g.value === formData.gender)?.label
                  : 'Select Gender'}
              </Text>
              <Text style={styles.pickerArrow}>▼</Text>
            </TouchableOpacity>
            {errors.gender && (
              <Text style={styles.errorText}>{errors.gender}</Text>
            )}
          </View>

          {/* Date of Birth */}
          <View style={styles.field}>
            <Text style={styles.label}>Date of Birth *</Text>
            <TouchableOpacity
              style={[
                styles.input,
                styles.pickerInput,
                errors.date_of_birth && styles.inputError,
              ]}
              onPress={showDatePickerModal}
              disabled={isLoading}>
              <Text
                style={
                  formData.date_of_birth
                    ? styles.pickerTextSelected
                    : styles.pickerText
                }>
                {formData.date_of_birth || 'Select Date of Birth'}
              </Text>
              <Text style={styles.pickerArrow}>📅</Text>
            </TouchableOpacity>
            {errors.date_of_birth && (
              <Text style={styles.errorText}>{errors.date_of_birth}</Text>
            )}
          </View>

          {/* Address with custom Google Places */}
          {renderAddressInput()}
        </View>

        {/* Sign Up Button */}
        <TouchableOpacity
          onPress={handleSignUp}
          style={[styles.signUpButton, isLoading && styles.buttonDisabled]}
          disabled={isLoading}
          activeOpacity={0.9}>
          {isLoading ? (
            <ActivityIndicator color={Colors.dark.background} />
          ) : (
            <Text style={styles.signUpText}>Create Account</Text>
          )}
        </TouchableOpacity>

        {/* Footer */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          style={styles.footerRow}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <View style={styles.circleIcon}>
            <Image
              source={require('../Images/RightButton.png')}
              style={styles.arrowIcon}
              resizeMode="contain"
            />
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* Gender Selection Modal */}
      <Modal
        visible={showGenderModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowGenderModal(false)}>
        <TouchableWithoutFeedback onPress={() => setShowGenderModal(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Select Gender</Text>
                {genderOptions.map(option => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.modalOption,
                      formData.gender === option.value &&
                        styles.modalOptionSelected,
                    ]}
                    onPress={() => {
                      updateFormData('gender', option.value);
                      setShowGenderModal(false);
                    }}>
                    <Text
                      style={[
                        styles.modalOptionText,
                        formData.gender === option.value &&
                          styles.modalOptionTextSelected,
                      ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={styles.modalCancel}
                  onPress={() => setShowGenderModal(false)}>
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* iOS themed date picker modal */}
      <Modal
        visible={showIOSPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowIOSPicker(false)}>
        <TouchableWithoutFeedback onPress={() => setShowIOSPicker(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={[styles.modalContent, {paddingBottom: 20}]}>
                <Text style={styles.modalTitle}>Select Date of Birth</Text>

                <View
                  style={{
                    backgroundColor: Colors.dark.card,
                    borderRadius: 12,
                    padding: 8,
                  }}>
                  <DateTimePicker
                    value={iosPickerDate}
                    mode="date"
                    display="spinner"
                    onChange={onIosPickerChange}
                    maximumDate={new Date()} // no future DOB
                    // on iOS the spinner will appear inside this view
                  />
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 12,
                    justifyContent: 'space-between',
                  }}>
                  <TouchableOpacity
                    style={[styles.modalCancel, {flex: 1, marginRight: 8}]}
                    onPress={onIosCancel}>
                    <Text style={styles.modalCancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.modalOption,
                      {
                        flex: 1,
                        marginLeft: 8,
                        backgroundColor: Colors.dark.primary,
                      },
                    ]}
                    onPress={onIosDone}>
                    <Text
                      style={[
                        styles.modalOptionText,
                        {color: Colors.dark.background, fontWeight: '700'},
                      ]}>
                      Done
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Android native DateTimePicker (renders only when requested) */}
      {showAndroidPicker && Platform.OS === 'android' && (
        <DateTimePicker
          value={
            formData.date_of_birth
              ? new Date(formData.date_of_birth)
              : new Date(1990, 0, 1)
          }
          mode="date"
          display="calendar"
          onChange={onAndroidDateChange}
          maximumDate={new Date()}
        />
      )}
    </SafeAreaView>
  );
}

const BUTTON_BG = 'rgba(255,255,255,0.03)';

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.dark.text,
    marginTop: 40,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.dark.text,
    opacity: 0.8,
    textAlign: 'center',
    marginBottom: 40,
  },
  formContainer: {
    marginBottom: 24,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    height: 56,
    borderRadius: 12,
    backgroundColor: BUTTON_BG,
    paddingHorizontal: 16,
    color: Colors.dark.text,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  textArea: {
    minHeight: 56,
    borderRadius: 12,
    backgroundColor: BUTTON_BG,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: Colors.dark.text,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: Colors.dark.danger,
  },
  errorText: {
    color: Colors.dark.danger,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  pickerInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerText: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 16,
  },
  pickerTextSelected: {
    color: Colors.dark.text,
    fontSize: 16,
  },
  pickerArrow: {
    color: Colors.dark.text,
    fontSize: 12,
  },
  // Google Places Styles (custom)
  placesContainer: {
    position: 'relative',
    marginTop: 8,
  },
  placesListView: {
    backgroundColor: Colors.dark.card,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    borderRadius: 8,
    marginTop: 4,
    maxHeight: 200,
  },
  placesRow: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  placesDescription: {
    color: Colors.dark.text,
    fontSize: 14,
  },
  placesPoweredContainer: {
    display: 'none',
  },
  noResultsText: {
    color: Colors.dark.muted,
    fontSize: 14,
    textAlign: 'center',
    padding: 16,
  },
  addressHelpText: {
    color: Colors.dark.muted,
    fontSize: 12,
    marginTop: 4,
    fontStyle: 'italic',
  },
  signUpButton: {
    width: '100%',
    backgroundColor: Colors.dark.primary,
    paddingVertical: 16,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  signUpText: {
    color: Colors.dark.background,
    fontSize: 18,
    fontWeight: '700',
  },
  demoButton: {
    padding: 12,
    backgroundColor: 'rgba(0, 224, 255, 0.1)',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  demoButtonText: {
    color: Colors.dark.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  footerText: {
    color: Colors.dark.text,
    opacity: 0.8,
    marginRight: 10,
    fontSize: 16,
  },
  circleIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowIcon: {
    width: 30,
    height: 30,
  },
  apiKeyNotice: {
    padding: 12,
    backgroundColor: 'rgba(255,193,7,0.1)',
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,193,7,0.3)',
  },
  apiKeyNoticeText: {
    color: Colors.dark.warning,
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.dark.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  modalTitle: {
    color: Colors.dark.text,
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalOption: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  modalOptionSelected: {
    backgroundColor: Colors.dark.primary,
  },
  modalOptionText: {
    color: Colors.dark.text,
    fontSize: 16,
    textAlign: 'center',
  },
  modalOptionTextSelected: {
    color: Colors.dark.background,
    fontWeight: '600',
  },
  modalCancel: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: BUTTON_BG,
    marginTop: 8,
    alignItems: 'center',
  },
  modalCancelText: {
    color: Colors.dark.text,
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
});
