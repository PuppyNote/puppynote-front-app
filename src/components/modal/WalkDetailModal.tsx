import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, ScrollView, Image, ActivityIndicator, Dimensions } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { CustomText as Text } from '../CustomText';
import { walkService, WalkDetail } from '../../services/walk/WalkService';
import { useAlert } from '../../hooks/useAlert';
import CustomAlert from './CustomAlert';
import GlobalDetailModal from './GlobalDetailModal';

interface WalkDetailModalProps {
  visible: boolean;
  walkId: number | null;
  onClose: () => void;
}

const { width } = Dimensions.get('window');

export default function WalkDetailModal({
  visible,
  walkId,
  onClose,
}: WalkDetailModalProps) {
  const [detail, setWalkDetail] = useState<WalkDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);
  const { alertConfig, showAlert } = useAlert();

  useEffect(() => {
    if (visible && walkId) {
      fetchDetail();
    } else {
      setWalkDetail(null);
    }
  }, [visible, walkId]);

  const fetchDetail = async () => {
    if (!walkId) return;
    setIsLoading(true);
    try {
      const data = await walkService.getWalkDetail(walkId);
      setWalkDetail(data);
    } catch (error: any) {
      showAlert('오류', error.message || '상세 정보를 가져오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  if (!visible) return null;

  return (
    <GlobalDetailModal
      visible={visible}
      onClose={onClose}
      title="산책 기록 상세"
      height="90%"
    >
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color="#eebd2b" size="large" />
        </View>
      ) : detail ? (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Photo Gallery */}
          {detail.photoUrls && detail.photoUrls.length > 0 && (
            <View style={styles.photoSection}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} pagingEnabled snapToInterval={width - 48} decelerationRate="fast">
                {detail.photoUrls.map((url, index) => (
                  <TouchableOpacity key={index} activeOpacity={0.9} onPress={() => setFullScreenImage(url)}>
                    <Image source={{ uri: url }} style={styles.walkImage} resizeMode="cover" />
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <View style={styles.photoCountBadge}>
                <Text style={styles.photoCountText}>1/{detail.photoUrls.length}</Text>
              </View>
            </View>
          )}

          {/* Info Section */}
          <View style={styles.infoSection}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>장소</Text>
              <Text style={styles.infoValue}>{detail.location}</Text>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoItemFlex}>
                <Text style={styles.infoLabel}>시작</Text>
                <Text style={styles.infoValue}>{formatTime(detail.startTime)}</Text>
              </View>
              <View style={styles.infoItemFlex}>
                <Text style={styles.infoLabel}>종료</Text>
                <Text style={styles.infoValue}>{formatTime(detail.endTime)}</Text>
              </View>
            </View>

            {detail.memo ? (
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>메모</Text>
                <View style={styles.memoBox}>
                  <Text style={styles.memoText}>{detail.memo}</Text>
                </View>
              </View>
            ) : null}
          </View>

          {/* Map Section */}
          {detail.latitude && detail.longitude && (
            <View style={styles.mapSection}>
              <Text style={styles.infoLabel}>위치 정보</Text>
              <View style={styles.mapContainer}>
                <MapView
                  provider={PROVIDER_GOOGLE}
                  style={styles.map}
                  initialRegion={{
                    latitude: detail.latitude,
                    longitude: detail.longitude,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005,
                  }}
                  scrollEnabled={false}
                  zoomEnabled={false}
                >
                  <Marker
                    coordinate={{
                      latitude: detail.latitude,
                      longitude: detail.longitude,
                    }}
                  >
                    <View style={styles.markerContainer}>
                      <Text style={styles.markerPaw}>🐾</Text>
                    </View>
                  </Marker>
                </MapView>
              </View>
            </View>
          )}
        </ScrollView>
      ) : (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>정보를 불러올 수 없습니다.</Text>
        </View>
      )}

      {/* Image Full Screen View */}
      <Modal visible={!!fullScreenImage} transparent animationType="fade">
        <TouchableOpacity 
          style={styles.fullScreenOverlay} 
          activeOpacity={1} 
          onPress={() => setFullScreenImage(null)}
        >
          {fullScreenImage && (
            <Image source={{ uri: fullScreenImage }} style={styles.fullScreenImage} resizeMode="contain" />
          )}
          <TouchableOpacity style={styles.fullScreenClose} onPress={() => setFullScreenImage(null)}>
            <Text style={styles.fullScreenCloseText}>✕</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      <CustomAlert 
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        onConfirm={alertConfig.onConfirm}
      />
    </GlobalDetailModal>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoSection: {
    marginBottom: 24,
    position: 'relative',
  },
  walkImage: {
    width: width - 48,
    height: 240,
    borderRadius: 24,
  },
  photoCountBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  photoCountText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  infoSection: {
    gap: 20,
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 16,
  },
  infoItem: {
    gap: 8,
  },
  infoItemFlex: {
    flex: 1,
    gap: 8,
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginLeft: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '600',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  memoBox: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    minHeight: 80,
  },
  memoText: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 22,
  },
  mapSection: {
    gap: 12,
  },
  mapContainer: {
    height: 200,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  markerContainer: {
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#eebd2b',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  markerPaw: {
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#94a3b8',
    fontSize: 16,
  },
  fullScreenOverlay: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: '100%',
    height: '100%',
  },
  fullScreenClose: {
    position: 'absolute',
    top: 60,
    right: 24,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenCloseText: {
    color: 'white',
    fontSize: 20,
  },
});
