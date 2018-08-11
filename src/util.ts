import {Blend} from "./types"


export function calcPrice(blend: Blend, size: number): number {
    // size is in grams; ingredient.price is in price per gram.
    let price = 0, weight
    for (let ingredient of blend.ingredients) {
        weight = 1 / blend.ingredients.length
        price += ingredient[0].price * weight
    }
    return price
}


export function priceDisplay(price: number) {
    // Handles 0 pad.
    return (Math.round(price * 100) / 100).toFixed(2);
}