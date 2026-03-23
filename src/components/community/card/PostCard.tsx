import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  Dimensions,
  LayoutAnimation,
  Platform,
  UIManager
} from 'react-native';
import { Card, Text, PhotoGallery } from '../../index';
import { Post } from '../../../types/Community';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width } = Dimensions.get('window');
const CARD_MARGIN = 24;
const CARD_PADDING = 16;
const IMAGE_WIDTH = width - (CARD_MARGIN * 2) - (CARD_PADDING * 2);

interface PostCardProps {
  post: Post;
  onPress: () => void;
  onHashtagPress?: (tag: string) => void;
  onLikePress?: () => void;
}

export default function PostCard({ post, onPress, onHashtagPress, onLikePress }: PostCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  const Header = () => (
    <View style={styles.postHeader}>
      <Image 
        source={post.userProfileUrl ? { uri: post.userProfileUrl } : require('../../../../assets/puppynote-icon.png')} 
        style={styles.profileImage} 
      />
      <View style={styles.headerInfo}>
        <Text style={styles.nickname}>{post.userNickname}</Text>
        <Text style={styles.date}>{new Date(post.createdDate).toLocaleDateString()}</Text>
      </View>
    </View>
  );

  return (
    <Card style={styles.postCard}>
      {/* 1. Header & User Info */}
      {onPress ? (
        <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
          <Header />
        </TouchableOpacity>
      ) : (
        <Header />
      )}

      {/* 2. Photos */}
      {post.imageUrls && post.imageUrls.length > 0 && (
        <View style={styles.imageSection}>
          <PhotoGallery 
            photoUrls={post.imageUrls} 
            width={IMAGE_WIDTH} 
            height={IMAGE_WIDTH}
            borderRadius={16}
            onImagePress={onPress}
          />
        </View>
      )}

      {/* 3. Content (Expandable) */}
      <TouchableOpacity activeOpacity={0.9} onPress={toggleExpand}>
        <Text 
          style={styles.content} 
          numberOfLines={isExpanded ? undefined : 3}
        >
          {post.content}
        </Text>
        {post.content.length > 60 && (
          <Text style={styles.moreText}>{isExpanded ? '접기' : '더보기'}</Text>
        )}
      </TouchableOpacity>

      {/* 4. Hashtags */}
      <View style={styles.hashtagRow}>
        {post.hashtags.map((tag, index) => (
          <TouchableOpacity 
            key={index} 
            onPress={() => onHashtagPress?.(tag)}
            activeOpacity={0.6}
          >
            <Text style={styles.hashtag}>#{tag}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 5. Footer (Like Button) */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.likeButton} 
          onPress={onLikePress}
          activeOpacity={0.6}
        >
          <Image 
            source={post.liked 
              ? require('../../../../assets/community/clicked_like.png') 
              : require('../../../../assets/community/like.png')
            } 
            style={styles.likeIcon}
            resizeMode="contain"
          />
          <Text style={[styles.likeCount, post.liked && styles.likedText]}>
            {post.likeCount}
          </Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  postCard: {
    marginBottom: 20,
    padding: 16,
    borderRadius: 24,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
  },
  headerInfo: {
    marginLeft: 12,
  },
  nickname: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  date: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  imageSection: {
    width: IMAGE_WIDTH,
    height: IMAGE_WIDTH,
    marginBottom: 16,
  },
  content: {
    fontSize: 15,
    color: '#334155',
    lineHeight: 22,
    marginBottom: 12,
  },
  moreText: {
    fontSize: 13,
    color: '#94a3b8',
    fontWeight: '600',
    marginTop: -8,
    marginBottom: 12,
  },
  hashtagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  hashtag: {
    fontSize: 13,
    color: '#eebd2b',
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 12,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  likeIcon: {
    width: 20,
    height: 20,
  },
  likeCount: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
  },
  likedText: {
    color: '#ef4444',
  },
});
