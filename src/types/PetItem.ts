export interface Category {
  category: string;
  categoryName: string;
  emoji: string;
}

export interface MajorCategory {
  majorCategory: string;
  majorCategoryName: string;
  majorCategoryEmoji: string;
  categories: Category[];
}

export interface UserCategory extends Category {
  id: string; // Used for identifying in current selection
}

export interface UserCategoryResponse {
  userItemCategoryId: number;
  categoryType: string;
  categoryTypeDescription: string;
  majorCategory: string;
  majorCategoryName: string;
  majorCategoryEmoji: string;
  category: string;
  categoryName: string;
  categoryEmoji: string;
  sort: number;
}

export interface PetItem {
  petItemId: number;
  petId: number;
  name: string;
  majorCategory: string;
  majorCategoryName: string;
  majorCategoryEmoji: string;
  category: string;
  categoryName: string;
  categoryEmoji: string;
  purchaseCycleDays: number;
  purchaseUrl: string;
  imageUrl: string;
  lastPurchasedAt: string;
  nextPurchaseAt: string;
}
