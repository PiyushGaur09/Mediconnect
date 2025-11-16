import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Image,
} from 'react-native';
import Colors from '../constants//Colors'; // Adjust the import path as needed

const CardioConnect2 = ({isDarkMode = false}) => {
  const colors = isDarkMode ? Colors.dark : Colors.light;

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
            Your Heart Score
          </Text>
        </View>

        {/* Heart Score Section with Progress Bar */}
        <View style={styles.scoreSection}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
            }}>
            <Text style={[styles.scoreLabel, {color: colors.text}]}>
              Heart Score
            </Text>
            <View style={styles.scoreContainer}>
              <Text style={[styles.scoreValue, {color: colors.primary}]}>
                75
              </Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBarBackground,
                {backgroundColor: isDarkMode ? '#3A4663' : '#F0F0F0'},
              ]}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    backgroundColor: colors.primary,
                    width: '75%', // 75% width for score of 75
                  },
                ]}
              />
            </View>
            {/* <View style={styles.progressLabels}>
              <Text style={[styles.progressLabel, {color: colors.text}]}>
                0
              </Text>
              <Text style={[styles.progressLabel, {color: colors.text}]}>
                100
              </Text>
            </View> */}
            <Text style={[styles.messageTitle, {color: colors.text}]}>
              Good
            </Text>
          </View>
        </View>

        {/* Divider */}
        <View
          style={[
            styles.divider,
            {backgroundColor: isDarkMode ? '#3A4663' : '#E0E0E0'},
          ]}
        />

        {/* Good Message Section */}
        <View style={styles.messageSection}>
          <Text style={[styles.messageText, {color: colors.text}]}>
            Your heart is estimated to be 35 years old, which is 5 years younger
            than your actual age. Keep up the great work!
          </Text>
        </View>

        {/* Divider */}
        <View
          style={[
            styles.divider,
            {backgroundColor: isDarkMode ? '#3A4663' : '#E0E0E0'},
          ]}
        />

        {/* Risk Level Section - Fixed Layout */}
        <View style={styles.riskSection}>
          <Text style={[styles.riskTitle, {color: colors.text}]}>
            Risk Level
          </Text>
          <View style={styles.riskItemsContainer}>
            <View>
              <Image style={{marginRight:16}} source={require('../Images/HeartBackground.png')} />
            </View>
            <View style={{}}>
              <Text style={[styles.overallRisk, {color: colors.text}]}>
                Overall Risk
              </Text>
              <Text style={[styles.riskLevel, {color: colors.text}]}>Low</Text>
            </View>
          </View>
        </View>

        {/* Divider */}
        <View
          style={[
            styles.divider,
            {backgroundColor: isDarkMode ? '#3A4663' : '#E0E0E0'},
          ]}
        />

        {/* Get Recommendations Section */}
        <View style={styles.recommendationsSection}>
          <Text style={[styles.recommendationsTitle, {color: colors.text}]}>
            Get Recommendations
          </Text>

          {/* Book Consultation Button - Fixed Width */}
          <TouchableOpacity
            style={[
              styles.consultationButton,
              {backgroundColor: colors.primary},
            ]}>
            <Text
              style={[
                styles.consultationButtonText,
                {color: Colors.dark.black},
              ]}>
              Book Consultation
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    paddingBottom: 40,
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
  scoreSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  scoreLabel: {
    fontSize: 14,
    fontWeight: '600',
    // marginBottom: 10,
  },
  scoreContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    // marginVertical: 15,
  },
  scoreValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  // Progress Bar Styles
  progressBarContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  progressBarBackground: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 8,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    marginVertical: 20,
  },
  messageSection: {
    marginBottom: 20,
  },
  messageTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 6,
    justifyContent: 'flex-start',
    width: '100%',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
  },
  riskSection: {
    marginBottom: 20,
  },
  riskTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    // textAlign: 'center',
  },
  riskItemsContainer: {
    alignItems: 'flex-start',
    // paddingHorizontal: 6,
    flexDirection: 'row',
  },
  riskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  riskCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    // marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: Colors.dark.black,
    fontSize: 12,
    fontWeight: 'bold',
  },
  overallRisk: {
    fontSize: 16,
    fontWeight: '500',
  },
  riskLevel: {
    fontSize: 14,
    fontWeight: '400',
  },
  recommendationsSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  recommendationsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  consultationButton: {
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 30,
    width: '100%', // Full width button
    maxWidth: 300, // Maximum width constraint
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  consultationButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CardioConnect2;
