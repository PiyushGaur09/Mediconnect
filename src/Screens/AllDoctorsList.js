import React, {useMemo, useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  StatusBar,
  SafeAreaView,
  Image,
  useColorScheme,
  FlatList,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';

const {width} = Dimensions.get('window');

const categories = [
  'All',
  'General',
  'Cardiologist',
  'Dentist',
  'Pediatrics',
  'Orthopedic',
  'Neurologist',
  'Ophthalmologist',
  'Psychiatrist',
  'ENT Specialist',
  'Gynecologist',
  'Dermatologist',
];

const AllDoctorsList = ({navigation, route}) => {
  // Get data from route.params
  console.log('route', route?.params);
  const screeningData = route.params?.screeningData || {};
  const recommendedSpecialties = screeningData.recommended_specialties || [];
  const doctorsFromParams = screeningData.doctors || [];
  const totalDoctors = screeningData.total_doctors || 0;
  const screening = screeningData.screening;
  const screeningId = route.params?.screeningId || {};

  // console.log('screening', screeningId);

  console.log('Received screening data:', screeningData);
  console.log('Recommended specialties:', recommendedSpecialties);
  console.log('Doctors count:', doctorsFromParams.length);

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'light';

  // UI state
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState('default'); // 'default' | 'rating'
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Use doctors from route.params directly
  const doctors = doctorsFromParams;

  // Map API data to component format
  const mappedDoctors = useMemo(() => {
    return doctors.map(doctor => ({
      id: doctor.id,
      name: doctor.full_name,
      specialization: doctor.specialization,
      location: doctor.clinic_address,
      rating: doctor.rating || 0,
      reviews: doctor.total_reviews || 0,
      experience: doctor.experience_years,
      consultation_fee: doctor.consultation_fee,
      profile_picture: doctor.users?.profile_picture,
      available_days: doctor.available_days,
      available_time: doctor.available_time,
      clinic_name: doctor.clinic_name,
      license_number: doctor.license_number,
      email: doctor.email,
      latitude: doctor.latitude,
      longitude: doctor.longitude,
      onboarding_status: doctor.onboarding_status,
    }));
  }, [doctors]);

  // Derived filtered/sorted data
  const filteredDoctors = useMemo(() => {
    const q = query.trim().toLowerCase();

    let list = mappedDoctors.filter(d => {
      const matchesCategory =
        selectedCategory === 'All' ||
        d.specialization
          .toLowerCase()
          .includes(selectedCategory.toLowerCase()) ||
        d.specialization.toLowerCase() === selectedCategory.toLowerCase();

      const matchesQuery =
        q === '' ||
        d.name.toLowerCase().includes(q) ||
        d.specialization.toLowerCase().includes(q) ||
        d.location.toLowerCase().includes(q) ||
        d.clinic_name?.toLowerCase().includes(q);

      return matchesCategory && matchesQuery;
    });

    if (sortOrder === 'rating') {
      list = list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [mappedDoctors, selectedCategory, query, sortOrder]);

  const toggleSort = () =>
    setSortOrder(s => (s === 'default' ? 'rating' : 'default'));

  const theme = useMemo(
    () => ({
      background: isDark ? '#0F1724' : '#F8FAFC',
      panel: isDark ? '#102033' : '#FFFFFF',
      text: isDark ? '#E6EEF8' : '#0B1220',
      muted: isDark ? '#9AA7BA' : '#6B7280',
      accent: '#00E0FF',
      success: '#10b981',
      warning: '#f59e0b',
      danger: '#ef4444',
      cardShadow: isDark ? 'rgba(0,0,0,0.6)' : 'rgba(11,20,32,0.06)',
    }),
    [isDark],
  );

  const getStatusBadge = status => {
    switch (status) {
      case 'approved':
        return {color: theme.success, text: 'Verified'};
      default:
        return {color: theme.warning, text: 'Pending'};
    }
  };

  const formatTime = timeObj => {
    if (!timeObj) return 'N/A';
    return `${timeObj.start} - ${timeObj.end}`;
  };

  const formatDays = daysArray => {
    if (!daysArray || daysArray.length === 0) return 'N/A';
    return daysArray.join(', ');
  };

  // Show recommended specialties in header if available
  const getHeaderSubtitle = () => {
    if (recommendedSpecialties.length > 0) {
      return `Recommended: ${recommendedSpecialties.join(', ')}`;
    }
    return 'Find the right specialist';
  };

  const renderDoctor = ({item}) => {
    const statusBadge = getStatusBadge(item.onboarding_status);

    return (
      <TouchableOpacity
        activeOpacity={0.86}
        style={[
          styles.card,
          {backgroundColor: theme.panel, shadowColor: theme.cardShadow},
        ]}
        onPress={() => {
          navigation.navigate('DoctorsDetails', {
            doctor: item,
            screening: screening,
            screeningId: screeningId,
          });
        }}>
        {/* Avatar */}
        <View style={styles.avatarWrap}>
          <Image
            source={{
              uri:
                item.profile_picture ||
                'https://randomuser.me/api/portraits/men/21.jpg',
            }}
            style={styles.avatar}
            defaultSource={require('../Images/dr-david.png')}
          />
          {/* Status Badge */}
          <View
            style={[styles.statusBadge, {backgroundColor: statusBadge.color}]}>
            <Text style={styles.statusText}>{statusBadge.text}</Text>
          </View>
        </View>

        {/* Info */}
        <View style={styles.info}>
          <View style={styles.row}>
            <Text style={[styles.name, {color: theme.text}]} numberOfLines={1}>
              {item.name}
            </Text>

            {/* Rating Badge */}
            <View style={[styles.ratingBadge, {backgroundColor: theme.accent}]}>
              <Text style={styles.ratingTextBold}>
                {item.rating.toFixed(1)}
              </Text>
            </View>
          </View>

          <Text style={[styles.spec, {color: theme.accent}]} numberOfLines={1}>
            {item.specialization}
          </Text>

          {/* Experience and Fee */}
          <View style={styles.metaRow}>
            <Text style={[styles.metaText, {color: theme.muted}]}>
              ⏳ {item.experience} years exp
            </Text>
            <Text style={[styles.feeText, {color: theme.success}]}>
              ₹{item.consultation_fee}
            </Text>
          </View>

          <Text
            style={[styles.location, {color: theme.muted}]}
            numberOfLines={1}>
            ◎ {item.location}
          </Text>

          {/* Availability */}
          <View style={styles.availabilityRow}>
            <Text style={[styles.availabilityText, {color: theme.muted}]}>
              📅 {formatDays(item.available_days)}
            </Text>
            <Text style={[styles.availabilityText, {color: theme.muted}]}>
              ⏰ {formatTime(item.available_time)}
            </Text>
          </View>

          <View style={styles.footerRow}>
            <View style={styles.reviewsWrap}>
              <Text style={[styles.reviewsText, {color: theme.muted}]}>
                {item.reviews.toLocaleString()} Reviews
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.bookBtn, {backgroundColor: theme.accent}]}
              onPress={() => {
                navigation.navigate('DoctorsDetails', {doctor: item});
              }}>
              <Text style={styles.bookBtnText}>Book</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (doctors.length === 0 && !isLoading) {
    return (
      <SafeAreaView style={[styles.safe, {backgroundColor: theme.background}]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, {color: theme.text}]}>
            No doctors found for your screening results.
          </Text>
          <TouchableOpacity
            style={[styles.retryButton, {backgroundColor: theme.accent}]}
            onPress={() => navigation.goBack()}>
            <Text style={styles.retryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, {backgroundColor: theme.background}]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View style={[styles.header, {backgroundColor: theme.background}]}>
        <View>
          <Text style={[styles.title, {color: theme.text}]}>
            Recommended Doctors
          </Text>
          <Text style={[styles.subtitle, {color: theme.muted}]}>
            {getHeaderSubtitle()}
          </Text>
        </View>

        <Text style={[styles.time, {color: theme.muted}]}>
          {new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>

      {/* Search & Sort */}
      <View style={[styles.searchSection, {backgroundColor: theme.background}]}>
        <View
          style={[
            styles.searchBox,
            {
              backgroundColor: isDark ? '#0b1b2b' : '#fff',
              borderColor: isDark ? '#123' : '#eee',
            },
          ]}>
          <TextInput
            placeholder="Search doctor, specialization or location"
            placeholderTextColor={isDark ? '#7b8a98' : '#9AA2AB'}
            style={[styles.searchInput, {color: theme.text}]}
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
          />
        </View>

        {/* <TouchableOpacity
          style={[
            styles.sortBtn,
            {borderColor: isDark ? '#1E2A38' : '#E6E9EE'},
          ]}
          onPress={toggleSort}>
          <Text style={[styles.sortBtnText, {color: theme.text}]}>
            {sortOrder === 'default' ? 'Sort: Default' : 'Sort: Top Rated'}
          </Text>
        </TouchableOpacity> */}
      </View>

      {/* Categories */}
      {/* <View
        style={[styles.categoriesWrap, {backgroundColor: theme.background}]}>
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={c => c}
          contentContainerStyle={{paddingHorizontal: 16}}
          renderItem={({item}) => {
            const active = selectedCategory === item;
            return (
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => setSelectedCategory(item)}
                style={[
                  styles.categoryChip,
                  {
                    backgroundColor: active
                      ? theme.accent
                      : isDark
                      ? '#0b1b2b'
                      : '#fff',
                    borderColor: active
                      ? theme.accent
                      : isDark
                      ? '#1E2A38'
                      : '#E6E9EE',
                  },
                ]}>
                <Text
                  style={[
                    styles.categoryText,
                    {color: active ? '#fff' : theme.muted},
                  ]}>
                  {item}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View> */}

      {/* Results header */}
      <View style={[styles.resultsHeader, {backgroundColor: theme.background}]}>
        <Text style={[styles.resultsText, {color: theme.muted}]}>
          {filteredDoctors.length} doctors found
        </Text>
        {/* <Text style={[styles.resultsText, {color: theme.muted}]}>
          {selectedCategory === 'All'
            ? 'All Specializations'
            : selectedCategory}
        </Text> */}
      </View>

      {/* Doctors list */}
      <FlatList
        data={filteredDoctors}
        keyExtractor={d => d.id}
        renderItem={renderDoctor}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{padding: 16, paddingBottom: 28}}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, {color: theme.muted}]}>
              No doctors found matching your criteria.
            </Text>
            <TouchableOpacity
              style={[styles.resetButton, {borderColor: theme.accent}]}
              onPress={() => {
                setSelectedCategory('All');
                setQuery('');
              }}>
              <Text style={[styles.resetButtonText, {color: theme.accent}]}>
                Reset Filters
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const CARD_WIDTH = Math.min(960, width - 32);

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 16,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
    gap: 16,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  resetButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 2,
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: '10%',
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {fontSize: 22, fontWeight: '800'},
  subtitle: {fontSize: 13, marginTop: 4},
  time: {fontSize: 13, fontWeight: '600'},

  searchSection: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  searchBox: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  searchInput: {fontSize: 15},

  sortBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  sortBtnText: {fontSize: 13, fontWeight: '600'},

  categoriesWrap: {
    paddingVertical: 10,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 10,
  },
  categoryText: {fontSize: 13, fontWeight: '600'},

  resultsHeader: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 0,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultsText: {fontSize: 13, fontWeight: '600'},

  // Card
  card: {
    width: CARD_WIDTH,
    alignSelf: 'center',
    flexDirection: 'row',
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  avatarWrap: {
    width: 84,
    height: 84,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 14,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.06)',
    backgroundColor: '#fff',
    alignSelf: 'center',
    position: 'relative',
  },
  avatar: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  statusBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 8,
    fontWeight: '700',
  },

  info: {
    flex: 1,
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {fontSize: 16, fontWeight: '800', maxWidth: '70%'},
  ratingBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingTextBold: {color: '#fff', fontWeight: '800'},

  spec: {fontSize: 14, fontWeight: '700', marginTop: 4},
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  metaText: {fontSize: 12, fontWeight: '500'},
  feeText: {fontSize: 14, fontWeight: '700'},
  location: {marginTop: 6, fontSize: 13},
  availabilityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  availabilityText: {fontSize: 11, fontWeight: '500'},

  footerRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reviewsWrap: {flex: 1},
  reviewsText: {fontSize: 12},

  bookBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    marginLeft: 12,
  },
  bookBtnText: {color: '#fff', fontSize: 14, fontWeight: '700'},
});

export default AllDoctorsList;
