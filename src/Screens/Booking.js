// import React, { useState, useEffect } from 'react';
// import {
//   SafeAreaView,
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   Image,
//   Dimensions,
//   StatusBar,
//   Platform,
//   useColorScheme,
//   ActivityIndicator,
//   Alert,
//   RefreshControl
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import Colors from '../constants/Colors';

// const { width } = Dimensions.get('window');

// const Booking = ({ navigation }) => {
//   const deviceScheme = useColorScheme();
//   const scheme = deviceScheme === 'light' ? 'dark' : 'dark';
//   const theme = Colors[scheme] || {};

//   const palette = {
//     background: theme.background ?? (scheme === 'light' ? '#FFFFFF' : '#0A1830'),
//     surface: theme.card ?? (scheme === 'light' ? '#FFFFFF' : '#0F2034'),
//     text: theme.text ?? (scheme === 'light' ? '#0B1220' : '#FFFFFF'),
//     muted: theme.muted ?? (scheme === 'light' ? '#7B8794' : '#A8B0C2'),
//     border: theme.border ?? (scheme === 'light' ? '#E6E9EE' : '#243142'),
//     primary: theme.primary ?? (scheme === 'light' ? '#0B1220' : '#00E0FF'),
//     accent: theme.primary ?? '#00E0FF',
//     cardBg: scheme === 'light' ? '#FFFFFF' : '#0F2034',
//     lightCard: scheme === 'light' ? '#F8F9FB' : '#132033',
//     danger: '#FF6B6B',
//     success: '#4CAF50',
//   };

//   const [activeTab, setActiveTab] = useState('Upcoming');
//   const [appointments, setAppointments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [rescheduling, setRescheduling] = useState(null);

//   // Function to get user ID from AsyncStorage
//   const getUserId = async () => {
//     try {
//       const userData = await AsyncStorage.getItem('user_data');
//       if (userData) {
//         const parsedUserData = JSON.parse(userData);
//         return parsedUserData.id || parsedUserData.userId || null;
//       }
//       return null;
//     } catch (error) {
//       console.error('Error getting user ID:', error);
//       return null;
//     }
//   };

//   // Function to fetch appointments from API
//   const fetchAppointments = async (page = 1, dateFilter = 'all') => {
//     try {
//       const userId = await getUserId();
//       if (!userId) {
//         Alert.alert('Error', 'User not found. Please login again.');
//         setLoading(false);
//         return;
//       }

//       const requestData = {
//         patient_id: userId,
//         date_filter: dateFilter,
//         page: page
//       };

//       const response = await fetch('https://mediconnect-lemon.vercel.app/api/appointment/patient-appointment', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(requestData),
//       });

//       const result = await response.json();

//       if (response.ok && result.success) {
//         setAppointments(result.data.appointments || []);
//       } else {
//         throw new Error(result.message || 'Failed to fetch appointments');
//       }
//     } catch (error) {
//       console.error('Fetch appointments error:', error);
//       Alert.alert(
//         'Error',
//         error.message || 'Failed to load appointments. Please try again.'
//       );
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   // Format date for display
//   const formatDisplayDate = (dateString, timeString) => {
//     const date = new Date(dateString);
//     const options = { month: 'long', day: 'numeric', year: 'numeric' };
//     const formattedDate = date.toLocaleDateString(undefined, options);
    
//     // Format time from "09:30:00" to "09.30 AM"
//     const time = timeString.split(':');
//     let hours = parseInt(time[0]);
//     const minutes = time[1];
//     const ampm = hours >= 12 ? 'PM' : 'AM';
//     hours = hours % 12 || 12;
    
//     return `${formattedDate} - ${hours}.${minutes} ${ampm}`;
//   };

//   // Check if appointment is joinable (within 15 minutes of appointment time)
//   const isAppointmentJoinable = (appointment) => {
//     const now = new Date();
//     const appointmentDateTime = new Date(`${appointment.appointment_date}T${appointment.appointment_time}`);
    
//     // Check if current time is within 15 minutes after appointment time
//     const timeDifference = now.getTime() - appointmentDateTime.getTime();
//     const fifteenMinutes = 15 * 60 * 1000; // 15 minutes in milliseconds
    
//     return timeDifference >= 0 && timeDifference <= fifteenMinutes;
//   };

//   // Check if appointment is upcoming (within next 24 hours)
//   const isAppointmentUpcoming = (appointment) => {
//     const now = new Date();
//     const appointmentDateTime = new Date(`${appointment.appointment_date}T${appointment.appointment_time}`);
//     const twentyFourHours = 24 * 60 * 60 * 1000;
    
//     return appointmentDateTime > now && (appointmentDateTime.getTime() - now.getTime()) <= twentyFourHours;
//   };

//   // Determine appointment status for filtering
//   const getAppointmentStatus = (appointment) => {
//     const today = new Date();
//     const appointmentDate = new Date(appointment.appointment_date);
    
//     if (appointment.status === 'canceled') return 'canceled';
//     if (appointmentDate < today) return 'completed';
//     return 'upcoming';
//   };

//   // Filter appointments based on active tab
//   const filteredAppointments = appointments.filter(appointment => {
//     const status = getAppointmentStatus(appointment);
    
//     if (activeTab === 'Upcoming') return status === 'upcoming';
//     if (activeTab === 'Completed') return status === 'completed';
//     if (activeTab === 'Canceled') return status === 'canceled';
//     return true;
//   });

//   // Handle pull to refresh
//   const handleRefresh = () => {
//     setRefreshing(true);
//     fetchAppointments();
//   };

//   // Reschedule appointment API call
//   const handleReschedule = async (appointment, newDate, newTime) => {
//     try {
//       setRescheduling(appointment.id);
      
//       const userId = await getUserId();
//       if (!userId) {
//         Alert.alert('Error', 'User not found. Please login again.');
//         return;
//       }

