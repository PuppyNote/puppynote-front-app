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
      console.log('Failed to fetch pets in PetContext (Might not be logged in yet)');
      return [];
    }
  }, []);

  const updateSelectedPet = useCallback(async (pet: PetSummary | null) => {
    if (!pet) {
      setSelectedPetState(null);
      await storageService.clearSelectedPet();
      return;
    }
    const petObj = { id: pet.petId, name: pet.petName };
    setSelectedPetState(petObj);
    await storageService.saveSelectedPet(pet.petId, pet.petName);
  }, []);

  const loadSavedPet = useCallback(async () => {
    try {
      setIsLoadingPet(true);
      
      // 토큰 확인 (로그인 여부)
      const token = await storageService.getAccessToken();
      if (!token) {
        setIsLoadingPet(false);
        return;
      }

      const fetchedPets = await fetchPets();
      const savedPet = await storageService.getSelectedPet();
      
      if (savedPet) {
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

  const refreshPets = useCallback(async () => {
    const token = await storageService.getAccessToken();
    if (!token) return [];
    
    const fetchedPets = await fetchPets();
    
    // 현재 선택된 펫이 없고 목록이 있다면 첫 번째 펫을 자동으로 선택
    if (fetchedPets.length > 0 && !selectedPet) {
      await updateSelectedPet(fetchedPets[0]);
    }
    
    return fetchedPets;
  }, [fetchPets, selectedPet, updateSelectedPet]);

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
