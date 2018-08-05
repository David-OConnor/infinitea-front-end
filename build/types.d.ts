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
    price: number;
}
export interface Blend {
    title: string;
    description: string;
    ingredients: Ingredient[];
}
export interface Order {
    items: [Blend, number][];
    shipping_address: number;
}
export interface Address {
    name: string;
    email: string;
    country: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    postal: string;
    phone: string;
}
