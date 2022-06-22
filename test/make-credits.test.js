import { makeCredits } from "../src/parse.js";

import { expect } from "chai";

describe("Credits tests", () => {
  it("Make credits from simple description", () => {
    const issue = {
      body: "### Credits\n\nProps @random-name",
    };
    const result = makeCredits(issue);
    expect(result.length).to.equal(1);
    expect(result[0].login).to.equal("random-name");
    expect(result[0].html_url).to.equal("https://github.com/random-name");
  });

  it("Make credits from comma-separated description", () => {
    const issue = {
      body: "### Credits\n\nProps @random-name, @random-name2",
    };
    const result = makeCredits(issue);
    expect(result.length).to.equal(2);
    expect(result[0].login).to.equal("random-name");
    expect(result[0].html_url).to.equal("https://github.com/random-name");
    expect(result[1].login).to.equal("random-name2");
    expect(result[1].html_url).to.equal("https://github.com/random-name2");
  });

  it("Extract clean name", () => {
    const issue = {
      body: "### Credits\n\nProps @random-name.",
    };
    const result = makeCredits(issue);
    expect(result.length).to.equal(1);
    expect(result[0].login).to.equal("random-name");
    expect(result[0].html_url).to.equal("https://github.com/random-name");
  });

});