//       const rescheduleData = {
//         appointment_id: appointment.id,
//         new_date: newDate,
//         new_time: newTime,
//         user_id: userId
//       };

//       console.log('Rescheduling appointment with data:', rescheduleData);

//       const response = await fetch('https://mediconnect-lemon.vercel.app/api/appointment/reschedule', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(rescheduleData),
//       });

//       const result = await response.json();

//       if (response.ok && result.success) {
//         Alert.alert('Success', 'Appointment rescheduled successfully!');
//         fetchAppointments(); // Refresh the list
//       } else {
//         throw new Error(result.message || 'Failed to reschedule appointment');
//       }
//     } catch (error) {
//       console.error('Reschedule error:', error);
//       Alert.alert(
//         'Reschedule Failed',
//         error.message || 'Something went wrong. Please try again.'
//       );
//     } finally {
//       setRescheduling(null);
//     }
//   };

//   // Navigate to BookSlot for rescheduling
//   const navigateToReschedule = (appointment) => {
//     navigation?.navigate?.('BookSlot', { 
//       doctor: appointment.doctor,
//       appointmentId: appointment.id,
//       isReschedule: true,
//       onReschedule: (newDate, newTime) => {
//         handleReschedule(appointment, newDate, newTime);
//       }
//     });
//   };

//   // Join video call
//   const handleJoinCall = (appointment) => {
//     // Navigate to video call screen with appointment details
//     navigation.navigate('VideoCall', {
//       appointmentId: appointment.id,
//       doctorId: appointment.doctor?.id,
//       doctorName: appointment.doctor?.full_name,
//       channelName: `appointment_${appointment.id}`,
//     });
//   };

//   // Cancel appointment
//   const handleCancel = (appointment) => {
//     console.log('cancel', appointment.id);
//     Alert.alert(
//       'Cancel Appointment',
//       'Are you sure you want to cancel this appointment?',
//       [
//         { text: 'No', style: 'cancel' },
//         { text: 'Yes', onPress: () => {
//           // Implement cancel API call here
//           Alert.alert('Appointment Cancelled', 'Your appointment has been cancelled.');
//         }},
//       ]
//     );
//   };

//   const handleReview = (appointment) => {
//     console.log('review', appointment.id);
//     // Navigate to review screen
//   };

//   const handleReceipt = (appointment) => {
//     console.log('receipt', appointment.id);
//     // Navigate to receipt screen
//   };

//   const handleRebook = (appointment) => {
//     console.log('rebook', appointment.id);
//     navigation?.navigate?.('BookSlot', { 
//       doctor: appointment.doctor 
//     });
//   };

//   // Initial data fetch
//   useEffect(() => {
//     fetchAppointments();
//   }, []);

//   // Default doctor image
//   const defaultDoctorImage = 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=800&auto=format&fit=crop';

//   if (loading) {
//     return (
//       <SafeAreaView style={[styles.safe, { backgroundColor: palette.background }]}>
//         <StatusBar
//           barStyle={scheme === 'light' ? 'dark-content' : 'light-content'}
//           backgroundColor={palette.background}
//         />
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color={palette.primary} />
//           <Text style={[styles.loadingText, { color: palette.text }]}>
//             Loading appointments...
//           </Text>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={[styles.safe, { backgroundColor: palette.background }]}>
//       <StatusBar
//         barStyle={scheme === 'light' ? 'dark-content' : 'light-content'}
//         backgroundColor={palette.background}
//       />

//       <View style={[styles.header, { backgroundColor: palette.background }]}>
//         <TouchableOpacity onPress={() => navigation?.goBack?.()} style={styles.headerLeft}>
//           <Text style={[styles.back, { color: palette.text }]}>‹</Text>
//         </TouchableOpacity>

//         <Text style={[styles.headerTitle, { color: palette.text }]}>My Bookings</Text>

//         <View style={styles.headerRight} />
//       </View>

//       {/* Horizontal tab row */}
//       <View style={[styles.tabRow, { backgroundColor: palette.background, borderBottomColor: palette.border }]}>
//         {['Upcoming', 'Completed', 'Canceled'].map(tab => {
//           const focused = activeTab === tab;
//           return (
//             <TouchableOpacity
//               key={tab}
//               onPress={() => setActiveTab(tab)}
//               activeOpacity={0.8}
//               style={[styles.tabItem, focused && { borderBottomColor: palette.primary }]}
//             >
//               <Text style={[styles.tabLabel, { color: focused ? palette.text : palette.muted, fontWeight: focused ? '800' : '700' }]}>
//                 {tab}
//               </Text>
//               {focused && <View style={[styles.underline, { backgroundColor: palette.primary }]} />}
//             </TouchableOpacity>
//           );
//         })}
//       </View>

//       <ScrollView 
//         showsVerticalScrollIndicator={false} 
//         contentContainerStyle={{ paddingBottom: 140 }}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={handleRefresh}
//             colors={[palette.primary]}
//             tintColor={palette.primary}
//           />
//         }
//       >
//         <View style={styles.container}>
//           {filteredAppointments.length === 0 ? (
//             <View style={styles.empty}>
//               <Text style={[styles.emptyText, { color: palette.muted }]}>
//                 No {activeTab.toLowerCase()} appointments.
//               </Text>
//               {activeTab === 'Upcoming' && (
//                 <TouchableOpacity 
//                   style={[styles.bookNowButton, { backgroundColor: palette.primary }]}
//                   onPress={() => navigation.navigate('AllDoctors')}
//                 >
//                   <Text style={styles.bookNowText}>Book Now</Text>
//                 </TouchableOpacity>
//               )}
//             </View>
//           ) : (
//             filteredAppointments.map(appointment => {
//               const isJoinable = isAppointmentJoinable(appointment);
//               const isUpcoming = isAppointmentUpcoming(appointment);
              
