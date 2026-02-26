import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  Alert,
  PanResponder,
  Animated,
  Vibration,
  Dimensions
} from 'react-native';
import { CustomText as Text } from '../../components/CustomText';
import { petItemService } from '../../services/petItem/PetItemService';
import { userCategoryService } from '../../services/userCategory/UserCategoryService';
import { MajorCategory, Category } from '../../types/PetItem';
import AddTopBar from '../../components/tabs/AddTopBar';

const ITEM_HEIGHT = 60; // Approximate height of each category item

export default function CategoryManagementScreen({ navigation, route }: any) {
  const { currentTabs, setTabs, categoryType } = route.params;
  const [selectedCategories, setSelectedCategories] = useState<any[]>(currentTabs);
  const [allCategories, setAllCategories] = useState<MajorCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const title = categoryType === 'ITEM' ? '용품 카테고리 설정' : '활동 카테고리 설정';
  
  // Drag and drop states
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const pan = useRef(new Animated.ValueXY()).current;
  const scrollY = useRef(0);
  const containerY = useRef(0);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await petItemService.getCategories();
      setAllCategories(data);
    } catch (error) {
      Alert.alert('오류', '카테고리를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: () => draggingIndex !== null,
      onPanResponderMove: (e, gestureState) => {
        Animated.event([null, { dy: pan.y }], { useNativeDriver: false })(e, gestureState);
        
        if (draggingIndex !== null) {
          const currentPos = gestureState.moveY - containerY.current + scrollY.current;
          const newIndex = Math.max(0, Math.min(selectedCategories.length - 1, Math.floor(currentPos / ITEM_HEIGHT)));
          
          if (newIndex !== draggingIndex && newIndex !== 0) { // Don't move 'all' (index 0)
            const newArr = [...selectedCategories];
            const item = newArr.splice(draggingIndex, 1)[0];
            newArr.splice(newIndex, 0, item);
            setSelectedCategories(newArr);
            setDraggingIndex(newIndex);
            Vibration.vibrate(10);
          }
        }
      },
      onPanResponderRelease: () => {
        setDraggingIndex(null);
        setScrollEnabled(true);
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderTerminate: () => {
        setDraggingIndex(null);
        setScrollEnabled(true);
        pan.setValue({ x: 0, y: 0 });
      },
    })
  ).current;

  const onLongPress = (index: number) => {
    if (index === 0) return; // Can't move 'all'
    Vibration.vibrate(50);
    setDraggingIndex(index);
    setScrollEnabled(false);
  };

  const handleAddCategory = (category: Category) => {
    if (selectedCategories.find(c => c.id === category.category)) {
      Alert.alert('알림', '이미 추가된 카테고리입니다.');
      return;
    }
    const newTab = {
      id: category.category,
      label: `${category.emoji} ${category.categoryName}`
    };
    setSelectedCategories([...selectedCategories, newTab]);
  };

  const handleRemoveCategory = (id: string) => {
    if (id === 'all') {
      Alert.alert('알림', '"전체" 카테고리는 삭제할 수 없습니다.');
      return;
    }
    setSelectedCategories(selectedCategories.filter(c => c.id !== id));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const categoryCodes = selectedCategories
        .filter(c => c.id !== 'all')
        .map(c => c.id);
      
      await userCategoryService.saveUserCategories(categoryType, categoryCodes);
      
      setTabs(selectedCategories);
      navigation.goBack();
    } catch (error) {
      Alert.alert('오류', '카테고리 저장에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <AddTopBar title={title} onBack={() => navigation.goBack()} />
      
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        scrollEnabled={scrollEnabled}
        onScroll={(e) => { scrollY.current = e.nativeEvent.contentOffset.y; }}
        scrollEventThrottle={16}
      >
        <View 
          style={styles.section}
          onLayout={(e) => { containerY.current = e.nativeEvent.layout.y + 100; }} // Adjust for header
          {...panResponder.panHandlers}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>현재 카테고리 (꾹 눌러서 이동)</Text>
            <TouchableOpacity 
              onPress={handleSave} 
              style={[styles.saveButton, saving && styles.saveButtonDisabled]}
              disabled={saving}
            >
              <Text style={styles.saveText}>{saving ? '저장 중...' : '저장'}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.selectedContainer}>
            {selectedCategories.map((tab, index) => {
              const isDragging = draggingIndex === index;
              return (
                <Animated.View 
                  key={tab.id} 
                  style={[
                    styles.selectedItem,
                    isDragging && {
                      transform: [{ translateY: pan.y }],
                      zIndex: 100,
                      backgroundColor: '#fff',
                      elevation: 5,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.25,
                      shadowRadius: 3.84,
                    }
                  ]}
                >
                  <TouchableOpacity 
                    activeOpacity={0.9}
                    onLongPress={() => onLongPress(index)}
                    style={styles.itemTouchable}
                    disabled={tab.id === 'all'}
                  >
                    <View style={styles.itemInfo}>
                      <Text style={[styles.itemLabel, tab.id === 'all' && styles.disabledText]}>
                        {tab.id === 'all' ? '🏠 전체' : tab.label}
                      </Text>
                    </View>
                    {tab.id !== 'all' && (
                      <TouchableOpacity onPress={() => handleRemoveCategory(tab.id)} style={styles.removeBtn}>
                        <Text style={styles.removeIcon}>×</Text>
                      </TouchableOpacity>
                    )}
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>추가할 수 있는 카테고리</Text>
          {loading ? (
            <Text style={styles.loadingText}>불러오는 중...</Text>
          ) : (
            allCategories.map((major) => (
              <View key={major.majorCategory} style={styles.majorCategoryGroup}>
                <View style={styles.majorHeader}>
                  <Text style={styles.majorEmoji}>{major.majorCategoryEmoji}</Text>
                  <Text style={styles.majorName}>{major.majorCategoryName}</Text>
                </View>
                <View style={styles.categoryGrid}>
                  {major.categories.map((cat) => (
                    <TouchableOpacity 
                      key={cat.category} 
                      style={[
                        styles.categoryChip,
                        selectedCategories.find(c => c.id === cat.category) && styles.categoryChipDisabled
                      ]}
                      onPress={() => handleAddCategory(cat)}
                    >
                      <Text style={styles.chipText}>{cat.emoji} {cat.categoryName}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))
          )}
        </View>
        <View style={styles.spacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fcfaf2',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  saveButton: {
    backgroundColor: '#eebd2b',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonDisabled: {
    backgroundColor: '#cbd5e1',
  },
  saveText: {
    color: 'white',
    fontWeight: 'bold',
  },
  selectedContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 12,
    gap: 0,
  },
  selectedItem: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  itemTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    flex: 1,
  },
  itemInfo: {
    flex: 1,
  },
  itemLabel: {
    fontSize: 16,
    color: '#334155',
  },
  disabledText: {
    color: '#94a3b8',
  },
  removeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#fee2e2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeIcon: {
    fontSize: 20,
    color: '#ef4444',
    lineHeight: 20,
  },
  majorCategoryGroup: {
    marginTop: 20,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
  },
  majorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  majorEmoji: {
    fontSize: 20,
  },
  majorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#475569',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 999,
  },
  categoryChipDisabled: {
    opacity: 0.5,
    backgroundColor: '#e2e8f0',
  },
  chipText: {
    fontSize: 14,
    color: '#334155',
  },
  loadingText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#64748b',
  },
  spacer: {
    height: 40,
  }
});
