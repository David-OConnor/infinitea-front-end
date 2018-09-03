import * as React from 'react'

import {Blend} from "./types"


const HOSTNAME = window && window.location && window.location.hostname
let online = false

if (HOSTNAME === 'infinitea.herokuapp.com' || HOSTNAME === 'www.infinitea.org'
    || HOSTNAME === 'david-oconnor.github.io' ||
    HOSTNAME === 'amazing-villani-7734f7.netlify.com') {
    online = true
}

export const BASE_URL = online ? 'https://infinitea.herokuapp.com/api/' :
    'http://localhost:8000/api/'

// Keep this index url fixed here, rather than calling window.location.pathname
// each time we use it: That can produce bogus results.
// #/ tells the server not to look past this part; this way we can use the url
// for back/fwd, but bookmarking and refreshing always effectively point to the base url.
export const indexUrl = window.location.pathname + '#/'

export const mainOpacity = 0.9


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
    paddingTop: 9,
    // lineHeight: 40,
    textAlign: 'center' as any,  // wtf?
    // verticalAlign: 'middle',
    color: 'black',
    fontFamily: '"Lucida Sans Unicode"',
    fontSize: '1em',
}
export const primaryStyle = {
    ...buttonStyle,
    background: '#9091c2',
    fontWeight: 600
}

export const onMobile = () => window.innerWidth < 650

export function randInt(min: number, max: number) {
    return Math.floor(Math.random() * (max + 1 - min) + min)
}

export function randChoice(items: any[]) {
    return items[Math.floor(Math.random() * items.length)]
}

const descriptions = [
    "Definitely an aphrodisiac - I'm not teasing!",
    "Orange you glad I contain chocolate?",
    "Drink me",
    "It's always tea time",
    "Would you like an adventure now, or shall we have our tea first?",
    "Made of star stuff",
]

// Generate it here, so the same value persists until the page is refreshed.
const description2 = descriptions[Math.floor(Math.random()*descriptions.length)]

export const TitleForm = ({title, descrip, titleCb, descripCb}:
                       {title: string, descrip: string, titleCb: Function, descripCb: Function}) => (
    <div style={{
        gridArea: 'title',
        margin: 'auto',
        textAlign: 'center'
    }}>
        <form>
            <h4>Title</h4>
            <input
                type="text"
                value={title}
                placeholder="Serious? Fun?"
                onChange={(e: any) => titleCb(e.target.value)}
            />

            <h4>Description</h4>
            <input
                type="text"
                value={descrip}
                // Random description.
                placeholder={description2}
                onChange={(e: any) => descripCb(e.target.value)}
            />
        </form>

        <h4 style={{textAlign: 'center'}}>More ingredients coming
            soon!</h4>
    </div>
)