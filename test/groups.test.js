import { addPrefixes, makeGroups } from "../src/parse.js";
import { expect } from "chai";

addPrefixes(
  "^(Added|Changed|Deprecated|Removed|Fixed|Security|Other) - (.*?)$"
);

describe("Groups tests", () => {
  it("Make groups", () => {
    const entries = [
      "Added - Some feature",
      "Added - Another feature",
      "Changed - Third feature",
    ];
    const result = makeGroups(entries);
    expect(result).to.deep.equal({
      Added: ["Some feature", "Another feature"],
      Changed: ["Third feature"],
    });
  });
});
