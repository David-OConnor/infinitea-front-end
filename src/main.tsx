import axios from "axios"
import * as React from 'react'
import * as ReactDOM from "react-dom"
import { BrowserRouter as Router, Route } from "react-router-dom"
import 'rheostat/initialize'
import Rheostat from 'rheostat'

import About from './about'
import CheckoutForm from './checkout'
import Footer from './footer'
import FlavorPicker from './flavor'
import Privacy from './privacy'
import Terms from './terms'
import * as util from './util'
import {Address, Blend, Ingredient} from "./types"


const shippingPrice = 7.20  // todo sync this with DB/server-side?

const flavorColor = '#dbeef6'
const ingredColor = '#ffe5e5'


const Menu = ({page, subPage, flavorMode, setPage, setSubPage, setFlav}:
                  {page: number, subPage: number, flavorMode: boolean,
                      setPage: Function, setSubPage: Function, setFlav: Function}) => {
    let text = "About"
    let destPage = 1
    let route = 'about'
    if (page !== 0) {
        text = "⇐ Your tea"
        destPage = 0
        route = flavorMode ? 'flavors' : 'ingredients'
    }
    // todo This function/comp is organized inconsistently.

    // We need this double-wrapped div apparently to make the buttons center.  Not sure why.
    return <Route render={({history}) => (
        <div style={{display: 'flex', margin: 'auto'}}>
            <div style={{display: 'flex', margin: 'auto'}}>
                <button
                    onClick={() => {
                        setPage(destPage)
                        history.push(util.indexUrl + route)
                    }}
                >
                    {text}
                </button>

                {page === 0 && (subPage === 0 || subPage === 5) ? <span style={{width: 10}}/> : null}

                {page === 0 && subPage === 0 ? <button
                    style={{background: flavorColor}}
                    onClick={() => {
                        setSubPage(5)
                        setFlav(true)
                        history.push(util.indexUrl + 'flavors')
                    }}
                >
                    Pick flavors
                </button> : null}

                {page === 0 && subPage === 5 ? <button
                    style={{background: ingredColor}}
                    onClick={() => {
                        setSubPage(0)
                        setFlav(false)
                        history.push(util.indexUrl + 'ingredients')
                    }}
                >
                    Pick ingredients
                </button> : null}
            </div>
        </div>
    )} />
}

const Heading = ({set}: {set: Function}) => (
    <Route render={({history}) => (
        <div style={{
            textAlign: 'center',
            marginBottom: 40,
        }}>
            <h1
                style={{cursor: 'pointer'}}
                onClick={() => {
                    set('page', 0)
                    set('subPage', 6)
                    history.push(util.indexUrl)
                }}
            >Infini·tea ∞ </h1>
            <h2>Unique tea blends, designed by you</h2>
        </div>
    )} />
)

const IngredPopover = ({ingred, showCb}: {ingred: Ingredient, showCb: Function}) => {
    const popoverWidth = util.onMobile() ? 300 : 500
    // const popoverWidth = '80%'
    const imgSrc = './images/' + ingred.name.toLowerCase() + '.jpg'
    let organicTag = null
    if (ingred.organic === 1) {
        organicTag = <h4>USDA certified organic</h4>
    } else if (ingred.organic === 2) {
        organicTag = <h4>Organic</h4>
    }

    return (
        <div style={{
            width: popoverWidth,
            cursor: 'pointer',
            border: '1px solid black',
            // zIndex and background are both required to
            // have it show over other items.
            zIndex: 999,
            background: 'white',
            position: 'fixed',
            margin: 'auto',
            left: '50%',
            top: '50%',
            marginLeft: -popoverWidth / 2,
            // Correction factor for text.
            marginTop: -(popoverWidth + 120) / 2
        }}
             onClick={() => showCb()}
        >
            <h4>{ingred.name}</h4>
            <p style={{fontSize: util.onMobile() ? 12 : 14}}>{ingred.description}</p>
            {organicTag}
            <img style={{display: 'flex', margin: 'auto'}} src={imgSrc}
                 height={popoverWidth} width={popoverWidth}/>
        </div>
    )
}

