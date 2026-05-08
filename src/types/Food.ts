export interface FoodItem {
  id: number;
  question: string;
  answer: string;
  safetyLevel: 'GOOD' | 'NOTION' | 'BAD';
}

export interface FoodSearchResponse {
  content: FoodItem[];
  page: number;
  totalCount: number;
}

export interface FoodSearchRequest {
  question: string;
  page?: number;
  size?: number;
}

export interface FoodAiRequest {
  question: string;
}
