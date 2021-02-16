import fs from "fs";
import util from 'util';
import path from "path";

const readFile = util.promisify(fs.readFile);
const readDir = util.promisify(fs.readdir);

class FileService {
    readDir(dirName: string) {
       return readDir(path.join(__dirname, dirName), 'utf-8');
    }

    readFile(pathStr: string): Promise<any> {
       return readFile(path.join(__dirname, pathStr), 'utf-8');
    }
}

export default FileService;