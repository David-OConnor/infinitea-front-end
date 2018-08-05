import axios from "axios"
import * as React from 'react'
import * as ReactDOM from "react-dom"
import {Button, Grid, Row, Col, ControlLabel,
    Form, FormGroup, FormControl, ButtonGroup, Image, OverlayTrigger, Panel, Popover} from 'react-bootstrap'

import CheckoutForm from './checkout'
import About from './about'
import * as util from './util'
import {Address, Blend, Ingredient, Order} from "./types"
// import {stringify} from "querystring";

const HOSTNAME = window && window.location && window.location.hostname
let ON_HEROKU = false
if (HOSTNAME === 'infinitea.herokuapp.com' || HOSTNAME === 'www.infinitea.org') {
    ON_HEROKU = true
}

export const BASE_URL = ON_HEROKU ? 'https://infinitea.herokuapp.com/api/' :
    'http://localhost:8000/api/'

const primaryColor = '#9091c2'

const buttonStyle = {
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
    fontSize: '1.2em',
}

const Menu = ({page, cb}: {page: number, cb: Function}) => {
    let text = "About"
    let destPage = 1
    if (page === 1) {
        text = "Your tea"
        destPage = 0
    }

    return (
        <div
            style={{
                height: 40,
                fontSize: '1.5em',
                ...buttonStyle,
            }}
            onClick={() => cb(destPage)}

        >
            {text}
        </div>
    )
}


// <div style={{'display': 'flex', 'margin': 'auto'}}>
//     <ButtonGroup style={{'display': 'flex', 'margin': 'auto'}}>
//         {
//             page === 0 ? <Button onClick={() => cb(1)}>About</Button> :
//                 <Button onClick={() => cb(0)}>Your tea</Button>
//         }
//
//     </ButtonGroup>
// </div>

const Heading = () => (
    <div style={{textAlign: 'center'}}>
        <h1>Infini·tea ∞ </h1>
        <h3>Your personalized tea blend</h3>
    </div>
)

// import blackteaImg from '../public/blacktea.jpg'

const IngredientCard = ({ingredient, selected, selectCb}:
                            {ingredient: Ingredient, selected: boolean, selectCb: Function}) => {

    const popover = <Popover
        id="0"  // Not sure what this does.
        placement="bottom"  // Appears to be overridden by the trigger.
        positionLeft={0}
        positionTop={0}
        title={ingredient.name}
    >{ingredient.description}</Popover>

    let style = {cursor: 'pointer', borderWidth: "5px", borderColor: "#69996a"}
    if (selected) {style['borderStyle'] = "solid"}


    return (
        <div>
            <Col xs={3}>
                <h5 style={selected ? {fontWeight: "bold"} : {}}>{ingredient.name}</h5>

                <OverlayTrigger trigger={['hover', 'focus']} placement="bottom" overlay={popover}>

                    <Image src={'./images/' + ingredient.name.toLocaleLowerCase() + '.jpg'}
                           style={style}
                           width={64} height={64} circle
                           onClick={() => selectCb(!selected)}
                        // onMouseOver={() => }
                    />
                </OverlayTrigger>
            </Col>

        </div>
    )
}

const BlendDisplay = ({ingredients, ingSelection}:
                          {ingredients: Ingredient[], ingSelection: Map<number, boolean>}) => (
    <div>

    </div>
)

