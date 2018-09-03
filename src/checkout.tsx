// Example at this JSFiddle: https://jsfiddle.net/xux7qzch/1073/
// and this Githug page: https://github.com/stripe/react-stripe-elements


import * as React from "react";
import {
    CardElement,
    Elements,
    StripeProvider,
    injectStripe,
} from "react-stripe-elements"

import {Address, Blend} from "./types";
import * as util from './util'


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


const YourBlend = ({blend}: {blend: Blend}) => (
    // Unlike YourBlend in main.tsx, this is text-only.
    <div>
        <h3>Your blend</h3>
        <ul>
            {blend.ingredients.map(ing => <li
                key={ing[0].id}
                style={{fontSize: util.onMobile() ? 14 : null}}
            >
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
                // lineHeight: 12,
                // border: '5px solid orange',
                // letterSpacing: '0.025em',
                // fontSize: '14px',
                // fontFamily: 'Karla, sans-serif',
                // padding: '6px 14px',
                '::placeholder': {
                    color: '#aab7c4',

                    // paddingTop: 30,
                    fontFamily: 'Karla',
                },
            },
            invalid: {
                color: '#b4677e',

            },
        },
    }
}


const emptyStyle = {borderColor: 'black'}
const validStyle = {borderColor: 'green'}
const invalidStyle = {borderColor: '#b4677e'}

const AddressForm = ({address, cb}: {address: Address, cb: Function}) => {

    let nameStyle = emptyStyle
    if (address.name.length > 0) {
        nameStyle = address.name.length >= minName ? validStyle : invalidStyle
    }

    let emailStyle = emptyStyle
    if (address.email.length > 0) {
        emailStyle = address.email.length >= minEmail && address.email.includes('@') &&
        address.email.includes('.') ? validStyle : invalidStyle
    }

    let address1Style = emptyStyle
    if (address.address1.length > 0) {
        address1Style = address.address1.length >= minAddress1 ? validStyle : invalidStyle
    }

    let address2Style = emptyStyle
    if (address.address2.length > 0) {
        address2Style = address.address2.length >= minAddress2 ? validStyle : invalidStyle
    }

    let cityStyle = emptyStyle
    if (address.city.length > 0) {
        cityStyle = address.city.length >= minCity ? validStyle : invalidStyle
    }

    let stateStyle = emptyStyle
    if (address.state.length > 0) {
        stateStyle = address.state.length >= minState ? validStyle : invalidStyle
    }

    let postalStyle = emptyStyle
    if (address.postal.length > 0) {
        postalStyle = address.postal.length >= minPostal &&
        address.postal.length <= maxPostal ? validStyle : invalidStyle
    }

    let phoneStyle = emptyStyle
    if (address.phone.length > 0) {
        phoneStyle = address.phone.length >=minPhone &&
        address.phone.length <= maxPhone ? validStyle : invalidStyle
    }


    return (
        <form>
            <h4> Only orders to US addresses accepted at this time.
                Expect international shipping in the future!</h4>
            <h3 style={{marginBottom: 20}}>Shipping address</h3>

            <h4 style={{marginBottom: 0}}>Your name</h4>
            <input
                style={nameStyle}
                // style={validStyle}
                type="text"
                value={address.name}
                placeholder="Name"
                onChange={(e: any) => cb('name', e.target.value)}
            />

            <h4 style={{marginBottom: 0}}>Email address</h4>
            <input
                style={emailStyle}
                type="text"
                value={address.email}
                placeholder="Email"
                onChange={(e: any) => cb('email', e.target.value)}
            />

            <h4 style={{marginBottom: 0}}>Address, line 1</h4>
            <input
                style={address1Style}
                type="text"
                value={address.address1}
                placeholder="Address 1"
                onChange={(e: any) => cb('address1', e.target.value)}
            />

            <h4 style={{marginBottom: 0}}>Address, line 2 (eg apartment #)</h4>
            <input
                style={address2Style}
                type="text"
                value={address.address2}
                placeholder="(Optional)"
                onChange={(e: any) => cb('address2', e.target.value)}
            />

            <h4 style={{marginBottom: 0}}>City</h4>
            <input
                style={cityStyle}
                type="text"
                value={address.city}
                placeholder="City"
                onChange={(e: any) => cb('city', e.target.value)}
            />

            <h4 style={{marginBottom: 0}}>State</h4>
            <input
                style={stateStyle}
                type="text"
                value={address.state}
                placeholder="State"
                onChange={(e: any) => cb('state', e.target.value)}
            />

            <h4 style={{marginBottom: 0}}>Postal (ZIP) code</h4>
            <input
                style={postalStyle}
                type="text"
                value={address.postal}
                placeholder="Postal code"
                onChange={(e: any) => cb('postal', e.target.value)}
            />

            <h4 style={{marginBottom: 0}}>Phone number</h4>
            <input
                style={phoneStyle}
                type="text"
                value={address.phone}
                placeholder="Phone number"
                onChange={(e: any) => cb('phone', e.target.value)}
            />
        </form>
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
                            this.props.orderCb(payload.token)
                            // this.props.processingCb(false)
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
            <form
                style={{marginTop: 60}}
                onSubmit={this.handleSubmit as any}>
                <h3 style={{marginBottom: 20}}>
                    Payment, processed by <a href={'https://stripe.com'}>Stripe</a>
                </h3>
                <p>We don't collect or store your card information, and it's removed once you leave this page. <a
                    href={'https://stripe.com/docs/security/stripe'}>Details about security</a></p>

                <h4 style={{marginBottom: 0}}>Card details</h4>
                {/*// Having trouble styling the card form.*/}
                <div className='card' style={{margin: 'auto', height: 25,
                    borderColor: this.state.cardValid ? 'green' : 'black'}}>
                    <CardElement
                        // style={{paddingTop: 20}}
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
            </form>
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

                {/*<StripeProvider apiKey="pk_test_hf9oqK2GfiqI8ZII7cadPM3W">*/}
                <StripeProvider apiKey="pk_live_n37f11dQvFbbfyQZT6Qhf70y">
                    <Elements>
                        <CardForm
                            fontSize={elementFontSize}
                            addressValid={addressValid}
                            processing={this.state.processing}
                            orderCb={this.props.orderCb}
                            processingCb={this.setProcessing}
                        />
                    </Elements>
                </StripeProvider>

                {this.state.processing ? <h4>Processing your order...</h4> : null}
            </div>
        )
    }
}