interface IngredCardProps {
    ingredient: Ingredient
    val: number
    selectCb: Function
}

interface IngredCardState {
    showPopover: boolean
}

class IngredientCard extends React.Component<IngredCardProps, IngredCardState> {
    // Make selectCb null to hide the slider
    constructor(props: IngredCardProps) {
        super(props)
        this.state = {showPopover: false}

        this.togglePopover = this.togglePopover.bind(this)
    }

    togglePopover() {
        this.setState({showPopover: !this.state.showPopover})
    }

    render() {
        const ingredient = this.props.ingredient
        const val = this.props.val
        const selectCb = this.props.selectCb

        const imgSrc = './images/' + ingredient.name.toLowerCase() + '.jpg'

        const selectedColor = '#3330ab'
        let style = {
            // Don't use the pointer if
            // cursor: selectCb !== null ? null :'pointer',
            cursor :'pointer',
            borderWidth: 5,
            borderStyle: 'solid',
            borderColor: 'white',  // not-selected
            borderRadius: '50%',
        }

        // Select color rather than style to keep the card from changing size.
        if (val > 0) {
            style.borderColor = selectedColor
        }

        return (
            <div style={{
                textAlign: 'center',
                width: util.onMobile() ? 80 : 120,
                marginLeft: 20,
                marginRight: 20,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center'
            }}>
                <h4 style={{
                    color: val > 0 ? selectedColor : 'black',
                    height: '1.1em'
                }}>
                    {ingredient.name}
                </h4>

                <img src={imgSrc}
                     style={style}
                     width={64} height={64}
                     onClick={() => this.togglePopover()}
                />

                {this.state.showPopover ?
                    <IngredPopover ingred={ingredient} showCb={this.togglePopover} /> : null}

                {/*  textAlign left or slider will be in the wrong place. */}
                {selectCb !== null ? <div style={{
                    marginTop: 20,
                    marginBottom: 0,
                    textAlign: 'left',
                    cursor: 'pointer',
                    alignSelf: 'stretch'
                }}>
                    <Rheostat
                        min={0}
                        max={100}
                        values={[val]}
                        onChange={(e: any) => selectCb(e.values[0])}
                    />
                </div> : null}
            </div>
        )
    }
}

// const BlendDisplay = ({ingredients, ingSelection}:
//                           {ingredients: Ingredient[], ingSelection: Map<number, number>}) => (
//     <div>
//
//     </div>
// )

interface PickerProps {
    ingredients: Ingredient[]
    title: string
    description: string
    blend: Blend
    ingSelection: Map<number, number>
    selectCB: Function
    titleCb: Function
    descriptionCb: Function
}

interface PickerState {
    title: string
    description: string
}

const Picker = ({ingredients, title, descrip, blend, ingSelection, selectCb, titleCb, descripCb}:
                    {ingredients: Ingredient[], title: string, descrip: string,
                        blend: Blend, ingSelection: Map<number, number>
                        selectCb: Function, titleCb: Function, descripCb: Function}) => {

    // todo text entry is so slow.
    const selected = ingredients.filter(ing => ingSelection.get(ing.id) > 0)
    let selectedDisplay = selected.reduce((acc, ing) => (acc + " " + ing.name + ": " +
        util.ingPortion(blend, ingSelection.get(ing.id)) + "%,"), "")
    selectedDisplay = selectedDisplay.slice(0, -1)  // Remove final trailing comma.

    const blendText = selected.length > 0 ? "Your blend: " + selectedDisplay :
        "Use the sliders to add ingredients. Click the pictures for details."

    // Ensure the instruction height's large enough to prevent the line changing
    // sizes or overlapping text when many ingredients are selected.
    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gridTemplateRows: util.onMobile() ? '5em' : '3em' + ' auto 250px',
            gridTemplateAreas: '"instructions" "ingredients" "title"',
            justifyItems: 'center',
            alignItems: 'center',
        }}>

            <div style={{gridArea: 'instructions'}}>

                <h3>{blendText}</h3>
            </div>

            <div style={{
                gridArea: 'ingredients',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
            }}>
                {ingredients.map(ing => <IngredientCard
                    key={ing.id}
                    ingredient={ing}
                    // TS bug where includes is rejected.
                    val={ingSelection.get(ing.id)}
                    selectCb={(val: number) => selectCb(ing.id, val)}
                />)}
            </div>

            {/*<BlendDisplay ingredients={ingredients} ingSelection={ingSelection}/>*/}
            <util.TitleForm title={title} descrip={descrip} titleCb={titleCb} descripCb={descripCb} />

        </div>
    )
}


