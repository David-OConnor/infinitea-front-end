import * as React from "react"
import {Route} from "react-router-dom"
import axios from "axios"

import * as util from "./util"


function sendMessage(name: string, email: string, message: string) {
    axios.post(
        util.BASE_URL + 'contact',
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
            <form style={{
                display: 'flex',
                flexDirection: 'column',
                width: 500,
                margin: 'auto',
                background: 'white',
                opacity: util.mainOpacity,
                padding: 20
            }}>
                <div style={{margin: 'auto'}}>
                    <h4>Your name</h4>
                    <input
                        type="text"
                        style={{marginBottom: 10}}
                        value={this.state.name}
                        placeholder="Name"
                        onChange={(e: any) => this.handleChange('name', e.target.value)}
                    />

                    <h4>Your email</h4>
                    <input
                        type="text"
                        style={{marginBottom: 10}}
                        value={this.state.email}
                        placeholder="Email address"
                        onChange={(e: any) => this.handleChange('email', e.target.value)}
                    />

                    <h4>Message</h4>
                    <textarea
                        style={{height: '8em'}}
                        value={this.state.message}
                        placeholder="Your message"
                        onChange={(e: any) => this.handleChange('message', e.target.value)}
                    />

                    <div style={{display: 'flex', margin: 'auto', marginTop: 20}}>
                        <div
                            style={util.primaryStyle}
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
                </div>
            </form>
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


export default class _ extends React.Component<FooterProps, FooterState> {
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
                        opacity: util.mainOpacity,
                        textAlign: 'center',
                        width: 300,
                        height: 80,
                    }}>
                        <h4>
                            Thanks for your message! 🙂
                        </h4>
                    </div>: null}

                <Route render={({history}) => (
                    <h4 style={{textAlign: 'center', color: 'black', cursor: 'pointer', textDecoration: 'underline'}}>
                        <span
                            onClick={() => {
                                history.push(util.indexUrl + 'privacy')
                                this.props.setPage(2)
                                window.scrollTo(0, 0)
                            }}
                        >Privacy policy</span>

                        <span style={{marginLeft: '1em'}}
                              onClick={() => {
                                  history.push(util.indexUrl + 'terms')
                                  this.props.setPage(3)
                                  window.scrollTo(0, 0)
                              }}
                        >Terms & conditions</span>
                    </h4>
                )} />

                <h4 style={{textAlign: 'center', color: 'black'}}>© 2018 Infinitea.org</h4>
            </div>
        )
    }
}