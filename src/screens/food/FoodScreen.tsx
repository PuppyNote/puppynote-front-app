import React, { useState, useCallback, useEffect } from 'react';
import { 
  View, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet, 
  ActivityIndicator,
} from 'react-native';
import {
  Layout,
  Card,
  Text,
  SearchBar,
  CustomAlert,
} from '../../components';
import { foodService } from '../../services/food/FoodService';
import { FoodItem } from '../../types/Food';
import { useAlert } from '../../hooks/useAlert';
import { Ionicons } from '@expo/vector-icons';
import Markdown from 'react-native-markdown-display';

const FoodCard = ({ item, initialExpanded = false }: { item: FoodItem; initialExpanded?: boolean }) => {
  const [expanded, setExpanded] = useState(initialExpanded);

  useEffect(() => {
    setExpanded(initialExpanded);
  }, [initialExpanded]);

  const getStatusInfo = () => {
    switch (item.safetyLevel) {
      case 'GOOD': return { border: styles.borderSuccess, bg: styles.bgSuccess, icon: '🐾', text: '안전' };
      case 'NOTION': return { border: styles.borderWarning, bg: styles.bgWarning, icon: '⚠️', text: '주의' };
      case 'BAD': return { border: styles.borderError, bg: styles.bgError, icon: '🚨', text: '위험' };
      default: return { border: {}, bg: {}, icon: '?', text: '' };
    }
  };

  const status = getStatusInfo();

  return (
    <TouchableOpacity 
      activeOpacity={0.7} 
      onPress={() => setExpanded(!expanded)}
    >
      <Card style={[styles.foodSummaryCard, status.border]}>
        <View style={styles.foodSummaryContent}>
          <View style={styles.cardMainRow}>
            <View style={styles.cardTextContent}>
              <Text style={styles.foodSummaryLabel}>{status.text}</Text>
              <Text style={styles.foodSummaryValue}>{item.question}</Text>
            </View>
            <View style={styles.statusContainer}>
              <View style={[styles.foodStatusIndicator, status.bg]}>
                <Text style={styles.foodStatusIcon}>{status.icon}</Text>
              </View>
            </View>
          </View>

          {expanded ? (
            <View style={styles.answerContainer}>
              <View style={styles.divider} />
              <Markdown style={markdownStyles}>
                {item.answer}
              </Markdown>
              <View style={styles.collapseButton}>
                <Ionicons name="chevron-up" size={20} color="#94a3b8" />
              </View>
            </View>
          ) : (
            item.answer.length > 0 && (
              <View style={styles.answerContainer}>
                <View style={styles.divider} />
                <Text style={styles.answerSummary} numberOfLines={2}>
                  {item.answer.replace(/[#*`]/g, '')}
                </Text>
                {item.answer.length > 60 && (
                  <View style={styles.moreContainer}>
                    <Ionicons name="chevron-down" size={20} color="#94a3b8" />
                  </View>
                )}
              </View>
            )
          )}
        </View>
      </Card>
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

  useEffect(() => {
    const timer = setTimeout(() => {
      searchFoods(true);
    }, 500);
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
        if (response.content.length === 0) setShowAiConfirm(true);
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
    if (!isLoading && foods.length < totalCount) searchFoods(false);
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
            renderItem={({ item }) => <FoodCard item={item} initialExpanded={isAiResult} />}
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
                    <Text style={styles.aiRecommendDescription}>AI에게 물어보면 더 정확한 정보를 얻을 수 있어요!{'\n'}'{keyword}'에 대해 물어볼까요?</Text>
                    <TouchableOpacity style={styles.aiRecommendButton} onPress={handleAiSearch}>
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
      <CustomAlert visible={alertConfig.visible} title={alertConfig.title} message={alertConfig.message} onConfirm={hideAlert} />
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
  listContent: { paddingBottom: 100, flexGrow: 1 },
  foodSummaryCard: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: 'white',
    borderRadius: 28,
    marginBottom: 16,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    borderColor: '#f1f5f9',
  },
  foodSummaryContent: {},
  cardMainRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTextContent: { flex: 1, marginRight: 12 },
  foodSummaryLabel: { fontSize: 13, color: '#64748b', fontWeight: '700', marginBottom: 4 },
  foodSummaryValue: { fontSize: 18, fontWeight: 'bold', color: '#0f172a' },
  statusContainer: { alignItems: 'center', justifyContent: 'center' },
  foodStatusIndicator: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  foodStatusIcon: { fontSize: 22 },
  borderSuccess: { borderColor: '#22c55e' },
  borderWarning: { borderColor: '#f97316' },
  borderError: { borderColor: '#ef4444' },
  bgSuccess: { backgroundColor: '#f0fdf4' },
  bgWarning: { backgroundColor: '#fff7ed' },
  bgError: { backgroundColor: '#fef2f2' },
  answerContainer: { marginTop: 12 },
  divider: { height: 1, backgroundColor: '#f1f5f9', marginBottom: 12 },
  answerSummary: { fontSize: 14, color: '#475569', lineHeight: 20 },
  moreContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 12 },
  collapseButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 16, paddingVertical: 8 },
  loaderContainer: { paddingVertical: 20 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  aiSearchingText: { marginTop: 16, fontSize: 16, color: '#475569' },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 60 },
  emptyText: { fontSize: 16, color: '#94a3b8' },
  aiRecommendContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 40, paddingHorizontal: 20 },
  aiRecommendTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e293b', marginTop: 16 },
  aiRecommendDescription: { fontSize: 15, color: '#64748b', textAlign: 'center', marginTop: 8, lineHeight: 22 },
  aiRecommendButton: { marginTop: 24, backgroundColor: '#eebd2b', paddingHorizontal: 24, paddingVertical: 14, borderRadius: 12, width: '100%', alignItems: 'center' },
  aiRecommendButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

const markdownStyles = StyleSheet.create({
  body: { color: '#475569', fontSize: 14, lineHeight: 22 },
  paragraph: { marginBottom: 8 },
  strong: { fontWeight: 'bold', color: '#1e293b' },
  bullet_list: { marginBottom: 8 },
  ordered_list: { marginBottom: 8 },
  heading1: { fontSize: 20, fontWeight: 'bold', color: '#1e293b', marginBottom: 8 },
  heading2: { fontSize: 18, fontWeight: 'bold', color: '#1e293b', marginBottom: 8 },
  code_inline: { backgroundColor: '#f1f5f9', paddingHorizontal: 4, borderRadius: 4, color: '#ef4444' },
});
