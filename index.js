const { readFileSync, writeFileSync, readdirSync,existsSync,mkdirSync } = require("node:fs");
const { join } = require("node:path");

console.info("Start converting hts-label to audacity-label");
if (!existsSync(join(__dirname, "mono-label"))) {
    console.error("mono-label folder not found");
    return process.exit(1);
};
if (!existsSync(join(__dirname, "audacity-label"))) {
    console.log("audacity-label folder not found, creating...");
    mkdirSync(join(__dirname, "audacity-label"));
}
console.info("Converting...");
readdirSync(join(__dirname, "mono-label")).forEach((file, index, array) => {
    console.log(`Converting ${file} ${Math.round((index + 1) / array.length * 100)}%`);
    const monoContent = readFileSync(join(__dirname, "mono-label", file), "utf-8");
    const monoContentArray = monoContent.split("\n");
    const contentLines = [];
    for (let i = 0; i < monoContentArray.length; i++) {
        const line = monoContentArray[i];
        if (line == "") {
            console.warn(`Empty line found in ${file} at line ${i + 1}`);
            continue;
        }
        const lineStartSecond = Number(line.split(" ")[0]) / 10000000; //1000 * 1000 * 10
        const lineEndSecond = Number(line.split(" ")[1]) / 10000000; //1000 * 1000 * 10
        const lineText = line.split(" ").slice(2).join(" ");
        if (isNaN(lineStartSecond) || isNaN(lineEndSecond) || lineText == "") {
            console.warn(`Invalid line found in ${file} at line ${i + 1}`);
            continue;
        };
        contentLines.push(`${lineStartSecond}\t${lineEndSecond}\t${lineText}`);
    }
    const content = contentLines.join("\n");
    writeFileSync(join(__dirname, "audacity-label", file), content, "utf-8");
    console.log(`Converted ${file} ${Math.round((index + 1) / array.length * 100)}%`);
});