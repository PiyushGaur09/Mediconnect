import React, {useMemo, useState, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  useColorScheme,
  StatusBar,
  Platform,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../constants/Colors';

const {width, height} = Dimensions.get('window');

// Utility to build calendar matrix (same as before)
function buildMonthMatrix(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const firstWeekday = firstDay.getDay(); // 0=Sun .. 6=Sat
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

export default function BookSlot({navigation, route}) {
  const {doctor, screeningId, screening} = route.params || {};
  const colorScheme = useColorScheme();
  const scheme = colorScheme === 'dark' ? 'light' : 'dark';
  const themeColors = Colors[scheme] || {};

  // derive palette with fallbacks consistent with DoctorsDetails
  const t = {
    background:
      themeColors.background ?? (scheme === 'light' ? '#FFFFFF' : '#0A1830'),
    card: themeColors.card ?? (scheme === 'light' ? '#FFFFFF' : '#0F2034'),
    text: themeColors.text ?? (scheme === 'light' ? '#0B1220' : '#FFFFFF'),
    muted: themeColors.muted ?? (scheme === 'light' ? '#7B8794' : '#A8B0C2'),
    primary: themeColors.primary ?? '#00E0FF',
    slotBg: themeColors.slotBg ?? (scheme === 'light' ? '#F2F4F7' : '#112231'),
    slotText:
      themeColors.slotText ?? (scheme === 'light' ? '#334155' : '#CDE0F4'),
    shadow:
      themeColors.shadow ??
      (scheme === 'light' ? 'rgba(11,20,32,0.06)' : 'rgba(0,0,0,0.6)'),
    confirmBg:
      themeColors.primary ?? (scheme === 'light' ? '#0B1220' : '#00E0FF'),
    confirmText:
      themeColors.confirmText ?? (scheme === 'light' ? '#FFFFFF' : '#0B1220'),
    success: themeColors.success ?? '#9ED7C9', // green circle color (fallback)
    available: themeColors.available ?? '#4CAF50', // green for available days
    unavailable: themeColors.unavailable ?? '#F44336', // red for unavailable days
  };

  // calendar state
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState(today.getDate());

  // modal visibility and loading states
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // available slots state
  const [availableSlots, setAvailableSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // user data state
  const [userData, setUserData] = useState(null);

  // sample slots (fallback if API fails)
  const defaultSlots = [
    '09.00 AM',
    '09.30 AM',
    '10.00 AM',
    '10.30 AM',
    '11.00 AM',
    '11.30 AM',
    '03.00 PM',
    '03.30 PM',
    '04.00 PM',
    '04.30 PM',
    '05.00 PM',
    '05.30 PM',
  ];

  const monthName = useMemo(
    () =>
      new Date(currentYear, currentMonth, 1).toLocaleString(undefined, {
        month: 'long',
        year: 'numeric',
      }),
    [currentMonth, currentYear],
  );

  const monthMatrix = useMemo(
    () => buildMonthMatrix(currentYear, currentMonth),
    [currentYear, currentMonth],
  );

  // Fetch user data on component mount
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const userDataString = await AsyncStorage.getItem('user_data');
      if (userDataString) {
        const parsedData = JSON.parse(userDataString);
        setUserData(parsedData);
        console.log('User data:', parsedData);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const goPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(y => y - 1);
    } else setCurrentMonth(m => m - 1);
    setSelectedDay(null);
    setAvailableSlots([]);
    setSelectedSlot(null);
  };

  const goNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(y => y + 1);
    } else setCurrentMonth(m => m + 1);
    setSelectedDay(null);
    setAvailableSlots([]);
    setSelectedSlot(null);
  };

  // Function to check if a day is available (doctor works on that weekday)
  const isDayAvailable = day => {
    if (!day || !doctor?.available_days) return false;

    const date = new Date(currentYear, currentMonth, day);
    const weekday = date.getDay(); // 0=Sunday, 1=Monday, etc.

    // Convert weekday number to abbreviated string representation
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const currentWeekday = weekdays[weekday];

    return doctor.available_days.includes(currentWeekday);
  };

  // Function to convert 12-hour format to 24-hour format
  const convertTo24HourFormat = timeStr => {
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split('.');

    if (hours === '12') {
      hours = '00';
    }

    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }

    return `${String(hours).padStart(2, '0')}:${minutes}`;
  };

  // Function to convert 24-hour format to 12-hour format
  const convertTo12HourFormat = timeStr => {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours, 10);

    if (hour === 0) {
      return `12.${minutes} AM`;
    } else if (hour < 12) {
      return `${hour}.${minutes} AM`;
    } else if (hour === 12) {
      return `12.${minutes} PM`;
    } else {
      return `${hour - 12}.${minutes} PM`;
    }
  };

  // Function to format date for API (YYYY-MM-DD)
  const formatDateForAPI = (year, month, day) => {
    const formattedMonth = String(month + 1).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    return `${year}-${formattedMonth}-${formattedDay}`;
  };

  // Function to fetch available slots for selected date
  const fetchAvailableSlots = async (year, month, day) => {
    if (!doctor?.id) {
      Alert.alert('Error', 'Doctor information is missing');
      return;
    }

    setSlotsLoading(true);
    setSelectedSlot(null);

    try {
      const dateStr = formatDateForAPI(year, month, day);

      const response = await fetch(
        'https://mediconnect-lemon.vercel.app/api/doctors/slots',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            doctor_id: doctor.id,
            date: dateStr,
          }),
        },
      );

      const result = await response.json();

      if (response.ok && result.success) {
        setAvailableSlots(result.data || []);
      } else {
        throw new Error(result.message || 'Failed to fetch available slots');
      }
    } catch (error) {
      console.error('Error fetching slots:', error);
      // If API fails, show all slots as available (fallback)
      setAvailableSlots(
        defaultSlots.map(time => ({
          time: convertTo24HourFormat(time),
          slot_booked: false,
        })),
      );
    } finally {
      setSlotsLoading(false);
    }
  };

  // Function to handle day selection
  const handleDaySelect = day => {
    if (!day || !isDayAvailable(day)) return;

    setSelectedDay(day);
    fetchAvailableSlots(currentYear, currentMonth, day);
  };

  // Function to prepare disease_info object from screening data
  const prepareDiseaseInfo = () => {
    if (!screening?.analysis) {
      // Fallback disease info if no screening data is available
      return {
        summary: 'Patient reported symptoms requiring medical attention.',
        probable_diagnoses: [
          {
            name: 'General Medical Condition',
            confidence: 0.7,
          },
        ],
        recommended_specialties: ['General Practice'],
        recommended_lab_tests: ['Complete Blood Count'],
        recommended_medicines: [
          {
            name: 'Symptomatic Relief',
            dose: 'as needed',
            notes: 'For symptom management',
          },
        ],
        urgency: 'routine',
      };
    }

    // Use the actual screening data structure from route.params
    return {
      summary: screening.analysis.summary || 'Patient reported symptoms requiring medical attention.',
      probable_diagnoses: screening.analysis.probable_diagnoses || [
        {
          name: 'General Medical Condition',
          confidence: 0.7,
        },
      ],
      recommended_specialties: screening.analysis.recommended_specialties || ['General Practice'],
      recommended_lab_tests: screening.analysis.recommended_lab_tests || ['Complete Blood Count'],
      recommended_medicines: screening.analysis.recommended_medicines || [
        {
          name: 'Symptomatic Relief',
          dose: 'as needed',
          notes: 'For symptom management',
        },
      ],
      urgency: screening.analysis.urgency || 'routine',
    };
  };

  // API call to book appointment with new structure
  const bookAppointment = async () => {
    if (!selectedDay) {
      Alert.alert('Error', 'Please select a date');
      return;
    }

    if (!selectedSlot) {
      Alert.alert('Error', 'Please select a time slot');
      return;
    }

    if (!doctor?.id) {
      Alert.alert('Error', 'Doctor information is missing');
      return;
    }

    if (!userData?.id) {
      Alert.alert('Error', 'User not found. Please login again.');
      return;
    }

    setLoading(true);

    try {
      const appointmentData = {
        doctor_id: doctor.id,
        patient_id: userData.id,
        screening_id: screeningId, // Use screeningId from route.params
        appointment_date: formatDateForAPI(currentYear, currentMonth, selectedDay),
        appointment_time: selectedSlot, // already in 24-hour format from API
        disease_info: prepareDiseaseInfo(), // Use the prepared disease info from screening data
      };

      console.log('Booking appointment with data:', JSON.stringify(appointmentData, null, 2));

      const response = await fetch(
        'https://mediconnect-lemon.vercel.app/api/appointment/book',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(appointmentData),
        },
      );

      const result = await response.json();
      console.log('Booking response:', result);

      if (response.ok) {
        setBookingSuccess(true);
        setConfirmed(true);

        // Clear screening data from AsyncStorage after successful booking
        try {
          await AsyncStorage.removeItem('screening_data');
        } catch (error) {
          console.error('Error clearing screening data:', error);
        }
      } else {
        throw new Error(result.message || 'Failed to book appointment');
      }
    } catch (error) {
      console.error('Booking error:', error);
      Alert.alert(
        'Booking Failed',
        error.message || 'Something went wrong. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  const onConfirm = () => {
    bookAppointment();
  };

  const onDone = () => {
    setConfirmed(false);
    setBookingSuccess(false);
    // navigate or close as required; example:
    navigation?.navigate?.('BottomNavigation');
  };

  const onEdit = () => {
    setConfirmed(false);
    setBookingSuccess(false);
    // allow user to edit - simply close modal; focus remains on BookSlot
  };

  const calendarCardWidth = width - 48;
  const dayCellSize = (calendarCardWidth - 32) / 7;

  // formatted date for modal text
  const formattedDate = `${
    monthName.split(' ')[0]
  } ${selectedDay}, ${currentYear}`; // "June 30, 2023"

  return (
    <SafeAreaView style={[styles.safe, {backgroundColor: t.background}]}>
      <StatusBar
        barStyle={scheme === 'light' ? 'dark-content' : 'light-content'}
        backgroundColor={t.background}
      />

      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => navigation?.goBack?.()}
          style={styles.backTouchable}>
          <Text style={[styles.backText, {color: t.text}]}>‹</Text>
        </TouchableOpacity>

        <Text style={[styles.title, {color: t.text}]}>Book Appointment</Text>

        <View style={{width: 36}} />
      </View>

      <ScrollView contentContainerStyle={{paddingBottom: 140}}>
        <View style={styles.screenPadding}>
          <Text style={[styles.sectionTitle, {color: t.text}]}>
            Select Date
          </Text>

          <View
            style={[
              styles.calendarCard,
              {
                backgroundColor: t.card,
                shadowColor: t.shadow,
                width: calendarCardWidth,
              },
            ]}>
            <View style={styles.calendarHeader}>
              <Text style={[styles.calendarTitle, {color: t.text}]}>
                {monthName}
              </Text>
              <View style={styles.calendarNav}>
                <TouchableOpacity onPress={goPrevMonth} style={styles.navBtn}>
                  <Text style={[styles.navText, {color: t.muted}]}>‹</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={goNextMonth}
                  style={[styles.navBtn, {marginLeft: 10}]}>
                  <Text style={[styles.navText, {color: t.muted}]}>›</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.weekDaysRow}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <Text
                  key={d}
                  style={[
                    styles.weekDayLabel,
                    {color: t.muted, width: dayCellSize, textAlign: 'center'},
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
                    const isToday =
                      day === today.getDate() &&
                      currentMonth === today.getMonth() &&
                      currentYear === today.getFullYear();
                    const isAvailable = isDayAvailable(day);

                    return (
                      <TouchableOpacity
                        key={`d-${wi}-${di}`}
                        activeOpacity={day && isAvailable ? 0.8 : 1}
                        onPress={() =>
                          day && isAvailable && handleDaySelect(day)
                        }
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
                                    backgroundColor: t.primary,
                                    width: 40,
                                    height: 40,
                                    borderRadius: 10,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  }
                                : {},
                              !isAvailable && {
                                opacity: 0.4,
                              },
                            ]}>
                            <Text
                              style={[
                                styles.dayText,
                                {
                                  color: isSelected
                                    ? scheme === 'light'
                                      ? '#fff'
                                      : '#0B1220'
                                    : isToday
                                    ? t.primary
                                    : isAvailable
                                    ? t.available // Green for available days
                                    : t.unavailable, // Red for unavailable days
                                },
                              ]}>
                              {day}
                            </Text>
                          </View>
                        ) : (
                          <View style={{height: 40}} />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ))}
            </View>
          </View>

          <Text style={[styles.sectionTitle, {color: t.text, marginTop: 28}]}>
            Select Hour
          </Text>

          {slotsLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={t.primary} />
              <Text style={[styles.loadingText, {color: t.muted}]}>
                Loading available slots...
              </Text>
            </View>
          ) : (
            <View style={styles.slotsWrap}>
              {availableSlots.length > 0 ? (
                availableSlots.map((slot, index) => {
                  const isSelected = slot.time === selectedSlot;
                  const isBooked = slot.slot_booked;

                  return (
                    <TouchableOpacity
                      key={index}
                      activeOpacity={isBooked ? 1 : 0.9}
                      onPress={() => !isBooked && setSelectedSlot(slot.time)}
                      style={[
                        styles.slotItem,
                        {
                          backgroundColor: isSelected
                            ? t.primary
                            : isBooked
                            ? t.unavailable
                            : t.slotBg,
                          opacity: isBooked ? 0.6 : 1,
                        },
                      ]}
                      disabled={isBooked}>
                      <Text
                        style={[
                          styles.slotText,
                          {
                            color: isSelected
                              ? scheme === 'light'
                                ? '#fff'
                                : '#0B1220'
                              : isBooked
                              ? '#fff'
                              : t.slotText,
                          },
                        ]}>
                        {convertTo12HourFormat(slot.time)}
                        {isBooked && ' (Booked)'}
                      </Text>
                    </TouchableOpacity>
                  );
                })
              ) : (
                <Text style={[styles.noSlotsText, {color: t.muted}]}>
                  {selectedDay
                    ? 'No available slots for selected date'
                    : 'Select a date to see available slots'}
                </Text>
              )}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Confirm */}
      <View style={styles.bottomWrap}>
        <TouchableOpacity
          activeOpacity={0.95}
          onPress={onConfirm}
          disabled={loading || !selectedSlot}
          style={[
            styles.confirmBtn,
            {
              backgroundColor:
                scheme === 'light'
                  ? t.confirmBg ?? t.primary
                  : t.confirmBg ?? '#0B1220',
              opacity: loading || !selectedSlot ? 0.7 : 1,
            },
          ]}>
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text
              style={[
                styles.confirmText,
                {
                  color:
                    scheme === 'light'
                      ? t.confirmText ?? '#fff'
                      : t.confirmText ?? '#fff',
                },
              ]}>
              Confirm
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Confirmation Modal */}
      <Modal
        visible={confirmed}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setConfirmed(false);
          setBookingSuccess(false);
        }}>
        <View style={modalStyles.backdrop}>
          <View style={[modalStyles.modalCard, {backgroundColor: t.card}]}>
            {bookingSuccess ? (
              <>
                {/* Success circle */}
                <View
                  style={[
                    modalStyles.successCircle,
                    {backgroundColor: t.success || '#C8EDE1'},
                  ]}>
                  <Text style={modalStyles.checkMark}>✓</Text>
                </View>

                <Text style={[modalStyles.modalTitle, {color: t.text}]}>
                  Congratulations!
                </Text>

                <Text style={[modalStyles.modalBody, {color: t.muted}]}>
                  Your appointment with {doctor?.name || 'Dr. David Patel'} is
                  confirmed for {formattedDate}, at{' '}
                  {convertTo12HourFormat(selectedSlot)}.
                </Text>

                <TouchableOpacity
                  style={[
                    modalStyles.doneBtn,
                    {
                      backgroundColor:
                        scheme === 'light' ? '#0F1724' : '#0F1724',
                    },
                  ]}
                  activeOpacity={0.9}
                  onPress={onDone}>
                  <Text style={modalStyles.doneText}>Done</Text>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={0.8} onPress={onEdit}>
                  <Text style={[modalStyles.editText, {color: t.muted}]}>
                    Edit your appointment
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                {/* Error state */}
                <View
                  style={[
                    modalStyles.successCircle,
                    {backgroundColor: '#FF6B6B'},
                  ]}>
                  <Text style={modalStyles.checkMark}>✕</Text>
                </View>

                <Text style={[modalStyles.modalTitle, {color: t.text}]}>
                  Booking Failed
                </Text>

                <Text style={[modalStyles.modalBody, {color: t.muted}]}>
                  Sorry, we couldn't book your appointment. Please try again.
                </Text>

                <TouchableOpacity
                  style={[
                    modalStyles.doneBtn,
                    {
                      backgroundColor:
                        scheme === 'light' ? '#0F1724' : '#0F1724',
                    },
                  ]}
                  activeOpacity={0.9}
                  onPress={onEdit}>
                  <Text style={modalStyles.doneText}>Try Again</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const PADDING = 24;

const styles = StyleSheet.create({
  safe: {flex: 1},
  headerRow: {
    height: 80,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backTouchable: {width: 36, height: 36, justifyContent: 'center'},
  backText: {fontSize: 28, fontWeight: '600'},
  title: {fontSize: 22, fontWeight: '800'},

  screenPadding: {paddingHorizontal: 24, paddingTop: 6},

  sectionTitle: {fontSize: 22, fontWeight: '800', marginBottom: 12},

  calendarCard: {
    alignSelf: 'center',
    borderRadius: 12,
    padding: 16,
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 8,
    marginTop: 8,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  calendarTitle: {fontSize: 18, fontWeight: '800'},
  calendarNav: {flexDirection: 'row', alignItems: 'center'},
  navBtn: {padding: 6},
  navText: {fontSize: 18, fontWeight: '700'},

  weekDaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 6,
    paddingBottom: 4,
  },
  weekDayLabel: {fontSize: 14, fontWeight: '700', opacity: 0.85},

  daysWrap: {marginTop: 4},
  weekRow: {flexDirection: 'row', justifyContent: 'space-between'},

  dayWrapper: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: {fontSize: 14, fontWeight: '700'},

  slotsWrap: {
    marginTop: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  slotItem: {
    width: (width - 72) / 4,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  slotText: {fontSize: 16, fontWeight: '700'},

  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  noSlotsText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
    width: '100%',
  },

  bottomWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: Platform.OS === 'ios' ? 20 : 60,
    alignItems: 'center',
  },
  confirmBtn: {
    width: width - 40,
    height: 50,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: {width: 0, height: 12},
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
  confirmText: {fontSize: 18, fontWeight: '700'},
});

// Modal styles
const modalStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(8, 12, 20, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  modalCard: {
    width: Math.min(380, width - 56),
    borderRadius: 22,
    paddingVertical: 28,
    paddingHorizontal: PADDING,
    alignItems: 'center',
    // shadow
    shadowOffset: {width: 0, height: 12},
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 12,
  },
  successCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -72,
    marginBottom: 12,
    // subtle border to match example
  },
  checkMark: {
    fontSize: 34,
    color: '#fff',
    fontWeight: '900',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: 6,
    marginBottom: 8,
  },
  modalBody: {
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  doneBtn: {
    width: '80%',
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  doneText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
  editText: {
    fontSize: 14,
    textDecorationLine: 'underline',
    marginTop: 4,
  },
});