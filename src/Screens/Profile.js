import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  useColorScheme,
  Alert,
  ActivityIndicator,
  ScrollView,
  Modal,
  TextInput,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImagePicker from 'react-native-image-crop-picker';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
const API_BASE_URL = 'https://mediconnect-lemon.vercel.app/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export default function Profile({navigation}) {
  const scheme = useColorScheme();
  const isDark = scheme === 'light';

  const colors = {
    background: isDark ? '#0f172a' : '#ffffff',
    textPrimary: isDark ? '#f1f5f9' : '#1e293b',
    textSecondary: isDark ? '#94a3b8' : '#64748b',
    cardBg: isDark ? '#1e293b' : '#f8fafc',
    primary: '#00E0FF',
    accent: '#3b82f6',
    success: '#10b981',
    danger: '#ef4444',
  };

  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);




  // Edit form state
  const [editForm, setEditForm] = useState({
    full_name: '',
    email: '',
    gender: '',
    date_of_birth: '',
    address: '',
  });

  // Fetch user data from AsyncStorage
  const getUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('user_data');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error retrieving user data:', error);
      return null;
    }
  };

  // Fetch profile data from API
  const fetchProfileData = async () => {
    try {
      setIsLoading(true);
      const userData = await getUserData();
      
      if (!userData || !userData.id) {
        Alert.alert('Error', 'User data not found. Please login again.');
        navigation.reset({
          index: 0,
          routes: [{name: 'PhoneLogin'}],
        });
        return;
      }

      const response = await api.post('/profile/get', {
        user_id: userData.id,
      });

      console.log('Profile Response:', response.data);

      if (response.data && response.data.success) {
        setProfileData(response.data.data);
      } else {
        throw new Error(response.data.message || 'Failed to fetch profile');
      }
    } catch (error) {
      console.error('Profile Fetch Error:', error);
      Alert.alert('Error', 'Failed to load profile data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Update profile data
  const updateProfile = async () => {
    try {
      setIsUpdating(true);
      const userData = await getUserData();
      
      if (!userData || !userData.id) {
        Alert.alert('Error', 'User data not found. Please login again.');
        return;
      }

      // Create form data for file upload
      const formData = new FormData();
      formData.append('user_id', userData.id);
      formData.append('full_name', editForm.full_name);
      formData.append('email', editForm.email);
      formData.append('gender', editForm.gender);
      formData.append('date_of_birth', editForm.date_of_birth);
      formData.append('address', editForm.address);

      // Append profile picture if selected
      if (selectedImage) {
        formData.append('profile_picture', {
          uri: selectedImage.path,
          type: selectedImage.mime,
          name: selectedImage.filename || 'profile.jpg',
        });
      }

      const response = await api.put('/auth/patient/update', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Update Response:', response.data);

      if (response.data && response.data.success) {
        Alert.alert('Success', response.data.message || 'Profile updated successfully!');
        setShowEditModal(false);
        setSelectedImage(null);
        fetchProfileData(); // Refresh profile data
      } else {
        throw new Error(response.data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Update Profile Error:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle image selection
  const handleImageSelection = () => {
    Alert.alert('Change Profile Photo', 'Choose an option', [
      {
        text: '📷 Camera',
        onPress: takePhotoFromCamera,
      },
      {
        text: '🖼️ Gallery',
        onPress: choosePhotoFromGallery,
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]);
  };

  const takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      width: 400,
      height: 400,
      cropping: true,
      cropperCircleOverlay: true,
      compressImageQuality: 0.8,
      includeBase64: false,
    })
      .then(image => {
        console.log('Camera Image:', image);
        setSelectedImage(image);
      })
      .catch(error => {
        if (error.code !== 'E_PICKER_CANCELLED') {
          Alert.alert('Error', 'Failed to take photo');
        }
      });
  };

  const choosePhotoFromGallery = () => {
    ImagePicker.openPicker({
      width: 400,
      height: 400,
      cropping: true,
      cropperCircleOverlay: true,
      compressImageQuality: 0.8,
      includeBase64: false,
      mediaType: 'photo',
    })
      .then(image => {
        console.log('Gallery Image:', image);
        setSelectedImage(image);
      })
      .catch(error => {
        if (error.code !== 'E_PICKER_CANCELLED') {
          Alert.alert('Error', 'Failed to select image from gallery');
        }
      });
  };

  // Open edit modal
  const openEditModal = () => {
    if (profileData && profileData.details) {
      setEditForm({
        full_name: profileData.details.full_name || '',
        email: profileData.details.email || '',
        gender: profileData.details.gender || '',
        date_of_birth: profileData.details.date_of_birth || '',
        address: profileData.details.address || '',
      });
      setShowEditModal(true);
    }
  };

  // Handle logout
  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          try {
            await AsyncStorage.removeItem('user_data');
            navigation.reset({
              index: 0,
              routes: [{name: 'Login'}],
            });
          } catch (error) {
            console.error('Logout Error:', error);
          }
        },
      },
    ]);
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, {backgroundColor: colors.background}]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, {color: colors.textPrimary}]}>
            Loading your profile...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: colors.background}]}>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Header with Edit Button */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, {color: colors.textPrimary}]}>
            My Profile
          </Text>
          <TouchableOpacity style={styles.editHeaderButton} onPress={openEditModal}>
            <Text style={styles.editHeaderButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <View style={[styles.profileCard, {backgroundColor: colors.cardBg}]}>
          {/* Profile Image with Animation */}
          <TouchableOpacity 
            style={styles.avatarContainer} 
            onPress={handleImageSelection}
            activeOpacity={0.8}>
            <Image
              source={{
                uri: selectedImage?.path || profileData?.profile_picture || 'https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?auto=format&fit=crop&w=400&q=80',
              }}
              style={styles.avatar}
            />
            <View style={styles.cameraIcon}>
              <Text style={styles.cameraIconText}>📷</Text>
            </View>
          </TouchableOpacity>

          {/* Name & Verification */}
          <View style={styles.nameContainer}>
            <Text style={[styles.name, {color: colors.textPrimary}]}>
              {profileData?.details?.full_name || 'No Name'}
            </Text>
            <View style={[
              styles.verificationBadge,
              {backgroundColor: profileData?.is_verified ? colors.success : colors.danger}
            ]}>
              <Text style={styles.verificationText}>
                {profileData?.is_verified ? '✓ Verified' : '✗ Not Verified'}
              </Text>
            </View>
          </View>

          {/* Contact Info */}
          <View style={styles.contactInfo}>
            <View style={styles.contactItem}>
              <Text style={styles.contactIcon}>📱</Text>
              <Text style={[styles.contactText, {color: colors.textSecondary}]}>
                {profileData?.phone_number || 'No Phone'}
              </Text>
            </View>
            <View style={styles.contactItem}>
              <Text style={styles.contactIcon}>✉️</Text>
              <Text style={[styles.contactText, {color: colors.textSecondary}]}>
                {profileData?.details?.email || 'No Email'}
              </Text>
            </View>
          </View>

          {/* Info Grid */}
          <View style={styles.infoGrid}>
            <View style={styles.infoCard}>
              <Text style={styles.infoIcon}>👤</Text>
              <Text style={[styles.infoLabel, {color: colors.textSecondary}]}>Gender</Text>
              <Text style={[styles.infoValue, {color: colors.textPrimary}]}>
                {profileData?.details?.gender ? profileData.details.gender.charAt(0).toUpperCase() + profileData.details.gender.slice(1) : 'Not set'}
              </Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoIcon}>🎂</Text>
              <Text style={[styles.infoLabel, {color: colors.textSecondary}]}>Date of Birth</Text>
              <Text style={[styles.infoValue, {color: colors.textPrimary}]}>
                {profileData?.details?.date_of_birth || 'Not set'}
              </Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoIcon}>🩸</Text>
              <Text style={[styles.infoLabel, {color: colors.textSecondary}]}>Blood Group</Text>
              <Text style={[styles.infoValue, {color: colors.textPrimary}]}>
                {profileData?.details?.blood_group || 'Not set'}
              </Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoIcon}>📅</Text>
              <Text style={[styles.infoLabel, {color: colors.textSecondary}]}>Member Since</Text>
              <Text style={[styles.infoValue, {color: colors.textPrimary}]}>
                {profileData?.created_at
                  ? new Date(profileData.created_at).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short' 
                    })
                  : 'N/A'}
              </Text>
            </View>
          </View>

          {/* Address Section */}
          <View style={styles.addressCard}>
            <Text style={styles.addressIcon}>📍</Text>
            <View style={styles.addressContent}>
              <Text style={[styles.addressLabel, {color: colors.textSecondary}]}>
                Address
              </Text>
              <Text style={[styles.addressValue, {color: colors.textPrimary}]}>
                {profileData?.details?.address || 'No address provided'}
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, {backgroundColor: colors.primary}]}
            onPress={openEditModal}>
            <Text style={styles.actionButtonText}>✏️ Edit Profile</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, {backgroundColor: colors.danger}]}
            onPress={handleLogout}>
            <Text style={styles.actionButtonText}>🚪 Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Edit Profile Modal - FIXED FULL SCREEN */}
      <Modal
        visible={showEditModal}
        transparent={true}
        animationType="slide"
        statusBarTranslucent={true}
        onRequestClose={() => !isUpdating && setShowEditModal(false)}>
        <KeyboardAvoidingView 
          style={styles.modalContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          
          <View style={[styles.modalOverlay, {backgroundColor: 'rgba(0, 0, 0, 0.8)'}]}>
            <View style={[styles.modalContent, {backgroundColor: colors.cardBg}]}>
              
              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, {color: colors.textPrimary}]}>
                  Edit Profile
                </Text>
                <TouchableOpacity 
                  onPress={() => !isUpdating && setShowEditModal(false)}
                  disabled={isUpdating}
                  style={styles.closeButton}>
                  <Text style={[styles.modalClose, {color: colors.textSecondary}]}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView 
                style={styles.modalScrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.modalScrollContent}>
                
                {/* Profile Picture Section */}
                <View style={styles.modalImageSection}>
                  <TouchableOpacity 
                    style={styles.modalImageContainer}
                    onPress={handleImageSelection}
                    disabled={isUpdating}>
                    <Image
                      source={{
                        uri: selectedImage?.path || profileData?.profile_picture || 'https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?auto=format&fit=crop&w=400&q=80',
                      }}
                      style={styles.modalAvatar}
                    />
                    <View style={styles.modalImageOverlay}>
                      <Text style={styles.modalImageText}>📷 Change Photo</Text>
                    </View>
                  </TouchableOpacity>
                </View>

                {/* Form Fields */}
                <View style={styles.modalForm}>
                  <View style={styles.modalField}>
                    <Text style={[styles.modalLabel, {color: colors.textPrimary}]}>
                      Full Name
                    </Text>
                    <TextInput
                      value={editForm.full_name}
                      onChangeText={text => setEditForm({...editForm, full_name: text})}
                      style={[styles.modalInput, {color: colors.textPrimary, backgroundColor: colors.background}]}
                      placeholder="Enter full name"
                      placeholderTextColor={colors.textSecondary}
                      editable={!isUpdating}
                    />
                  </View>

                  <View style={styles.modalField}>
                    <Text style={[styles.modalLabel, {color: colors.textPrimary}]}>
                      Email
                    </Text>
                    <TextInput
                      value={editForm.email}
                      onChangeText={text => setEditForm({...editForm, email: text})}
                      style={[styles.modalInput, {color: colors.textPrimary, backgroundColor: colors.background}]}
                      placeholder="Enter email"
                      placeholderTextColor={colors.textSecondary}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      editable={!isUpdating}
                    />
                  </View>

                  <View style={styles.modalField}>
                    <Text style={[styles.modalLabel, {color: colors.textPrimary}]}>
                      Gender
                    </Text>
                    <View style={styles.genderOptions}>
                      {['male', 'female', 'other'].map(gender => (
                        <TouchableOpacity
                          key={gender}
                          style={[
                            styles.genderOption,
                            {backgroundColor: colors.background},
                            editForm.gender === gender && [styles.genderOptionSelected, {backgroundColor: colors.primary}],
                          ]}
                          onPress={() => setEditForm({...editForm, gender})}
                          disabled={isUpdating}>
                          <Text
                            style={[
                              styles.genderText,
                              {color: colors.textSecondary},
                              editForm.gender === gender && [styles.genderTextSelected, {color: '#ffffff'}],
                            ]}>
                            {gender.charAt(0).toUpperCase() + gender.slice(1)}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  <View style={styles.modalField}>
                    <Text style={[styles.modalLabel, {color: colors.textPrimary}]}>
                      Date of Birth
                    </Text>
                    <TextInput
                      value={editForm.date_of_birth}
                      onChangeText={text => setEditForm({...editForm, date_of_birth: text})}
                      style={[styles.modalInput, {color: colors.textPrimary, backgroundColor: colors.background}]}
                      placeholder="YYYY-MM-DD"
                      placeholderTextColor={colors.textSecondary}
                      editable={!isUpdating}
                    />
                  </View>

                  <View style={styles.modalField}>
                    <Text style={[styles.modalLabel, {color: colors.textPrimary}]}>
                      Address
                    </Text>
                    <TextInput
                      value={editForm.address}
                      onChangeText={text => setEditForm({...editForm, address: text})}
                      style={[styles.modalTextArea, {color: colors.textPrimary, backgroundColor: colors.background}]}
                      placeholder="Enter your address"
                      placeholderTextColor={colors.textSecondary}
                      multiline
                      numberOfLines={3}
                      textAlignVertical="top"
                      editable={!isUpdating}
                    />
                  </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={[styles.cancelButton, {borderColor: colors.textSecondary}]}
                    onPress={() => setShowEditModal(false)}
                    disabled={isUpdating}>
                    <Text style={[styles.cancelButtonText, {color: colors.textPrimary}]}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.updateButton, isUpdating && styles.buttonDisabled]}
                    onPress={updateProfile}
                    disabled={isUpdating}>
                    {isUpdating ? (
                      <ActivityIndicator color="#ffffff" size="small" />
                    ) : (
                      <Text style={styles.updateButtonText}>💾 Save Changes</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
  },
  editHeaderButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  editHeaderButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  profileCard: {
    margin: 16,
    marginTop: 8,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  avatarContainer: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#00E0FF',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#00E0FF',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  cameraIconText: {
    fontSize: 16,
  },
  nameContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  name: {
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  verificationBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },
  verificationText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  contactInfo: {
    marginBottom: 24,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactIcon: {
    fontSize: 16,
    marginRight: 12,
    width: 24,
  },
  contactText: {
    fontSize: 16,
    fontWeight: '500',
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  infoCard: {
    width: '48%',
    backgroundColor: 'rgba(0, 224, 255, 0.1)',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  infoIcon: {
    fontSize: 20,
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  addressCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    padding: 16,
    borderRadius: 12,
    alignItems: 'flex-start',
  },
  addressIcon: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 2,
  },
  addressContent: {
    flex: 1,
  },
  addressLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  addressValue: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  actionButtons: {
    padding: 16,
    gap: 12,
  },
  actionButton: {
    padding: 18,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  // FIXED MODAL STYLES - FULL SCREEN
  modalContainer: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 500,
    height: '90%',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  closeButton: {
    padding: 5,
  },
  modalClose: {
    fontSize: 24,
    fontWeight: '300',
  },
  modalScrollView: {
    flex: 1,
  },
  modalScrollContent: {
    paddingBottom: 30,
  },
  modalImageSection: {
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
  },
  modalImageContainer: {
    position: 'relative',
  },
  modalAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#00E0FF',
  },
  modalImageOverlay: {
    position: 'absolute',
    bottom: -5,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 6,
    borderRadius: 8,
  },
  modalImageText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
  modalForm: {
    padding: 20,
    paddingTop: 0,
  },
  modalField: {
    marginBottom: 20,
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontWeight: '500',
  },
  modalTextArea: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    fontWeight: '500',
  },
  genderOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  genderOption: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    alignItems: 'center',
  },
  genderOptionSelected: {
    borderColor: '#00E0FF',
  },
  genderText: {
    fontSize: 14,
    fontWeight: '500',
  },
  genderTextSelected: {
    fontWeight: '700',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    paddingTop: 10,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  updateButton: {
    flex: 2,
    backgroundColor: '#00E0FF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  updateButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});