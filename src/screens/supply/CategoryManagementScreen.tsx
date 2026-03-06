import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity, 
  PanResponder,
  Animated,
  LayoutAnimation,
  UIManager,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Layout,
  Text,
  AddTopBar,
  CustomAlert,
} from '../../components';
import { petItemService } from '../../services/petItem/PetItemService';
import { userCategoryService } from '../../services/userCategory/UserCategoryService';
import { MajorCategory, Category } from '../../types/PetItem';
import { useAlert } from '../../hooks/useAlert';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ITEM_HEIGHT = 64; 

export default function CategoryManagementScreen({ navigation, route }: any) {
  const { categoryType } = route.params;
  const { alertConfig, showSimpleAlert, hideAlert } = useAlert();
  const [selectedCategories, setSelectedCategories] = useState<any[]>([]);
  const [allCategories, setAllCategories] = useState<MajorCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const title = categoryType === 'ITEM' ? '용품 카테고리 설정' : '활동 카테고리 설정';
  
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  
  const panY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const scrollY = useRef(0);
  const containerY = useRef(0);
  const sectionRef = useRef<View>(null);

  // Use refs to avoid closure issues in PanResponder
  const stateRef = useRef({ 
    draggingIndex: null as number | null, 
    selectedCategories: [] as any[], 
    scrollY: 0, 
    containerY: 0 
  });
  
  useEffect(() => {
    stateRef.current = { 
      draggingIndex, 
      selectedCategories, 
      scrollY: scrollY.current, 
      containerY: containerY.current
    };
  }, [draggingIndex, selectedCategories]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [allCats, userCats] = await Promise.all([
        petItemService.getCategories(),
        userCategoryService.getUserCategories(categoryType)
      ]);
      setAllCategories(Array.isArray(allCats) ? allCats : []);
      const userTabs = Array.isArray(userCats) ? userCats.map(cat => ({
        id: cat.category,
        label: `${cat.categoryEmoji} ${cat.categoryName}`
      })) : [];
      setSelectedCategories([{ id: 'all', label: '전체' }, ...userTabs]);
    } catch (error) {
      showSimpleAlert('오류', '데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (e, gestureState) => stateRef.current.draggingIndex !== null,
      onMoveShouldSetPanResponderCapture: (e, gestureState) => stateRef.current.draggingIndex !== null,
      onPanResponderMove: (e, gestureState) => {
        const { draggingIndex: dIdx, selectedCategories: sCats, containerY: cY, scrollY: sY } = stateRef.current;
        if (dIdx === null) return;

        // 1. Calculate finger position relative to container
        // 12 is container padding, 32 is half item height
        const relativeY = gestureState.moveY - cY + sY - 12;
        
        // 2. Position item exactly under finger relative to its CURRENT slot
        const currentSlotY = dIdx * ITEM_HEIGHT;
        const targetTranslateY = relativeY - currentSlotY - 32;
        panY.setValue(targetTranslateY);

        // 3. Reorder if moved far enough
        const newIndex = Math.max(0, Math.min(sCats.length - 1, Math.floor(relativeY / ITEM_HEIGHT)));

        if (newIndex !== dIdx && newIndex !== 0) {
          const newArr = [...sCats];
          const item = newArr.splice(dIdx, 1)[0];
          newArr.splice(newIndex, 0, item);

          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          
          stateRef.current.draggingIndex = newIndex;
          stateRef.current.selectedCategories = newArr;
          setSelectedCategories(newArr);
          setDraggingIndex(newIndex);
        }
      },
      onPanResponderRelease: () => stopDragging(),
      onPanResponderTerminate: () => stopDragging(),
    })
  ).current;

  const stopDragging = () => {
    setDraggingIndex(null);
    setScrollEnabled(true);
    Animated.parallel([
      Animated.spring(panY, { 
        toValue: 0, 
        useNativeDriver: false,
        damping: 20,
        stiffness: 250
      }),
      Animated.spring(scale, { 
        toValue: 1, 
        useNativeDriver: false,
        damping: 20,
        stiffness: 250
      })
    ]).start();
  };

  const onLongPress = (index: number) => {
    if (index === 0) return;
    
    sectionRef.current?.measureInWindow((x, y) => {
        containerY.current = y;
        setDraggingIndex(index);
        setScrollEnabled(false);
        panY.setValue(0);
        Animated.spring(scale, { 
          toValue: 1.05, 
          useNativeDriver: false,
          damping: 20,
          stiffness: 300
        }).start();
    });
  };

  const handleAddCategory = (category: Category) => {
    if (selectedCategories.find(c => c.id === category.category)) {
      showSimpleAlert('알림', '이미 추가된 카테고리입니다.');
      return;
    }
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSelectedCategories([...selectedCategories, { id: category.category, label: `${category.emoji} ${category.categoryName}` }]);
  };

  const handleRemoveCategory = (id: string) => {
    if (id === 'all') return;
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSelectedCategories(selectedCategories.filter(c => c.id !== id));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const codes = selectedCategories.filter(c => c.id !== 'all').map(c => c.id);
      await userCategoryService.saveUserCategories(categoryType, codes);
      navigation.goBack();
    } catch (error) {
      showSimpleAlert('오류', '저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <AddTopBar title={title} onBack={() => navigation.goBack()} />
      <ScrollView 
        style={styles.content} 
        scrollEnabled={scrollEnabled}
        onScroll={e => { scrollY.current = e.nativeEvent.contentOffset.y; }}
        scrollEventThrottle={16}
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>현재 카테고리 (꾹 눌러서 이동)</Text>
          <TouchableOpacity onPress={handleSave} style={[styles.saveButton, saving && styles.saveButtonDisabled]} disabled={saving}>
            <Text style={styles.saveText}>{saving ? '저장 중...' : '저장'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.selectedContainer} ref={sectionRef} {...panResponder.panHandlers}>
          {selectedCategories.map((tab, index) => {
            const isDragging = draggingIndex === index;
            return (
              <Animated.View 
                key={tab.id} 
                style={[
                  styles.selectedItem,
                  isDragging && {
                    transform: [{ translateY: panY }, { scale }],
                    zIndex: 100,
                    backgroundColor: '#fff',
                    elevation: 8,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 4.65,
                    borderRadius: 12,
                  }
                ]}
              >
                <TouchableOpacity 
                  activeOpacity={1} 
                  onLongPress={() => onLongPress(index)}
                  onPressOut={() => draggingIndex === null && Animated.spring(scale, { toValue: 1, useNativeDriver: false }).start()}
                  style={styles.itemTouchable}
                >
                  <Text style={[styles.itemLabel, tab.id === 'all' && styles.disabledText]}>{tab.label}</Text>
                  {tab.id !== 'all' && (
                    <View style={styles.itemRight}>
                      <TouchableOpacity onPress={() => handleRemoveCategory(tab.id)} style={styles.removeBtn}><Text style={styles.removeIcon}>×</Text></TouchableOpacity>
                      <Text style={styles.dragHandleText}>≡</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>추가할 수 있는 카테고리</Text>
          {loading ? <Text style={styles.loadingText}>불러오는 중...</Text> : 
            allCategories.map(major => (
              <View key={major.majorCategory} style={styles.majorCategoryGroup}>
                <View style={styles.majorHeader}><Text style={styles.majorEmoji}>{major.majorCategoryEmoji}</Text><Text style={styles.majorName}>{major.majorCategoryName}</Text></View>
                <View style={styles.categoryGrid}>
                  {major.categories.map(cat => (
                    <TouchableOpacity key={cat.category} style={[styles.categoryChip, selectedCategories.find(c => c.id === cat.category) && styles.categoryChipDisabled]} onPress={() => handleAddCategory(cat)}>
                      <Text style={styles.chipText}>{cat.emoji} {cat.categoryName}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))
          }
        </View>
        <View style={styles.spacer} />
      </ScrollView>

      <CustomAlert 
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        onConfirm={hideAlert}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcfaf2' },
  content: { flex: 1, paddingHorizontal: 24 },
  section: { marginTop: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#0f172a' },
  saveButton: { backgroundColor: '#eebd2b', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  saveButtonDisabled: { backgroundColor: '#cbd5e1' },
  saveText: { color: 'white', fontWeight: 'bold' },
  selectedContainer: { backgroundColor: 'white', borderRadius: 16, padding: 12 },
  selectedItem: { height: ITEM_HEIGHT, justifyContent: 'center', backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  itemTouchable: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, flex: 1 },
  itemLabel: { fontSize: 16, color: '#334155' },
  itemRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  dragHandleText: { fontSize: 20, color: '#cbd5e1' },
  disabledText: { color: '#94a3b8' },
  removeBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#fee2e2', justifyContent: 'center', alignItems: 'center' },
  removeIcon: { fontSize: 20, color: '#ef4444' },
  majorCategoryGroup: { marginTop: 20, backgroundColor: 'white', borderRadius: 16, padding: 16 },
  majorHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 8 },
  majorEmoji: { fontSize: 20 },
  majorName: { fontSize: 16, fontWeight: 'bold', color: '#475569' },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  categoryChip: { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#f1f5f9', borderRadius: 999 },
  categoryChipDisabled: { opacity: 0.5, backgroundColor: '#e2e8f0' },
  chipText: { fontSize: 14, color: '#334155' },
  loadingText: { marginTop: 20, textAlign: 'center', color: '#64748b' },
  spacer: { height: 40 }
});