const YourBlend = ({blend}: {blend: Blend}) => (
    <>
        <h3>Your blend</h3>
        <div style={{display: 'flex', flexWrap: 'wrap'}}>
            {blend.ingredients.map(ing =>
                <IngredientCard key={ing[0].id} ingredient={ing[0]} val={ing[1]} selectCb={null}/>
            )}
        </div>
    </>
)

function blendNameSimple(blend: Blend) {
    return "Ingredients: " + blend.ingredients.map(ing => ing[0].name).join(', ')
}

const sizeSelStyle = {
    cursor: 'pointer',
    height: 60,
    border: '1px solid black',
    marginTop: 20,
    // paddingTop: 30,
    paddingLeft: 20,
}

const OrderDetails = ({sizeSelected, blend, title, description, sizeCb}:
                          {sizeSelected: number, blend: Blend,
                              title: string, description: string, sizeCb: Function}) => (
    // For selecting amount etc.
    <div style={{
        display: 'flex',
        flexDirection: 'column',
        margin: 'auto',
        justifyContent: 'center',
    }}>
        {/* Overlay the title over the image.*/}
        <div style={{display: 'flex', position: 'relative', margin: 'auto', textAlign: 'center'}}>
            <img src={'./images/bag.jpg'} style={{maxHeight: 400}}/>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                textAlign: 'left',
                width: 200,
                position: 'absolute',
                top: 52, left: 20,
            }}>
                <h4 style={{fontSize: 9, marginBottom: 5}}>{title}</h4>
                <p style={{fontSize: 7, marginTop: 0, marginBottom: 5, fontStyle: 'italic'}}>{description}</p>
                <p style={{fontSize: 7, marginTop: 0}}>{blendNameSimple(blend)}</p>
            </div>
        </div>

        <YourBlend blend={blend} />

        <div
            style={{...sizeSelStyle, backgroundColor: sizeSelected === 50 ? '#bccddd': 'white'}}
            onClick={() => sizeCb(50)}
        >
            <h4>{'50 grams (~1.8 oz): $' +  util.priceDisplay(util.calcPrice(blend, 50))}</h4>
        </div>

        <div
            style={{...sizeSelStyle, backgroundColor: sizeSelected === 100 ? '#bccddd': 'white'}}
            onClick={() => sizeCb(100)}
        >
            <h4>{'100 grams (~3.5 oz): $' +  util.priceDisplay(util.calcPrice(blend, 100))}</h4>
        </div>

        <div
            style={{...sizeSelStyle, backgroundColor: sizeSelected === 200 ? '#bccddd': 'white'}}
            onClick={() => sizeCb(200)}
        >
            <h4>{'200 grams (~7 oz): $' +  util.priceDisplay(util.calcPrice(blend, 200))}</h4>
        </div>

        <div style={{marginTop: 20}}>
            <h4>{"Flat-rate shipping: $" + util.priceDisplay(shippingPrice)}, via USPS Priority Mail</h4>
        </div>
    </div>
)


const OrderPlaced = () => (
    <>
        <h1 style={{color: '#9ae27f'}}>Order placed successfully!</h1>
        <h3>We'll send a confirmation email with order details soon</h3>
    </>
)

const OrderFailed = () => (
    <>
        <h1 style={{color: '#e25f45'}}>There was a problem placing your order. 😞</h1>
        <h3>If this happens again, please let us know.</h3>
    </>
)

const DispButton = ({text, route, subPage, primary, set}: {text: string, route: string,
    subPage: number, primary: boolean, set: Function}) => (
    <Route render={({history}) => (
        <button style={primary? util.primaryStyle : null}
             onClick={() => {
                 set('subPage', subPage)
                 history.push(util.indexUrl + route)
             }
             }>{text}
        </button>
    )} />
)

