export interface Ingredient {
  item: string;
  quantity: string;
}

export interface Recipe {
  id: string;
  title: string;
  category: string;
  ingredients: Ingredient[];
  method: string[];
  difficulty?: 'Easy' | 'Medium' | 'Complex';
  prepTime?: string;
}
