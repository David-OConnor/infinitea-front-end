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


// todo duped from main.
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
    fontFamily: '"Lucida Sans Unicode"',
    fontSize: '1.2em',
}
const primaryColor = '#9091c2'

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

const handleBlur = () => {
    // console.log('[blur]');
};
const handleChange = (change: any) => {
    // console.log('[change]', change);
};
const handleClick = () => {
    // console.log('[click]');
};
const handleFocus = () => {
    // console.log('[focus]');
};
const handleReady = () => {
    // console.log('[ready]');
};

const createOptions = (fontSize: string) => {
    const padding = 10
    return {
        style: {
            base: {
                fontSize,
                color: '#424770',
                letterSpacing: '0.025em',
                fontFamily: 'Source Code Pro, monospace',
                '::placeholder': {
                    color: '#aab7c4',
                },
                // padding: padding,
            },
            invalid: {
                color: '#9e576d',
            },
        },
    };
};

const inputStyle = {
    display: 'block',
    margin: '10px 0 20px 0',
    maxWidth: 500,
    padding: "10px 14px",
    fontSize: '1em',
    fontFamily: "'Source Code Pro', monospace",
    boxShadow: "rgba(50, 50, 93, 0.14902) 0px 1px 3px, rgba(0, 0, 0, 0.0196078) 0px 1px 0px",
    border: 2,
    borderRadius: 4,
    background: 'white',
    // backgroundCo: '#ff1111'
}

const AddressForm = ({address, cb}: {address: Address, cb: Function}) => {
    const validStyle = {borderColor: 'green'}
    const invalidStyle = {borderColor: '#b4677e'}
    
    return (
        <Form>
            <h5> Only orders to US addresses accepted at this time.
                Expect international shipping in the future!</h5>
            <h4> Shipping address</h4>

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
}


class _CardForm extends React.Component<any, any> {
    handleSubmit = (ev: Event) => {
        ev.preventDefault();
        if (this.props.stripe) {
            this.props.stripe
                .createToken()

                .then((payload: any) => {
                        if (payload.token) {
                            this.props.orderCb(payload.token)
                        }
                        else {
                            console.log("OOps, payment error :(")
                        }
                    }
                )
        } else {
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

                    <CardElement
                        style={inputStyle}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        onFocus={handleFocus}
                        onReady={handleReady}
                        {...createOptions(this.props.fontSize)}
                    />
                    {
                        this.props.addressValid ?
                            <div
                                style={{...buttonStyle, background: primaryColor, marginTop: 30}}
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
}

class Checkout extends React.Component<CheckoutProps, CheckoutState> {
    constructor(props: CheckoutProps) {
        super(props)
        this.state = {
            elementFontSize: window.innerWidth < 450 ? '14px' : '18px',
        }

        window.addEventListener('resize', () => {
            if (window.innerWidth < 450 && this.state.elementFontSize !== '14px') {
                this.setState({elementFontSize: '14px'});
            } else if (
                window.innerWidth >= 450 &&
                this.state.elementFontSize !== '18px'
            ) {
                this.setState({elementFontSize: '18px'});
            }
        })
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
                        orderCb={this.props.orderCb}/>
                </Elements>
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
                <h3>Your blend</h3>
                <ul>
                    {blend.ingredients.map(ing => <li key={ing[0].id}>{ing[0].name}</li>)}
                </ul>
            </Col>

            <Col xs={6}>
                <h4 style={{textAlign: 'left'}}>Size: {size + " grams"}</h4>
                <h4 style={{textAlign: 'left'}}>Price: {"$" + util.priceDisplay(price) + " + $" +
                util.priceDisplay(shippingPrice) + " shipping"}</h4>
                <h3 style={{textAlign: 'left'}}>{"Total: $" + util.priceDisplay(price + shippingPrice)}</h3>
            </Col>
        </Row>

        <StripeProvider apiKey="pk_test_hf9oqK2GfiqI8ZII7cadPM3W">
            <Checkout address={address} orderCb={orderCb} addressCb={addressCb} />
        </StripeProvider>

    </div>
)


