import React, { useState, useEffect } from 'react';
import { PetSummary } from '../../services/pet/PetService';
import ScrollableTab, { TabItem } from './ScrollableTab';
import PetRegistrationModal from '../modal/PetRegistrationModal';
import { usePet } from '../../context/PetContext';

interface PetTabProps {
  onPetsLoaded?: (pets: PetSummary[]) => void;
}

export default function PetTab({ 
  onPetsLoaded 
}: PetTabProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { pets, selectedPet, updateSelectedPet, refreshPets } = usePet();

  useEffect(() => {
    if (pets.length > 0) {
      onPetsLoaded?.(pets);
    }
  }, [pets, onPetsLoaded]);

  const tabs: TabItem[] = pets.map(pet => ({
    id: pet.petId,
    label: `${pet.petName}`
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
      updateSelectedPet({ petId, petName, petProfileUrl: '' });
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
    </>
  );
}
