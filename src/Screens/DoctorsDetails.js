import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Image,
  TouchableOpacity,
  Dimensions,
  useColorScheme,
  Platform,
} from 'react-native';
import Colors from '../constants/Colors';

const {width} = Dimensions.get('window');

const DoctorsDetails = ({navigation, route}) => {
  const {doctor, screeningId, screening} = route.params || {};
  const colorScheme = useColorScheme();
  const scheme = colorScheme === 'dark' ? 'light' : 'dark';
  const palette = Colors[scheme] ||
    Colors.dark || {
      background: scheme === 'light' ? '#FFFFFF' : '#0A1830',
      text: scheme === 'light' ? '#0B1220' : '#FFFFFF',
      primary: '#00E0FF',
      secondary: '#FF4F4F',
      card: scheme === 'light' ? '#FFFFFF' : '#0F2034',
      muted: scheme === 'light' ? '#7B8794' : '#A8B0C2',
    };

  // Replace these URLs with your actual image URLs
  const backIconUrl =
    scheme === 'light'
      ? 'https://img.icons8.com/ios-filled/50/000000/left.png'
      : 'https://img.icons8.com/ios-filled/50/ffffff/left.png';

  const heartIconUrl =
    scheme === 'light'
      ? 'https://img.icons8.com/ios/50/000000/like--v1.png'
      : 'https://img.icons8.com/ios/50/ffffff/like--v1.png';

  const statPatientsUrl =
    'https://img.icons8.com/ios-filled/100/000000/user-group-man-man.png';
  const statExperienceUrl =
    'https://img.icons8.com/ios-filled/100/000000/medal.png';
  const statRatingUrl =
    'https://img.icons8.com/ios-filled/100/000000/star--v1.png';
  const statReviewsUrl =
    'https://img.icons8.com/ios-filled/100/000000/comments.png';

  // Use the actual doctor data from API response
  const doctorData = doctor || {
    id: '1',
    full_name: 'Dr. Neelam Rao',
    specialization:
      'Primary Care, Geriatrics, Endocrinology, Nutrition, Wellness Medicine',
    clinic_name: 'GoldenYears Clinic',
    clinic_address: 'Baner, Pune',
    profile_picture: 'https://randomuser.me/api/portraits/men/21.jpg',
    experience_years: 14,
    rating: 4.9,
    total_reviews: 195,
    consultation_fee: 780,
    qualification: 'MBBS, MD (Medicine)',
    available_days: ['Mon', 'Wed', 'Fri', 'Sat'],
    available_time: {
      start: '09:00',
      end: '17:30',
    },
    about:
      'Dr. Neelam Rao is a dedicated primary care physician with extensive experience in geriatrics and endocrinology. She provides comprehensive healthcare services with a focus on preventive medicine and patient education.',
  };

  // Format available days
  const formatAvailableDays = days => {
    if (!days || !Array.isArray(days)) return 'Not specified';
    return days.join(', ');
  };

  // Format available time
  const formatAvailableTime = time => {
    if (!time || !time.start || !time.end) return 'Not specified';
    return `${time.start} - ${time.end}`;
  };

  // Format consultation fee
  const formatConsultationFee = fee => {
    if (!fee) return 'Free';
    return `₹${fee}`;
  };

  // Format experience
  const formatExperience = years => {
    if (!years) return '0 years';
    return `${years}+ years`;
  };

  // Format rating
  const formatRating = rating => {
    if (!rating) return '0.0';
    return rating.toFixed(1);
  };

  return (
    <SafeAreaView style={[styles.safe, {backgroundColor: palette.background}]}>
      <StatusBar
        barStyle={scheme === 'light' ? 'dark-content' : 'light-content'}
        backgroundColor={palette.background}
      />

      {/* Header */}
      <View style={[styles.header, {backgroundColor: palette.background}]}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => (navigation?.goBack ? navigation.goBack() : null)}
          style={styles.headerLeft}>
          <Image
            source={{uri: backIconUrl}}
            style={[styles.headerIcon, {tintColor: palette.text}]}
          />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, {color: palette.text}]}>
          Doctor Details
        </Text>

        <TouchableOpacity activeOpacity={0.7} style={styles.headerRight}>
          <Image
            source={{uri: heartIconUrl}}
            style={[styles.headerIcon, {tintColor: palette.text}]}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 140}}>
        {/* Doctor Card */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: palette.card,
              shadowColor: palette.card === '#FFFFFF' ? '#000' : '#000',
            },
          ]}>
          <Image
            source={{
              uri:
                doctorData.users?.profile_picture ||
                doctorData.profile_picture ||
                'https://randomuser.me/api/portraits/men/21.jpg',
            }}
            style={styles.cardImage}
          />

          <View style={styles.cardBody}>
            <Text style={[styles.doctorName, {color: palette.text}]}>
              {doctorData.full_name}
            </Text>

            <View
              style={[
                styles.divider,
                {backgroundColor: scheme === 'light' ? '#E6E9EE' : '#243142'},
              ]}
            />

            <Text
              style={[
                styles.specialty,
                {color: palette.muted || palette.text},
              ]}>
              {doctorData.specialization}
            </Text>

            <View style={styles.locationRow}>
              <Text
                style={[
                  styles.locationText,
                  {color: palette.muted || palette.text},
                ]}>
                ◎ {doctorData.clinic_name} - {doctorData.clinic_address}
              </Text>
            </View>

            <View style={styles.feeContainer}>
              <Text
                style={[styles.feeText, {color: palette.primary || '#00E0FF'}]}>
                {formatConsultationFee(doctorData.consultation_fee)}
              </Text>
              <Text
                style={[
                  styles.feeLabel,
                  {color: palette.muted || palette.text},
                ]}>
                Consultation Fee
              </Text>
            </View>
          </View>
        </View>

        {/* Stats row */}
        <View style={styles.statsWrap}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <View
                style={[
                  styles.statCircle,
                  {backgroundColor: scheme === 'light' ? '#F2F4F7' : '#0F2034'},
                ]}>
                <Image
                  source={{uri: statPatientsUrl}}
                  style={[styles.statIcon, {tintColor: '#00E0FF'}]}
                />
              </View>
              <Text style={[styles.statNumber, {color: palette.text}]}>
                {doctorData.total_reviews || '0'}
              </Text>
              <Text
                style={[
                  styles.statLabel,
                  {color: palette.muted || palette.text},
                ]}>
                reviews
              </Text>
            </View>

            <View style={styles.statItem}>
              <View
                style={[
                  styles.statCircle,
                  {backgroundColor: scheme === 'light' ? '#F2F4F7' : '#0F2034'},
                ]}>
                <Image
                  source={{uri: statExperienceUrl}}
                  style={[styles.statIcon, {tintColor: '#00E0FF'}]}
                />
              </View>
              <Text style={[styles.statNumber, {color: palette.text}]}>
                {doctorData.experience_years || '0'}
              </Text>
              <Text
                style={[
                  styles.statLabel,
                  {color: palette.muted || palette.text},
                ]}>
                years
              </Text>
            </View>

            <View style={styles.statItem}>
              <View
                style={[
                  styles.statCircle,
                  {backgroundColor: scheme === 'light' ? '#F2F4F7' : '#0F2034'},
                ]}>
                <Image
                  source={{uri: statRatingUrl}}
                  style={[styles.statIcon, {tintColor: '#00E0FF'}]}
                />
              </View>
              <Text style={[styles.statNumber, {color: palette.text}]}>
                {formatRating(doctorData.rating)}
              </Text>
              <Text
                style={[
                  styles.statLabel,
                  {color: palette.muted || palette.text},
                ]}>
                rating
              </Text>
            </View>

            <View style={styles.statItem}>
              <View
                style={[
                  styles.statCircle,
                  {backgroundColor: scheme === 'light' ? '#F2F4F7' : '#0F2034'},
                ]}>
                <Image
                  source={{uri: statReviewsUrl}}
                  style={[styles.statIcon, {tintColor: '#00E0FF'}]}
                />
              </View>
              <Text style={[styles.statNumber, {color: palette.text}]}>
                {doctorData.total_reviews || '0'}
              </Text>
              <Text
                style={[
                  styles.statLabel,
                  {color: palette.muted || palette.text},
                ]}>
                feedback
              </Text>
            </View>
          </View>
        </View>

        {/* Qualification */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, {color: palette.text}]}>
            Qualification
          </Text>
          <Text
            style={[
              styles.sectionBody,
              {color: palette.muted || palette.text},
            ]}>
            {doctorData.qualification ||
              'Qualification information not available'}
          </Text>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, {color: palette.text}]}>
            About me
          </Text>
          <Text
            style={[
              styles.sectionBody,
              {color: palette.muted || palette.text},
            ]}>
            {doctorData.about ||
              `${doctorData.full_name} is a dedicated healthcare professional committed to providing quality medical care.`}
          </Text>
        </View>

        {/* Availability */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, {color: palette.text}]}>
            Availability
          </Text>
          <View style={styles.availabilityRow}>
            <View style={styles.availabilityItem}>
              <Text
                style={[
                  styles.availabilityLabel,
                  {color: palette.muted || palette.text},
                ]}>
                Days
              </Text>
              <Text style={[styles.availabilityValue, {color: palette.text}]}>
                {formatAvailableDays(doctorData.available_days)}
              </Text>
            </View>
            <View style={styles.availabilityItem}>
              <Text
                style={[
                  styles.availabilityLabel,
                  {color: palette.muted || palette.text},
                ]}>
                Time
              </Text>
              <Text style={[styles.availabilityValue, {color: palette.text}]}>
                {formatAvailableTime(doctorData.available_time)}
              </Text>
            </View>
          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, {color: palette.text}]}>
            Contact
          </Text>
          <View style={styles.contactItem}>
            <Text
              style={[
                styles.contactLabel,
                {color: palette.muted || palette.text},
              ]}>
              Email
            </Text>
            <Text style={[styles.contactValue, {color: palette.text}]}>
              {doctorData.email || 'Not provided'}
            </Text>
          </View>
          <View style={styles.contactItem}>
            <Text
              style={[
                styles.contactLabel,
                {color: palette.muted || palette.text},
              ]}>
              Clinic
            </Text>
            <Text style={[styles.contactValue, {color: palette.text}]}>
              {doctorData.clinic_name || 'Not specified'}
            </Text>
          </View>
          <View style={styles.contactItem}>
            <Text
              style={[
                styles.contactLabel,
                {color: palette.muted || palette.text},
              ]}>
              Address
            </Text>
            <Text style={[styles.contactValue, {color: palette.text}]}>
              {doctorData.clinic_address || 'Address not available'}
            </Text>
          </View>
        </View>

        {/* Reviews header */}
        <View style={[styles.section, styles.reviewsHeader]}>
          <Text style={[styles.sectionTitle, {color: palette.text}]}>
            Patient Reviews
          </Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text
              style={[styles.seeAll, {color: palette.muted || palette.text}]}>
              See All ({doctorData.total_reviews || 0})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Sample review - You can make this dynamic if you have actual review data */}
        {doctorData.total_reviews > 0 && (
          <View style={styles.reviewCard}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&s=4c4e0b6b6d8f9f1a6b4f2e2a6d5b8a9d',
              }}
              style={styles.reviewerAvatar}
            />
            <View style={styles.reviewBody}>
              <View style={styles.reviewTop}>
                <Text style={[styles.reviewerName, {color: palette.text}]}>
                  Satisfied Patient
                </Text>
                <View style={styles.ratingRow}>
                  <Text
                    style={[
                      styles.ratingValue,
                      {color: palette.muted || palette.text},
                    ]}>
                    {formatRating(doctorData.rating)}
                  </Text>
                  <Text style={styles.star}>⭐️⭐️⭐️⭐️⭐️</Text>
                </View>
              </View>

              <Text
                style={[
                  styles.reviewText,
                  {color: palette.muted || palette.text},
                ]}>
                Dr. {doctorData.full_name?.replace('Dr. ', '') || 'the doctor'}{' '}
                is highly professional and caring. The consultation was thorough
                and the advice provided was very helpful.
              </Text>
            </View>
          </View>
        )}

        {!doctorData.total_reviews || doctorData.total_reviews === 0 ? (
          <View style={styles.noReviews}>
            <Text
              style={[
                styles.noReviewsText,
                {color: palette.muted || palette.text},
              ]}>
              No reviews yet
            </Text>
          </View>
        ) : null}
      </ScrollView>

      {/* Bottom Book button */}
      <View style={[styles.bottomWrap, {backgroundColor: 'transparent'}]}>
        <TouchableOpacity
          activeOpacity={0.9}
          style={[
            styles.bookButton,
            {backgroundColor: scheme === 'light' ? '#00E0FF' : '#00E0FF'},
          ]}
          onPress={() => {
            navigation.navigate('BookSlot', {
              doctor: doctorData,
              screening: screening,
              screeningId: screeningId,
            });
          }}>
          <Text style={styles.bookButtonText}>
            Book Appointment -{' '}
            {formatConsultationFee(doctorData.consultation_fee)}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const CARD_PADDING = 16;