//               return (
//                 <View key={appointment.id} style={[styles.card, { backgroundColor: palette.cardBg, borderColor: palette.border }]}>
//                   {/* Status-based left accent color */}
//                   <View style={[
//                     styles.leftAccent, 
//                     { 
//                       backgroundColor: getAppointmentStatus(appointment) === 'canceled' 
//                         ? palette.danger 
//                         : isJoinable 
//                         ? palette.success 
//                         : palette.primary 
//                     }
//                   ]} />

//                   <View style={styles.cardContent}>
//                     <Text style={[styles.cardDate, { color: palette.text }]}>
//                       {formatDisplayDate(appointment.appointment_date, appointment.appointment_time)}
//                     </Text>

//                     {isJoinable && (
//                       <View style={[styles.joinIndicator, { backgroundColor: palette.success }]}>
//                         <Text style={styles.joinIndicatorText}>Join Now Available</Text>
//                       </View>
//                     )}

//                     <View style={[styles.row, { marginTop: 8 }]}>
//                       <Image 
//                         source={{ uri: appointment.doctor?.image || defaultDoctorImage }} 
//                         style={styles.avatar} 
//                         defaultSource={{ uri: defaultDoctorImage }}
//                       />
//                       <View style={{ flex: 1 }}>
//                         <Text style={[styles.name, { color: palette.text }]}>
//                           {appointment.doctor?.full_name || 'Doctor'}
//                         </Text>
//                         <Text style={[styles.spec, { color: palette.muted }]}>
//                           {appointment.doctor?.specialization || 'Specialist'}
//                         </Text>
//                         <Text style={[styles.location, { color: palette.muted }]}>
//                           ◎ {appointment.doctor?.clinic_name || 'Medical Center'}
//                         </Text>
//                         <Text style={[styles.fee, { color: palette.primary }]}>
//                           ₹{appointment.doctor?.consultation_fee || '0'} Consultation Fee
//                         </Text>
//                       </View>
//                     </View>

//                     {/* Disease Info */}
//                     {appointment.disease_info && (
//                       <>
//                         <View style={[styles.cardDivider, { backgroundColor: palette.border }]} />
//                         <View style={styles.diseaseInfo}>
//                           <Text style={[styles.diseaseTitle, { color: palette.text }]}>
//                             Condition:
//                           </Text>
//                           <Text style={[styles.diseaseSummary, { color: palette.muted }]}>
//                             {appointment.disease_info.summary}
//                           </Text>
//                           {appointment.disease_info.symptoms && (
//                             <Text style={[styles.symptoms, { color: palette.muted }]}>
//                               Symptoms: {appointment.disease_info.symptoms.join(', ')}
//                             </Text>
//                           )}
//                         </View>
//                       </>
//                     )}

//                     <View style={[styles.cardDivider, { backgroundColor: palette.border }]} />

//                     {/* Actions vary by tab */}
//                     <View style={styles.actions}>
//                       {activeTab === 'Upcoming' && (
//                         <>
//                           {isJoinable ? (
//                             <TouchableOpacity 
//                               style={[styles.btnJoin, { backgroundColor: palette.success }]} 
//                               onPress={() => handleJoinCall(appointment)}
//                             >
//                               <Text style={styles.btnJoinText}>Join Now</Text>
//                             </TouchableOpacity>
//                           ) : (
//                             <>
//                               <TouchableOpacity 
//                                 style={[styles.btnGhost, { backgroundColor: scheme === 'light' ? '#F1F3F5' : '#12202A' }]} 
//                                 onPress={() => handleCancel(appointment)}
//                               >
//                                 <Text style={[styles.btnGhostText, { color: palette.muted }]}>Cancel</Text>
//                               </TouchableOpacity>

//                               <TouchableOpacity 
//                                 style={[styles.btnPrimary, { backgroundColor: palette.primary }]} 
//                                 onPress={() => navigateToReschedule(appointment)}
//                                 disabled={rescheduling === appointment.id}
//                               >
//                                 {rescheduling === appointment.id ? (
//                                   <ActivityIndicator size="small" color="#FFF" />
//                                 ) : (
//                                   <Text style={styles.btnPrimaryText}>Reschedule</Text>
//                                 )}
//                               </TouchableOpacity>
//                             </>
//                           )}
//                         </>
//                       )}

//                       {activeTab === 'Completed' && (
//                         <>
//                           <TouchableOpacity 
//                             style={[styles.btnGhost, { backgroundColor: scheme === 'light' ? '#F1F3F5' : '#12202A' }]} 
//                             onPress={() => handleReview(appointment)}
//                           >
//                             <Text style={[styles.btnGhostText, { color: palette.muted }]}>Leave Review</Text>
//                           </TouchableOpacity>

//                           <TouchableOpacity 
//                             style={[styles.btnPrimary, { backgroundColor: palette.primary }]} 
//                             onPress={() => handleReceipt(appointment)}
//                           >
//                             <Text style={styles.btnPrimaryText}>View Receipt</Text>
//                           </TouchableOpacity>
//                         </>
//                       )}

//                       {activeTab === 'Canceled' && (
//                         <TouchableOpacity 
//                           style={[styles.btnPrimary, { backgroundColor: palette.primary, flex: 1 }]} 
//                           onPress={() => handleRebook(appointment)}
//                         >
//                           <Text style={styles.btnPrimaryText}>Rebook</Text>
//                         </TouchableOpacity>
//                       )}
//                     </View>
//                   </View>
//                 </View>
//               );
//             })
//           )}
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const CARD_PADDING = 18;
// const AVATAR = 96;

