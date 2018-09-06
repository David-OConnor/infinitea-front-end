import * as React from "react";
import {Route} from "react-router-dom"

import * as util from "./util";
import {Ingredient} from "./types";


function shuffle(a: any[]) {
    // https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
    // I think this suffle's in place.
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    // return a;
}

function ingFromId(id: number, ingreds: Ingredient[]): Ingredient {
    return ingreds.filter(ing => ing.id === id)[0]
}

let flavAttrMap = new Map()
flavAttrMap.set(0, 'caffeine')
flavAttrMap.set(1, 'citrus')
flavAttrMap.set(2, 'spicy')
flavAttrMap.set(3, 'chocolate')
flavAttrMap.set(4, 'tart')
flavAttrMap.set(5, 'minty')
flavAttrMap.set(6, 'savory')
flavAttrMap.set(7, 'sweet')
flavAttrMap.set(8, 'floral')
flavAttrMap.set(9, 'hot')

function score(ingreds: Ingredient[], flavs: number[]): number {
    const flavsUsedFactor = 2
    let result = 0

    for (let ing1 of ingreds) {
        for (let ing2 of ingreds) {
            if (ing1.pairings.includes(ing2.id) || ing2.pairings.includes(ing1.id)) {
                result += 1
            }
            if (ing1.clashes.includes(ing2.id) || ing2.clashes.includes(ing1.id)) {
                result -= 1
            }
        }
    }

    let numSelFlavorsUsed = 0
    for (let flav of flavs) {
        for (let ing of ingreds) {
            if (ing[flavAttrMap.get(flav)] > 0) {
                numSelFlavorsUsed += 1
                break
            }
        }
    }

    result += numSelFlavorsUsed / flavs.length * flavsUsedFactor

    return result
}

function recommend(selected: Map<number, boolean>, ingredients: Ingredient[]): [number, number][] {
    // Todo this function has lots of room for improvement, algo-wise.
    const targetNumIngreds = 5
    // More iters provides a better result, but is slower.
    const numIters = 40

    // Note that we're inconsistent with terms 'tea' (here) and 'caffeine" (model)

    let suitable: Map<number, number[]> = new Map()
    let selectedArr: number[] = []
    selected.forEach(
        (sel, flavId, map) => {
            // In Python, setting up suitable here would be handled by a
            // default dict, but in JS, we need to set this up manually.
            suitable.set(flavId, [])
            if (sel) {selectedArr.push(flavId)}
        }
    )

    for (let flavor of selectedArr) {
        // suitableIngsPerFlav = []
        for (let ing of ingredients) {
            if (ing[flavAttrMap.get(flavor)] > 0) {
                suitable.set(flavor, suitable.get(flavor).concat([ing.id]))
            }
        }
    }

    let numIngs = targetNumIngreds

    // Weighted chances to add 1, add 2, sub 1, sub 2, or leave num ings unchanged,
    // Assuming enough suitable ings are avail.
    let numModifier = Math.random()
    if (numModifier > .9) {
        numIngs += 2
    } else if (numModifier > .6) {
        numIngs += 1
    } else if (numModifier > .4) {
        numIngs += 0
    } else  if (numModifier > .1) {
        numIngs -= 1
    } else {
        numIngs -= 2
    }

    // Don't try to add ings when we don't have enough.
    numIngs = Math.min(numIngs, selectedArr.length)

    let suitableArr: number[] = []
    suitable.forEach(
        (ingIds, flavId, map) => {
            for (let ingId of ingIds) {
                if (!suitableArr.includes(ingId)) {
                    suitableArr.push(ingId)
                }
            }
        }
    )

    let candidate

    let mixes = [], candidateIngs
    for (let i=0; i<=numIters; i++) {
        shuffle(suitableArr)

        candidate = suitableArr.slice(0, numIngs)
        candidateIngs = candidate.map(id => ingFromId(id, ingredients))

        mixes.push([candidateIngs, score(candidateIngs, selectedArr)])
    }


    mixes.sort((a: any, b: any) => b[1] - a[1])
    // console.log(mixes, 'after')
    const best = mixes[0]

    // console.log("best: ", best)

    // Set the value to a 0-100 val so that the sliders under ingred selection
    // make sense.
    return (best[0] as any).map((b: any) => [b.id, 50] as any)
}

