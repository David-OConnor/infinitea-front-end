/// <reference types="react" />
import { Address, Blend } from "./types";
declare const _default: ({ blend, size, price, shippingPrice, address, orderCb, addressCb }: {
    blend: Blend;
    size: number;
    price: number;
    shippingPrice: number;
    address: Address;
    orderCb: Function;
    addressCb: Function;
}) => JSX.Element;
export default _default;