const Picker = ({ingredients, ingSelection, selectCb, title, description, titleCb, descriptionCb}:
                    {ingredients: Ingredient[], ingSelection: Map<number, boolean>,
                        selectCb: Function, title: string, description: string,
                        titleCb: Function, descriptionCb: Function}) => {
    const selected = ingredients.filter(ing => ingSelection.get(ing.id))
    let selectedDisplay = selected.reduce((acc, ing) => (acc + " " + ing.name + ","), "")
    selectedDisplay = selectedDisplay.slice(0, -1)  // Remove final trailing comma.

    const blendText = selected.length > 0 ? "Your blend: " + selectedDisplay :
        "Pick an ingredient to get started"

    return (
        <div>
            <Row>
                <Col xs={12}>
                    {ingredients.map(ing => <IngredientCard
                        key={ing.id}
                        ingredient={ing}
                        // TS bug where includes is rejected.
                        selected={ingSelection.get(ing.id)}
                        selectCb={(selected: boolean) => selectCb(ing.id, selected)}
                    />)}
                </Col>
            </Row>

            <Row>
                <Col xs={12}>
                    <BlendDisplay ingredients={ingredients} ingSelection={ingSelection}/>
                </Col>
            </Row>

            <Row style={{marginTop: 50}}>
                <Col xs={12}>
                    <h4 style={{textAlign: 'center'}}>{blendText}</h4>
                </Col>
            </Row>

            <Row style={{marginTop: 30}}>
                <Col xs={10} xsOffset={1}>
                    <Form>
                        <FormGroup>
                            <ControlLabel>Title</ControlLabel>
                            <FormControl
                                type="text"
                                value={title}
                                placeholder="Serious? Fun?"
                                onChange={(e: any) => titleCb(e.target.value)}
                            />
                        </FormGroup>

                        <FormGroup>
                            <ControlLabel>Description</ControlLabel>
                            <FormControl
                                type="text"
                                value={description}
                                placeholder="Orange you glad I contain chocolate?"
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

const OrderDetails = ({sizeSelected, blend, sizeCb}:
                          {sizeSelected: number, blend: Blend, sizeCb: Function}) => (
    // For selecting amount etc.
    <div>
        <Col xs={12}>
            <Image src={'./images/bag.png'}
                   style={{'display': 'flex', 'margin': 'auto'}}
            />

            <h3>Your blend</h3>
            <ul>
                {blend.ingredients.map(ing => <li key={ing.id}>{ing.name}</li>)}
            </ul>

            <Panel bsStyle={sizeSelected === 50 ? 'primary' : 'default'}
                   style={{'cursor': 'pointer', 'backgroundColor': sizeSelected === 50 ? '#bccddd': 'white'}}
                   onClick={() => sizeCb(50)}>
                <Panel.Body>{'50 grams (~1.8 oz):  $' +  util.calcPrice(blend, 50).toString()}</Panel.Body>
            </Panel>

            <Panel bsStyle={sizeSelected === 100 ? 'primary' : 'default'}
                   style={{'cursor': 'pointer', 'backgroundColor': sizeSelected === 100 ? '#bccddd': 'white'}}
                   onClick={() => sizeCb(100)}>
                <Panel.Body>{'100 grams (~3.5 oz):  $' +  util.calcPrice(blend, 100).toString()}</Panel.Body>
            </Panel>

            <Panel bsStyle={sizeSelected === 200 ? 'primary' : 'default'}
                   style={{'cursor': 'pointer', 'backgroundColor': sizeSelected === 200 ? '#bccddd': 'white'}}
                   onClick={() => sizeCb(200)}>
                <Panel.Body>{'200 grams (~7 oz): $' +  util.calcPrice(blend, 200).toString()}</Panel.Body>
            </Panel>

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
            <Form>
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

                <Button bsStyle="primary" type="button" onClick={() => {
                    sendMessage(
                        this.state.name, this.state.email, this.state.message
                    )
                    // Now reset the form and show confirmation.
                    this.handleChange('name', "")
                    this.props.showCb(false)
                    this.props.confirmationCb(true)

                }}>Submit</Button>

                <Button type="button" onClick={() => {
                    this.handleChange('name', "")
                    this.props.showCb(false)
                }}>Discard</Button>
            </Form>
        )
    }
}

interface FooterProps {
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

                <h4>Questions? Feedback?</h4>
                {!this.state.showContact ?

                    <div
                        style={{
                            ...buttonStyle,
                        }}
                        onClick={() => {
                            this.setContactForm(true)
                            this.setConfirmation(false)
                        }}>
                        Send us a message
                    </div>

                    : null}
                {this.state.showContact ? <ContactForm
                    showCb={this.setContactForm}
                    confirmationCb={this.setConfirmation}

                /> : null}
                {this.state.showConfirmation ? <h4>Thanks for your message! 🙂</h4> : null}

                <h5 style={{textAlign: 'center'}}>© 2018 Infinitea.org</h5>
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

interface MainProps {
    // state: any
    // dispatch: Function
}

interface MainState {
    page: number
    order: Order
    ingredients: Ingredient[]  // Second param is if selected.
    ingSelection: Map<number, boolean> // <ingredient id, selected>
    mainDisplay: number // 0 for picker, 1 for order details, 2 for payment
    sizeSelected: number
    title: string
    description: string
}


class Main extends React.Component<MainProps, MainState> {
    constructor(props: MainProps) {
        super(props)
        this.state = {
            page: 0,
            order: {
                shipping_address: 1,
                items: []},
            ingredients: [],
            ingSelection: new Map(),
            mainDisplay: 0,
            sizeSelected: 50,
            title: "",
            description: "",
        }

        // Populate ingredients from the database.
        axios.get(BASE_URL + 'ingredients').then(
            (resp) =>{
                const ingredients: Ingredient[] = resp.data.results

                this.setState({ingredients: ingredients})
                let ingSelection = new Map()
                for (let ing of ingredients) {
                    ingSelection.set((ing as any).id, false)
                }
                this.setState({ingSelection: ingSelection})
            }
        )

        this.set = this.set.bind(this)
        this.addRemIngredient = this.addRemIngredient.bind(this)
        this.order = this.order.bind(this)
    }

