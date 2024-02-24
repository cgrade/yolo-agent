export interface IOptions{
    port?: number,
    errorStack?: boolean,
    errorMessage?: boolean,
    maxRouteCache?: number,
    useRouteCache?:boolean,
    decodeUrlParams?:boolean,
    qsParser?: (query:string)=>{[index:string]:any}
    urlParser?: "url" | "fast"
    trustProxy?:boolean
    ssl?: {
        key: string
        cert: string
    }
}
