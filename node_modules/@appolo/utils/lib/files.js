"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Files = void 0;
const fs_1 = require("fs");
const path = require("path");
const fs = require("fs");
const errors_1 = require("./errors");
const zlib = require("zlib");
class Files {
    static async removeDir(dirPath, removeSelf = true) {
        let status = await Files.pathStats(dirPath);
        if (!status || !status.isDirectory()) {
            return;
        }
        let files = await fs_1.promises.readdir(dirPath);
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
            await fs_1.promises.rmdir(dirPath);
        }
    }
    static async removeFile(filePath) {
        let status = await Files.pathStats(filePath);
        if (!status) {
            return;
        }
        if (status.isDirectory()) {
            return Files.removeDir(filePath);
        }
        if (status.isFile()) {
            await fs_1.promises.unlink(filePath);
        }
    }
    static callerPaths(deep = 1) {
        const offset = 2;
        let stack = errors_1.Errors.stack();
        let output = [];
        for (let i = offset; i < deep + offset; i++) {
            if (stack[i] && stack[i].getFileName) {
                output.push(stack[i].getFileName());
            }
        }
        return output;
    }
    static async pathStats(filePath) {
        let status;
        try {
            status = await fs_1.promises.stat(filePath);
            return status;
        }
        catch (e) {
            if (e.code === "ENOENT") {
                return null;
            }
            else {
                throw e;
            }
        }
    }
    static async createDir(dirPath) {
        let status = await Files.pathStats(dirPath);
        if (status) {
            return;
        }
        await fs_1.promises.mkdir(dirPath, { recursive: true });
    }
    static async reCreateDir(dirPath) {
        await Files.removeDir(dirPath, true);
        await Files.createDir(dirPath);
    }
    static *walk(root, filesPath, ext) {
        if (!Array.isArray(filesPath)) {
            filesPath = [filesPath];
        }
        if (!ext) {
            ext = ["js"];
        }
        let filesRegex = new RegExp(`(.*)\.(${ext.join("|")})$`);
        for (let filePath of filesPath) {
            yield* this._loadFiles(path.join(root, filePath), filesRegex);
        }
    }
    static *_loadFiles(filePath, filesRegex) {
        if (fs.existsSync(filePath)) {
            for (let file of fs.readdirSync(filePath)) {
                let newPath = path.join(filePath, file), stat = fs.statSync(newPath), isIgnored = file.startsWith("~");
                if (stat.isFile() && filesRegex.test(file) && !isIgnored) {
                    yield newPath;
                }
                else if (stat.isDirectory() && !isIgnored) {
                    yield* this._loadFiles(newPath, filesRegex);
                }
            }
        }
    }
    static unGzipFile(inPath, outPath) {
        return new Promise((resolve, reject) => {
            fs.createReadStream(inPath)
                .pipe(zlib.createGunzip())
                .pipe(fs.createWriteStream(outPath))
                .on("finish", () => resolve())
                .on("error", (e) => reject());
        });
    }
}
exports.Files = Files;
//# sourceMappingURL=files.js.map