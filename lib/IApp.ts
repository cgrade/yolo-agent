import {IOptions} from "./IOptions";
import {IEvent} from "@appolo/events";
import {Methods} from "@appolo/router/index";
import {IRouteHandler} from "./types";
import {IRequest} from "./request";
import {IResponse} from "./response";

export type RouteAddedEvent = { method: Methods, path: string, handler: IRouteHandler }

export interface IApp {
    options: IOptions

}
