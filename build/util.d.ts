import { Blend } from "./types";
export declare function calcPrice(blend: Blend, size: number): number;
export declare function priceDisplay(price: number): string;
export declare function ingPortion(blend: Blend, val: number): string;
export declare const buttonStyle: {
    cursor: string;
    background: string;
    height: number;
    width: number;
    margin: string;
    paddingTop: number;
    display: string;
    textAlign: any;
    color: string;
    fontFamily: string;
    fontSize: string;
};
export declare const primaryColor = "#9091c2";
export declare const onMobile: () => boolean;
