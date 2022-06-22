import { addVia } from "../src/parse.js";
import { expect } from "chai";

describe("Via tests", () => {
  it("add via", () => {
    const line = "Added - Some feature";
    const issue = {
      number: 123,
      html_url: "https://github.com/issue/123",
    };
    const result = addVia(line, issue);
    expect(result).to.equal("Added - Some feature via [#123](https://github.com/issue/123))");
  });
});
