import { addPrefixes, makePrefix } from "../src/parse.js";
import { expect } from "chai";

addPrefixes(
  "^(Added|Changed|Deprecated|Removed|Fixed|Security|Other) - (.*?)$"
);

describe("Prefix tests", () => {
  it("keep prefix unchanged", () => {
    const line = "Added - Some feature";
    const participants = [{ login: "login" }, { login: "login2" }];
    const result = makePrefix(line, participants);
    expect(result).to.equal(line);
  });

  it("Security from dependabot", () => {
    const line = "No prefix feature";
    const participants = [{ login: "login" }, { login: "dependabot[bot]" }];
    const result = makePrefix(line, participants);
    expect(result).to.equal("Security - No prefix feature");
  });

  it("Keep pre-filled from dependabot", () => {
    const line = "Added - Feature";
    const participants = [{ login: "login" }, { login: "dependabot[bot]" }];
    const result = makePrefix(line, participants);
    expect(result).to.equal(line);
  });

  it("Other if not specified", () => {
    const line = "Feature";
    const participants = [{ login: "login" }, { login: "login2" }];
    const result = makePrefix(line, participants);
    expect(result).to.equal("Other - Feature");
  });
});
