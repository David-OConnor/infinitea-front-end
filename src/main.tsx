import axios from "axios"
import * as React from 'react'
import * as ReactDOM from "react-dom"
import {Button, Grid, Row, Col, ControlLabel,
    Form, FormGroup, FormControl, Image, OverlayTrigger, Panel, Popover} from 'react-bootstrap'
import { BrowserRouter as Router, Route } from "react-router-dom"
// import Slider from 'rc-slider'
import 'rheostat/initialize'
import Rheostat from 'rheostat'

import About from './about'
import CheckoutForm from './checkout'
import Privacy from './privacy'
import Terms from './terms'
import * as util from './util'
import {Address, Blend, Ingredient} from "./types"


const HOSTNAME = window && window.location && window.location.hostname
let ON_HEROKU = false

if (HOSTNAME === 'infinitea.herokuapp.com' || HOSTNAME === 'www.infinitea.org'
    || HOSTNAME === 'david-oconnor.github.io') {
    ON_HEROKU = true
}

const BASE_URL = ON_HEROKU ? 'https://infinitea.herokuapp.com/api/' :
    'http://localhost:8000/api/'

const shippingPrice = 7.20  // todo sync this with DB/server-side?

const descriptions = [
    "Definitely an aphrodisiac - I'm not teasing!",
    "Orange you glad I contain chocolate?",
    "Drink me",
    "It's always tea time",
    "Would you like an adventure now, or shall we have our tea first?",
    "Made of star stuff",
]

// Generate it here, so the same value persists until the page is refreshed.
const description = descriptions[Math.floor(Math.random()*descriptions.length)]

const mainOpacity = 0.85


const Menu = ({page, cb}: {page: number, cb: Function}) => {
    let text = "About"
    let destPage = 1
    let route = 'about'
    if (page === 1 || page === 2 || page === 3) {
        text = "⇐ Your tea"
        destPage = 0
        route = ''
    }

    return <Route render={({history}) => (
        <div
            style={{
                height: 40,
                fontSize: '1.5em',
                ...util.buttonStyle,
            }}
            onClick={() => {
                cb(destPage)
                history.push(window.location.pathname + route)
            }}
        >
            {text}
        </div>

    )} />
}

const Heading = () => (
    <div style={{
        textAlign: 'center',
        fontFamily: '"Georgia", "times"',

    }}>
        <h1>Infini·tea ∞ </h1>
        <h3>Unique blends, designed by you</h3>
    </div>
)

const IngredientCard = ({ingredient, val, selectCb}:
                            {ingredient: Ingredient, val: number, selectCb: Function}) => {

    const imgSrc = './images/' + ingredient.name.toLowerCase() + '.jpg'

    const popoverWidth = 400

    let organicTag = null
    if (ingredient.organic === 1) {
        organicTag = <h5>USDA certified organic</h5>
    } else if (ingredient.organic === 2) {
        organicTag = <h5>Organic</h5>
    }

    const popover = <Popover
        style={{minWidth:  popoverWidth + 40}}
        id="0"  // Not sure what this does.
        placement="left"  // Appears to be overridden by the trigger.
        title={ingredient.name}
    >
        <p>{ingredient.description}</p>
        {organicTag}
        <img style={{display: 'flex', margin: 'auto'}} src={imgSrc}
             height={popoverWidth} width={popoverWidth} />
    </Popover>

    const selectedColor = '#3330ab'
    let style = {cursor: 'pointer', borderWidth: "5px", borderColor: selectedColor}
    if (val > 0) {style['borderStyle'] = "solid"}

    return (
        <div style={{textAlign: 'center'}}>
            <Col xs={4} md={3} lg={3}>
                <h5 style={val > 0 ? {
                        fontWeight: "bold",
                        fontFamily: '"Lucida Sans Unicode"',
                        color: selectedColor,
                        height: '2em',
                    } :
                    {fontFamily: '"Lucida Sans Unicode"', height: '2em',}}>
                    {ingredient.name}
                </h5>

                <OverlayTrigger trigger={['hover', 'focus']} placement="bottom" overlay={popover}>
                    <Image src={imgSrc}
                           style={style}
                           width={64} height={64} circle
                    />
                </OverlayTrigger>
                {/*  textAlign left or slider will be in the wrong place. */}
                <div style={{marginTop: 30, marginBottom: 30, textAlign: 'left'}}>
                    <Rheostat
                        min={0}
                        max={100}
                        values={[val]}
                        onChange={(e: any) => selectCb(e.values[0])}
                    />
                </div>
            </Col>
        </div>
    )
}

