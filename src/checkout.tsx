// Example at this JSFiddle: https://jsfiddle.net/xux7qzch/1073/
// and this Githug page: https://github.com/stripe/react-stripe-elements


import * as React from "react";
import {
    CardElement,
    Elements,
    StripeProvider,
    injectStripe,
    CardExpiryElement, CardCVCElement, PostalCodeElement, CardNumberElement
} from "react-stripe-elements"
import {Button, ControlLabel, Form, FormControl, FormGroup} from 'react-bootstrap'
import {Address, Blend, Ingredient} from "./types";


// Min lengths for address validation
const minName = 3
const minEmail = 4
const minAddress1 = 6
const minAddress2 = 0
const minCity = 3
const minState = 2
const minPostal = 5
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
                padding,
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

interface AddressProps {
    cb: Function
}

interface AddressState {
    name: string
    email: string
    // country: string
    address1: string
    address2: string
    city: string
    state: string
    postal: string
    phone: string
}

class AddressForm extends React.Component<AddressProps, AddressState> {
    constructor(props: AddressProps) {
        super(props)
        this.state = {
            name: '',
            email: '',
            address1: '',
            address2: '',
            city: '',
            state: '',
            postal: '',
            phone: '',
        }

        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(attr: string, val: string) {
        this.setState({[attr]: val} as any)
        this.props.cb(this.state.name, this.state.email, this.state.address1, this.state.address2,
            this.state.city, this.state.state, this.state.postal, this.state.phone)

    }

    render() {
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
                        style={this.state.name.length >= minName ? validStyle : invalidStyle}
                        type="text"
                        value={this.state.name}
                        placeholder="Name"
                        onChange={(e: any) => this.handleChange('name', e.target.value)}
                    />
                </FormGroup>

                <FormGroup>
                    <ControlLabel>Email address</ControlLabel>
                    <FormControl
                        style={this.state.email.length >= minEmail && this.state.email.includes('@') &&
                            this.state.email.includes('.') ? validStyle : invalidStyle}
                        type="text"
                        value={this.state.email}
                        placeholder="Email"
                        onChange={(e: any) => this.handleChange('email', e.target.value)}
                    />
                </FormGroup>

                <FormGroup>
                    <ControlLabel>Address, line 1</ControlLabel>
                    <FormControl
                        style={this.state.address1.length >= minAddress1 ? validStyle : invalidStyle}
                        type="text"
                        value={this.state.address1}
                        placeholder="Address 1"
                        onChange={(e: any) => this.handleChange('address1', e.target.value)}
                    />
                </FormGroup>

                <FormGroup>
                    <ControlLabel>Address, line 2 (eg apartment #)</ControlLabel>
                    <FormControl
                        style={this.state.address2.length >= minAddress2 ? validStyle : invalidStyle}
                        type="text"
                        value={this.state.address2}
                        placeholder="(Optional)"
                        onChange={(e: any) => this.handleChange('address2', e.target.value)}
                    />
                </FormGroup>

                <FormGroup>
                    <ControlLabel>City</ControlLabel>
                    <FormControl
                        style={this.state.city.length >= minCity ? validStyle : invalidStyle}
                        type="text"
                        value={this.state.city}
                        placeholder="City"
                        onChange={(e: any) => this.handleChange('city', e.target.value)}
                    />
                </FormGroup>

                <FormGroup>
                    <ControlLabel>State</ControlLabel>
                    <FormControl
                        style={this.state.state.length >= minState ? validStyle : invalidStyle}
                        type="text"
                        value={this.state.state}
                        placeholder="State"
                        onChange={(e: any) => this.handleChange('state', e.target.value)}
                    />
                </FormGroup>

                <FormGroup>
                    <ControlLabel>Postal (ZIP) code</ControlLabel>
                    <FormControl
                        style={this.state.postal.length >= minPostal ? validStyle : invalidStyle}
                        type="text"
                        value={this.state.postal}
                        placeholder="Postal code"
                        onChange={(e: any) => this.handleChange('postal', e.target.value)}
                    />
                </FormGroup>

                <FormGroup>
                    <ControlLabel>Phone number</ControlLabel>
                    <FormControl
                        style={this.state.phone.length >=minPhone &&
                                this.state.phone.length <= maxPhone ? validStyle : invalidStyle}
                        type="text"
                        value={this.state.phone}
                        placeholder="Phone number"
                        onChange={(e: any) => this.handleChange('phone', e.target.value)}
                    />
                </FormGroup>
            </Form>
        )
    }
}

interface CardFormProps {
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
                            <Button
                                type='submit'
                                style={{marginTop: 30}}
                                bsStyle='primary'
                            >Place Order</Button> : null
                    }
                </FormGroup>
            </Form>
        );
    }
}
const CardForm = injectStripe(_CardForm);


interface CheckoutProps {
    orderCb: Function
}

interface CheckoutState {
    elementFontSize: string
    address: Address
}

class Checkout extends React.Component<CheckoutProps, CheckoutState> {
    constructor(props: CheckoutProps) {
        super(props)
        this.state = {
            elementFontSize: window.innerWidth < 450 ? '14px' : '18px',
            address: {
                name: '',
                email: '',
                country: '',
                address1: '',
                address2: '',
                city: '',
                state: '',
                postal: '',
                phone: '',
            },
        }

        this.changeAddress = this.changeAddress.bind(this)

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

    changeAddress(name: string, email: string, address1: string, address2: string,
                  city: string, state: string, postal: string, phone: string) {

        this.setState({
            address: {
                name: name,
                email: email,
                country: 'usa',
                address1: address1,
                address2: address2,
                city: city,
                state: state,
                postal: postal,
                phone: phone,
            }
        })
    }

    render() {
        const {elementFontSize} = this.state


        const address = this.state.address
        let addressValid = false
        if (address.name.length >= minName && address.email.length >= minEmail &&
            address.email.includes('@') && address.email.includes('.') &&
            address.address1.length >= minAddress1 &&
            address.address2.length >= minAddress2 && address.city.length >= minCity &&
            address.state.length >= minState && address.postal.length >= minPostal &&
            address.phone.length >= minPhone && address.phone.length <= maxPhone) {
            addressValid = true
        }

            return (
                <div style={{margin: '0px auto', maxWidth: 800, boxSizing: 'border-box', padding: '0 5px'}}>
                    <h3 style={{marginBottom: 50}}>Shipping and payment</h3>

                    <AddressForm cb={this.changeAddress}/>

                    <Elements>
                        <CardForm
                            fontSize={elementFontSize}
                            addressValid={addressValid}
                            orderCb={(token: any) => this.props.orderCb(this.state.address, token)}/>
                    </Elements>
                </div>
            )
    }
}

export default ({orderCb, blend, size, price}: {orderCb: Function,
        blend: Blend, size: number, price: number}) => (
    <div>
        <h2 style={{textAlign: 'center'}}>Your order summary</h2>
        <h3>Your blend</h3>
        <ul>
            {blend.ingredients.map(ing => <li key={ing.id}>{ing.name}</li>)}
        </ul>
        <h4 style={{textAlign: 'center'}}>Size: {size + " grams"}</h4>
        <h4 style={{textAlign: 'center'}}>Price: {"$" + price}</h4>

        <StripeProvider apiKey="pk_test_hf9oqK2GfiqI8ZII7cadPM3W">
            <Checkout orderCb={orderCb} />
        </StripeProvider>

    </div>
)


