import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Colors from '../constants/Colors.js';

// Default avatar URL
const DEFAULT_AVATAR = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

const ServiceListScreen = ({route, navigation}) => {
  const {serviceType} = route.params || {};
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log('ServiceListScreen - serviceType:', serviceType); // Debug log

  const API_URLS = {
    chemists: 'https://mediconnect-lemon.vercel.app/api/chemists',
    pharmacists: 'https://mediconnect-lemon.vercel.app/api/pharmacists',
    labs: 'https://mediconnect-lemon.vercel.app/api/lab',
  };

  const TITLES = {
    chemists: 'Chemists',
    pharmacists: 'Pharmacists',
    labs: 'Diagnostic Labs',
  };

  useEffect(() => {
    if (serviceType) {
      fetchData();
    } else {
      setError('Service type not specified');
      setLoading(false);
    }
  }, [serviceType]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const apiUrl = API_URLS[serviceType];
      if (!apiUrl) {
        setError('Invalid service type');
        return;
      }

      console.log('Fetching from:', apiUrl); // Debug log

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      const result = await response.json();
      console.log('API Response:', result); // Debug log

      if (result.success) {
        setData(result.data || []);
      } else {
        setError(result.message || 'Failed to fetch data');
      }
    } catch (err) {
      console.error('API Error:', err);
      setError('Network error occurred. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const renderRating = rating => {
    if (!rating) return null;

    return (
      <View style={styles.ratingContainer}>
        <Text style={styles.ratingText}>⭐ {rating}</Text>
      </View>
    );
  };

  const renderItem = ({item}) => (
    <TouchableOpacity style={styles.listItem} activeOpacity={0.8}>
      <Image
        source={{uri: item.users?.profile_picture || DEFAULT_AVATAR}}
        style={styles.avatar}
        defaultSource={{uri: DEFAULT_AVATAR}}
      />

      <View style={styles.itemContent}>
        <View style={styles.itemHeader}>
          <Text style={styles.name}>
            {serviceType === 'labs' ? item.lab_name : item.full_name}
          </Text>
          {renderRating(item.rating)}
        </View>

        <Text style={styles.detail}>
          {serviceType === 'labs'
            ? item.owner_name
            : item.pharmacy_name || item.store_name}
        </Text>

        <Text style={styles.address}>{item.address}</Text>

        <View style={styles.metaContainer}>
          <Text style={styles.metaText}>
            {serviceType === 'labs'
              ? `Reviews: ${item.total_reviews || 0}`
              : `Exp: ${item.experience_years || 0} years`}
          </Text>
          <Text style={styles.license}>{item.license_number}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.dark.primary} />
          <Text style={styles.loadingText}>
            Loading {TITLES[serviceType]}...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchData}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
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

      {/* <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{TITLES[serviceType]}</Text>
        <View style={styles.placeholder} />
      </View> */}

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id?.toString() || Math.random().toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No {TITLES[serviceType]} found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: Colors.dark.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: '700',
  },
  placeholder: {
    width: 60,
  },
  listContainer: {
    padding: 16,
  },
  listItem: {
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  itemContent: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  name: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
    marginRight: 8,
  },
  ratingContainer: {
    backgroundColor: 'rgba(255,193,7,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingText: {
    color: Colors.dark.text,
    fontSize: 12,
    fontWeight: '600',
  },
  detail: {
    color: Colors.dark.text,
    fontSize: 14,
    marginBottom: 4,
    opacity: 0.9,
  },
  address: {
    color: Colors.dark.text,
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 8,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaText: {
    color: Colors.dark.text,
    fontSize: 12,
    opacity: 0.8,
  },
  license: {
    color: Colors.dark.primary,
    fontSize: 11,
    fontWeight: '600',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    color: Colors.dark.text,
    marginTop: 12,
    fontSize: 16,
  },
  errorText: {
    color: '#dc3545',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: Colors.dark.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: Colors.dark.background,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    color: Colors.dark.text,
    fontSize: 16,
    opacity: 0.7,
  },
});

export default ServiceListScreen;
