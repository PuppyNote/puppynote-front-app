import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { storageService } from '../services/auth/StorageService';
import { petService, PetSummary } from '../services/pet/PetService';

interface PetContextType {
  pets: PetSummary[];
  selectedPet: { id: number; name: string } | null;
  setSelectedPet: (pet: { id: number; name: string } | null) => void;
  updateSelectedPet: (pet: PetSummary) => Promise<void>;
  refreshPets: () => Promise<PetSummary[]>;
  isLoadingPet: boolean;
}

const PetContext = createContext<PetContextType | undefined>(undefined);

export function PetProvider({ children }: { children: React.ReactNode }) {
  const [pets, setPets] = useState<PetSummary[]>([]);
  const [selectedPet, setSelectedPetState] = useState<{ id: number; name: string } | null>(null);
  const [isLoadingPet, setIsLoadingPet] = useState(true);

  const fetchPets = useCallback(async () => {
    try {
      const data = await petService.getPets();
      setPets(data);
      return data;
    } catch (error) {
      console.error('Failed to fetch pets in PetContext:', error);
      return [];
    }
  }, []);

  const updateSelectedPet = useCallback(async (pet: PetSummary) => {
    const petObj = { id: pet.petId, name: pet.petName };
    setSelectedPetState(petObj);
    await storageService.saveSelectedPet(pet.petId, pet.petName);
  }, []);

  const refreshPets = useCallback(async () => {
    return await fetchPets();
  }, [fetchPets]);

  const loadSavedPet = useCallback(async () => {
    try {
      setIsLoadingPet(true);
      const savedPet = await storageService.getSelectedPet();
      const fetchedPets = await fetchPets();
      
      if (savedPet) {
        // 저장된 펫이 현재 펫 목록에 있는지 확인
        const exists = fetchedPets.some(p => p.petId === savedPet.id);
        if (exists) {
          setSelectedPetState(savedPet);
        } else if (fetchedPets.length > 0) {
          await updateSelectedPet(fetchedPets[0]);
        }
      } else if (fetchedPets.length > 0) {
        await updateSelectedPet(fetchedPets[0]);
      }
    } catch (error) {
      console.error('Failed to load initial pet data:', error);
    } finally {
      setIsLoadingPet(false);
    }
  }, [fetchPets, updateSelectedPet]);

  useEffect(() => {
    loadSavedPet();
  }, [loadSavedPet]);

  return (
    <PetContext.Provider value={{ 
      pets,
      selectedPet, 
      setSelectedPet: setSelectedPetState, 
      updateSelectedPet,
      refreshPets,
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
