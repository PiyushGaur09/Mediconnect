// import { View, Text } from 'react-native'
// import React from 'react'

// const Notification = () => {
//   return (
//     <View>
//       <Text>Notification</Text>
//     </View>
//   )
// }

// export default Notification



// Notification.js
import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  useColorScheme,
  StatusBar,
  Platform,
} from 'react-native';
import Colors from '../constants/Colors';

const Notification = ({ navigation }) => {
  // default to dark theme
  const deviceScheme = useColorScheme();
  const scheme = deviceScheme === 'dark' ? 'dark' : 'dark'; // force dark as default per request
  const theme = Colors[scheme] || {};

  // derived palette (fallbacks chosen to match earlier screens)
  const palette = {
    background: theme.background ?? '#0A1830',
    card: theme.card ?? (scheme === 'light' ? '#FFFFFF' : '#0F2034'),
    text: theme.text ?? (scheme === 'light' ? '#0B1220' : '#FFFFFF'),
    muted: theme.muted ?? (scheme === 'light' ? '#7B8794' : '#A8B0C2'),
    primary: theme.primary ?? '#00E0FF',
    success: theme.success ?? '#DFF6EA', // light green background in icons
    successIcon: theme.successIcon ?? '#0D8F6E', // icon color
    danger: theme.danger ?? '#FEEAEA', // light red bg
    dangerIcon: theme.dangerIcon ?? '#C23535',
    neutral: theme.neutral ?? '#F3F6F9',
    neutralIcon: theme.neutralIcon ?? '#2B3846',
    border: theme.border ?? (scheme === 'light' ? '#EDEFF3' : '#243142'),
    badgeBg: theme.badgeBg ?? '#374151',
    badgeText: theme.badgeText ?? '#fff',
  };

  // sample notifications data
  const notifications = [
    {
      id: 'n1',
      group: 'TODAY',
      title: 'Appointment Success',
      message: 'You have successfully booked your appointment with Dr. Emily Walker.',
      time: '1h',
      bg: palette.success,
      iconColor: palette.successIcon,
    },
    {
      id: 'n2',
      group: 'TODAY',
      title: 'Appointment Cancelled',
      message: 'You have successfully cancelled your appointment with Dr. David Patel.',
      time: '2h',
      bg: palette.danger,
      iconColor: palette.dangerIcon,
    },
    {
      id: 'n3',
      group: 'TODAY',
      title: 'Scheduled Changed',
      message: 'You have successfully changed your appointment with Dr. Jesica Turner.',
      time: '8h',
      bg: palette.neutral,
      iconColor: palette.neutralIcon,
    },
    {
      id: 'n4',
      group: 'YESTERDAY',
      title: 'Appointment success',
      message: 'You have successfully booked your appointment with Dr. David Patel.',
      time: '1d',
      bg: palette.success,
      iconColor: palette.successIcon,
    },
  ];

  // group notifications
  const groups = Array.from(new Set(notifications.map(n => n.group)));

  // Icon images (replace these with your real icon files if you have them)
  // You can keep single-file icons or provide light/dark versions if you prefer
  const calendarIcon = require('../Images/icons/calendar.png'); // placeholder path
  const calendarCancelIcon = require('../Images/icons/calendar.png'); // placeholder
  const calendarEditIcon = require('../Images/icons/calendar.png'); // placeholder

  const getIconForTitle = (title) => {
    if (title.toLowerCase().includes('cancel')) return calendarCancelIcon;
    if (title.toLowerCase().includes('changed')) return calendarEditIcon;
    return calendarIcon;
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: palette.background }]}>
      <StatusBar
        barStyle={scheme === 'light' ? 'dark-content' : 'light-content'}
        backgroundColor={palette.background}
      />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: palette.background }]}>
        <TouchableOpacity
          style={styles.headerLeft}
          activeOpacity={0.7}
          onPress={() => navigation?.goBack?.()}>
          <Text style={[styles.backArrow, { color: palette.text }]}>‹</Text>
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: palette.text }]}>Notification</Text>

        <View style={styles.headerRight}>
          <View style={[styles.newBadge, { backgroundColor: palette.badgeBg }]}>
            <Text style={[styles.newBadgeText, { color: palette.badgeText }]}>1 New</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {groups.map(groupName => {
          const groupItems = notifications.filter(n => n.group === groupName);
          return (
            <View key={groupName} style={styles.groupBlock}>
              <View style={styles.groupHeaderRow}>
                <Text style={[styles.groupTitle, { color: palette.muted }]}>{groupName}</Text>
                <TouchableOpacity activeOpacity={0.7}>
                  <Text style={[styles.markAll, { color: palette.text }]}>Mark all as read</Text>
                </TouchableOpacity>
              </View>

              {/* list items */}
              {groupItems.map(item => (
                <TouchableOpacity
                  activeOpacity={0.9}
                  key={item.id}
                  style={[styles.itemRow, { borderBottomColor: palette.border }]}>
                  <View style={styles.itemLeft}>
                    <View style={[styles.iconCircle, { backgroundColor: item.bg }]}>
                      <Image source={getIconForTitle(item.title)} style={[styles.iconImage, { tintColor: item.iconColor }]} />
                    </View>
                  </View>

                  <View style={styles.itemCenter}>
                    <Text style={[styles.itemTitle, { color: palette.text }]} numberOfLines={1} ellipsizeMode="tail">
                      {item.title}
                    </Text>
                    <Text style={[styles.itemMessage, { color: palette.muted }]} numberOfLines={2}>
                      {item.message}
                    </Text>
                  </View>

                  <View style={styles.itemRight}>
                    <Text style={[styles.itemTime, { color: palette.muted }]}>{item.time}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },

  header: {
    height: 80,
    paddingHorizontal: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerLeft: { width: 40, alignItems: 'flex-start', justifyContent: 'center' },
  backArrow: { fontSize: 40, fontWeight: '600' },
  headerTitle: { fontSize: 20, fontWeight: '800' },
  headerRight: { width: 80, alignItems: 'flex-end', justifyContent: 'center' },
  newBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  newBadgeText: { fontSize: 12, fontWeight: '700' },

  scrollContent: {
    paddingBottom: 160,
  },

  groupBlock: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  groupHeaderRow: {
    marginTop: 8,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  groupTitle: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  markAll: {
    fontSize: 14,
    fontWeight: '700',
  },

  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  itemLeft: {
    width: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconImage: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },

  itemCenter: {
    flex: 1,
    paddingRight: 12,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6,
  },
  itemMessage: {
    fontSize: 14,
    lineHeight: 20,
  },

  itemRight: {
    width: 48,
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    paddingTop: 6,
  },
  itemTime: {
    fontSize: 13,
    fontWeight: '600',
  },
});

export default Notification;
