import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface TabItem {
  id: string;
  label: string;
}

interface SubTabsProps {
  tabs: TabItem[];
  activeTabId: string;
  onTabPress: (id: string) => void;
}

export default function SubTabs({ tabs, activeTabId, onTabPress }: SubTabsProps) {
  return (
    <View style={styles.subTabs}>
      <View style={styles.tabRow}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <TouchableOpacity 
              key={tab.id} 
              style={[styles.tab, isActive && styles.activeTab]}
              onPress={() => onTabPress(tab.id)}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, isActive ? styles.tabTextActive : styles.tabTextInactive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  subTabs: {
    backgroundColor: 'white',
    paddingHorizontal: 24,
    paddingBottom: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tabRow: {
    flexDirection: 'row',
    gap: 24,
  },
  tab: {
    padding: 12,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#eebd2b',
  },
  tabText: {
    fontSize: 14,
  },
  tabTextActive: {
    fontWeight: 'bold',
    color: '#0f172a',
  },
  tabTextInactive: {
    fontWeight: '500',
    color: '#64748b',
  },
});
