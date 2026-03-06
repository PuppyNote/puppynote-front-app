import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import { Layout, Text, CustomAlert, AlertSettingModal, UserProfileModal } from '../../components';
import { authService, UserProfile } from '../../services/auth/AuthService';
import { storageService } from '../../services/auth/StorageService';
import { useAlert } from '../../hooks/useAlert';

export default function SettingScreen({ navigation }: any) {
  const { alertConfig, showAlert, showSimpleAlert, hideAlert } = useAlert();
  const [isAlertSettingModalVisible, setIsAlertSettingModalVisible] = useState(false);
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setIsLoading(true);
      const profile = await authService.getProfile();
      setUserProfile(profile);
    } catch (error) {
      console.error('Failed to load user profile:', error);
      showSimpleAlert('오류', '프로필 정보를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const menuItems = [
    {
      id: 'profile',
      title: '내 프로필 수정',
      icon: '👤',
      onPress: () => setIsProfileModalVisible(true)
    },
    {
      id: 'family',
      title: '가족 관리',
      icon: '👨‍👩‍👧‍👦',
      onPress: () => navigation.navigate('FamilyManagement')
    },
    {
      id: 'notification',
      title: '알림 설정',
      icon: '🔔',
      onPress: () => setIsAlertSettingModalVisible(true)
    },
  ];

  const handleLogout = async () => {
    showAlert({
      title: '로그아웃',
      message: '정말 로그아웃 하시겠습니까?',
      confirmText: '로그아웃',
      cancelText: '취소',
      onConfirm: async () => {
        hideAlert();
        await storageService.clearTokens();
        await storageService.clearSelectedPet();
        navigation.replace('Login');
      },
      onCancel: hideAlert,
      type: 'info'
    });
  };

  return (
    <Layout edges={['top', 'left', 'right', 'bottom']} backgroundColor="#fcfaf2">
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topSection}>
          {/* Profile Section */}
          <View style={styles.profileSection}>
            <View style={styles.imageContainer}>
              {userProfile?.profileUrl ? (
                <Image source={{ uri: userProfile.profileUrl }} style={styles.profileImage} />
              ) : (
                <View style={styles.placeholderImage}>
                  <Text style={styles.placeholderIcon}>👤</Text>
                </View>
              )}
              <TouchableOpacity 
                style={styles.editBadge}
                onPress={() => setIsProfileModalVisible(true)}
              >
                <Text style={styles.editIcon}>⚙️</Text>
              </TouchableOpacity>
            </View>
            {isLoading ? (
              <ActivityIndicator size="small" color="#eebd2b" />
            ) : (
              <>
                <Text style={styles.nickname}>{userProfile?.nickName || '집사님'}</Text>
                <Text style={styles.email}>{userProfile?.email || 'puppynote@example.com'}</Text>
              </>
            )}
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
        </View>

        <View style={styles.bottomSection}>
          <TouchableOpacity style={styles.prettyLogoutButton} onPress={handleLogout} activeOpacity={0.8}>
            <Text style={styles.prettyLogoutText}>로그아웃</Text>
          </TouchableOpacity>

          <View style={styles.versionContainer}>
            <Text style={styles.versionText}>버전 1.0.0</Text>
          </View>
        </View>
      </ScrollView>

      <AlertSettingModal 
        visible={isAlertSettingModalVisible}
        onClose={() => setIsAlertSettingModalVisible(false)}
      />

      <UserProfileModal
        visible={isProfileModalVisible}
        initialData={userProfile}
        onClose={() => setIsProfileModalVisible(false)}
        onSuccess={() => {
          setIsProfileModalVisible(false);
          loadUserProfile();
        }}
      />

      <CustomAlert 
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        confirmText={alertConfig.confirmText}
        cancelText={alertConfig.cancelText}
        onConfirm={alertConfig.onConfirm}
        onCancel={alertConfig.onCancel}
        type={alertConfig.type}
      />
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  topSection: {
    paddingTop: 16, // 40에서 16으로 감소
  },
  bottomSection: {
    marginTop: 24, // 40에서 24로 감소
    gap: 16,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 24, // 40에서 24로 감소
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
  prettyLogoutButton: {
    backgroundColor: '#fee2e2',
    paddingVertical: 10, // 16에서 10으로 감소
    paddingHorizontal: 24, // 가로 패딩 추가
    borderRadius: 999, // 둥근 모양으로 변경
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#fecaca',
    alignSelf: 'center', // 가운데 정렬
    minWidth: 100, // 최소 너비 설정
  },
  prettyLogoutText: {
    fontSize: 14, // 16에서 14로 감소
    color: '#ef4444',
    fontWeight: 'bold',
  },
  versionContainer: {
    alignItems: 'center',
  },
  versionText: {
    fontSize: 12,
    color: '#94a3b8',
  },
});