const Start = ({setPage, setFlav}: {setPage: Function, setFlav: Function}) => {
    const style={
        cursor: 'pointer',
        padding: '100px 30px',
        gridRow: '1 / 2'
    }
    // {/*<div style={{display: 'flex', height: 300, alignItems: 'center',*/}
    // {/*justifyContent: 'center', textAlign: 'center', margin: 'auto'}}>*/}
    // Grid is perhaps overkill compared to flex, but I can't get the flex items
    // to vertically-center.
    return (
        <Route render={({history}) => (
            <div style={{
                display: 'grid',
                gridTemplateRows: '1fr',
                gridTemplateColumns: '1fr 1fr',
                textAlign: 'center',
                margin: 'auto',
                height: 300
            }}>

                <div style={{...style, gridColumn: '1 / 2', background: flavorColor}}
                     onClick={() => {
                         setPage(5)
                         setFlav(true)
                         history.push(util.indexUrl + 'flavors')
                     }}>
                    <h3 style={{fontSize: util.onMobile() ? 14 : null}}>
                        Pick flavors
                    </h3>
                    <h4 style={{fontSize: util.onMobile() ? 12 : null}}>
                        We'll build your tea - fast and easy</h4>
                </div>

                <div style={{...style, gridColumn: '2 / 3', background: ingredColor}}
                     onClick={() => {
                         setPage(0)
                         setFlav(false)
                         history.push(util.indexUrl + 'ingredients')
                     }}>
                    <h3 style={{fontSize: util.onMobile() ? 14 : null}}>
                        Design it yourself
                    </h3>
                    <h4 style={{fontSize: util.onMobile() ? 12 : null}}>
                        Fully customizable</h4>
                </div>

            </div>
        )} />
    )
}

interface MainProps {
    initialPage: number
}

interface MainState {
    page: number  // 0: Tea  1: About  2: Privacy  3: Terms
    // 0: Ingredient picker  1:  Size  2: Checkout  3: Order placed  4: Order failed  5: Flavor picker  6: Start
    subPage: number
    ingredients: Ingredient[]  // All ingredients, passed from the DB.

    ingSelection: Map<number, number> // <ingredient id, amount selected>
    flavorSelection: Map<number, boolean>

    sizeSelected: number
    title: string
    description: string
    notes: string
    address: Address
    flavorMode: boolean
}

class Main extends React.Component<MainProps, MainState> {
    constructor(props: MainProps) {
        super(props)

        const flavorSelection = new Map()
        flavorSelection.set(0, true)

        this.state = {
            page: this.props.initialPage,
            subPage: 6,
            ingredients: [],

            ingSelection: new Map(),
            flavorSelection: flavorSelection,
            title: "",
            description: "",
            sizeSelected: 50,
            notes: '',

            address: {
                name: "",
                email: "",
                country: "usa",
                address1: "",
                address2: "",
                city: "",
                state: "",
                postal: "",
                phone: ""
            },
            flavorMode: false
        }

        // Populate ingredients from the database.
        axios.get(util.BASE_URL + 'ingredients').then(
            (resp) =>{
                const ingredients: Ingredient[] = resp.data.results

                this.setState({ingredients: ingredients})
                let ingSelection = new Map()
                for (let ing of ingredients) {
                    ingSelection.set(ing, 0)
                }
                this.setState({ingSelection: ingSelection})
            }
        )

        this.set = this.set.bind(this)
        this.changeAddress = this.changeAddress.bind(this)
        this.changeIngVal = this.changeIngVal.bind(this)
        this.order = this.order.bind(this)
        this.nav = this.nav.bind(this)
        this.ingSelFromAr = this.ingSelFromAr.bind(this)
    }

    set(attr: string, val: any) {
        this.setState({[attr]: val} as any)
    }

    changeAddress(attr: string, val: any) {
        this.setState({
            address: {...this.state.address, [attr]: val}
        })
    }

    changeIngVal(id: number, val: number) {
        let modifiedSel = this.state.ingSelection
        modifiedSel.set(id, val)
        this.setState({ingSelection: modifiedSel})
    }