const IMAGE_SIZE = 96;
const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  header: {
    height: 80,
    paddingHorizontal: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerLeft: {
    width: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  headerRight: {
    width: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  headerIcon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
  },

  // Top card
  card: {
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 14,
    padding: CARD_PADDING,
    flexDirection: 'row',
    alignItems: 'center',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 6,
  },
  cardImage: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: 12,
    marginRight: 18,
    resizeMode: 'cover',
    backgroundColor: '#fff',
  },
  cardBody: {
    flex: 1,
  },
  doctorName: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#E6E9EE',
    marginVertical: 2,
    width: '100%',
  },
  specialty: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
  },
  locationRow: {
    marginTop: 8,
  },
  locationText: {
    fontSize: 15,
    fontWeight: '500',
  },
  feeContainer: {
    marginTop: 12,
    alignItems: 'flex-start',
  },
  feeText: {
    fontSize: 18,
    fontWeight: '800',
  },
  feeLabel: {
    fontSize: 12,
    marginTop: 2,
  },

  // stats
  statsWrap: {
    marginTop: 18,
    paddingHorizontal: 18,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    width: (width - 64) / 4,
    alignItems: 'center',
  },
  statCircle: {
    width: 64,
    height: 64,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statIcon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
  statNumber: {
    fontSize: 16,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 13,
    marginTop: 4,
  },

  // sections
  section: {
    marginTop: 18,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8,
  },
  sectionBody: {
    fontSize: 15,
    lineHeight: 22,
  },

  // availability
  availabilityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  availabilityItem: {
    flex: 1,
  },
  availabilityLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  availabilityValue: {
    fontSize: 16,
    fontWeight: '600',
  },

  // contact
  contactItem: {
    marginBottom: 12,
  },
  contactLabel: {
    fontSize: 14,
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 16,
    fontWeight: '500',
  },

  // reviews
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
  },
  reviewCard: {
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  reviewerAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 12,
    resizeMode: 'cover',
  },
  reviewBody: {
    flex: 1,
  },
  reviewTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: '800',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingValue: {
    fontSize: 14,
    marginRight: 6,
  },
  star: {
    fontSize: 12,
    marginLeft: 4,
  },
  reviewText: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
  },
  noReviews: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: 'center',
  },
  noReviewsText: {
    fontSize: 16,
    fontStyle: 'italic',
  },

  // bottom
  bottomWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: Platform.OS === 'ios' ? 20 : 60,
    alignItems: 'center',
  },
  bookButton: {
    width: width - 40,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 6,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
});

export default DoctorsDetails;
