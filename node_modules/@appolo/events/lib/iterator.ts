import {EventDispatcher} from "./eventDispatcher";
const symbolAsyncIterator = Symbol.asyncIterator || '@@asyncIterator';

export class Iterator<T> {

    private _eventCount = 0;
    private _emitter: EventDispatcher;
    private _events: string[];
    private _options: { limit?: number };
    private _limit: number;
    private _done: boolean;
    private _nextQueue: { resolve, reject }[] = [];
    private _valueQueue: { value: any }[] = [];

    constructor(emitter: EventDispatcher, events: string | string[], options: { limit?: number } = {}) {
        this._events = Array.isArray(events) ? events : [events];
        this._emitter = emitter;
        this._options = options;
        this._limit = options.limit || Infinity;
        this._done = this._limit <= 0;
    }

    public iterate(): AsyncIterableIterator<T> {
        this._events.forEach(event => this._emitter.on(event, this._onEvent, this));
        let $self = this;

        let dto = {
            [symbolAsyncIterator]() {
                return this
            },
            next: async () => {
                if ($self._valueQueue.length) {
                    let result = $self._valueQueue.shift();
                    return {value: result.value, done: false}
                }

                if ($self._done) {
                    return {value: undefined, done: true}
                }

                return new Promise((resolve, reject) => $self._nextQueue.push({resolve, reject}));
            },
            return: async (value?: any) => {
                this._cancel();
                return {done: this._done, value}
            },
            throw: async (error) => {
                this._cancel();
                return {
                    done: this._done,
                    value: Promise.reject(error)
                }
            }
        };

        return dto as any;
    }

    private _onEvent(value: any) {
        this._eventCount++;
        if (this._limit <= this._eventCount) {
            this._done = true
        }

        if (this._nextQueue.length) {
            const result = this._nextQueue.shift();

            result.resolve({done: false, value});
        } else {
            this._valueQueue.push({value})
        }

        if (this._done) {
            this._cancel();
        }
    }

    private _cancel() {
        this._events.forEach(event => this._emitter.un(event, this._onEvent, this));
        while (this._nextQueue.length > 0) {
            const result = this._nextQueue.shift();
            result.resolve({done: true, value: undefined});
        }
        this._nextQueue.length = 0;
        // this._valueQueue.length = 0;


    }

}
