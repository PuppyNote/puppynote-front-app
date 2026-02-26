import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { Layout, CustomText as Text } from '../../components';
import { storageService } from '../../services/auth/StorageService';

export default function SettingScreen({ navigation }: any) {
  const [userInfo, setUserInfo] = useState({
    nickName: '사용자',
    email: '',
    profileImage: null
  });

  useEffect(() => {
    // For now, we can try to get some info from storage or just use placeholders
    loadUserInfo();
  }, []);

  const loadUserInfo = async () => {
    // Placeholder: In a real app, you'd fetch this from an API
    // const info = await authService.getUserProfile();
  };

  const menuItems = [
    {
      id: 'family',
      title: '가족 관리',
      icon: '👨‍👩‍👧‍👦',
      onPress: () => Alert.alert('알림', '가족 관리 기능 준비 중입니다.')
    },
    // More items can be added here later
  ];

  const handleLogout = async () => {
    Alert.alert('로그아웃', '정말 로그아웃 하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      { 
        text: '로그아웃', 
        style: 'destructive',
        onPress: async () => {
          await storageService.clearTokens();
          await storageService.clearSelectedPet();
          navigation.replace('Login');
        }
      }
    ]);
  };

  return (
    <Layout edges={['top', 'left', 'right']} backgroundColor="#fcfaf2">
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.imageContainer}>
            {userInfo.profileImage ? (
              <Image source={{ uri: userInfo.profileImage }} style={styles.profileImage} />
            ) : (
              <View style={styles.placeholderImage}>
                <Text style={styles.placeholderIcon}>👤</Text>
              </View>
            )}
            <TouchableOpacity style={styles.editBadge}>
              <Text style={styles.editIcon}>⚙️</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.nickname}>{userInfo.nickName}</Text>
          <Text style={styles.email}>{userInfo.email || 'puppynote@example.com'}</Text>
        </View>

        {/* Menu Section */}
        <View style={styles.menuSection}>
          {menuItems.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.menuItem}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View style={styles.menuLeft}>
                <View style={styles.menuIconContainer}>
                  <Text style={styles.menuIcon}>{item.icon}</Text>
                </View>
                <Text style={styles.menuTitle}>{item.title}</Text>
              </View>
              <Text style={styles.arrowIcon}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>로그아웃</Text>
        </TouchableOpacity>

        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>버전 1.0.0</Text>
        </View>
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  profileSection: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  placeholderImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderIcon: {
    fontSize: 40,
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'white',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  editIcon: {
    fontSize: 16,
  },
  nickname: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#64748b',
  },
  menuSection: {
    backgroundColor: 'white',
    borderRadius: 24,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: 20,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
  },
  arrowIcon: {
    fontSize: 24,
    color: '#cbd5e1',
  },
  logoutButton: {
    marginTop: 32,
    alignItems: 'center',
    paddingVertical: 16,
  },
  logoutText: {
    fontSize: 15,
    color: '#ef4444',
    fontWeight: '600',
  },
  versionContainer: {
    marginTop: 16,
    alignItems: 'center',
    paddingBottom: 40,
  },
  versionText: {
    fontSize: 12,
    color: '#94a3b8',
  },
});
