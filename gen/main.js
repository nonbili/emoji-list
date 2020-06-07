const fs = require("fs");
const { lib } = require("emojilib");

const result = {};

for (let [name, { category, char, keywords }] of Object.entries(lib)) {
  if (!result[category]) {
    result[category] = [];
  }
  result[category].push([char, name, ...keywords]);
}

const header = `/**
 * Generated from https://github.com/muan/emojilib.
 * Source code: https://github.com/nonbili/emoji-list.
 */
`;

fs.writeFileSync(
  "../src/emojilib.ts",
  header + "export const emojilib = " + JSON.stringify(result, null, 2)
);
