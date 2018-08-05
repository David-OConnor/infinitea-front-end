export interface Ingredient {
    id: number;
    name: string;
    description: string;
    caffeine: number;
    astringent: number;
    sweet: number;
    floral: number;
    chocolate: number;
    spicy: number;
    savory: number;
}
export interface Blend {
    id: number;
    name: string;
    description: string;
    ingredients: Ingredient[];
}
export interface Order {
    items: [Blend, number][];
    name: string;
    shipping_address: number;
}