// const styles = StyleSheet.create({
//   safe: { flex: 1 },
  
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingText: {
//     marginTop: 12,
//     fontSize: 16,
//     fontWeight: '600',
//   },

//   header: {
//     height: 84,
//     paddingHorizontal: 18,
//     alignItems: 'center',
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   headerLeft: { width: 48, alignItems: 'flex-start', justifyContent: 'center' },
//   back: { fontSize: 30, fontWeight: '600' },
//   headerTitle: { fontSize: 22, fontWeight: '800' },
//   headerRight: { width: 48 },

//   tabRow: {
//     flexDirection: 'row',
//     borderBottomWidth: 1,
//   },
//   tabItem: {
//     flex: 1,
//     paddingVertical: 12,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   tabLabel: {
//     fontSize: 16,
//   },
//   underline: {
//     marginTop: 8,
//     height: 4,
//     width: 64,
//     borderRadius: 6,
//   },

//   container: {
//     paddingHorizontal: 16,
//     paddingTop: 12,
//   },

//   card: {
//     marginBottom: 18,
//     borderRadius: 14,
//     overflow: 'hidden',
//     borderWidth: 1,
//     padding: 0,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 12 },
//     shadowOpacity: 0.08,
//     shadowRadius: 20,
//     elevation: 8,
//   },

//   leftAccent: {
//     position: 'absolute',
//     left: 0,
//     top: 0,
//     bottom: 0,
//     width: 6,
//     borderTopLeftRadius: 14,
//     borderBottomLeftRadius: 14,
//   },

//   cardContent: {
//     padding: CARD_PADDING,
//     paddingLeft: CARD_PADDING + 8,
//   },

//   cardDate: {
//     fontSize: 16,
//     fontWeight: '800',
//   },

//   joinIndicator: {
//     alignSelf: 'flex-start',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 12,
//     marginTop: 8,
//   },
//   joinIndicatorText: {
//     color: '#FFF',
//     fontSize: 12,
//     fontWeight: '700',
//   },

//   row: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },

//   avatar: {
//     width: AVATAR,
//     height: AVATAR,
//     borderRadius: 12,
//     marginRight: 14,
//     backgroundColor: '#EEE',
//   },

//   name: {
//     fontSize: 18,
//     fontWeight: '800',
//     marginBottom: 6,
//   },
//   spec: {
//     fontSize: 15,
//     fontWeight: '600',
//     marginBottom: 6,
//   },
//   location: {
//     fontSize: 14,
//     marginBottom: 4,
//   },
//   fee: {
//     fontSize: 14,
//     fontWeight: '700',
//   },

//   diseaseInfo: {
//     marginVertical: 8,
//   },
//   diseaseTitle: {
//     fontSize: 14,
//     fontWeight: '700',
//     marginBottom: 4,
//   },
//   diseaseSummary: {
//     fontSize: 14,
//     lineHeight: 18,
//     marginBottom: 4,
//   },
//   symptoms: {
//     fontSize: 13,
//     fontStyle: 'italic',
//   },

//   cardDivider: {
//     height: 1,
//     marginVertical: 12,
//   },

//   actions: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     gap: 12,
//   },

//   btnGhost: {
//     flex: 1,
//     height: 52,
//     borderRadius: 26,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginRight: 12,
//   },
//   btnGhostText: {
//     fontSize: 16,
//     fontWeight: '800',
//   },

//   btnPrimary: {
//     flex: 1,
//     height: 52,
//     borderRadius: 26,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   btnPrimaryText: {
//     color: '#FFF',
//     fontSize: 16,
//     fontWeight: '800',
//   },

//   btnJoin: {
//     flex: 1,
//     height: 52,
//     borderRadius: 26,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   btnJoinText: {
//     color: '#FFF',
//     fontSize: 16,
//     fontWeight: '800',
//   },

//   empty: {
//     paddingVertical: 48,
//     alignItems: 'center',
//   },
//   emptyText: {
//     fontSize: 16,
//     marginBottom: 16,
//   },
//   bookNowButton: {
//     paddingHorizontal: 24,
//     paddingVertical: 12,
//     borderRadius: 20,
//   },
//   bookNowText: {
//     color: '#FFF',
//     fontSize: 16,
//     fontWeight: '700',
//   },
// });

// export default Booking;




import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
  Platform,
  useColorScheme,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Modal,
  FlatList
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../constants/Colors';
import DateTimePicker from '@react-native-community/datetimepicker';

const { width } = Dimensions.get('window');

// Utility to build calendar matrix
function buildMonthMatrix(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const firstWeekday = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const rows = [];
  let current = 1 - firstWeekday;

  while (current <= daysInMonth) {
    const week = [];
    for (let i = 0; i < 7; i++, current++) {
      if (current < 1 || current > daysInMonth) week.push(null);
      else week.push(current);
    }
    rows.push(week);
  }
  return rows;
}

const Booking = ({ navigation }) => {
  const deviceScheme = useColorScheme();
  const scheme = deviceScheme === 'light' ? 'dark' : 'dark';
  const theme = Colors[scheme] || {};

  const palette = {
    background: theme.background ?? (scheme === 'light' ? '#FFFFFF' : '#0A1830'),
    surface: theme.card ?? (scheme === 'light' ? '#FFFFFF' : '#0F2034'),
    text: theme.text ?? (scheme === 'light' ? '#0B1220' : '#FFFFFF'),
    muted: theme.muted ?? (scheme === 'light' ? '#7B8794' : '#A8B0C2'),
    border: theme.border ?? (scheme === 'light' ? '#E6E9EE' : '#243142'),
    primary: theme.primary ?? (scheme === 'light' ? '#0B1220' : '#00E0FF'),
    accent: theme.primary ?? '#00E0FF',
    cardBg: scheme === 'light' ? '#FFFFFF' : '#0F2034',
    lightCard: scheme === 'light' ? '#F8F9FB' : '#132033',
    danger: '#FF6B6B',
    success: '#4CAF50',
    available: '#4CAF50',
    unavailable: '#FF6B6B',
  };

  const [activeTab, setActiveTab] = useState('Upcoming');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [rescheduling, setRescheduling] = useState(null);
  
  // Reschedule Modal State
  const [rescheduleModalVisible, setRescheduleModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [userId, setUserId] = useState(null);

  // Calendar State
  const [calendarModalVisible, setCalendarModalVisible] = useState(false);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [selectedDay, setSelectedDay] = useState(null);

  // Time Slots State
  const [timeSlotsModalVisible, setTimeSlotsModalVisible] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Function to get user ID from AsyncStorage
  const getUserId = async () => {
    try {
      const userData = await AsyncStorage.getItem('user_data');
      if (userData) {
        const parsedUserData = JSON.parse(userData);
        const id = parsedUserData.id || parsedUserData.userId || null;
        setUserId(id);
        return id;
      }
      return null;
    } catch (error) {
      console.error('Error getting user ID:', error);
      return null;
    }
  };

  // Function to fetch appointments from API
  const fetchAppointments = async (page = 1, dateFilter = 'all') => {
    try {
      const userId = await getUserId();
      if (!userId) {
        Alert.alert('Error', 'User not found. Please login again.');
        setLoading(false);
        return;
      }

      const requestData = {
        patient_id: userId,
        date_filter: dateFilter,
        page: page
      };

      const response = await fetch('https://mediconnect-lemon.vercel.app/api/appointment/patient-appointment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setAppointments(result.data.appointments || []);
      } else {
        throw new Error(result.message || 'Failed to fetch appointments');
      }
    } catch (error) {
      console.error('Fetch appointments error:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to load appointments. Please try again.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Format date for display
  const formatDisplayDate = (dateString, timeString) => {
    const date = new Date(dateString);
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    const formattedDate = date.toLocaleDateString(undefined, options);
    
    const time = timeString.split(':');
    let hours = parseInt(time[0]);
    const minutes = time[1];
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    
    return `${formattedDate} - ${hours}.${minutes} ${ampm}`;
  };

  // Check if appointment is joinable (within 15 minutes of appointment time)
  const isAppointmentJoinable = (appointment) => {
    const now = new Date();
    const appointmentDateTime = new Date(`${appointment.appointment_date}T${appointment.appointment_time}`);
    
    const timeDifference = now.getTime() - appointmentDateTime.getTime();
    const fifteenMinutes = 15 * 60 * 1000;
    
    return timeDifference >= 0 && timeDifference <= fifteenMinutes;
  };

  // Determine appointment status for filtering
  const getAppointmentStatus = (appointment) => {
    const today = new Date();
    const appointmentDate = new Date(appointment.appointment_date);
    
    if (appointment.status === 'canceled') return 'canceled';
    if (appointmentDate < today) return 'completed';
    return 'upcoming';
  };

  // Filter appointments based on active tab
  const filteredAppointments = appointments.filter(appointment => {
    const status = getAppointmentStatus(appointment);
    
    if (activeTab === 'Upcoming') return status === 'upcoming';
    if (activeTab === 'Completed') return status === 'completed';
    if (activeTab === 'Canceled') return status === 'canceled';
    return true;
  });

  // Handle pull to refresh
  const handleRefresh = () => {
    setRefreshing(true);
    fetchAppointments();
  };

  // Open reschedule modal
  const openRescheduleModal = (appointment) => {
    setSelectedAppointment(appointment);
    setNewDate('');
    setNewTime('');
    setSelectedDay(null);
    setSelectedSlot(null);
    setRescheduleModalVisible(true);
  };

  // Close all modals
  const closeAllModals = () => {
    setRescheduleModalVisible(false);
    setCalendarModalVisible(false);
    setTimeSlotsModalVisible(false);
    setSelectedAppointment(null);
    setNewDate('');
    setNewTime('');
    setSelectedDay(null);
    setSelectedSlot(null);
    setAvailableSlots([]);
  };

  // Open calendar modal
  const openCalendarModal = () => {
    setCalendarModalVisible(true);
  };

  // Handle date selection from calendar
  const handleDateSelect = (day) => {
    if (!day) return;
    
    const selectedDate = new Date(currentYear, currentMonth, day);
    const formattedDate = selectedDate.toISOString().split('T')[0];
    
    setSelectedDay(day);
    setNewDate(formattedDate);
    
    // Close calendar and fetch available slots
    setCalendarModalVisible(false);
    fetchAvailableSlots(formattedDate);
  };

  // Fetch available slots for selected date
  const fetchAvailableSlots = async (date) => {
    if (!selectedAppointment?.doctor?.id) {
      Alert.alert('Error', 'Doctor information not available');
      return;
    }

    setSlotsLoading(true);
    try {
      const response = await fetch('https://mediconnect-lemon.vercel.app/api/doctors/slots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          doctor_id: selectedAppointment.doctor.id,
          date: date
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setAvailableSlots(result.data || []);
        setTimeSlotsModalVisible(true);
      } else {
        throw new Error(result.message || 'Failed to fetch available slots');
      }
    } catch (error) {
      console.error('Fetch slots error:', error);
      Alert.alert('Error', 'Failed to load available time slots');
    } finally {
      setSlotsLoading(false);
    }
  };

  // Handle time slot selection
  const handleTimeSlotSelect = (slot) => {
    if (slot.slot_booked) return;
    
    setSelectedSlot(slot.time);
    setNewTime(slot.time);
    setTimeSlotsModalVisible(false);
  };

  // Convert 24-hour format to 12-hour format
  const convertTo12HourFormat = (timeStr) => {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours, 10);
    
    if (hour === 0) {
      return `12:${minutes} AM`;
    } else if (hour < 12) {
      return `${hour}:${minutes} AM`;
    } else if (hour === 12) {
      return `12:${minutes} PM`;
    } else {
      return `${hour - 12}:${minutes} PM`;
    }
  };

  // Reschedule appointment API call
  const handleReschedule = async () => {
    if (!selectedAppointment || !newDate || !newTime) {
      Alert.alert('Error', 'Please select both date and time');
      return;
    }

    try {
      setRescheduling(selectedAppointment.id);
      
      const userId = await getUserId();
      if (!userId) {
        Alert.alert('Error', 'User not found. Please login again.');
        return;
      }

      const rescheduleData = {
        appointment_id: selectedAppointment.id,
        new_date: newDate,
        new_time: newTime,
        user_id: userId
      };

      console.log('Rescheduling appointment with data:', rescheduleData);

      const response = await fetch('https://mediconnect-lemon.vercel.app/api/appointment/reschedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(rescheduleData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        Alert.alert('Success', 'Appointment rescheduled successfully!');
        closeAllModals();
        fetchAppointments();
      } else {
        throw new Error(result.message || 'Failed to reschedule appointment');
      }
    } catch (error) {
      console.error('Reschedule error:', error);
      Alert.alert(
        'Reschedule Failed',
        error.message || 'Something went wrong. Please try again.'
      );
    } finally {
      setRescheduling(null);
    }
  };

  // Calendar navigation
  const goPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(y => y - 1);
    } else {
      setCurrentMonth(m => m - 1);
    }
    setSelectedDay(null);
  };

  const goNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(y => y + 1);
    } else {
      setCurrentMonth(m => m + 1);
    }
    setSelectedDay(null);
  };

  const monthName = new Date(currentYear, currentMonth, 1).toLocaleString(undefined, {
    month: 'long',
    year: 'numeric',
  });

  const monthMatrix = buildMonthMatrix(currentYear, currentMonth);
  const calendarCardWidth = width - 80;
  const dayCellSize = (calendarCardWidth - 32) / 7;

  // Join video call
  const handleJoinCall = (appointment) => {
    navigation.navigate('VideoCall', {
      appointmentId: appointment.id,
      doctorId: appointment.doctor?.id,
      doctorName: appointment.doctor?.full_name,
      channelName: `appointment_${appointment.id}`,
    });
  };

  // Cancel appointment
  const handleCancel = (appointment) => {
    Alert.alert(
      'Cancel Appointment',
      'Are you sure you want to cancel this appointment?',
      [
        { text: 'No', style: 'cancel' },
        { text: 'Yes', onPress: () => {
          Alert.alert('Appointment Cancelled', 'Your appointment has been cancelled.');
        }},
      ]
    );
  };

  // Initial data fetch
  useEffect(() => {
    fetchAppointments();
    getUserId();
  }, []);

  // Default doctor image
  const defaultDoctorImage = 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=800&auto=format&fit=crop';

  if (loading) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: palette.background }]}>
        <StatusBar
          barStyle={scheme === 'light' ? 'dark-content' : 'light-content'}
          backgroundColor={palette.background}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={palette.primary} />
          <Text style={[styles.loadingText, { color: palette.text }]}>
            Loading appointments...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: palette.background }]}>
      <StatusBar
        barStyle={scheme === 'light' ? 'dark-content' : 'light-content'}
        backgroundColor={palette.background}
      />

      <View style={[styles.header, { backgroundColor: palette.background }]}>
        <TouchableOpacity onPress={() => navigation?.goBack?.()} style={styles.headerLeft}>
          <Text style={[styles.back, { color: palette.text }]}>‹</Text>
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: palette.text }]}>My Bookings</Text>

        <View style={styles.headerRight} />
      </View>

      {/* Horizontal tab row */}
      <View style={[styles.tabRow, { backgroundColor: palette.background, borderBottomColor: palette.border }]}>
        {['Upcoming', 'Completed', 'Canceled'].map(tab => {
          const focused = activeTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              activeOpacity={0.8}
              style={[styles.tabItem, focused && { borderBottomColor: palette.primary }]}
            >
              <Text style={[styles.tabLabel, { color: focused ? palette.text : palette.muted, fontWeight: focused ? '800' : '700' }]}>
                {tab}
              </Text>
              {focused && <View style={[styles.underline, { backgroundColor: palette.primary }]} />}
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ paddingBottom: 140 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[palette.primary]}
            tintColor={palette.primary}
          />
        }
      >
        <View style={styles.container}>
          {filteredAppointments.length === 0 ? (
            <View style={styles.empty}>
              <Text style={[styles.emptyText, { color: palette.muted }]}>
                No {activeTab.toLowerCase()} appointments.
              </Text>
              {activeTab === 'Upcoming' && (
                <TouchableOpacity 
                  style={[styles.bookNowButton, { backgroundColor: palette.primary }]}
                  onPress={() => navigation.navigate('AllDoctors')}
                >
                  <Text style={styles.bookNowText}>Book Now</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            filteredAppointments.map(appointment => {
              const isJoinable = isAppointmentJoinable(appointment);
              
              return (
                <View key={appointment.id} style={[styles.card, { backgroundColor: palette.cardBg, borderColor: palette.border }]}>
                  <View style={[
                    styles.leftAccent, 
                    { 
                      backgroundColor: getAppointmentStatus(appointment) === 'canceled' 
                        ? palette.danger 
                        : isJoinable 
                        ? palette.success 
                        : palette.primary 
                    }
                  ]} />

                  <View style={styles.cardContent}>
                    <Text style={[styles.cardDate, { color: palette.text }]}>
                      {formatDisplayDate(appointment.appointment_date, appointment.appointment_time)}
                    </Text>

                    {isJoinable && (
                      <View style={[styles.joinIndicator, { backgroundColor: palette.success }]}>
                        <Text style={styles.joinIndicatorText}>Join Now Available</Text>
                      </View>
                    )}

                    <View style={[styles.row, { marginTop: 8 }]}>
                      <Image 
                        source={{ uri: appointment.doctor?.image || defaultDoctorImage }} 
                        style={styles.avatar} 
                        defaultSource={{ uri: defaultDoctorImage }}
                      />
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.name, { color: palette.text }]}>
                          {appointment.doctor?.full_name || 'Doctor'}
                        </Text>
                        <Text style={[styles.spec, { color: palette.muted }]}>
                          {appointment.doctor?.specialization || 'Specialist'}
                        </Text>
                        <Text style={[styles.fee, { color: palette.primary }]}>
                          ₹{appointment.doctor?.consultation_fee || '0'} Consultation Fee
                        </Text>
                      </View>
                    </View>

                    <View style={[styles.cardDivider, { backgroundColor: palette.border }]} />

                    <View style={styles.actions}>
                      {activeTab === 'Upcoming' && (
                        <>
                          {isJoinable ? (
                            <TouchableOpacity 
                              style={[styles.btnJoin, { backgroundColor: palette.success }]} 
                              onPress={() => handleJoinCall(appointment)}
                            >
                              <Text style={styles.btnJoinText}>Join Now</Text>
                            </TouchableOpacity>
                          ) : (
                            <>
                              <TouchableOpacity 
                                style={[styles.btnGhost, { backgroundColor: scheme === 'light' ? '#F1F3F5' : '#12202A' }]} 
                                onPress={() => handleCancel(appointment)}
                              >
                                <Text style={[styles.btnGhostText, { color: palette.muted }]}>Cancel</Text>
                              </TouchableOpacity>

                              <TouchableOpacity 
                                style={[styles.btnPrimary, { backgroundColor: palette.primary }]} 
                                onPress={() => openRescheduleModal(appointment)}
                                disabled={rescheduling === appointment.id}
                              >
                                {rescheduling === appointment.id ? (
                                  <ActivityIndicator size="small" color="#FFF" />
                                ) : (
                                  <Text style={styles.btnPrimaryText}>Reschedule</Text>
                                )}
                              </TouchableOpacity>
                            </>
                          )}
                        </>
                      )}
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* Reschedule Modal */}
      <Modal
        visible={rescheduleModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeAllModals}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: palette.cardBg }]}>
            <Text style={[styles.modalTitle, { color: palette.text }]}>
              Reschedule Appointment
            </Text>
            
            {selectedAppointment && (
              <View style={styles.appointmentInfo}>
                <Text style={[styles.doctorName, { color: palette.text }]}>
                  Dr. {selectedAppointment.doctor?.full_name}
                </Text>
                <Text style={[styles.currentAppointment, { color: palette.muted }]}>
                  Current: {formatDisplayDate(selectedAppointment.appointment_date, selectedAppointment.appointment_time)}
                </Text>
              </View>
            )}

            {/* Date Selection */}
            <TouchableOpacity 
              style={[styles.selectionButton, { 
                backgroundColor: scheme === 'light' ? '#F8F9FA' : '#1A2530',
                borderColor: palette.border
              }]}
              onPress={openCalendarModal}
            >
              <Text style={[styles.selectionButtonText, { color: newDate ? palette.text : palette.muted }]}>
                {newDate ? `Selected Date: ${newDate}` : '📅 Select Date'}
              </Text>
            </TouchableOpacity>

            {/* Time Selection */}
            <TouchableOpacity 
              style={[styles.selectionButton, { 
                backgroundColor: scheme === 'light' ? '#F8F9FA' : '#1A2530',
                borderColor: palette.border,
                marginTop: 12
              }]}
              onPress={() => newDate && setTimeSlotsModalVisible(true)}
              disabled={!newDate}
            >
              <Text style={[styles.selectionButtonText, { 
                color: newTime ? palette.text : palette.muted,
                opacity: !newDate ? 0.5 : 1
              }]}>
                {newTime ? `Selected Time: ${convertTo12HourFormat(newTime)}` : '⏰ Select Time'}
              </Text>
            </TouchableOpacity>

            <Text style={[styles.selectionHint, { color: palette.muted }]}>
              {!newDate ? 'Please select a date first' : 'Select your preferred time slot'}
            </Text>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton, { borderColor: palette.border }]}
                onPress={closeAllModals}
              >
                <Text style={[styles.cancelButtonText, { color: palette.text }]}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton, { 
                  backgroundColor: palette.primary,
                  opacity: (newDate && newTime) ? 1 : 0.5
                }]}
                onPress={handleReschedule}
                disabled={!newDate || !newTime || rescheduling}
              >
                {rescheduling ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <Text style={styles.confirmButtonText}>Reschedule</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Calendar Modal */}
      <Modal
        visible={calendarModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setCalendarModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.calendarModalContent, { backgroundColor: palette.cardBg }]}>
            <Text style={[styles.modalTitle, { color: palette.text }]}>
              Select Date
            </Text>

            <View style={[styles.calendarCard, { backgroundColor: palette.surface, shadowColor: palette.text }]}>
              <View style={styles.calendarHeader}>
                <Text style={[styles.calendarTitle, { color: palette.text }]}>
                  {monthName}
                </Text>
                <View style={styles.calendarNav}>
                  <TouchableOpacity onPress={goPrevMonth} style={styles.navBtn}>
                    <Text style={[styles.navText, { color: palette.muted }]}>‹</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={goNextMonth} style={[styles.navBtn, { marginLeft: 10 }]}>
                    <Text style={[styles.navText, { color: palette.muted }]}>›</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.weekDaysRow}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                  <Text
                    key={d}
                    style={[
                      styles.weekDayLabel,
                      { color: palette.muted, width: dayCellSize, textAlign: 'center' },
                    ]}>
                    {d}
                  </Text>
                ))}
              </View>

              <View style={styles.daysWrap}>
                {monthMatrix.map((week, wi) => (
                  <View key={`w-${wi}`} style={styles.weekRow}>
                    {week.map((day, di) => {
                      const isSelected = day === selectedDay;
                      const isToday = day === new Date().getDate() && 
                                    currentMonth === new Date().getMonth() && 
                                    currentYear === new Date().getFullYear();
                      
                      return (
                        <TouchableOpacity
                          key={`d-${wi}-${di}`}
                          activeOpacity={day ? 0.8 : 1}
                          onPress={() => handleDateSelect(day)}
                          style={{
                            width: dayCellSize,
                            alignItems: 'center',
                            marginVertical: 8,
                          }}>
                          {day ? (
                            <View
                              style={[
                                styles.dayWrapper,
                                isSelected
                                  ? {
                                      backgroundColor: palette.primary,
                                      width: 36,
                                      height: 36,
                                      borderRadius: 18,
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                    }
                                  : {},
                              ]}>
                              <Text
                                style={[
                                  styles.dayText,
                                  {
                                    color: isSelected
                                      ? '#FFF'
                                      : isToday
                                      ? palette.primary
                                      : palette.text,
                                    fontWeight: isSelected ? '800' : '600',
                                  },
                                ]}>
                                {day}
                              </Text>
                            </View>
                          ) : (
                            <View style={{height: 36}} />
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                ))}
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.modalButton, { backgroundColor: palette.primary, marginTop: 16 }]}
              onPress={() => setCalendarModalVisible(false)}
            >
              <Text style={styles.confirmButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Time Slots Modal */}
      <Modal
        visible={timeSlotsModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setTimeSlotsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: palette.cardBg, maxHeight: '80%' }]}>
            <Text style={[styles.modalTitle, { color: palette.text }]}>
              Available Time Slots
            </Text>
            <Text style={[styles.subtitle, { color: palette.muted }]}>
              Select your preferred time for {newDate}
            </Text>

            {slotsLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={palette.primary} />
                <Text style={[styles.loadingText, { color: palette.text }]}>
                  Loading available slots...
                </Text>
              </View>
            ) : (
              <FlatList
                data={availableSlots}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.timeSlot,
                      { 
                        backgroundColor: selectedSlot === item.time ? palette.primary : 
                                       item.slot_booked ? palette.danger : palette.surface,
                        borderColor: palette.border,
                        opacity: item.slot_booked ? 0.6 : 1
                      }
                    ]}
                    onPress={() => !item.slot_booked && handleTimeSlotSelect(item)}
                    disabled={item.slot_booked}
                  >
                    <Text style={[
                      styles.timeSlotText,
                      { 
                        color: selectedSlot === item.time ? '#FFF' : 
                              item.slot_booked ? '#FFF' : palette.text
                      }
                    ]}>
                      {convertTo12HourFormat(item.time)}
                      {item.slot_booked && ' (Booked)'}
                    </Text>
                  </TouchableOpacity>
                )}
                numColumns={2}
                columnWrapperStyle={styles.timeSlotsGrid}
                contentContainerStyle={styles.timeSlotsContainer}
                showsVerticalScrollIndicator={false}
              />
            )}

            <TouchableOpacity 
              style={[styles.modalButton, { backgroundColor: palette.primary, marginTop: 16 }]}
              onPress={() => setTimeSlotsModalVisible(false)}
            >
              <Text style={styles.confirmButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const CARD_PADDING = 18;
const AVATAR = 96;

const styles = StyleSheet.create({
  safe: { flex: 1 },
  
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
  },

  header: {
    height: 84,
    paddingHorizontal: 18,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerLeft: { width: 48, alignItems: 'flex-start', justifyContent: 'center' },
  back: { fontSize: 30, fontWeight: '600' },
  headerTitle: { fontSize: 22, fontWeight: '800' },
  headerRight: { width: 48 },

  tabRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 16,
  },
  underline: {
    marginTop: 8,
    height: 4,
    width: 64,
    borderRadius: 6,
  },

  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },

  card: {
    marginBottom: 18,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    padding: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 8,
  },

  leftAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 6,
    borderTopLeftRadius: 14,
    borderBottomLeftRadius: 14,
  },

  cardContent: {
    padding: CARD_PADDING,
    paddingLeft: CARD_PADDING + 8,
  },

  cardDate: {
    fontSize: 16,
    fontWeight: '800',
  },

  joinIndicator: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 8,
  },
  joinIndicatorText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: AVATAR,
    height: AVATAR,
    borderRadius: 12,
    marginRight: 14,
    backgroundColor: '#EEE',
  },

  name: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6,
  },
  spec: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 6,
  },
  fee: {
    fontSize: 14,
    fontWeight: '700',
  },

  cardDivider: {
    height: 1,
    marginVertical: 12,
  },

  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },

  btnGhost: {
    flex: 1,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  btnGhostText: {
    fontSize: 16,
    fontWeight: '800',
  },

  btnPrimary: {
    flex: 1,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPrimaryText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
  },

  btnJoin: {
    flex: 1,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnJoinText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
  },

  empty: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    marginBottom: 16,
  },
  bookNowButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  bookNowText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    borderRadius: 16,
    padding: 24,
    maxHeight: '80%',
  },
  calendarModalContent: {
    width: '100%',
    borderRadius: 16,
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  appointmentInfo: {
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  currentAppointment: {
    fontSize: 14,
  },
  selectionButton: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  selectionButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  selectionHint: {
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 6,
  },
  cancelButton: {
    borderWidth: 1,
  },
  confirmButton: {
    marginLeft: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },

  // Calendar Styles
  calendarCard: {
    borderRadius: 12,
    padding: 16,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 8,
    marginBottom: 16,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  calendarNav: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navBtn: {
    padding: 6,
  },
  navText: {
    fontSize: 18,
    fontWeight: '700',
  },
  weekDaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 6,
    paddingBottom: 4,
  },
  weekDayLabel: {
    fontSize: 14,
    fontWeight: '700',
    opacity: 0.85,
  },
  daysWrap: {
    marginTop: 4,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: {
    fontSize: 14,
    fontWeight: '700',
  },

  // Time Slots Styles
  timeSlotsContainer: {
    paddingVertical: 8,
  },
  timeSlotsGrid: {
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  timeSlot: {
    flex: 1,
    margin: 4,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  timeSlotText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default Booking;