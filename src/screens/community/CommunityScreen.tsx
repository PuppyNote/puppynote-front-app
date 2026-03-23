import React, { useState, useCallback, useRef, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  FlatList,
  Dimensions,
  ScrollView
} from 'react-native';
import { 
  Layout, 
  Text, 
  FloatingActionButton,
  PagedFlatList,
  PostCard
} from '../../components';
import { communityService } from '../../services/community/CommunityService';
import { Post } from '../../types/Community';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function CommunityScreen({ navigation, route }: any) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [keyword, setKeyword] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const isInternalUpdate = useRef(false);
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();

  // Hashtag suggestions logic
  useEffect(() => {
    const fetchSuggestions = async () => {
      // If keyword was set via handleHashtagPress or route params, don't show suggestions
      if (isInternalUpdate.current) {
        isInternalUpdate.current = false;
        setShowSuggestions(false);
        return;
      }

      if (keyword.length > 0) {
        try {
          const response = await communityService.getHashtags(keyword);
          setSuggestions(response.data);
          setShowSuggestions(response.data.length > 0);
        } catch (error) {
          console.error('Failed to fetch hashtags:', error);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
        setSearchQuery(''); // Clear search when input is empty
      }
    };

    const timer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timer);
  }, [keyword]);

  // Handle incoming searchTag or refresh request
  useEffect(() => {
    if (isFocused) {
      if (route.params?.searchTag) {
        const tag = route.params.searchTag;
        isInternalUpdate.current = true;
        setKeyword(tag);
        setSearchQuery(tag);
        setShowSuggestions(false);
        navigation.setParams({ searchTag: undefined });
      } else if (route.params?.refresh) {
        setRefreshKey(prev => prev + 1);
        navigation.setParams({ refresh: undefined });
      }
    }
  }, [isFocused, route.params]);

  const fetchPosts = useCallback(async (page: number) => {
    // page - 1 because API uses 0-based page
    const response = await communityService.getPosts(page - 1, 10, searchQuery);
    return {
      content: response.data.posts,
      totalPage: response.data.totalPages,
    };
  }, [searchQuery]);

  const handleHashtagPress = (tag: string) => {
    isInternalUpdate.current = true;
    setKeyword(tag);
    setSearchQuery(tag);
    setShowSuggestions(false);
  };

  const handleLikePress = async (postId: number) => {
    try {
      const response = await communityService.toggleLike(postId);
      setPosts(currentPosts => 
        currentPosts.map(post => 
          post.postId === postId 
            ? { ...post, liked: response.data.liked, likeCount: response.data.likeCount }
            : post
        )
      );
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  const handleClearSearch = () => {
    setKeyword('');
    setSearchQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const renderPostItem = ({ item }: { item: Post }) => (
    <PostCard 
      post={item} 
      onHashtagPress={handleHashtagPress}
      onPress={() => navigation.navigate('CommunityDetail', { postId: item.postId })}
      onLikePress={() => handleLikePress(item.postId)}
    />
  );

  return (
    <Layout edges={['left', 'right']} backgroundColor="#fcfaf2">
      {/* Search Bar Area */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder="해시태그를 검색해보세요"
            placeholderTextColor="#94a3b8"
            value={keyword}
            onChangeText={(text) => {
              isInternalUpdate.current = false;
              setKeyword(text);
            }}
            returnKeyType="search"
            onSubmitEditing={() => {
              isInternalUpdate.current = true;
              const cleanedKeyword = keyword.trim().replace(/^#/, '');
              setSearchQuery(cleanedKeyword);
              setShowSuggestions(false);
            }}
          />
          {keyword.length > 0 && (
            <TouchableOpacity onPress={handleClearSearch} style={styles.clearButton}>
              <Text style={styles.clearButtonText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Autocomplete Suggestions Popup */}
        {showSuggestions && (
          <View style={styles.suggestionWrapper}>
            <ScrollView 
              style={styles.suggestionList} 
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={true}
            >
              {suggestions.map((item, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.suggestionItem}
                  onPress={() => handleHashtagPress(item)}
                >
                  <Text style={styles.suggestionText}>#{item}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>


      <PagedFlatList
        key={`${searchQuery}-${refreshKey}`}
        data={posts}
        onDataChange={setPosts}
        fetchData={fetchPosts}
        renderItem={renderPostItem}
        keyExtractor={(item: any) => item.postId.toString()}
        contentContainerStyle={styles.listContent}
        noItemsText="게시물이 없습니다."
      />

      <FloatingActionButton 
        onPress={() => navigation.navigate('AddPost')} 
        icon="+"
      />
    </Layout>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#fcfaf2',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    zIndex: 100, // Ensure suggestions are on top
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0f172a',
    fontWeight: '500',
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  clearButtonText: {
    fontSize: 16,
    color: '#94a3b8',
    fontWeight: '600',
  },
  suggestionWrapper: {
    position: 'absolute',
    top: 64, // below search bar
    left: 24,
    right: 24,
    maxHeight: 200,
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    overflow: 'hidden',
  },
  suggestionList: {
    flex: 1,
  },
  suggestionItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
  },
  suggestionText: {
    fontSize: 14,
    color: '#eebd2b',
    fontWeight: '600',
  },
  listContent: {
    padding: 24,
    paddingBottom: 120,
  },
});
