import * as React from "react";
interface FooterProps {
    setPage: Function;
}
interface FooterState {
    showContact: boolean;
    showConfirmation: boolean;
}
export default class _ extends React.Component<FooterProps, FooterState> {
    constructor(props: FooterProps);
    setContactForm(show: boolean): void;
    setConfirmation(show: boolean): void;
    render(): JSX.Element;
}
export {};
