import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/config';
import { useNotifications } from '../context/NotificationsContext';

const NotificationSettings = ({ compact = false }) => {
  const {
    notificationsEnabled,
    toggleNotifications,
    permissionStatus,
    sendTestNotification,
  } = useNotifications();

  const handleToggle = async (value) => {
    await toggleNotifications(value);
  };

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <View style={styles.compactRow}>
          <Text style={styles.compactLabel}>🔔 Streak Reminders</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={handleToggle}
            trackColor={{ false: 'rgba(255,255,255,0.2)', true: 'rgba(46,204,113,0.5)' }}
            thumbColor={notificationsEnabled ? '#2ecc71' : '#f4f3f4'}
          />
        </View>
        {notificationsEnabled && (
          <Text style={styles.compactSubtext}>
            Daily reminders at 8 PM to keep your streak
          </Text>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerIcon}>🔔</Text>
        <Text style={styles.headerTitle}>Notification Settings</Text>
      </View>

      <View style={styles.settingRow}>
        <View style={styles.settingInfo}>
          <Text style={styles.settingTitle}>Streak Reminders</Text>
          <Text style={styles.settingDesc}>
            Get reminded at 8 PM to play and keep your streak
          </Text>
        </View>
        <Switch
          value={notificationsEnabled}
          onValueChange={handleToggle}
          trackColor={{ false: 'rgba(255,255,255,0.2)', true: 'rgba(46,204,113,0.5)' }}
          thumbColor={notificationsEnabled ? '#2ecc71' : '#f4f3f4'}
        />
      </View>

      {notificationsEnabled && (
        <View style={styles.activeInfo}>
          <Text style={styles.activeIcon}>✓</Text>
          <View>
            <Text style={styles.activeTitle}>Notifications Active</Text>
            <Text style={styles.activeDesc}>
              • Daily reminder at 8 PM{'\n'}
              • Streak warning at 10 PM (if not played){'\n'}
              • Challenge reminders at 6 PM
            </Text>
          </View>
        </View>
      )}

      {permissionStatus === 'denied' && (
        <View style={styles.warningBox}>
          <Text style={styles.warningIcon}>⚠️</Text>
          <Text style={styles.warningText}>
            Notifications are blocked. Please enable them in your device settings.
          </Text>
        </View>
      )}

      {__DEV__ && (
        <TouchableOpacity style={styles.testButton} onPress={sendTestNotification}>
          <Text style={styles.testButtonText}>🧪 Send Test Notification</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 12,
    padding: 16,
    marginVertical: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  headerTitle: {
    color: COLORS.WHITE,
    fontSize: 18,
    fontWeight: '700',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 10,
    padding: 14,
  },
  settingInfo: {
    flex: 1,
    marginRight: 12,
  },
  settingTitle: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontWeight: '600',
  },
  settingDesc: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    marginTop: 2,
  },
  activeInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(46,204,113,0.15)',
    borderRadius: 10,
    padding: 12,
    marginTop: 12,
  },
  activeIcon: {
    color: '#2ecc71',
    fontSize: 16,
    fontWeight: '700',
    marginRight: 10,
    marginTop: 2,
  },
  activeTitle: {
    color: '#2ecc71',
    fontSize: 14,
    fontWeight: '700',
  },
  activeDesc: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginTop: 4,
    lineHeight: 18,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(231,76,60,0.2)',
    borderRadius: 10,
    padding: 12,
    marginTop: 12,
  },
  warningIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  warningText: {
    color: '#e74c3c',
    fontSize: 12,
    flex: 1,
  },
  testButton: {
    backgroundColor: 'rgba(155,89,182,0.3)',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    alignItems: 'center',
  },
  testButtonText: {
    color: '#9b59b6',
    fontSize: 14,
    fontWeight: '600',
  },
  // Compact styles
  compactContainer: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
  },
  compactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  compactLabel: {
    color: COLORS.WHITE,
    fontSize: 14,
    fontWeight: '600',
  },
  compactSubtext: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 11,
    marginTop: 6,
  },
});

export default NotificationSettings;
