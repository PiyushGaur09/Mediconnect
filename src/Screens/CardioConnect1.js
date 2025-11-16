import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import Colors from '../constants/Colors'; // Adjust the import path as needed

const CardioConnect1 = ({isDarkMode = false}) => {
  const colors = isDarkMode ? Colors.dark : Colors.light;
  const [selectedSex, setSelectedSex] = useState(null);

  const sexOptions = [
    {label: 'Male', value: 'male'},
    {label: 'Female', value: 'female'},
    {label: 'Others', value: 'others'},
  ];

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, {color: colors.text}]}>
            Cardio Connect
          </Text>
        </View>

        {/* Progress Section */}
        <View style={styles.progressSection}>
          <Text style={[styles.stepText, {color: colors.text}]}>
            Step 1 of 4
          </Text>
          <View style={styles.progressBarContainer}>
            <View
              style={[styles.progressBar, {backgroundColor: colors.primary}]}
            />
            <View
              style={[
                styles.progressBarBackground,
                {backgroundColor: isDarkMode ? '#3A4663' : '#F0F0F0'},
              ]}
            />
          </View>
        </View>

        {/* Divider */}
        <View
          style={[
            styles.divider,
            {backgroundColor: isDarkMode ? '#3A4663' : '#E0E0E0'},
          ]}
        />

        {/* Content */}
        <View style={styles.content}>
          <Text style={[styles.sectionTitle, {color: colors.text}]}>
            Demographics
          </Text>

          {/* Age Field */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.fieldLabel, {color: colors.text}]}>Age</Text>
            <View
              style={[
                styles.inputContainer,
                {
                  backgroundColor: isDarkMode ? '#3A4663' : '#F8F8F8',
                  borderColor: isDarkMode ? '#4A5678' : '#E0E0E0',
                },
              ]}>
              <TextInput
                style={[styles.textInput, {color: colors.text}]}
                placeholder="Enter your age"
                placeholderTextColor={isDarkMode ? '#8A93AB' : '#999999'}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Sex Field with Dropdown */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.fieldLabel, {color: colors.text}]}>Sex</Text>
            <Dropdown
              style={[
                styles.dropdown,
                {
                  backgroundColor: isDarkMode ? '#3A4663' : '#F8F8F8',
                  borderColor: isDarkMode ? '#4A5678' : '#E0E0E0',
                },
              ]}
              placeholderStyle={[
                styles.placeholderStyle,
                {color: isDarkMode ? '#8A93AB' : '#999999'},
              ]}
              selectedTextStyle={[
                styles.selectedTextStyle,
                {color: colors.text},
              ]}
              inputSearchStyle={[
                styles.inputSearchStyle,
                {
                  color: colors.text,
                  backgroundColor: colors.background,
                },
              ]}
              iconStyle={styles.iconStyle}
              data={sexOptions}
              search={false}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="Select"
              value={selectedSex}
              onChange={item => {
                setSelectedSex(item.value);
              }}
              itemTextStyle={{color: colors.text}}
              itemContainerStyle={{
                backgroundColor: isDarkMode ? '#3A4663' : '#F8F8F8',
              }}
              activeColor={isDarkMode ? '#4A5678' : '#E0E0E0'}
              containerStyle={{
                backgroundColor: isDarkMode ? '#3A4663' : '#F8F8F8',
                borderColor: isDarkMode ? '#4A5678' : '#E0E0E0',
                borderRadius: 8,
              }}
            />
          </View>
        </View>
      </ScrollView>

      {/* Footer Buttons */}
      <View
        style={[
          styles.footer,
          {
            backgroundColor: colors.background,
            borderTopColor: isDarkMode ? '#3A4663' : '#E0E0E0',
          },
        ]}>
        <TouchableOpacity
          style={[
            styles.button,
            styles.cancelButton,
            {
              backgroundColor: 'transparent',
            },
          ]}>
          <Text
            style={[
              styles.buttonText,
              styles.cancelButtonText,
              {
                color: isDarkMode ? colors.text : colors.secondary,
              },
            ]}>
            Cancel
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            styles.nextButton,
            {
              backgroundColor: colors.primary,
            },
          ]}>
          <Text
            style={[
              styles.buttonText,
              styles.nextButtonText,
              {
                color: isDarkMode ? Colors.dark.black : colors.text,
              },
            ]}>
            Next
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  progressSection: {
    marginBottom: 20,
  },
  stepText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  progressBarContainer: {
    height: 4,
    borderRadius: 2,
    position: 'relative',
  },
  progressBar: {
    height: 4,
    width: '25%', // 1 out of 4 steps = 25%
    borderRadius: 2,
    position: 'absolute',
    zIndex: 2,
  },
  progressBarBackground: {
    height: 4,
    width: '100%',
    borderRadius: 2,
    position: 'absolute',
    zIndex: 1,
  },
  divider: {
    height: 1,
    marginBottom: 30,
  },
  content: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  fieldContainer: {
    marginBottom: 25,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 50,
    justifyContent: 'center',
  },
  textInput: {
    fontSize: 16,
    padding: 0,
  },
  // Dropdown Styles
  dropdown: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    minWidth: 100,
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: 'transparent',
  },
  nextButton: {
    // backgroundColor handled dynamically
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButtonText: {
    // Color handled dynamically
  },
  nextButtonText: {
    // Color handled dynamically
  },
});

export default CardioConnect1;
