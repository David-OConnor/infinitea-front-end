import {Blend} from "./types"


export function calcPrice(blend: Blend, size: number): number {
    // size is in grams; ingredient.price is in price per gram.
    let price = 0, weight
    for (let ingredient of blend.ingredients) {
        weight = 1 / blend.ingredients.length
        price += ingredient.price * weight
    }
    return Math.round(price * size * 100) / 100
}