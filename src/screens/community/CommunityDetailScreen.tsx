import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  Image, 
  Dimensions, 
  ActivityIndicator,
  Alert
} from 'react-native';
import { 
  Layout, 
  Text, 
  Card,
  Badge
} from '../../components';
import { communityService } from '../../services/community/CommunityService';
import { Post } from '../../types/Community';

const { width } = Dimensions.get('window');

export default function CommunityDetailScreen({ route, navigation }: any) {
  const { postId } = route.params;
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPost();
  }, [postId]);

  const loadPost = async () => {
    try {
      setIsLoading(true);
      const response = await communityService.getPostById(postId);
      setPost(response.data);
    } catch (error: any) {
      Alert.alert('오류', error.message || '게시물을 불러오는데 실패했습니다.');
      navigation.goBack();
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Layout edges={['bottom', 'left', 'right']} backgroundColor="#fcfaf2" style={styles.center}>
        <ActivityIndicator color="#eebd2b" size="large" />
      </Layout>
    );
  }

  if (!post) return null;

  return (
    <Layout edges={['bottom', 'left', 'right']} backgroundColor="#fcfaf2">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.userSection}>
          <Image 
            source={post.userProfileUrl ? { uri: post.userProfileUrl } : require('../../../assets/puppynote-icon.png')} 
            style={styles.profileImage} 
          />
          <View style={styles.userInfo}>
            <Text style={styles.nickname}>{post.userNickname}</Text>
            <Text style={styles.date}>{new Date(post.createdDate).toLocaleString()}</Text>
          </View>
        </View>

        {post.imageUrls && post.imageUrls.length > 0 && (
          <ScrollView 
            horizontal 
            pagingEnabled 
            showsHorizontalScrollIndicator={false}
            style={styles.imageScroll}
          >
            {post.imageUrls.map((url, index) => (
              <Image 
                key={index} 
                source={{ uri: url }} 
                style={styles.detailImage} 
                resizeMode="cover"
              />
            ))}
          </ScrollView>
        )}

        <View style={styles.contentSection}>
          <Text style={styles.content}>{post.content}</Text>
          
          <View style={styles.hashtagRow}>
            {post.hashtags.map((tag, index) => (
              <TouchableOpacity key={index}>
                <Text style={styles.hashtag}>#{tag}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.footer} />
      </ScrollView>
    </Layout>
  );
}

// Add TouchableOpacity to imports
import { TouchableOpacity } from 'react-native';

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f1f5f9',
  },
  userInfo: {
    marginLeft: 16,
  },
  nickname: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  date: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 4,
  },
  imageScroll: {
    width: width,
    height: width,
  },
  detailImage: {
    width: width,
    height: width,
    backgroundColor: '#f1f5f9',
  },
  contentSection: {
    padding: 24,
  },
  content: {
    fontSize: 16,
    color: '#334155',
    lineHeight: 26,
    marginBottom: 20,
  },
  hashtagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  hashtag: {
    fontSize: 15,
    color: '#eebd2b',
    fontWeight: '600',
  },
  footer: {
    height: 60,
  },
});
