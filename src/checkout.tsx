// Example at this JSFiddle: https://jsfiddle.net/xux7qzch/1073/
// and this Githug page: https://github.com/stripe/react-stripe-elements


import * as React from "react";
import {
    CardElement,
    Elements,
    StripeProvider,
    injectStripe,
} from "react-stripe-elements"
import {
    Col,
    ControlLabel,
    Form,
    FormControl,
    FormGroup, Row
} from 'react-bootstrap'

import {Address, Blend, Ingredient} from "./types";
import * as util from './util'
import axios from "axios";


// Min lengths for address validation
const minName = 3
const minEmail = 4
const minAddress1 = 6
const minAddress2 = 0
const minCity = 3
const minState = 2
const minPostal = 5
const maxPostal = 10
const minPhone = 10
const maxPhone = 15


const validStyle = {borderColor: 'green'}
const invalidStyle = {borderColor: '#b4677e'}

// todo duped from main!
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


// todo lots of messy code relating to styling the Stripe card element.
const cardOptions = () => {
    return {
        style: {
            base: {
                color: 'black',
                // border: '5px solid orange',
                // letterSpacing: '0.025em',
                // fontFamily: 'Source Code Pro, monospace',
                // fontFamily: 'Helvetica Neue",Helvetica,Arial,sans-serif',
                // fontSize: '14px',
                // padding: '6px 14px',
                '::placeholder': {
                    color: '#aab7c4',
                    fontFamily: 'Helvetica Neue",Helvetica,Arial,sans-serif',
                    fontSize: '14px',
                },
            },
            invalid: {
                color: '#b4677e',
            },
        },
    }
}

const inputStyle = {
    display: 'block',
    margin: '10px 0 20px 0',
    padding: '6px 14px',
    fontSize: 14,
    fontFamily: 'Helvetica Neue",Helvetica,Arial,sans-serif',
    // fontFamily: "'Source Code Pro', monospace",
    boxShadow: "rgba(50, 50, 93, 0.14902) 0px 1px 3px, rgba(0, 0, 0, 0.0196078) 0px 1px 0px",
    border: '2px solid black',
    borderRadius: 4,
    background: 'white',
    // backgroundCo: '#ff1111'
}

