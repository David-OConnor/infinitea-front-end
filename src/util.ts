import {Blend} from "./types"


export function calcPrice(blend: Blend, size: number): number {
    // size is in grams; ingredient.price is in price per gram.
    let price = 0, totalVal = 0
    for (let ing of blend.ingredients) {
        totalVal += ing[1]
    }
    for (let ing of blend.ingredients) {
        price += ing[0].price * ing[1] / totalVal
    }

    const markup = 1.5 // todo temp; this will come from ingredient price.
    return price * size * markup
}


export function priceDisplay(price: number) {
    // Handles 0 pad.
    return (Math.round(price * 100) / 100).toFixed(2);
}

export function ingPortion(blend: Blend, val: number): string {
    // todo dry from calcPrice
    // Some duplication from calcPrice above.
    let totalVal = 0
    for (let ing of blend.ingredients) {
        totalVal += ing[1]
    }
    return (val * 100 / totalVal).toFixed(0)
}

export const buttonStyle = {
    cursor: 'pointer',
    background: '#c4ddd2',
    height: 40,
    width: 200,

    margin: 'auto',
    paddingTop: 6,
    display: 'block',
    // lineHeight: 40,
    textAlign: 'center' as any,  // wtf?
    // verticalAlign: 'middle',
    color: 'black',
    fontFamily: '"Lucida Sans Unicode"',
    fontSize: '1.2em',
}
export const primaryColor = '#9091c2'

export const onMobile = () => window.innerWidth < 450