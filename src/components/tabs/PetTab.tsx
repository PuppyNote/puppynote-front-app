import React, { useState, useEffect, useCallback } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { petService, PetSummary } from '../../services/pet/PetService';
import ScrollableTab, { TabItem } from './ScrollableTab';
import PetRegistrationModal from '../modal/PetRegistrationModal';
import { usePet } from '../../context/PetContext';

interface PetTabProps {
  onPetsLoaded?: (pets: PetSummary[]) => void;
}

export default function PetTab({ 
  onPetsLoaded 
}: PetTabProps) {
  const [pets, setPets] = useState<PetSummary[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const isFocused = useIsFocused();
  const { selectedPet, updateSelectedPet } = usePet();

  const fetchPets = useCallback(async () => {
    try {
      const data = await petService.getPets();
      setPets(data);
      onPetsLoaded?.(data);

      // 처음 로딩 시 선택된 펫이 없다면 첫 번째 펫 자동 선택
      if (selectedPet === null && data.length > 0) {
        updateSelectedPet(data[0]);
      }
    } catch (error) {
      console.error('Failed to fetch pets in PetTab:', error);
    }
  }, [selectedPet, updateSelectedPet, onPetsLoaded]);

  useEffect(() => {
    if (isFocused) {
      fetchPets();
    }
  }, [isFocused, fetchPets]);

  const tabs: TabItem[] = pets.map(pet => ({
    id: pet.petId,
    label: `${pet.petName}`
  }));

  const handleTabPress = (id: any) => {
    const selected = pets.find(p => p.petId == id);
    if (selected) {
      updateSelectedPet(selected);
    }
  };

  const handlePetRegistered = (petId: number, petName: string) => {
    setIsModalVisible(false);
    fetchPets(); 
    updateSelectedPet({ petId, petName, petProfileUrl: '' });
  };

  return (
    <>
      <ScrollableTab 
        tabs={tabs}
        activeTabId={selectedPet?.id !== null ? selectedPet?.id : ''}
        onTabPress={handleTabPress}
        onAddPress={() => setIsModalVisible(true)}
        containerStyle={{ borderBottomWidth: 1, borderBottomColor: '#f1f5f9' }}
      />
      
      <PetRegistrationModal 
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSuccess={handlePetRegistered}
      />
    </>
  );
}
