import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { CustomText as Text } from '../CustomText';
import { userCategoryService } from '../../services/userCategory/UserCategoryService';

interface TabItem {
  id: string;
  label: string;
}

interface CategoryTabProps {
  tabs?: TabItem[];
  activeTabId: string;
  onTabPress: (id: string) => void;
  onAddPress?: () => void;
  categoryType?: 'ITEM' | 'ACTIVITY';
  onTabsChange?: (tabs: TabItem[]) => void;
}

export default function CategoryTab({ 
  tabs: propsTabs, 
  activeTabId, 
  onTabPress, 
  onAddPress,
  categoryType,
  onTabsChange
}: CategoryTabProps) {
  const [internalTabs, setInternalTabs] = useState<TabItem[]>(propsTabs || []);

  useEffect(() => {
    if (categoryType) {
      fetchUserCategories();
    }
  }, [categoryType]);

  // Sync with propsTabs if provided, regardless of categoryType
  useEffect(() => {
    if (propsTabs && propsTabs.length > 0) {
      setInternalTabs(propsTabs);
    }
  }, [propsTabs]);

  const fetchUserCategories = async () => {
    if (!categoryType) return;
    try {
      const data = await userCategoryService.getUserCategories(categoryType);
      const userTabs = data.map(cat => ({
        id: cat.category,
        label: `${cat.categoryEmoji} ${cat.categoryName}`
      }));
      const finalTabs = [{ id: 'all', label: '전체' }, ...userTabs];
      setInternalTabs(finalTabs);
      onTabsChange?.(finalTabs);
    } catch (error) {
      console.error(`Failed to fetch ${categoryType} categories in CategoryTab:`, error);
    }
  };

  const displayTabs = internalTabs;

  return (
    <View style={styles.categoryTab}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.tabRow}>
          {displayTabs.map((tab) => {
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
  categoryTab: {
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
