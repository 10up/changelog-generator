import { addProps } from "../src/parse.js";
import { expect } from "chai";

describe("Props tests", () => {
  it("Add single participant", () => {
    const line = "Added - Some feature";
    const participants = [
      {
        login: "login",
        html_url: "https://github.com/login",
      },
    ];
    const result = addProps(line, participants);
    expect(result).to.equal(
      "Added - Some feature (props [@login](https://github.com/login)"
    );
  });

  it("Add multiple participants", () => {
    const line = "Added - Some feature";
    const participants = [
      {
        login: "login",
        html_url: "https://github.com/login",
      },
      {
        login: "login2",
        html_url: "https://github.com/login2",
      },
    ];
    const result = addProps(line, participants);
    expect(result).to.equal(
      "Added - Some feature (props [@login](https://github.com/login), [@login2](https://github.com/login2)"
    );
  });
});
