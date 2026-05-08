import React, { useState, useCallback, useEffect } from 'react';
import { 
  View, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet, 
  ActivityIndicator,
} from 'react-native';
import Layout from '../../components/common/item/Layout';
import { CustomText as Text } from '../../components/common/item/CustomText';
import { foodService } from '../../services/food/FoodService';
import { FoodItem } from '../../types/Food';
import { useAlert } from '../../hooks/useAlert';
import CustomAlert from '../../components/common/modal/CustomAlert';
import { Ionicons } from '@expo/vector-icons';
import Markdown from 'react-native-markdown-display';
import SearchBar from '../../components/common/item/SearchBar';

const FoodCard = ({ item, initialExpanded = false }: { item: FoodItem; initialExpanded?: boolean }) => {
  const [expanded, setExpanded] = useState(initialExpanded);

  // initialExpanded가 변경될 때 상태 업데이트 (AI 검색 후 결과가 바로 펼쳐지게 하기 위함)
  useEffect(() => {
    setExpanded(initialExpanded);
  }, [initialExpanded]);

  const getBorderColor = () => {
    switch (item.safetyLevel) {
      case 'GOOD': return '#3b82f6'; // Blue
      case 'NOTION': return '#f97316'; // Orange
      case 'BAD': return '#ef4444'; // Red
      default: return '#e2e8f0';
    }
  };

  const getSafetyText = () => {
    switch (item.safetyLevel) {
      case 'GOOD': return '안전';
      case 'NOTION': return '주의';
      case 'BAD': return '위험';
      default: return '';
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.card, { borderWidth: 2, borderColor: getBorderColor() }]} 
      onPress={() => setExpanded(!expanded)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.questionText}>Q. {item.question}</Text>
        <View style={[styles.badge, { backgroundColor: getBorderColor() }]}>
          <Text style={styles.badgeText}>{getSafetyText()}</Text>
        </View>
      </View>
      <View style={styles.answerContainer}>
        {expanded ? (
          <Markdown style={markdownStyles}>
            {item.answer}
          </Markdown>
        ) : (
          <View>
            <Text 
              style={styles.answerText} 
              numberOfLines={3}
            >
              {item.answer.replace(/[#*`]/g, '')}
            </Text>
            {item.answer.length > 100 && (
              <Text style={styles.moreText}>더보기...</Text>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default function FoodScreen() {
  const [keyword, setKeyword] = useState('');
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [isAiResult, setIsAiResult] = useState(false);
  const [showAiConfirm, setShowAiConfirm] = useState(false);
  
  const { alertConfig, showSimpleAlert, hideAlert } = useAlert();

  // 실시간 검색 (Debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      searchFoods(true);
    }, 500); // 500ms 대기 후 검색

    return () => clearTimeout(timer);
  }, [keyword]);

  const searchFoods = useCallback(async (isInitial: boolean = true) => {
    const currentPage = isInitial ? 0 : page + 1;
    
    setIsLoading(true);
    try {
      const response = await foodService.searchFoods({
        question: keyword.trim() || undefined,
        page: currentPage,
        size: 10
      });

      if (isInitial) {
        setIsAiResult(false);
        setFoods(response.content);
        if (response.content.length === 0) {
          setShowAiConfirm(true);
        }
      } else {
        setFoods(prev => [...prev, ...response.content]);
      }
      
      setTotalCount(response.totalCount);
      setPage(currentPage);
    } catch (error) {
      console.error('Food search error:', error);
      showSimpleAlert('오류', '검색 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [keyword, page, showSimpleAlert]);

  const handleAiSearch = async () => {
    setShowAiConfirm(false);
    setIsAiSearching(true);
    try {
      const result = await foodService.searchFoodAi({ question: keyword });
      setIsAiResult(true);
      setFoods([result]);
      setTotalCount(1);
    } catch (error: any) {
      console.error('AI search error:', error);
      if (error.statusCode === 400) {
        showSimpleAlert('알림', '음식과 관련 없는 질문이거나 AI가 답변할 수 없습니다.');
      } else {
        showSimpleAlert('오류', 'AI 검색 중 오류가 발생했습니다.');
      }
    } finally {
      setIsAiSearching(false);
    }
  };

  const renderFooter = () => {
    if (!isLoading) return null;
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator color="#eebd2b" />
      </View>
    );
  };

  const handleLoadMore = () => {
    if (!isLoading && foods.length < totalCount) {
      searchFoods(false);
    }
  };

  return (
    <Layout>
      <View style={styles.container}>
        <SearchBar
          placeholder="음식이름을 입력하세요."
          value={keyword}
          onChangeText={setKeyword}
          onSearch={() => searchFoods(true)}
          onClear={() => setKeyword('')}
          containerStyle={{ marginBottom: 20 }}
        />

        {isAiSearching ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#eebd2b" />
            <Text style={styles.aiSearchingText}>AI가 최적의 답변을 생성 중입니다...</Text>
          </View>
        ) : (
          <FlatList
            data={foods}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <FoodCard 
                item={item} 
                initialExpanded={isAiResult} 
              />
            )}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
            ListEmptyComponent={() => {
              if (isLoading) return null;
              
              if (keyword.trim() && foods.length === 0) {
                return (
                  <View style={styles.aiRecommendContainer}>
                    <Ionicons name="sparkles" size={48} color="#eebd2b" />
                    <Text style={styles.aiRecommendTitle}>검색 결과가 없습니다.</Text>
                    <Text style={styles.aiRecommendDescription}>
                      AI에게 물어보면 더 정확한 정보를 얻을 수 있어요!{'\n'}
                      '{keyword}'에 대해 물어볼까요?
                    </Text>
                    <TouchableOpacity 
                      style={styles.aiRecommendButton}
                      onPress={handleAiSearch}
                    >
                      <Text style={styles.aiRecommendButtonText}>AI에게 물어보기</Text>
                    </TouchableOpacity>
                  </View>
                );
              }

              return (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>궁금한 음식을 검색해보세요!</Text>
                </View>
              );
            }}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>

      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        onConfirm={hideAlert}
      />
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  listContent: {
    paddingBottom: 100,
    flexGrow: 1,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  questionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    flex: 1,
    marginRight: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  answerContainer: {
    marginTop: 4,
  },
  answerText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
  },
  moreText: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 4,
  },
  loaderContainer: {
    paddingVertical: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiSearchingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#475569',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#94a3b8',
  },
  aiRecommendContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    paddingHorizontal: 20,
  },
  aiRecommendTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginTop: 16,
  },
  aiRecommendDescription: {
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 22,
  },
  aiRecommendButton: {
    marginTop: 24,
    backgroundColor: '#eebd2b',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  aiRecommendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

const markdownStyles = StyleSheet.create({
  body: {
    color: '#475569',
    fontSize: 14,
    lineHeight: 22,
  },
  paragraph: {
    marginBottom: 8,
  },
  strong: {
    fontWeight: 'bold',
    color: '#1e293b',
  },
  bullet_list: {
    marginBottom: 8,
  },
  ordered_list: {
    marginBottom: 8,
  },
  heading1: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  heading2: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  code_inline: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 4,
    borderRadius: 4,
    color: '#ef4444',
  },
});
