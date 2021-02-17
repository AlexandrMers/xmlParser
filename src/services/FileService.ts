import fs from "fs";
import util from "util";

const readFile = util.promisify(fs.readFile);
const readDir = util.promisify(fs.readdir);

class FileService {
  readDir(dirName: string) {
    return readDir(dirName, "utf-8");
  }

  readFile(pathStr: string): Promise<any> {
    return readFile(pathStr, "utf-8");
  }
}

export default FileService;
