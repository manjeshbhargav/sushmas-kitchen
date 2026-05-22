import type { Ingredient } from '../types/recipe';

// Common non-vegan ingredient keywords (lowercase)
const NON_VEGAN_KEYWORDS = [
  // Meat & Poultry
  'chicken',
  'beef',
  'pork',
  'mutton',
  'lamb',
  'turkey',
  'bacon',
  'ham',
  'sausage',
  'meat',
  'poultry',
  'lard',
  
  // Seafood
  'fish',
  'salmon',
  'tuna',
  'shrimp',
  'prawn',
  'crab',
  'lobster',
  'mussel',
  'clam',
  'oyster',
  'anchovy',
  'seafood',
  'squid',
  'octopus',
  'scallop',
  
  // Dairy & Derivatives
  'milk',
  'cream',
  'butter',
  'cheese',
  'ghee',
  'paneer',
  'yogurt',
  'curd',
  'whey',
  'casein',
  'lactose',
  'buttermilk',
  'mawa',
  'khoya',
  'condensed milk',
  
  // Eggs & Bees
  'egg',
  'honey',
  
  // Other animal derivatives
  'gelatin',
];

// Vegan exceptions that would otherwise be flagged as non-vegan (e.g. because they contain "milk" or "butter")
const VEGAN_EXCEPTIONS = [
  // Plant milks & creams
  'coconut milk',
  'almond milk',
  'soy milk',
  'oat milk',
  'cashew milk',
  'coconut cream',
  'vegan milk',
  'dairy-free',
  'dairy free',
  'plant-based',
  'plant-based milk',
  'plant based',
  
  // Vegan butter / fat alternatives
  'vegan butter',
  'vegan cheese',
  'cocoa butter',
  'cacao butter',
  'shea butter',
  'peanut butter',
  'almond butter',
  'cashew butter',
  'nut butter',
  'seed butter',
  'sunflower butter',
  
  // Plants containing "butter" in their name
  'butternut',
  'butter fruit', // Indian term for avocado
  'butterhead lettuce',
];

// Nut keywords (lowercase) including Indian terms commonly used in the dataset
const NUT_KEYWORDS = [
  'almond',
  'cashew',
  'peanut',
  'walnut',
  'pecan',
  'hazelnut',
  'pistachio',
  'macadamia',
  'pine nut',
  'chestnut',
  'brazil nut',
  'hazel nut',
  'groundnut',
  'kaju',
  'badam',
  'pista',
];

/**
 * Returns true if the ingredients list is vegan.
 * Vegan ingredients must not contain meat, poultry, seafood, dairy, eggs, honey, or gelatin.
 * 
 * @param ingredients - List of ingredients (either Ingredient objects or raw strings)
 */
export function isVegan(ingredients: (Ingredient | string)[]): boolean {
  if (!ingredients || ingredients.length === 0) {
    return true;
  }

  return ingredients.every(ingredient => {
    // Get raw string representation of the ingredient
    const rawName = typeof ingredient === 'string' ? ingredient : ingredient.item;
    if (!rawName) return true;

    let normalized = rawName.toLowerCase();

    // Remove vegan exceptions (like "coconut milk") to avoid false positives with non-vegan terms (like "milk")
    for (const exception of VEGAN_EXCEPTIONS) {
      normalized = normalized.replace(new RegExp(exception, 'g'), '');
    }

    // Check if any remaining text contains a non-vegan keyword
    const isNonVegan = NON_VEGAN_KEYWORDS.some(keyword => normalized.includes(keyword));

    return !isNonVegan;
  });
}

/**
 * Returns true if any ingredient in the list contains nuts (e.g., peanuts, almonds, cashews, walnuts, etc.).
 * Note: Coconut and nutmeg are distinct and are not flagged as nuts.
 * 
 * @param ingredients - List of ingredients (either Ingredient objects or raw strings)
 */
export function containsNuts(ingredients: (Ingredient | string)[]): boolean {
  if (!ingredients || ingredients.length === 0) {
    return false;
  }

  return ingredients.some(ingredient => {
    const rawName = typeof ingredient === 'string' ? ingredient : ingredient.item;
    if (!rawName) return false;

    const normalized = rawName.toLowerCase();

    // Check specific nut keywords
    const hasNutKeyword = NUT_KEYWORDS.some(keyword => normalized.includes(keyword));
    if (hasNutKeyword) {
      return true;
    }

    // Check general "nut" / "nuts" word boundary (matches "mixed nuts" or "nut butter", but avoids "coconut", "nutmeg", "butternut")
    if (/\bnuts?\b/i.test(normalized)) {
      return true;
    }

    return false;
  });
}
