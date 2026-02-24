import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Badge from '../badge/Badge';
import { Text } from '..';

export default function HealthItem({ title, location, time, status, statusVariant, icon, onPress }: any) {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.infoRow}>
          <View style={styles.iconBox}>
            <Text style={styles.icon}>{icon}</Text>
          </View>
          <View>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.locationRow}>
              <Text style={styles.locationText}>📍 {location}</Text>
            </View>
            <Text style={styles.timeText}>{time}</Text>
          </View>
        </View>
        <Badge label={status} variant={statusVariant} />
      </View>
      <TouchableOpacity 
        style={styles.button}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>{status === 'Done' ? 'View Details' : 'Set Reminder'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 16,
  },
  iconBox: {
    width: 64,
    height: 64,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 30,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#0f172a',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  locationText: {
    fontSize: 12,
    color: '#94a3b8',
  },
  timeText: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  button: {
    width: '100%',
    paddingVertical: 12,
    backgroundColor: '#eebd2b',
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#0f172a',
    fontWeight: 'bold',
  },
});
