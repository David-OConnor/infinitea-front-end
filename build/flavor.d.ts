import * as React from "react";
import { Ingredient } from "./types";
interface FlavorProps {
    ingredients: Ingredient[];
}
interface FlavorState {
    flavorsSelected: Map<number, boolean>;
    ingRecs: [number, number][];
}
export default class _ extends React.Component<FlavorProps, FlavorState> {
    constructor(props: FlavorProps);
    toggleFlavor(flavor: number): void;
    render(): JSX.Element;
}
export {};
