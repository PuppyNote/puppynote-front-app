import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { storageService } from '../services/auth/StorageService';
import { PetSummary } from '../services/pet/PetService';

interface PetContextType {
  selectedPet: { id: number; name: string } | null;
  setSelectedPet: (pet: { id: number; name: string } | null) => void;
  updateSelectedPet: (pet: PetSummary) => Promise<void>;
  isLoadingPet: boolean;
}

const PetContext = createContext<PetContextType | undefined>(undefined);

export function PetProvider({ children }: { children: React.ReactNode }) {
  const [selectedPet, setSelectedPetState] = useState<{ id: number; name: string } | null>(null);
  const [isLoadingPet, setIsLoadingPet] = useState(true);

  const loadSavedPet = useCallback(async () => {
    try {
      const savedPet = await storageService.getSelectedPet();
      if (savedPet) {
        setSelectedPetState(savedPet);
      }
    } catch (error) {
      console.error('Failed to load saved pet:', error);
    } finally {
      setIsLoadingPet(false);
    }
  }, []);

  useEffect(() => {
    loadSavedPet();
  }, [loadSavedPet]);

  const updateSelectedPet = async (pet: PetSummary) => {
    const petObj = { id: pet.petId, name: pet.petName };
    setSelectedPetState(petObj);
    await storageService.saveSelectedPet(pet.petId, pet.petName);
  };

  return (
    <PetContext.Provider value={{ 
      selectedPet, 
      setSelectedPet: setSelectedPetState, 
      updateSelectedPet,
      isLoadingPet 
    }}>
      {children}
    </PetContext.Provider>
  );
}

export function usePet() {
  const context = useContext(PetContext);
  if (context === undefined) {
    throw new Error('usePet must be used within a PetProvider');
  }
  return context;
}
