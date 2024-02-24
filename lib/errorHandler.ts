import {HttpError} from "./errors/httpError";
import {Objects} from "@appolo/utils";

export class ErrorHandler {

    public static getStatusCode(err: HttpError): number {

        if ((err.status >= 400 && err.status < 600)) {
            return err.status
        }

        if (err.statusCode >= 400 && err.statusCode < 600) {
            return err.statusCode;
        }

        return 500;
    }

    public static getErrorMessage(e: HttpError, statusCode: number, errorMessage: boolean, errorStack: boolean): { message?: string, statusCode: number, code?: number, error?: string } {

        let dto: { message?: string, statusCode: number, code?: number, error?: string } = {
            statusCode: statusCode
        };

        dto.message = e.message;

        if (Objects.isPlain(e.data)) {
            Object.assign(dto, e.data)
        }


        if (e.code) {
            dto.code = e.code
        }

        if (e.error) {

            if (errorMessage) {
                dto.error = (e.error as Error).message || e.error.toString();
            }

            if (errorStack && (e.error as Error).stack) {
                dto.error = (e.error as Error).stack;
            }

            if ((e.error as HttpError).code && !dto.code) {
                dto.code = (e.error as HttpError).code
            }
        }

        return dto

    }
}
