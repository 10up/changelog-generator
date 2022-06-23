import { makeEntries } from "../src/parse.js";
import { expect } from "chai";

describe("Entries tests", () => {
  it("Make single entry", () => {
    const issue = {
      body: "### Changelog\n\nAdded - some feature",
    };
    const result = makeEntries(issue);
    expect(result).to.deep.equal(["Added - some feature"]);
  });

  it("Make multiple entries", () => {
    const issue = {
      body: "### Changelog\n\nAdded - some feature\nAdded - another feature",
    };
    const result = makeEntries(issue);
    expect(result).to.deep.equal([
      "Added - some feature",
      "Added - another feature",
    ]);
  });

  it("Clean up bullets", () => {
    const issue = {
      body: "### Changelog\n\n> Added - some feature\n- Added - another issue\n1. Added - first\n2. Added - second",
    };
    const result = makeEntries(issue);
    expect(result).to.deep.equal([
      "Added - some feature",
      "Added - another issue",
      "Added - first",
      "Added - second",
    ]);
  });
});
