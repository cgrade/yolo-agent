import {Event, IEvent} from "@appolo/events/index";
import {RouteAddedEvent} from "../IApp";

export class Events {
    public readonly routeAdded: IEvent<RouteAddedEvent> = new Event();
    public readonly beforeServerClosed: IEvent<void> = new Event();
    public readonly afterServerClosed: IEvent<void> = new Event();
    public readonly beforeServerOpen: IEvent<void> = new Event();
    public readonly afterServerOpen: IEvent<void> = new Event();
}
