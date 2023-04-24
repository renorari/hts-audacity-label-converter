const { readFileSync, writeFileSync, readdirSync,existsSync,mkdirSync } = require("node:fs");
const { join } = require("node:path");

console.info("Start converting audacity-label to mono-label");
if (!existsSync(join(__dirname, "audacity-label"))) {
    console.error("audacity-label folder not found");
    return process.exit(1);
};
if (!existsSync(join(__dirname, "mono-label"))) {
    console.log("mono-label folder not found, creating...");
    mkdirSync(join(__dirname, "mono-label"));
}
console.info("Converting...");
readdirSync(join(__dirname, "audacity-label")).forEach((file, index, array) => {
    console.log(`Converting ${file} ${Math.round((index + 1) / array.length * 100)}%`);
    const labelContent = readFileSync(join(__dirname, "audacity-label", file), "utf-8");
    const labelContentArray = labelContent.split("\n");
    const contentLines = [];
    for (let i = 0; i < labelContentArray.length; i++) {
        const line = labelContentArray[i];
        if (line == "") {
            console.warn(`Empty line found in ${file} at line ${i + 1}`);
            continue;
        }
        const lineStartSecond = Math.round(Number(line.split("\t")[0]) * 10000000); //1000 * 1000 * 10
        const lineEndSecond = Math.round(Number(line.split("\t")[1]) * 10000000); //1000 * 1000 * 10
        const lineText = line.split("\t").slice(2).join(" ");
        if (isNaN(lineStartSecond) || isNaN(lineEndSecond) || lineText == "") {
            console.warn(`Invalid line found in ${file} at line ${i + 1}`);
            continue;
        };
        contentLines.push(`${lineStartSecond} ${lineEndSecond} ${lineText}`);
    }
    const content = contentLines.join("\n");
    writeFileSync(join(__dirname, "mono-label", file), content, "utf-8");
    console.log(`Converted ${file} ${Math.round((index + 1) / array.length * 100)}%`);
});