const FlavorCard = ({index, name, selected, toggleCb}:
                        {index: number, name: string, selected: boolean, toggleCb: Function}) => (
    <div
        style={{
            display: 'flex',
            margin: 'auto',
            marginBottom: 10,
            width: 200,
            height: 30,
            backgroundColor: selected ? '#9bffc6' : '#cfeaf6',
            cursor: 'pointer'
        }}
        onClick={() => toggleCb()}
    >
        <h4 style={{
            display: 'flex',
            margin: 'auto',
        }}>{name}</h4>
    </div>
)

interface FlavorProps {
    ingredients: Ingredient[]
    selection: Map<number, boolean>
    flavSelCb: Function
    ingSelCb: Function
    subPageCb: Function

    title: string
    descrip: string
    titleCb: Function
    descripCb: Function
}

interface FlavorState {
    ingRecs: [number, number][]  // like ingSelection in Main
}

export default class _ extends React.Component<FlavorProps, FlavorState> {
    // todo you can possibly convert to a func component
    constructor(props: FlavorProps) {
        super(props)

        this.state = {
            ingRecs: []
        }

        this.toggleFlavor = this.toggleFlavor.bind(this)
    }

    toggleFlavor(flavor: number) {
        let newSelection = this.props.selection
        newSelection.set(flavor, !newSelection.get(flavor))
        this.props.flavSelCb(newSelection)
    }

    render() {
        // Reference models.py; could find a clever way to automatically set this.
        let flavors = new Map()
        flavors.set(0, 'Tea 🍵')
        flavors.set(7, 'Sweet 🍬')
        flavors.set(1, 'Citrus 🍋')
        flavors.set(2, 'Spicy 🥧')
        flavors.set(9, 'Hot 🌶️')
        flavors.set(3, 'Chocolate 🍫')
        flavors.set(4, 'Tart 🍒')
        flavors.set(5, 'Minty 🌿')
        flavors.set(6, 'Savory 🍄')
        flavors.set(8, 'Floral 🌺')

        // Not sure why this isn't working directly in the return portion.
        let items: any[] = []
        flavors.forEach(
            (name, i, map) => items.push(<FlavorCard
                key={i}
                index={i}
                name={name}
                selected={this.props.selection.get(i)}
                toggleCb={() => this.toggleFlavor(i)}
            />)
        )

        // At least one flavor must be selected to make a blend.
        let ready = false
        this.props.selection.forEach(
            (sel, i, map) => {
                if (sel) {
                    ready = true
                }
            }
        )

        return (
            <div style={{textAlign: 'center'}}>
                <h2 style={{textAlign: 'center', marginBottom: 40}}>
                    We'll build a blend from your choices
                </h2>
                <p>Choose as many flavors as you like, we'll pick ingredients
                    that match your choices. If you don't like the result after clicking
                    'Create my tea', you can go back and try again with the same flavors,
                    different ones, or customize with 'Pick Ingredients' above.</p>

                <div style={{display: 'flex', flexFlow: 'row wrap', marginTop: 40}}>
                    {items}
                </div>

                <util.TitleForm title={this.props.title} descrip={this.props.descrip}
                                titleCb={this.props.titleCb} descripCb={this.props.descripCb} />

                {ready ?

                    <Route render={({history}) => (
                        <button
                            style={{...util.primaryStyle, marginTop: 40}}
                            onClick={() => {
                                this.props.ingSelCb(
                                    recommend(this.props.selection, this.props.ingredients)
                                )
                                this.props.subPageCb(1)
                                history.push(util.indexUrl + 'size')
                            }}
                        >Create my tea ⇒</button>
                    )} />

                    : null }
            </div>
        )
    }
}