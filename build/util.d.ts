/// <reference types="react" />
import { Blend } from "./types";
export declare const BASE_URL: string;
export declare const indexUrl: string;
export declare const mainOpacity = 0.9;
export declare function calcPrice(blend: Blend, size: number): number;
export declare function priceDisplay(price: number): string;
export declare function ingPortion(blend: Blend, val: number): string;
export declare const primaryStyle: {
    background: string;
    fontWeight: number;
};
export declare const onMobile: () => boolean;
export declare function randInt(min: number, max: number): number;
export declare function randChoice(items: any[]): any;
export declare const TitleForm: ({ title, descrip, titleCb, descripCb }: {
    title: string;
    descrip: string;
    titleCb: Function;
    descripCb: Function;
}) => JSX.Element;
