import {promises, Stats} from "fs";
import * as path from "path";
import * as fs from "fs";
import {Errors} from "./errors";
import zlib = require("zlib");

export class Files {
    public static async removeDir(dirPath: string, removeSelf: boolean = true): Promise<void> {

        let status = await Files.pathStats(dirPath);

        if (!status || !status.isDirectory()) {
            return;
        }

        let files = await promises.readdir(dirPath);

        let len = files.length;

        if (len > 0) {

            let promises = [];

            for (let i = 0; i < len; i++) {
                let filePath = dirPath + '/' + files[i];

                promises.push(Files.removeFile(filePath));
            }

            if (promises.length) {
                await Promise.all(promises);
            }
        }

        if (removeSelf) {
            await promises.rmdir(dirPath);
        }
    }

    public static async removeFile(filePath: string): Promise<void> {

        let status = await Files.pathStats(filePath);

        if (!status) {
            return;
        }

        if (status.isDirectory()) {
            return Files.removeDir(filePath);
        }

        if (status.isFile()) {
            await promises.unlink(filePath)
        }
    }

    public static callerPaths(deep: number = 1): string[] {
        const offset = 2;
        let stack = Errors.stack();

        let output = [];

        for (let i = offset; i < deep + offset; i++) {
            if (stack[i] && stack[i].getFileName) {
                output.push(stack[i].getFileName());
            }
        }

        return output;
    }

    public static async pathStats(filePath: string): Promise<Stats> {

        let status: Stats;

        try {
            status = await promises.stat(filePath);

            return status;

        } catch (e) {

            if (e.code === "ENOENT") {
                return null;
            } else {
                throw e;
            }
        }
    }

    public static async createDir(dirPath: string): Promise<void> {

        let status = await Files.pathStats(dirPath);

        if (status) {
            return;
        }

        await promises.mkdir(dirPath, {recursive: true});
    }

    public static async reCreateDir(dirPath: string): Promise<void> {
        await Files.removeDir(dirPath, true);

        await Files.createDir(dirPath);

    }

    public static* walk(root: string, filesPath: string | string[], ext?: string[]) {
        if (!Array.isArray(filesPath)) {
            filesPath = [filesPath];
        }

        if (!ext) {
            ext = ["js"]
        }

        let filesRegex = new RegExp(`(.*)\.(${ext.join("|")})$`);

        for (let filePath of filesPath) {

            yield* this._loadFiles(path.join(root, filePath), filesRegex);
        }
    }

    private static* _loadFiles(filePath: string, filesRegex: RegExp) {
        if (fs.existsSync(filePath)) {

            for (let file of fs.readdirSync(filePath)) {
                let newPath = path.join(filePath, file), stat = fs.statSync(newPath), isIgnored = file.startsWith("~");


                if (stat.isFile() && filesRegex.test(file) && !isIgnored) {

                    yield newPath;

                } else if (stat.isDirectory() && !isIgnored) {
                    yield* this._loadFiles(newPath, filesRegex);
                }
            }
        }
    }

    public static unGzipFile(inPath, outPath): Promise<void> {
        return new Promise((resolve, reject) => {

            fs.createReadStream(inPath)
                .pipe(zlib.createGunzip())
                .pipe(fs.createWriteStream(outPath))
                .on("finish", () => resolve())
                .on("error", (e) => reject());
        })
    }
}
