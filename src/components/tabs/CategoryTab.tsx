import React, { useState, useEffect, useCallback } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { userCategoryService } from '../../services/userCategory/UserCategoryService';
import ScrollableTab, { TabItem } from './ScrollableTab';

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
  const isFocused = useIsFocused();

  const fetchUserCategories = useCallback(async () => {
    if (!categoryType) return;
    try {
      const data = await userCategoryService.getUserCategories(categoryType);
      if (!Array.isArray(data)) {
        console.error(`Invalid data format for ${categoryType} categories:`, data);
        return;
      }
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
  }, [categoryType, onTabsChange]);

  useEffect(() => {
    if (categoryType && isFocused) {
      fetchUserCategories();
    }
  }, [categoryType, isFocused, fetchUserCategories]);

  // Sync with propsTabs if provided, regardless of categoryType
  useEffect(() => {
    if (propsTabs && propsTabs.length > 0) {
      setInternalTabs(propsTabs);
    }
  }, [propsTabs]);

  const displayTabs = internalTabs || [];

  return (
    <ScrollableTab 
      tabs={displayTabs}
      activeTabId={activeTabId}
      onTabPress={(id) => onTabPress(id.toString())}
      onAddPress={onAddPress}
    />
  );
}