const AddressForm = ({address, cb}: {address: Address, cb: Function}) => {
    return (
        <Form>
            <h5> Only orders to US addresses accepted at this time.
                Expect international shipping in the future!</h5>
            <h4>Shipping address</h4>

            <FormGroup>
                <ControlLabel>Your name</ControlLabel>
                <FormControl
                    style={address.name.length >= minName ? validStyle : invalidStyle}
                    type="text"
                    value={address.name}
                    placeholder="Name"
                    onChange={(e: any) => cb('name', e.target.value)}
                />
            </FormGroup>

            <FormGroup>
                <ControlLabel>Email address</ControlLabel>
                <FormControl
                    style={address.email.length >= minEmail && address.email.includes('@') &&
                    address.email.includes('.') ? validStyle : invalidStyle}
                    type="text"
                    value={address.email}
                    placeholder="Email"
                    onChange={(e: any) => cb('email', e.target.value)}
                />
            </FormGroup>

            <FormGroup>
                <ControlLabel>Address, line 1</ControlLabel>
                <FormControl
                    style={address.address1.length >= minAddress1 ? validStyle : invalidStyle}
                    type="text"
                    value={address.address1}
                    placeholder="Address 1"
                    onChange={(e: any) => cb('address1', e.target.value)}
                />
            </FormGroup>

            <FormGroup>
                <ControlLabel>Address, line 2 (eg apartment #)</ControlLabel>
                <FormControl
                    style={address.address2.length >= minAddress2 ? validStyle : invalidStyle}
                    type="text"
                    value={address.address2}
                    placeholder="(Optional)"
                    onChange={(e: any) => cb('address2', e.target.value)}
                />
            </FormGroup>

            <FormGroup>
                <ControlLabel>City</ControlLabel>
                <FormControl
                    style={address.city.length >= minCity ? validStyle : invalidStyle}
                    type="text"
                    value={address.city}
                    placeholder="City"
                    onChange={(e: any) => cb('city', e.target.value)}
                />
            </FormGroup>

            <FormGroup>
                <ControlLabel>State</ControlLabel>
                <FormControl
                    style={address.state.length >= minState ? validStyle : invalidStyle}
                    type="text"
                    value={address.state}
                    placeholder="State"
                    onChange={(e: any) => cb('state', e.target.value)}
                />
            </FormGroup>

            <FormGroup>
                <ControlLabel>Postal (ZIP) code</ControlLabel>
                <FormControl
                    style={address.postal.length >= minPostal && address.postal.length <= maxPostal ? validStyle : invalidStyle}
                    type="text"
                    value={address.postal}
                    placeholder="Postal code"
                    onChange={(e: any) => cb('postal', e.target.value)}
                />
            </FormGroup>

            <FormGroup>
                <ControlLabel>Phone number</ControlLabel>
                <FormControl
                    style={address.phone.length >=minPhone &&
                    address.phone.length <= maxPhone ? validStyle : invalidStyle}
                    type="text"
                    value={address.phone}
                    placeholder="Phone number"
                    onChange={(e: any) => cb('phone', e.target.value)}
                />
            </FormGroup>
        </Form>
    )
}

interface CardFormProps {  // Not working for some reason.
    stripe: any
    fontSize: string
    orderCb: Function
    addressValid: boolean
    processing: boolean
    processingCb: Function
}


class _CardForm extends React.Component<any, any> {

    constructor(props: any) {
        super(props)
        this.state = {
           cardValid: false
        }

        this.setValid = this.setValid.bind(this)
    }

    setValid = (valid: boolean) => this.setState({cardValid: valid})

    handleSubmit = (ev: Event) => {
        this.props.processingCb(true)
        if (this.props.stripe) {
            this.props.stripe
                .createToken()
                .then((payload: any) => {
                        if (payload.token) {
                            this.props.processingCb(false)
                            this.props.orderCb(payload.token)
                        }
                        else {
                            this.props.processingCb(false)
                            console.log("OOps, payment error :(")
                        }
                    }
                )
        } else {
            this.props.processingCb(false)
            console.log("Stripe.js hasn't loaded yet.");
        }
    }

    render() {
        return (
            <Form
                style={{marginTop: 60}}
                onSubmit={this.handleSubmit as any}>
                <FormGroup>
                    <ControlLabel>Card details</ControlLabel>
                    <div style={{
                        display: 'block',
                        padding: '6px 12px',
                        border: '1px solid',
                        borderColor: this.state.cardValid ? 'green' : '#b4677e',
                        borderRadius: 4,
                        height: 34,
                        fontSize: 14,
                        lineHeight: 1.4286,
                        color: '#555',

                    }}>
                        <CardElement
                            style={inputStyle}
                            onChange={(e) => {
                                this.setValid(e.complete && e.error === undefined)
                            }}
                            {...cardOptions()}

                        />
                    </div>
                    {
                        this.props.addressValid && this.state.cardValid && !this.props.processing ?
                            <div
                                style={{...util.primaryStyle, marginTop: 30}}
                                onClick={(e: any) => this.handleSubmit(e)}
                            >Place Order</div> : null
                    }
                </FormGroup>
            </Form>
        );
    }
}
const CardForm = injectStripe(_CardForm);


interface CheckoutProps {
    address: Address
    orderCb: Function
    addressCb: Function
}

interface CheckoutState {
    elementFontSize: string
    processing: boolean  // Weather we're processing the order.
}

class Checkout extends React.Component<CheckoutProps, CheckoutState> {
    constructor(props: CheckoutProps) {
        super(props)
        this.state = {
            elementFontSize: util.onMobile() ? '14px' : '18px',
            processing: false
        }

        window.addEventListener('resize', () => {
            if (util.onMobile() && this.state.elementFontSize !== '14px') {
                this.setState({elementFontSize: '14px'});
            } else if (
                !util.onMobile() &&
                this.state.elementFontSize !== '18px'
            ) {
                this.setState({elementFontSize: '18px'});
            }
        })

        this.setProcessing = this.setProcessing.bind(this)
    }

    setProcessing(val: boolean) {
        this.setState({processing: val})
    }

    render() {
        const {elementFontSize} = this.state


        const address = this.props.address  // shortener
        let addressValid = false
        if (address.name.length >= minName && address.email.length >= minEmail &&
            address.email.includes('@') && address.email.includes('.') &&
            address.address1.length >= minAddress1 &&
            address.address2.length >= minAddress2 && address.city.length >= minCity &&
            address.state.length >= minState && address.postal.length >= minPostal &&
            address.postal.length <= maxPostal &&
            address.phone.length >= minPhone && address.phone.length <= maxPhone) {
            addressValid = true
        }

        return (
            <div style={{margin: '0px auto', maxWidth: 800, boxSizing: 'border-box', padding: '0 5px'}}>
                <AddressForm address={this.props.address} cb={this.props.addressCb}/>

                <Elements>
                    <CardForm
                        fontSize={elementFontSize}
                        addressValid={addressValid}
                        processing={this.state.processing}
                        orderCb={this.props.orderCb}
                        processingCb={this.setProcessing}
                    />
                </Elements>

                {this.state.processing ? <h4>Processing your order...</h4> : null}
            </div>
        )
    }
}

export default ({blend, size, price, shippingPrice, address, orderCb, addressCb}:
                    {blend: Blend, size: number, price: number, shippingPrice: number,
                        address: Address, orderCb: Function, addressCb: Function}) => (
    <div>
        <h2 style={{textAlign: 'center'}}>Your order summary</h2>

        <div style={{
            marginTop: 50,
            fontFamily: 'Georgia',
            background: '#c9d1e7',

        }}>
            <h3 style={{textAlign: 'center'}}>{blend.title}</h3>
            <p style={{textAlign: 'center'}}>{blend.description}</p>
        </div>

        <Row style={{marginBottom: 60}}>
            <Col xs={6}>
                <YourBlend blend={blend} />
            </Col>

            <Col xs={6}>
                <h4 style={{textAlign: 'left'}}>Size: {size + " grams"}</h4>
                <h4 style={{textAlign: 'left'}}>Price: {"$" + util.priceDisplay(price) + " + $" +
                util.priceDisplay(shippingPrice) + " shipping"}</h4>
                <h4 style={{textAlign: 'left'}}>{"Total: $" + util.priceDisplay(price + shippingPrice)}</h4>
            </Col>
        </Row>

        <StripeProvider apiKey="pk_test_hf9oqK2GfiqI8ZII7cadPM3W">
            <Checkout address={address} orderCb={orderCb} addressCb={addressCb} />
        </StripeProvider>

    </div>
)


