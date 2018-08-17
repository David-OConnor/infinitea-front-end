import {Blend} from "./types"



const HOSTNAME = window && window.location && window.location.hostname
let ON_HEROKU = false

if (HOSTNAME === 'infinitea.herokuapp.com' || HOSTNAME === 'www.infinitea.org'
    || HOSTNAME === 'david-oconnor.github.io') {
    ON_HEROKU = true
}

export const BASE_URL = ON_HEROKU ? 'https://infinitea.herokuapp.com/api/' :
    'http://localhost:8000/api/'

// Keep this index url fixed here, rather than calling window.location.pathname
// each time we use it: That can produce bogus results.
// #/ tells the server not to look past this part; this way we can use the url
// for back/fwd, but bookmarking and refreshing always effectively point to the base url.
export const indexUrl = window.location.pathname + '#/'

export const mainOpacity = 0.85


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
export const primaryStyle = {
    ...buttonStyle,
    background: '#9091c2',
    fontWeight: 600
}

export const onMobile = () => window.innerWidth < 450

export function randInt(min: number, max: number) {
    return Math.floor(Math.random() * (max + 1 - min) + min)
}

export function randChoice(items: any[]) {
    return items[Math.floor(Math.random() * items.length)]
}