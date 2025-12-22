import fs from "fs";
const content = fs.readFileSync("src/data/frameworks.ts", "utf8");
const match = content.match(
  /export const PROMPT_FRAMEWORKS: PromptFrameworksType = (\{[\s\S]*?\});/,
);
if (match) {
  console.log("Match length:", match[1].length);
  console.log("Last 50 chars:", match[1].slice(-50));
  try {
    eval("(" + match[1] + ")");
    console.log("Eval SUCCESS");
  } catch (e) {
    console.log("Eval FAILED:", e.message);
    // Find where it fails
    const part = match[1];
    for (let i = 1000; i < part.length; i += 10000) {
      try {
        eval("(" + part.slice(0, i) + "}"); // try to close it
      } catch (e2) {
        // if it's a syntax error other than "unexpected end of input", then we found a problem
        if (
          !e2.message.includes("Unexpected end") &&
          !e2.message.includes("is not defined")
        ) {
          console.log("Fail potential around index", i, ":", e2.message);
        }
      }
    }
  }
} else {
  console.log("No match found");
}
