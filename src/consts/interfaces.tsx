import { Time } from "xapi-node";

export interface ICandle {
    ctm: Time
    open: number
    high: number
    low: number
    close: number
    vol: number
    ctmString: string
}