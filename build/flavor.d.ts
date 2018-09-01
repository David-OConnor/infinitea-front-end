import * as React from "react";
import { Ingredient } from "./types";
interface FlavorProps {
    ingredients: Ingredient[];
    selection: Map<number, boolean>;
    flavSelCb: Function;
    ingSelCb: Function;
    subPageCb: Function;
    title: string;
    descrip: string;
    titleCb: Function;
    descripCb: Function;
}
interface FlavorState {
    ingRecs: [number, number][];
}
export default class _ extends React.Component<FlavorProps, FlavorState> {
    constructor(props: FlavorProps);
    toggleFlavor(flavor: number): void;
    render(): JSX.Element;
}
export {};
