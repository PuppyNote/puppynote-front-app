import React from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { CustomText as Text } from './CustomText';

export interface TabItem {
  id: string | number;
  label: string;
  onDeletePress?: () => void;
}

interface ScrollableTabProps {
  tabs: TabItem[];
  activeTabId: string | number;
  onTabPress: (id: any) => void;
  onAddPress?: () => void;
  containerStyle?: any;
}

export default function ScrollableTab({ 
  tabs, 
  activeTabId, 
  onTabPress, 
  onAddPress,
  containerStyle
}: ScrollableTabProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.tabRow}>
          {tabs.map((tab) => {
            // ID 타입을 가리지 않고 확실하게 비교하기 위해 문자열로 변환하여 비교
            const isActive = String(tab.id) === String(activeTabId);
            
            return (
              <View key={tab.id.toString()} style={styles.tabContainer}>
                <TouchableOpacity 
                  style={[
                    styles.tab, 
                    isActive && styles.activeTab
                  ]}
                  onPress={() => onTabPress(tab.id)}
                  activeOpacity={0.7}
                >
                  <Text 
                    style={[
                      styles.tabText, 
                      isActive ? styles.tabTextActive : styles.tabTextInactive
                    ]}
                  >
                    {tab.label}
                  </Text>
                </TouchableOpacity>
                {tab.onDeletePress && (
                  <TouchableOpacity 
                    style={styles.deleteButton} 
                    onPress={tab.onDeletePress}
                  >
                    <Text style={styles.deleteText}>×</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
          {onAddPress && (
            <TouchableOpacity 
              style={styles.addButton}
              onPress={onAddPress}
              activeOpacity={0.7}
            >
              <Text style={styles.addText}>+</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fcfaf2',
    paddingHorizontal: 24,
    paddingTop: 0, // 4에서 0으로 제거 (TopBar에 바짝 붙임)
    paddingBottom: 8, 
  },
  tabRow: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 8, // x 버튼 공간 확보를 위해 row에만 패딩 유지
    paddingBottom: 4, 
  },
  tabContainer: {
    position: 'relative',
    marginRight: 8, // 탭 간 간격 및 x 버튼 공간 확보
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 10, // 상하 패딩 약간 증가
    borderRadius: 9999,
    backgroundColor: 'white',
    // shadow for better depth
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  deleteButton: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'white',
    zIndex: 2,
  },
  deleteText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    lineHeight: 12,
    textAlign: 'center',
  },
  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 9999,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addText: {
    fontSize: 18,
    color: '#64748b',
    fontWeight: 'bold',
    lineHeight: 18,
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
