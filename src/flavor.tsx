import * as React from "react";
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
            switch(flavor) {
                case 0:
                    val = ing.sweet
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
                    val = ing.minty
                    break;
                case 5:
                    val = ing.savory
                    break;
                case 6:
                    val = ing.astringent
                    break;
                case 7:
                    val = ing.spicy
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

    return result.map(i => [i.id, 1] as any)
    // todo dedupe
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
}

interface FlavorState {
    flavorsSelected: Map<number, boolean>
    ingRecs: [number, number][]  // like ingSelection in Main
}

export default class _ extends React.Component<FlavorProps, FlavorState> {
    constructor(props: FlavorProps) {
        super(props)

        this.state = {
            flavorsSelected: new Map(),
            ingRecs: []
        }

        this.toggleFlavor = this.toggleFlavor.bind(this)
    }

    toggleFlavor(flavor: number) {
        let newSelection = this.state.flavorsSelected
        newSelection.set(flavor, !newSelection.get(flavor))
        this.setState({flavorsSelected: newSelection})
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
        flavors.set(6, 'Savory')
        flavors.set(8, 'Floral 🌺')

        // Not sure why this isn't working directly in the return portion.
        let items: any[] = []
        flavors.forEach(
            (name, i, map) => items.push(<FlavorCard
                key={i}
                index={i}
                name={name}
                selected={this.state.flavorsSelected.get(i)}
                toggleCb={() => this.toggleFlavor(i)}
            />)
        )

        return (
            <div>
                {items}
                <div
                    style={util.primaryStyle}
                    onClick={() => this.setState({ingRecs: recommend(
                            this.state.flavorsSelected, this.props.ingredients
                        )})}
                >Create my tea ⇒</div>
            </div>
        )
    }
}