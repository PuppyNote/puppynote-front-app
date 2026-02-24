import React from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Text } from '..';

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
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  subTabs: {
    backgroundColor: '#fcfaf2',
    paddingHorizontal: 24,
    paddingBottom: 4,
  },
  tabRow: {
    flexDirection: 'row',
    gap: 12,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 9999,
    backgroundColor: 'white',
  },
  activeTab: {
    backgroundColor: '#eebd2b',
  },
  tabText: {
    fontSize: 14,
  },
  tabTextActive: {
    fontWeight: 'bold',
    color: 'white',
  },
  tabTextInactive: {
    fontWeight: '500',
    color: '#64748b',
  },
});
