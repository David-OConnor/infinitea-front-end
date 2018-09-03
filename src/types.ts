// These correspond to entries in models.py; ref that for more info.

export interface Ingredient {
    id: number
    name: string
    description: string
    category: number
    caffeine: number
    astringent: number
    sweet: number
    citrus: number
    floral: number
    tart: number
    minty: number
    chocolate: number
    spicy: number
    hot: number
    savory: number
    price: number
    inventory: number
    organic: number
}

export interface Blend {
    title: string
    description: string
    ingredients: [Ingredient, number][]
}

// export interface Order {
//     blends: [Blend, number][]  // second tuple item is the size in grams.
//     shipping_address: number
//     notes: string
// }

export interface Address {
    name: string
    email: string
    country: string
    address1: string
    address2: string
    city: string
    state: string
    postal: string
    phone: string
}