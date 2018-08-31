import * as React from "react";
import { Ingredient } from "./types";
interface FlavorProps {
    ingredients: Ingredient[];
    selection: Map<number, boolean>;
    selectionCb: Function;
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
