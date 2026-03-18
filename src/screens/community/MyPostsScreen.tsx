import React, { useState, useCallback } from 'react';
import { 
  StyleSheet, 
  Dimensions,
} from 'react-native';
import { 
  Layout, 
  PagedFlatList,
  PostCard,
  TopBar
} from '../../components';
import { communityService } from '../../services/community/CommunityService';
import { Post } from '../../types/Community';

const { width } = Dimensions.get('window');

export default function MyPostsScreen({ navigation, route }: any) {
  const [posts, setPosts] = useState<Post[]>([]);

  const fetchMyPosts = useCallback(async (page: number) => {
    // page - 1 because API uses 0-based page
    const response = await communityService.getMyPosts(page - 1, 10);
    return {
      content: response.data.posts,
      totalPage: response.data.totalPages,
    };
  }, []);

  const handleHashtagPress = (tag: string) => {
    // Navigate to Community Tab and search for this hashtag
    navigation.navigate('MainTabs', { 
      screen: 'Community', 
      params: { searchTag: tag } 
    });
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
      <TopBar 
        title="내 게시물" 
        onBack={() => navigation.goBack()} 
        navigation={navigation}
        route={route}
      />
      
      <PagedFlatList
        data={posts}
        onDataChange={setPosts}
        fetchData={fetchMyPosts}
        renderItem={renderPostItem}
        keyExtractor={(item: any) => item.postId.toString()}
        contentContainerStyle={styles.listContent}
        noItemsText="작성한 게시물이 없습니다."
      />
    </Layout>
  );
}

const styles = StyleSheet.create({
  listContent: {
    padding: 24,
    paddingBottom: 40,
  },
});
