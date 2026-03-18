import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  Image, 
  Dimensions, 
  ActivityIndicator,
  Alert,
  TouchableOpacity
} from 'react-native';
import { 
  Layout, 
  Text, 
  Card,
  Badge,
  CustomAlert
} from '../../components';
import { communityService } from '../../services/community/CommunityService';
import { authService, UserProfile } from '../../services/auth/AuthService';
import { Post } from '../../types/Community';
import { useAlert } from '../../hooks/useAlert';
import { useIsFocused } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function CommunityDetailScreen({ route, navigation }: any) {
  const { postId } = route.params;
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const { alertConfig, showAlert, showSimpleAlert, hideAlert } = useAlert();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      loadData();
    }
  }, [postId, isFocused]);

  const loadData = async () => {
    try {
      // Don't show full loading if we already have data (for smoother refresh)
      if (!post) setIsLoading(true);
      const [postRes, userProfile] = await Promise.all([
        communityService.getPostById(postId),
        authService.getProfile().catch(() => null)
      ]);
      setPost(postRes.data);
      setCurrentUser(userProfile);
    } catch (error: any) {
      Alert.alert('오류', error.message || '게시물을 불러오는데 실패했습니다.');
      navigation.goBack();
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    showAlert({
      title: '게시물 삭제',
      message: '정말로 이 게시물을 삭제하시겠습니까?',
      confirmText: '삭제',
      cancelText: '취소',
      onConfirm: async () => {
        hideAlert();
        try {
          await communityService.deletePost(postId);
          showSimpleAlert('성공', '게시물이 삭제되었습니다.', () => {
            navigation.navigate('MainTabs', { 
              screen: 'Community', 
              params: { refresh: true } 
            });
          });
        } catch (error: any) {
          showSimpleAlert('오류', error.message || '삭제에 실패했습니다.');
        }
      },
      onCancel: hideAlert,
    });
  };

  const handleEdit = () => {
    if (post) {
      navigation.navigate('AddPost', { editPost: post });
    }
  };

  if (isLoading) {
    return (
      <Layout edges={['left', 'right']} backgroundColor="#fcfaf2" style={styles.center}>
        <ActivityIndicator color="#eebd2b" size="large" />
      </Layout>
    );
  }

  if (!post) return null;

  // Compare using userId for better robustness
  const isOwner = currentUser && currentUser.userId === post.userId;

  return (
    <Layout edges={['left', 'right']} backgroundColor="#fcfaf2">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerRow}>
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

          {isOwner && (
            <View style={styles.actionButtons}>
              <TouchableOpacity onPress={handleEdit} style={styles.actionBtn}>
                <Text style={styles.editBtnText}>수정</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDelete} style={styles.actionBtn}>
                <Text style={styles.deleteBtnText}>삭제</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {post.imageUrls && post.imageUrls.length > 0 && (
          <View style={styles.imageContainer}>
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
            {post.imageUrls.length > 1 && (
              <View style={styles.imageBadge}>
                <Text style={styles.imageBadgeText}>1/{post.imageUrls.length}</Text>
              </View>
            )}
          </View>
        )}

        <View style={styles.contentSection}>
          <Text style={styles.content}>{post.content}</Text>
          
          <View style={styles.hashtagRow}>
            {post.hashtags.map((tag, index) => (
              <TouchableOpacity 
                key={index}
                onPress={() => navigation.navigate('MainTabs', { 
                  screen: 'Community', 
                  params: { searchTag: tag } 
                })}
              >
                <Text style={styles.hashtag}>#{tag}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.footer} />
      </ScrollView>

      <CustomAlert 
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        confirmText={alertConfig.confirmText}
        cancelText={alertConfig.cancelText}
        onConfirm={alertConfig.onConfirm}
        onCancel={hideAlert}
      />
    </Layout>
  );
}

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 24,
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
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  editBtnText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  deleteBtnText: {
    fontSize: 12,
    color: '#ef4444',
    fontWeight: '600',
  },
  imageContainer: {
    position: 'relative',
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
  imageBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  imageBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
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

