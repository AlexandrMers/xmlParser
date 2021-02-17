import main from "./main";

const [input, output] = process.argv.slice(2);

console.log("process.argv -> ", process.argv);

main(input, output);
