import * as React from "react";
import {Route} from "react-router-dom"

import * as util from "./util";
import {Ingredient} from "./types";


function recommend(selected: Map<number, boolean>, ingredients: Ingredient[]): [number, number][] {
    const targetNumIngreds = 5

    let selectedArr: number[] = []
    selected.forEach(
        (sel, i, map) => {
            if (sel) {selectedArr.push(i)}
        }
    )

    let result = []
    let suitableIngs, val
    for (let flavor of selectedArr) {
        suitableIngs = []
        for (let ing of ingredients) {
            // This must sync up with the buttons.
            switch(flavor) {
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
                default:
                    val = 0
            }
            if (val > 0) {
                suitableIngs.push(ing)
            }
        }
        // For each selected flavor, add a random ingredient that has this flavor.
        // For each additional ingredient marked with this flavor, there's some
        // chance to add it too.
        result.push(util.randChoice(suitableIngs))
        const extraIngThresh = 0.5
        for (let ing of suitableIngs) {
            // todo take into account the specific value for each ing, eg val above.
            // todo also, change the portions below too, perhaps.
            if (Math.random() > extraIngThresh) {
                result.push(ing)
            }
        }
    }

    let deduped: Ingredient[] = []
    for (let ing of result) {
        if (!deduped.map(i => i.id).includes(ing.id)) {
            deduped.push(ing)
        }
    }

    // Set the value to a 0-100 val so that the sliders under ingred selection
    // make sense.
    return deduped.map(i => [i.id, 50] as any)
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
        flavors.set(2, 'Spicy 🌶️')
        flavors.set(3, 'Chocolate 🍫')
        flavors.set(4, 'Tart 🍒')
        flavors.set(5, 'Minty 🌿')
        // flavors.set(6, 'Savory 🥓')
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
            <div>
                <h4 style={{textAlign: 'center', marginBottom: 40}}>
                    We'll build a blend from your choices
                </h4>

                <div style={{display: 'flex', flexFlow: 'row wrap'}}>
                    {items}
                </div>

                <util.TitleForm title={this.props.title} descrip={this.props.descrip}
                                titleCb={this.props.titleCb} descripCb={this.props.descripCb} />

                {ready ?

                    <Route render={({history}) => (
                    <div
                    style={{...util.primaryStyle, marginTop: 40}}
                    onClick={() => {
                        this.props.ingSelCb(
                            recommend(this.props.selection, this.props.ingredients)
                        )
                        this.props.subPageCb(1)
                        history.push(util.indexUrl + 'size')
                    }}
                >Create my tea ⇒</div>
                        )} />

                        : null }
            </div>
        )
    }
}