    order(selected: Ingredient[], blend: Blend, token: any) {
        axios.post(
            util.BASE_URL + 'order',
            {
                address: this.state.address,
                blend: blend,
                size: this.state.sizeSelected,
                notes: this.state.notes,
                stripeToken: token
            }
        ).then(
            (resp) => {
                if (resp.data.success) {
                    this.set('subPage', 3)
                    console.log('Success')
                } else {
                    this.set('subPage', 4)
                    console.log("Failure")
                }
            }
        )
    }

    nav() {
        // Catch what we appended to the URL using the history/router.
        if (location.href.includes('size')) {
            this.set('subPage', 1)
            this.set('page', 0)
        } else if (location.href.includes('flavors')) {
            this.set('subPage', 5)
            this.set('page', 0)
        } else if (location.href.includes('ingredients')) {
            this.set('subPage', 5)
            this.set('page', 0)
        } else if (location.href.includes('checkout')) {
            this.set('subPage', 2)
            this.set('page', 0)
        } else if (location.href.includes('about')) {
            this.set('subPage', 1)
        } else {  // We're going back to the main page with nothing appended to the url.
            this.set('subPage', 6)
            this.set('page', 0)
        }
    }

    ingSelFromAr(ings: [number, number][]) {
        // Replace the selected ingredients with a new one, generated by the
        // flavor-based page.
        let newSel = new Map()  // empty
        this.state.ingSelection.forEach(
            (val, key, map) => {
                newSel.set(key, 0)
            }
        )

        for (let ing of ings) {
            newSel.set(ing[0], ing[1])
        }

        this.setState({ingSelection: newSel})
    }

