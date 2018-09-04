import * as React from "react";
import {Route} from "react-router-dom"

import * as util from "./util";
import {Ingredient} from "./types";


function recommend(selected: Map<number, boolean>, ingredients: Ingredient[]): [number, number][] {
    const targetNumIngreds = 4
    const maxTeas = 2  // ie tea proper.

    // Note that we're inconsistent with terms 'tea' (here) and 'caffeine" (model)

    let selectedArr: number[] = []
    selected.forEach(
        (sel, i, map) => {
            if (sel) {selectedArr.push(i)}
        }
    )

    let result = []

    // suitableIngsPerFlav is used to make sure we get at least one ingred
    // per selected flav. suitableIngs is used later, to add additional ings.
    let suitableIngs = [], numTeas = 0, suitableIngsPerFlav, val
    for (let flavor of selectedArr) {
        suitableIngsPerFlav = []
        for (let ing of ingredients) {
            // This must sync up with the buttons.
            switch (flavor) {
                case 0:
                    val = ing.caffeine
                    break;
                case 1:
                    val = ing.citrus
                    break;
                case 2:
                    val = ing.spicy
                    break;
                case 3:
                    val = ing.chocolate
                    break;
                case 4:
                    val = ing.tart
                    break;
                case 5:
                    val = ing.minty
                    break;
                case 6:
                    val = ing.savory
                    break;
                case 7:
                    val = ing.sweet
                    break;
                case 8:
                    val = ing.floral
                    break;
                case 9:
                    val = ing.hot
                    break;
                default:
                    val = 0
            }
            if (val > 0) {
                suitableIngsPerFlav.push(ing)
                // todo note: We don't take into account ings
                // todo that count towards multiple flavors here;
                // todo perhaps we should


                numTeas = suitableIngs.reduce((acc, ing) => ing.caffeine > 0 ? acc + 1 : acc, 0)
                // Limit the number of teas in the blend.
                if (!suitableIngs.map(i => i.id).includes(ing.id)) {
                    if (ing.caffeine <= 0 || numTeas < maxTeas) {
                        suitableIngs.push(ing)
                    }
                }

            }
        }
        // For each selected flavor, add a random ingredient that has this flavor.
        // For each additional ingredient marked with this flavor, there's some
        // chance to add it too.
        // Make sure to add at least one suitable ing per flavor selected.
        result.push(util.randChoice(suitableIngsPerFlav))
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
    numIngs = Math.min(numIngs, suitableIngs.length)

    let choice
    while (result.length < numIngs) {
        // Deliberatly un-deduped suitableings, for now, to bias towards
        // ings that are in multiple selected flavors.
        choice = util.randChoice(suitableIngs)
        if (!result.map(i => i.id).includes(choice.id)) {
            result.push(choice)
        }
    }

    // Set the value to a 0-100 val so that the sliders under ingred selection
    // make sense.
    return result.map(i => [i.id, 50] as any)
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