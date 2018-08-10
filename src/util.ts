import {Blend, Ingredient} from "./types"


export function calcPrice(blend: Blend, size: number): number {
    // size is in grams; ingredient.price is in price per gram.
    let price = 0

    // Find the value to normalize each ingredient to.  val's scale is irrelevant
    // to this func, as long as it's consistent between ingredients.
    let totalVal = 0
    for (let ingredient of blend.ingredients) {
        totalVal += ingredient[1]
    }

    for (let ingredient of blend.ingredients) {
        price += ingredient[0].price / totalVal
    }
    return price * size
}

export function ingPortion(blend: Blend, val: number): string {
    // Return the percent an ingredient is a portion of the blend.
    // Similar to calcPrice, but aimed at display.
    let totalVal = 0
    for (let ing of blend.ingredients) {
        totalVal += ing[1]
    }
    return (val / totalVal * 100).toFixed(0).toString()
}

export function priceDisplay(price: number) {
    // Handles 0 pad.
    return (Math.round(price * 100) / 100).toFixed(2);
}