    render() {
        // This handles forward in addition to back.
        window.onpopstate = this.nav

        const selected = this.state.ingredients.filter(ing => this.state.ingSelection.get(ing.id) > 0)
        const ingredients = selected.map(s => ([s, this.state.ingSelection.get(s.id)]))

        const blend: Blend = {
            title: this.state.title,
            description: this.state.description,
            ingredients: ingredients as any
        }

        let mainDisplay = <Picker
            ingredients={this.state.ingredients}
            blend={blend}
            title={this.state.title}
            descrip={this.state.description}
            ingSelection={this.state.ingSelection}
            selectCb={this.changeIngVal}
            titleCb={(title: string) => this.set('title', title)}
            descripCb={(descrip: string) => this.set('description', descrip)}
        />

        // Only show the size and price option if at least one ingredient is selected.
        let numSelected = 0
        this.state.ingSelection.forEach(
            (val, key, map) => {
                if (val) {numSelected += 1}
            }
        )

        let nextDisplayButtons = (<div />)

        // Only allow the user to proceed if 1 or more ingredients are selected.
        if (numSelected > 0 && this.state.subPage !== 5) {
            nextDisplayButtons = (
                <DispButton text="Continue ⇒" route="size" subPage={1}
                            primary={true} set={this.set} />
            )
        }

        if (this.state.subPage === 1) {
            mainDisplay = <OrderDetails
                sizeSelected={this.state.sizeSelected}
                blend={blend}
                title={this.state.title}
                description={this.state.description}
                sizeCb={(size: number) => this.set('sizeSelected', size)}
            />
            nextDisplayButtons = (
                <div style={{'display': 'flex', 'margin': 'auto'}}>
                    {this.state.flavorMode ? <DispButton text="⇐ Change flavors" route="flavors" subPage={5}
                                                         primary={false} set={this.set}/>
                        :
                        <DispButton text="⇐ Change ingredients" route="ingredients" subPage={0}
                                    primary={false} set={this.set}/>
                    }
                    <DispButton text="Checkout ⇒" route="checkout" subPage={2}
                                primary={true} set={this.set} />
                </div>
            )
        }

        else if (this.state.subPage === 2)  {
            mainDisplay = <CheckoutForm
                blend={blend}
                size={this.state.sizeSelected}
                price={util.calcPrice(blend, this.state.sizeSelected)}
                shippingPrice={shippingPrice}
                address={this.state.address}
                orderCb={(token: any) => this.order(selected, blend, token)}
                addressCb={this.changeAddress}
            />
            nextDisplayButtons = (
                <div style={{'display': 'flex', 'margin': 'auto'}}>
                    {this.state.flavorMode ?
                        <DispButton text="⇐⇐ Change flavors" route="flavors"
                                    subPage={5}
                                    primary={false} set={this.set}/> :
                        <DispButton text="⇐⇐ Change ingredients" route="ingredients"
                                    subPage={0}
                                    primary={false} set={this.set}/>
                    }
                    <span style={{width: 10}}/>
                    <DispButton text="⇐ Size and price" route="size" subPage={1}
                                primary={false} set={this.set} />
                </div>
            )
        }

        else if (this.state.subPage === 3)  {
            mainDisplay = <OrderPlaced />
            nextDisplayButtons = (
                <div style={{'display': 'flex', 'margin': 'auto'}}>
                    <DispButton text=" ⇐Back to the main page" route=""
                                subPage={6} primary={false} set={this.set} />
                </div>
            )
        }

        else if (this.state.subPage === 4)  {
            mainDisplay = <OrderFailed />
            nextDisplayButtons = (
                <div style={{'display': 'flex', 'margin': 'auto'}}>
                    <DispButton text=" ⇐Back to the main page" route=""
                                subPage={6} primary={false} set={this.set} />
                </div>
            )
        }

        else if (this.state.subPage === 5)  {
            mainDisplay = <FlavorPicker
                ingredients={this.state.ingredients}
                selection={this.state.flavorSelection}
                flavSelCb={(sel: Map<number, boolean>) => this.setState({flavorSelection: sel})}
                ingSelCb={this.ingSelFromAr}
                subPageCb={(sp: number) => this.setState({subPage: sp})}

                title={this.state.title}
                descrip={this.state.description}
                titleCb={(title: string) => this.set('title', title)}
                descripCb={(descrip: string) => this.set('description', descrip)}
            />
            // Keep the same buttons as the ingredient picker, set by default above.
        }

        else if (this.state.subPage === 6)  {
            mainDisplay = <Start
                setPage={(page: number) => this.set('subPage', page)}
                setFlav={(flav: boolean) => this.set('flavorMode', flav)}
            />
            nextDisplayButtons = null
        } else if (this.state.subPage > 6) { console.log("Invalid subpage set") }

        let display = mainDisplay
        if (this.state.page === 1) {
            display = <About />
        } else if (this.state.page === 2) {
            display = <Privacy />
        } else if (this.state.page === 3) {
            display = <Terms />
        }
        return (
            <Router>
                <div style={{
                    display: 'grid',
                    width: util.onMobile() ? '100%' : '80%',
                    margin: 'auto',
                    gridTemplateColumns: '1fr',
                    gridTemplateRows: 'auto 40px auto 40px 300px',
                    gridTemplateAreas: '"header" "menu" "content" "menu2" "footer"',
                }}>
                    <div style={{gridArea: 'header'}}>
                        <Heading set={this.set} />
                    </div>

                    <div style={{gridArea: 'menu'}}>
                        <Menu page={this.state.page}
                              subPage={this.state.subPage}
                              flavorMode={this.state.flavorMode}
                              setPage={(page: number) => this.set('page', page)}
                              setSubPage={(page: number) => this.set('subPage', page)}
                              setFlav={(flav: boolean) => this.set('flavorMode', flav)}
                        />
                    </div>

                    <div style={{
                        gridArea: 'content',
                        background: 'white',
                        opacity: util.mainOpacity,
                        border: "0px solid black",
                        padding: util.onMobile() ? 0 : 40
                    }}>
                        {display}
                    </div>

                    <div style={{gridArea: 'menu2', textAlign: 'center'}}>
                        {this.state.page === 0 ? nextDisplayButtons : null }
                    </div>

                    <div style={{gridArea: 'footer'}}>
                        <Footer setPage={(page: number) => this.set('page', page)} />
                    </div>
                </div>
            </Router>

        )
    }
}

ReactDOM.render(<Main initialPage={0}/>, document.getElementById('root') as HTMLElement)


