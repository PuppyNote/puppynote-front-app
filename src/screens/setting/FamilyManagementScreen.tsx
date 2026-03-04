import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, ScrollView, TextInput, ActivityIndicator, FlatList, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Layout, Text, Badge, CustomAlert } from '../../components';
import { familyService, FamilyMember, SearchedUser } from '../../services/family/FamilyService';
import { useAlert } from '../../hooks/useAlert';

export default function FamilyManagementScreen() {
  const { alertConfig, showAlert, showSimpleAlert, hideAlert } = useAlert();
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [searchEmail, setSearchEmail] = useState('');
  const [searchedUsers, setSearchedUsers] = useState<SearchedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isInviting, setIsInviting] = useState(false);

  const loadFamilyMembers = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setIsLoading(true);
      const members = await familyService.getFamilyMembers();
      setFamilyMembers(members);
    } catch (error) {
      console.error('Failed to load family members:', error);
      showSimpleAlert('오류', '가족 목록을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadFamilyMembers(false);
    }, [loadFamilyMembers])
  );

  const onRefresh = () => {
    setIsRefreshing(true);
    loadFamilyMembers(false);
  };

  const handleSearch = async () => {
    if (!searchEmail.trim()) {
      showSimpleAlert('알림', '검색할 이메일을 입력해주세요.');
      return;
    }

    try {
      setIsSearching(true);
      const users = await familyService.searchUsers(searchEmail);
      setSearchedUsers(users);
      if (users.length === 0) {
        showSimpleAlert('알림', '검색된 유저가 없습니다.');
      }
    } catch (error) {
      showSimpleAlert('오류', '유저 검색에 실패했습니다.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleInvite = (user: SearchedUser) => {
    showAlert({
      title: '가족 초대',
      message: `${user.nickName}님을 가족으로 초대하시겠습니까?`,
      confirmText: '초대하기',
      cancelText: '취소',
      onConfirm: async () => {
        hideAlert();
        try {
          setIsInviting(true);
          await familyService.inviteFamilyMember(user.userId);
          showSimpleAlert('성공', '초대를 보냈습니다. 상대방이 수락하면 가족으로 등록됩니다.');
          setSearchedUsers([]);
          setSearchEmail('');
        } catch (error) {
          showSimpleAlert('오류', '초대 발송에 실패했습니다.');
        } finally {
          setIsInviting(false);
        }
      },
      onCancel: hideAlert,
    });
  };

  const renderFamilyItem = ({ item }: { item: FamilyMember }) => (
    <View style={styles.memberItem}>
      <View style={styles.memberImageContainer}>
        {item.profileUrl ? (
          <Image source={{ uri: item.profileUrl }} style={styles.memberImage} />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderIcon}>👤</Text>
          </View>
        )}
      </View>
      <View style={styles.memberInfo}>
        <View style={styles.nameRow}>
          <Text style={styles.memberName}>{item.nickName}</Text>
          <Badge 
            label={item.role === 'OWNER' ? '주인' : '가족'} 
            variant={item.role === 'OWNER' ? 'warning' : 'neutral'} 
          />
        </View>
        <Text style={styles.memberStatus}>{item.status === 'DONE' ? '등록 완료' : '수락 대기 중'}</Text>
      </View>
    </View>
  );

  const renderSearchedUserItem = ({ item }: { item: SearchedUser }) => (
    <TouchableOpacity 
      style={styles.searchItem} 
      onPress={() => handleInvite(item)}
      disabled={isInviting}
    >
      <View style={styles.searchImageContainer}>
        {item.profileUrl ? (
          <Image source={{ uri: item.profileUrl }} style={styles.searchImage} />
        ) : (
          <View style={[styles.placeholderImage, { width: 44, height: 44 }]}>
            <Text style={[styles.placeholderIcon, { fontSize: 20 }]}>👤</Text>
          </View>
        )}
      </View>
      <View style={styles.searchInfo}>
        <Text style={styles.searchName}>{item.nickName}</Text>
        <Text style={styles.searchEmail}>{item.email}</Text>
      </View>
      <View style={styles.inviteButton}>
        <Text style={styles.inviteButtonText}>초대</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <Layout edges={['left', 'right']} backgroundColor="#fcfaf2">
      <View style={styles.container}>
        {/* Search Section */}
        <View style={styles.searchSection}>
          <Text style={styles.sectionTitle}>새로운 가족 초대 📩</Text>
          <View style={styles.searchBar}>
            <TextInput
              style={styles.searchInput}
              placeholder="이메일로 유저 검색"
              value={searchEmail}
              onChangeText={setSearchEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <TouchableOpacity 
              style={styles.searchButton} 
              onPress={handleSearch}
              disabled={isSearching}
            >
              {isSearching ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text style={styles.searchButtonText}>검색</Text>
              )}
            </TouchableOpacity>
          </View>

          {searchedUsers.length > 0 && (
            <View style={styles.searchResults}>
              <FlatList
                data={searchedUsers}
                renderItem={renderSearchedUserItem}
                keyExtractor={(item) => `search-${item.userId}`}
                scrollEnabled={false}
              />
            </View>
          )}
        </View>

        {/* Family List Section */}
        <View style={styles.listSection}>
          <Text style={styles.sectionTitle}>함께하는 가족 👨‍👩‍👧‍👦</Text>
          {isLoading ? (
            <ActivityIndicator color="#eebd2b" size="large" style={{ marginTop: 40 }} />
          ) : (
            <FlatList
              data={familyMembers}
              renderItem={renderFamilyItem}
              keyExtractor={(item) => `family-${item.userId}`}
              refreshControl={
                <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} color="#eebd2b" />
              }
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>등록된 가족이 없습니다.</Text>
                </View>
              }
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          )}
        </View>
      </View>

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
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 16,
  },
  searchSection: {
    marginBottom: 32,
  },
  searchBar: {
    flexDirection: 'row',
    gap: 12,
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    fontSize: 15,
  },
  searchButton: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  searchResults: {
    marginTop: 12,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 8,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  searchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
  },
  searchImageContainer: {
    marginRight: 12,
  },
  searchImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  searchInfo: {
    flex: 1,
  },
  searchName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#334155',
  },
  searchEmail: {
    fontSize: 12,
    color: '#94a3b8',
  },
  inviteButton: {
    backgroundColor: '#eebd2b',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  inviteButtonText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  listSection: {
    flex: 1,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  memberImageContainer: {
    marginRight: 16,
  },
  memberImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  placeholderImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderIcon: {
    fontSize: 24,
  },
  memberInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  memberName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  memberStatus: {
    fontSize: 13,
    color: '#64748b',
  },
  emptyContainer: {
    marginTop: 60,
    alignItems: 'center',
  },
  emptyText: {
    color: '#94a3b8',
    fontSize: 15,
  },
});