const topRightStyle = {
    fontSize: util.onMobile() ? 14 : null,
}

export default ({blend, size, price, shippingPrice, address, orderCb, addressCb}:
                    {blend: Blend, size: number, price: number, shippingPrice: number,
                        address: Address, orderCb: Function, addressCb: Function}) => (
    <div
        style={{
            display: 'grid',
            gridTemplateRows: 'auto 180px auto',
            gridTemplateColumns: '1fr 1fr',
            gridTemplateAreas: '"title title" "topleft topright" "form form"',
            alignItems: 'center',
            justifyItems: 'center',
            marginBottom: 60
        }}
    >
        <div style={{gridArea: 'title', display: 'flex', flexDirection: 'column'}}>
            <h2 style={{textAlign: 'center'}}>Your order summary</h2>

            <div>
                <h2 style={{textAlign: 'center'}}>{blend.title}</h2>
                <p style={{textAlign: 'center', fontStyle: 'italic'}}>{blend.description}</p>
            </div>
        </div>

        <div style={{gridArea: 'topleft'}}>
            <YourBlend blend={blend} />
        </div>

        <div style={{gridArea: 'topright'}}>
            <h4 style={topRightStyle}>Size: {size + " grams"}</h4>
            <h4 style={topRightStyle}>Price: {"$" + util.priceDisplay(price) + " + $" +
            util.priceDisplay(shippingPrice) + " shipping"}</h4>
            <h4 style={topRightStyle}>{"Total: $" + util.priceDisplay(price + shippingPrice)}</h4>
        </div>


        <div style={{gridArea: 'form', textAlign: 'center'}}>
            <hr />
            <Checkout address={address} orderCb={orderCb} addressCb={addressCb} />

        </div>
    </div>
)


