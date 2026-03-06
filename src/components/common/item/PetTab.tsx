import React, { useState, useEffect } from 'react';
import { PetSummary, petService } from '../../../services/pet/PetService';
import ScrollableTab, { TabItem } from './ScrollableTab';
import PetRegistrationModal from '../modal/PetRegistrationModal';
import { usePet } from '../../../context/PetContext';
import { useAlert } from '../../../hooks/useAlert';
import CustomAlert from '../modal/CustomAlert';

interface PetTabProps {
  onPetsLoaded?: (pets: PetSummary[]) => void;
}

export default function PetTab({ 
  onPetsLoaded 
}: PetTabProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { pets, selectedPet, updateSelectedPet, refreshPets } = usePet();
  const { alertConfig, showConfirmAlert, showSimpleAlert, hideAlert } = useAlert();

  useEffect(() => {
    if (pets.length > 0) {
      onPetsLoaded?.(pets);
    }
  }, [pets, onPetsLoaded]);

  const handleDeletePet = (petId: number, petName: string) => {
    showConfirmAlert(
      '반려동물 삭제',
      `정말로 ${petName}의 정보를 삭제하시겠습니까?\n삭제 시 모든 연관 데이터(산책, 용품 등)가 함께 삭제됩니다.`,
      async () => {
        try {
          await petService.deletePet(petId);
          const updatedPets = await refreshPets();
          
          // 삭제된 펫이 현재 선택된 펫인 경우 다른 펫으로 교체
          if (selectedPet?.id === petId) {
            if (updatedPets.length > 0) {
              updateSelectedPet(updatedPets[0]);
            } else {
              updateSelectedPet(null);
            }
          }
          showSimpleAlert('성공', '반려동물 정보가 삭제되었습니다.');
        } catch (error: any) {
          showSimpleAlert('오류', error.message || '삭제 중 오류가 발생했습니다.');
        }
      }
    );
  };

  const tabs: TabItem[] = pets.map(pet => ({
    id: pet.petId,
    label: `${pet.petName}`,
    onDeletePress: pet.roleType === 'OWNER' ? () => handleDeletePet(pet.petId, pet.petName) : undefined
  }));

  const handleTabPress = (id: any) => {
    if (selectedPet?.id === id) return;
    
    const selected = pets.find(p => p.petId == id);
    if (selected) {
      updateSelectedPet(selected);
    }
  };

  const handlePetRegistered = async (petId: number, petName: string) => {
    setIsModalVisible(false);
    const updatedPets = await refreshPets(); 
    const newPet = updatedPets.find(p => p.petId === petId);
    if (newPet) {
      updateSelectedPet(newPet);
    } else {
      updateSelectedPet({ petId, petName, petProfileUrl: '', roleType: 'OWNER' });
    }
  };

  return (
    <>
      <ScrollableTab 
        tabs={tabs}
        activeTabId={selectedPet?.id ?? ''}
        onTabPress={handleTabPress}
        onAddPress={() => setIsModalVisible(true)}
        containerStyle={{ borderBottomWidth: 1, borderBottomColor: '#f1f5f9' }}
      />
      
      <PetRegistrationModal 
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSuccess={handlePetRegistered}
      />

      <CustomAlert 
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        confirmText={alertConfig.confirmText}
        cancelText={alertConfig.cancelText}
        onConfirm={alertConfig.onConfirm}
        onCancel={hideAlert}
        type={alertConfig.type}
      />
    </>
  );
}