const BlendDisplay = ({ingredients, ingSelection}:
                          {ingredients: Ingredient[], ingSelection: Map<number, number>}) => (
    <div>

    </div>
)

const Picker = ({ingredients, blend, ingSelection, selectCb, titleCb, descriptionCb}:
                    {ingredients: Ingredient[], blend: Blend, ingSelection: Map<number, number>
                        selectCb: Function, titleCb: Function, descriptionCb: Function}) => {

    const selected = ingredients.filter(ing => ingSelection.get(ing.id) > 0)
    let selectedDisplay = selected.reduce((acc, ing) => (acc + " " + ing.name + ": " +
        util.ingPortion(blend, ingSelection.get(ing.id)) +  "%,"), "")
    selectedDisplay = selectedDisplay.slice(0, -1)  // Remove final trailing comma.

    const blendText = selected.length > 0 ? "Your blend: " + selectedDisplay :
        "Pick an ingredient to get started"

    return (
        <div>
            <Row style={{marginBottom: 0}}>
                <Col xs={12}>
                    {/* Ensure the height's large enough to prevent the line changing
                     sizes or overlapping text when many ingredients are selected. */}
                    <h4 style={{textAlign: 'center', height: util.onMobile() ? '5em' : '3em'}}>
                        {blendText}
                    </h4>
                    {/*<h4 style={{textAlign: 'center', height: '3em'}}>{blendText}</h4>*/}
                </Col>
            </Row>

            <Row>
                <Col xs={12}>
                    {ingredients.map(ing => <IngredientCard
                        key={ing.id}
                        ingredient={ing}
                        // TS bug where includes is rejected.
                        val={ingSelection.get(ing.id)}
                        selectCb={(val: number) => selectCb(ing.id, val)}
                    />)}
                </Col>
            </Row>

            <Row>
                <Col xs={12}>
                    <BlendDisplay ingredients={ingredients} ingSelection={ingSelection}/>
                </Col>
            </Row>



            <Row style={{marginTop: 30}}>
                <Col xs={10} xsOffset={1}>
                    <Form>
                        <FormGroup>
                            <ControlLabel>Title</ControlLabel>
                            <FormControl
                                type="text"
                                value={blend.title}
                                placeholder="Serious? Fun?"
                                onChange={(e: any) => titleCb(e.target.value)}
                            />
                        </FormGroup>

                        <FormGroup>
                            <ControlLabel>Description</ControlLabel>
                            <FormControl
                                type="text"
                                value={blend.description}
                                // Random description.
                                placeholder={description}
                                onChange={(e: any) => descriptionCb(e.target.value)}
                            />
                        </FormGroup>
                    </Form>
                </Col>
            </Row>

            <Row>
                <Col xs={12}>
                    <h5 style={{textAlign: 'center'}}>More ingredients coming soon!</h5>
                </Col>
            </Row>

        </div>
    )
}

const YourBlend = ({blend}: {blend: Blend}) => (
    <div>
        <h3>Your blend</h3>
        <ul>
            {blend.ingredients.map(ing => <li key={ing[0].id}>
                {ing[0].name + ' ' + util.ingPortion(blend, ing[1]) + '%'}
            </li>)}
        </ul>
    </div>
)

