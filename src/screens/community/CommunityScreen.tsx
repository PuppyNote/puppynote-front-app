import React, { useState, useCallback, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  FlatList,
  Dimensions
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

const { width } = Dimensions.get('window');

export default function CommunityScreen({ navigation }: any) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [keyword, setKeyword] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const insets = useSafeAreaInsets();
  const listRef = useRef<any>(null);

  const fetchPosts = useCallback(async (page: number) => {
    // page - 1 because API uses 0-based page
    const response = await communityService.getPosts(page - 1, 10, searchQuery);
    return {
      content: response.data.posts,
      totalPage: response.data.totalPages,
    };
  }, [searchQuery]);

  const handleSearch = () => {
    setSearchQuery(keyword);
  };

  const handleHashtagPress = (tag: string) => {
    setKeyword(tag);
    setSearchQuery(tag);
  };

  const renderPostItem = ({ item }: { item: Post }) => (
    <PostCard 
      post={item} 
      onPress={() => navigation.navigate('CommunityDetail', { postId: item.postId })} 
      onHashtagPress={handleHashtagPress}
    />
  );

  return (
    <Layout edges={['left', 'right']} backgroundColor="#fcfaf2">
      {/* Search Bar Area (Replacing PetTab) */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder="장소를 검색해보세요"
            placeholderTextColor="#94a3b8"
            value={keyword}
            onChangeText={setKeyword}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
            <Text style={styles.searchIcon}>🔍</Text>
          </TouchableOpacity>
        </View>
      </View>

      <PagedFlatList
        key={searchQuery} // Force re-render/re-fetch on search
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
  searchButton: {
    padding: 4,
  },
  searchIcon: {
    fontSize: 18,
  },
  listContent: {
    padding: 24,
    paddingBottom: 120,
  },
});