    set(attr: string, val: any) {
        this.setState({[attr]: val} as any)
    }

    addRemIngredient(id: number, selected: boolean) {
        let modifiedSel = this.state.ingSelection
        modifiedSel.set(id, selected)
        this.setState({ingSelection: modifiedSel})
    }

    order(address: Address, token: any) {
        // todo dry from below in render()

        const selected = this.state.ingredients.filter(ing => this.state.ingSelection.get(ing.id))
        const blend: Blend = {
            title: this.state.title,
            description: this.state.description,
            ingredients: selected
        }

        axios.post(
            BASE_URL + 'order',
            {
                address: address,
                blend: blend,
                size: this.state.sizeSelected,
                stripeToken: token
            }
        ).then(
            (resp) => {
                console.log("RESP FROM DJANGO:", resp)
                if (resp.data.success) {
                    this.set('mainDisplay', 3)
                }
            }
        )
    }

    render() {
        let mainDisplay = <Picker
            ingredients={this.state.ingredients}
            ingSelection={this.state.ingSelection}
            selectCb={this.addRemIngredient}
            title={this.state.title}
            description={this.state.description}
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

        if (numSelected > 0) {
            nextDisplayButtons = (
                <div
                    style={{
                        ...buttonStyle,
                        background: primaryColor,
                    }}
                    onClick={() => this.set('mainDisplay', 1)}>Size and price
                </div>
            )
        }

        const selected = this.state.ingredients.filter(ing => this.state.ingSelection.get(ing.id))
        const blend: Blend = {
            title: this.state.title,
            description: this.state.description,
            ingredients: selected
        }

        if (this.state.mainDisplay === 1) {
            mainDisplay = <OrderDetails sizeSelected={this.state.sizeSelected}
                                        blend={blend}
                                        sizeCb={(size: number) => this.set('sizeSelected', size)}/>
            nextDisplayButtons = (
                <div style={{'display': 'flex', 'margin': 'auto'}}>
                    <div style={buttonStyle} onClick={() =>
                        this.set('mainDisplay', 0)}>⇐ Change ingredients</div>
                    <div style={{...buttonStyle, background: primaryColor}}
                         onClick={() => this.set('mainDisplay', 2)}>Checkout</div>
                </div>
            )
        }

        else if (this.state.mainDisplay === 2)  {
            mainDisplay = <CheckoutForm
                orderCb={this.order}
                blend={blend}
                size={this.state.sizeSelected}
                price={util.calcPrice(blend, this.state.sizeSelected)}
            />
            nextDisplayButtons = (
                <div style={{'display': 'flex', 'margin': 'auto'}}>
                    <div style={buttonStyle}
                         onClick={() =>
                             this.set('mainDisplay', 0)}>⇐⇐ Change ingredients
                    </div>
                    <div style={buttonStyle}
                         onClick={() =>
                             this.set('mainDisplay', 1)}>⇐ Size and price
                    </div>
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

        return (
            <Grid>
                <Row>
                    <Col xs={12} md={10} lg={8} mdOffset={1} lgOffset={2}>
                        <Heading />

                        <Menu page={this.state.page} cb={(page: number) => this.set('page', page)} />

                        <div style={{background: 'white', border: "0px solid black", padding: 40}}>
                            <Row>
                                <Col xs={12}>
                                    {this.state.page === 0 ? mainDisplay : <About />}
                                </Col>
                            </Row>
                        </div>

                        {this.state.page === 0 ? (
                            <Row style={{marginTop: 20}}>
                                <Col xs={12} style={{'display': 'flex', 'margin': 'auto'}}>
                                    {nextDisplayButtons}
                                </Col>
                            </Row>
                        ) : null }

                        <Footer />

                    </Col>
                </Row>
            </Grid>
        )
    }
}

ReactDOM.render(<Main />, document.getElementById('root') as HTMLElement)