const OrderDetails = ({sizeSelected, blend, sizeCb}:
                          {sizeSelected: number, blend: Blend, sizeCb: Function}) => (
    // For selecting amount etc.
    <div>
        <Col xs={12}>
            <img src={'./images/bag.png'}
                 style={{'display': 'flex', 'margin': 'auto'}}
            />

            <YourBlend blend={blend} />

            <Panel bsStyle={sizeSelected === 50 ? 'primary' : 'default'}
                   style={{'cursor': 'pointer', 'backgroundColor': sizeSelected === 50 ? '#bccddd': 'white'}}
                   onClick={() => sizeCb(50)}>
                <Panel.Body>{'50 grams (~1.8 oz): $' +  util.priceDisplay(util.calcPrice(blend, 50))}</Panel.Body>
            </Panel>

            <Panel bsStyle={sizeSelected === 100 ? 'primary' : 'default'}
                   style={{'cursor': 'pointer', 'backgroundColor': sizeSelected === 100 ? '#bccddd': 'white'}}
                   onClick={() => sizeCb(100)}>
                <Panel.Body>{'100 grams (~3.5 oz): $' +  util.priceDisplay(util.calcPrice(blend, 100))}</Panel.Body>
            </Panel>

            <Panel bsStyle={sizeSelected === 200 ? 'primary' : 'default'}
                   style={{'cursor': 'pointer', 'backgroundColor': sizeSelected === 200 ? '#bccddd': 'white'}}
                   onClick={() => sizeCb(200)}>
                <Panel.Body>{'200 grams (~7 oz): $' +  util.priceDisplay(util.calcPrice(blend, 200))}</Panel.Body>
            </Panel>

            <div style={{marginTop: 60}}>
                <h5>{"Flat-rate shipping: $" + util.priceDisplay(shippingPrice)}, via USPS</h5>
            </div>

        </Col>

    </div>
)

function sendMessage(name: string, email: string, message: string) {
    axios.post(
        BASE_URL + 'contact',
        {name: name, email: email, message: message}
    )
}


interface ContactProps {
    showCb: Function
    confirmationCb: Function
}

interface ContactState {
    name: string
    email: string
    message: string
}

class ContactForm extends React.Component<ContactProps, ContactState> {
    constructor(props: ContactProps) {
        super(props)
        this.state = {
            name: "",
            email: "",
            message: ""
        }

    }
    handleChange(attr: string, text: string) {
        this.setState({[attr]: text} as any)
    }

    render() {
        return (
            <Form style={{background: 'white', opacity: mainOpacity, padding: 40}}>
                <FormGroup>
                    <ControlLabel>Your name</ControlLabel>
                    <FormControl
                        type="text"
                        value={this.state.name}
                        placeholder="Name"
                        onChange={(e: any) => this.handleChange('name', e.target.value)}
                    />
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Your email</ControlLabel>
                    <FormControl
                        type="text"
                        value={this.state.email}
                        placeholder="Email address"
                        onChange={(e: any) => this.handleChange('email', e.target.value)}
                    />
                </FormGroup>
                <FormGroup>
                    <ControlLabel>Message</ControlLabel>
                    <FormControl
                        componentClass="textarea"
                        value={this.state.message}
                        placeholder="Your message"
                        onChange={(e: any) => this.handleChange('message', e.target.value)}
                    />
                </FormGroup>

                <div style={{display: 'flex', margin: 'auto'}}>
                    <div
                        style={{...util.buttonStyle, background: util.primaryColor}}
                        onClick={() => {
                            sendMessage(
                                this.state.name, this.state.email, this.state.message
                            )
                            // Now reset the form and show confirmation.
                            this.handleChange('name', "")
                            this.props.showCb(false)
                            this.props.confirmationCb(true)

                        }}>Submit</div>

                    <div
                        style={util.buttonStyle}
                        onClick={() => {
                            this.handleChange('name', "")
                            this.props.showCb(false)
                        }}>Discard</div>
                </div>
            </Form>
        )
    }
}

interface FooterProps {
    setPage: Function
}

interface FooterState {
    showContact: boolean
    showConfirmation: boolean
}


