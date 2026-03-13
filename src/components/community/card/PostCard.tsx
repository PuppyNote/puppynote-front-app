import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  Dimensions,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent
} from 'react-native';
import { Card, Text } from '../../index';
import { Post } from '../../../types/Community';

const { width } = Dimensions.get('window');
const CARD_MARGIN = 24;
const CARD_PADDING = 16;
const IMAGE_WIDTH = width - (CARD_MARGIN * 2) - (CARD_PADDING * 2);

interface PostCardProps {
  post: Post;
  onPress: () => void;
  onHashtagPress?: (tag: string) => void;
}

export default function PostCard({ post, onPress, onHashtagPress }: PostCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const hasMultipleImages = post.imageUrls && post.imageUrls.length > 1;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / IMAGE_WIDTH);
    setCurrentImageIndex(index);
  };

  return (
    <Card style={styles.postCard}>
      {/* 1. Header & User Info (Clickable) */}
      <TouchableOpacity activeOpacity={0.7} onPress={onPress} style={styles.postHeader}>
        <Image 
          source={post.userProfileUrl ? { uri: post.userProfileUrl } : require('../../../../assets/puppynote-icon.png')} 
          style={styles.profileImage} 
        />
        <View style={styles.headerInfo}>
          <Text style={styles.nickname}>{post.userNickname}</Text>
          <Text style={styles.date}>{new Date(post.createdDate).toLocaleDateString()}</Text>
        </View>
      </TouchableOpacity>

      {/* 2. Photos (Slider) */}
      {post.imageUrls && post.imageUrls.length > 0 && (
        <View style={styles.imageSection}>
          {hasMultipleImages ? (
            <ScrollView 
              horizontal 
              pagingEnabled 
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              decelerationRate="fast"
            >
              {post.imageUrls.map((url, index) => (
                <TouchableOpacity 
                  key={index} 
                  activeOpacity={1} 
                  onPress={onPress}
                >
                  <Image 
                    source={{ uri: url }} 
                    style={styles.postImage} 
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <TouchableOpacity activeOpacity={1} onPress={onPress}>
              <Image 
                source={{ uri: post.imageUrls[0] }} 
                style={styles.postImage} 
                resizeMode="cover"
              />
            </TouchableOpacity>
          )}
          {hasMultipleImages && (
            <View style={styles.imageBadge}>
              <Text style={styles.imageBadgeText}>{currentImageIndex + 1}/{post.imageUrls.length}</Text>
            </View>
          )}
        </View>
      )}

      {/* 3. Content (Clickable) */}
      <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
        <Text style={styles.content} numberOfLines={3}>{post.content}</Text>
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
    height: IMAGE_WIDTH * 0.7,
    marginBottom: 16,
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
  },
  postImage: {
    width: IMAGE_WIDTH,
    height: IMAGE_WIDTH * 0.7,
    backgroundColor: '#f1f5f9',
  },
  imageBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
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
  content: {
    fontSize: 15,
    color: '#334155',
    lineHeight: 22,
    marginBottom: 12,
  },
  hashtagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  hashtag: {
    fontSize: 13,
    color: '#eebd2b',
    fontWeight: '700',
  },
});