class Footer extends React.Component<FooterProps, FooterState> {
    constructor(props: FooterProps) {
        super(props)
        this.state = {showContact: false, showConfirmation: false}

        this.setContactForm = this.setContactForm.bind(this)
        this.setConfirmation = this.setConfirmation.bind(this)
    }

    setContactForm(show: boolean) {
        this.setState({showContact: show})
    }
    setConfirmation(show: boolean) {
        this.setState({showConfirmation: show})
    }

    render() {
        return (
            <div>
                <br />
                <br />

                {/*<h4 style={{textAlign: 'center'}}>Questions? Feedback?</h4>*/}
                {!this.state.showContact ?

                    <div
                        style={{
                            ...util.buttonStyle,
                            height: 60,
                        }}
                        onClick={() => {
                            this.setContactForm(true)
                            this.setConfirmation(false)
                        }}>
                        Questions? Feedback?
                        Send us a message
                    </div>

                    : null}
                {this.state.showContact ? <ContactForm
                    showCb={this.setContactForm}
                    confirmationCb={this.setConfirmation}

                /> : null}
                {this.state.showConfirmation ?
                    <div style={{
                        display: 'flex',
                        margin: 'auto',
                        marginTop: 40,
                        paddingTop: 20,
                        paddingLeft: 30,
                        background: 'white',
                        opacity: mainOpacity,
                        textAlign: 'center',
                        width: 300,
                        height: 80,
                    }}>
                        <h4>
                            Thanks for your message! 🙂
                        </h4>
                    </div>: null}

                <Route render={({history}) => (
                    <h5 style={{textAlign: 'center', color: 'white', cursor: 'pointer', textDecoration: 'underline'}}>
                        <span
                            onClick={() => {
                                history.push('/' + 'privacy')
                                this.props.setPage(2)
                                window.scrollTo(0, 0)
                            }}
                        >Privacy policy</span>

                        <span style={{marginLeft: '1em'}}
                              onClick={() => {
                                  history.push('/' + 'terms')
                                  this.props.setPage(3)
                                  window.scrollTo(0, 0)
                              }}
                        >Terms & conditions</span>
                    </h5>
                )} />

                <h5 style={{textAlign: 'center', color: 'white'}}>© 2018 Infinitea.org</h5>
            </div>
        )
    }
}

const OrderPlaced = () => (
    <div>
        <h1 style={{color: '#9ae27f'}}>Order placed successfully!</h1>
        <h3>We'll send a confirmation email with order details soon</h3>
    </div>
)

const OrderFailed = () => (
    <div>
        <h1 style={{color: '#e25f45'}}>There was a problem placing your order. 😞</h1>
        <h3>If this happens again, please let us know.</h3>
    </div>
)


const DispButton = ({text, route, page, primary, cb}: {text: string, route: string,
    page: number, primary: boolean, cb: Function}) => (
    <Route render={({history}) => (
        <div style={primary? {...util.buttonStyle, background: util.primaryColor} : util.buttonStyle}
             onClick={() => {
                 cb('mainDisplay', page)
                 history.push(window.location.pathname + route)
             }
             }>{text}
        </div>
    )} />
)

interface MainProps {
}

interface MainState {
    page: number
    mainDisplay: number // 0 for picker, 1 for order details, 2 for payment
    ingredients: Ingredient[]

    ingSelection: Map<number, number> // <ingredient id, amount selected, 0 - 1.>
    sizeSelected: number
    title: string
    description: string
    notes: string
    address: Address
}

class Main extends React.Component<MainProps, MainState> {
    constructor(props: MainProps) {
        super(props)
        this.state = {
            page: 0,
            mainDisplay: 0,
            ingredients: [],

            ingSelection: new Map(),
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
            }
        }

        // Populate ingredients from the database.
        axios.get(BASE_URL + 'ingredients').then(
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
            BASE_URL + 'order',
            {
                address: this.state.address,
                blend: blend,
                size: this.state.sizeSelected,
                notes: this.state.notes,
                stripeToken: token
            }
        ).then(
            (resp) => {
                console.log("RESP FROM DJANGO:", resp)
                if (resp.data.success) {
                    this.set('mainDisplay', 3)
                } else {
                    this.set('mainDisplay', 4)
                }
            }
        )
    }

    nav() {
        // Catch what we appended to the URL using the history/router.
        if (location.href.includes('size')) {
            this.set('mainDisplay', 1)
            this.set('page', 0)
        } else if (location.href.includes('checkout')) {
            this.set('mainDisplay', 2)
            this.set('page', 0)
        } else if (location.href.includes('about')) {
            this.set('page', 1)
        } else {  // We're going back to the main page with nothing appended to the url.
            this.set('mainDisplay', 0)
            this.set('page', 0)
        }
    }

    render() {
        // Todo this handles forward in addition to back.
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
            ingSelection={this.state.ingSelection}
            selectCb={this.changeIngVal}
            titleCb={(title: string) => this.set('title', title)}
            descriptionCb={(descrip: string) => this.set('description', descrip)}
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
        if (numSelected > 0) {
            nextDisplayButtons = (
                <DispButton text="Size and price" route="size" page={1}
                            primary={true} cb={this.set} />
            )
        }

        if (this.state.mainDisplay === 1) {
            mainDisplay = <OrderDetails
                sizeSelected={this.state.sizeSelected}
                blend={blend}
                sizeCb={(size: number) => this.set('sizeSelected', size)}
            />
            nextDisplayButtons = (
                <div style={{'display': 'flex', 'margin': 'auto'}}>
                    <DispButton text="⇐ Change ingredients" route="" page={0}
                                primary={false} cb={this.set} />
                    <DispButton text="Checkout" route="checkout" page={2}
                                primary={true} cb={this.set} />
                </div>
            )
        }

        else if (this.state.mainDisplay === 2)  {
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
                    <DispButton text="⇐⇐ Change ingredients" route="" page={0}
                                primary={false} cb={this.set} />
                    <span style={{width: 10}}/>
                    <DispButton text="⇐ Size and price" route="size" page={1}
                                primary={false} cb={this.set} />
                </div>
            )
        }

        else if (this.state.mainDisplay === 3)  {
            mainDisplay = <OrderPlaced />
            nextDisplayButtons = (
                <div style={{'display': 'flex', 'margin': 'auto'}}>
                    <Button onClick={() => this.set('mainDisplay', 0)}>⇐ Back to the main page</Button>
                </div>
            )
        }

        else if (this.state.mainDisplay === 4)  {
            mainDisplay = <OrderFailed />
            nextDisplayButtons = (
                <div style={{'display': 'flex', 'margin': 'auto'}}>
                    <Button onClick={() => this.set('mainDisplay', 0)}>⇐ Back to the main page</Button>
                </div>
            )
        }

        let display = mainDisplay
        if (this.state.page === 1) {
            display = <About />
        } else if (this.state.page === 2) {
            display = <Privacy />
        } else if (this.state.page === 3) {
            display = <Terms />
        }

        return (

            <Grid>
                <Router>
                    <Row>
                        <Col xs={12} md={10} lg={10} mdOffset={1} lgOffset={1}>
                            <Heading />
                            <Menu page={this.state.page} cb={(page: number) => this.set('page', page)} />

                            <div style={{background: 'white', opacity: mainOpacity, border: "0px solid black", padding: 40}}>
                                <Row>
                                    <Col xs={12}>{display}</Col>
                                </Row>
                            </div>

                            {this.state.page === 0 ? (
                                <Row style={{marginTop: 20}}>
                                    <Col xs={12} style={{'display': 'flex', 'margin': 'auto'}}>
                                        {nextDisplayButtons}
                                    </Col>
                                </Row>
                            ) : null }
                            <Footer setPage={(page: number) => this.set('page', page)} />
                        </Col>
                    </Row>
                </Router>
            </Grid>

        )
    }
}

ReactDOM.render(<Main />, document.getElementById('root') as HTMLElement)


