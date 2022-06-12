#!/usr/bin/env node
import meow from "meow";
import GitHub from "./src/github.js";
import { makeChangelog, makeGroups, addPrefixes } from "./src/parse.js";

async function run() {
  const cli = meow(
    `
Usage
$ changelog-generator

Options:
--milestone, -m  Milestone title.
--pat, -p        Personal access token.
--repo           Repository address.
--style, -s      Changelog style: plain (default)
--prefixes       PR prefixes. Default: Added,Changed,Deprecated,Removed,Fixed,Security
--quiet          Disable debug output
`,
    {
      importMeta: import.meta,
      flags: {
        milestone: {
          type: "string",
          alias: "m",
        },
        pat: {
          type: "string",
          alias: "p",
        },
        repo: {
          type: "string",
        },
        style: {
          type: "string",
          alias: "s",
          default: "plain", // TODO Add "grouped" option
        },
        prefixes: {
          type: "string",
          default: "Added,Changed,Deprecated,Removed,Fixed,Security"
        },
        quiet: {
          type: "boolean",
          defalut: false,
        },
      },
    }
  );

  let prefixesPattern = '^(' + cli.flags.prefixes.replaceAll(",", "|") + ') - (.*?)$';
  addPrefixes(prefixesPattern);

  if (!cli.flags.milestone) {
    cli.showHelp();
  }

  !cli.flags.quiet &&
    console.log(`Reading issues from Milestone "${cli.flags.milestone}"`);

  const github = new GitHub({
    ...(cli.flags.pat ? { auth: cli.flags.pat } : {}),
  });
  await github.init(cli.flags.repo);

  const prs = await github.getIssues(cli.flags.milestone);

  !cli.flags.quiet && console.log(`Found PRs: ${prs.length}`);

  let entries = [];

  for (let pr of prs) {
    !cli.flags.quiet && console.log(`PR "${pr.title}"`);

    const participants = await github.getParticipants(pr);

    !cli.flags.quiet &&
      console.log(`Found ${participants.length} participants`);

    const lines = makeChangelog(pr, participants);

    !cli.flags.quiet &&
      console.log(`Extracted ${lines.length} changelog records`);

    entries = entries.concat(lines);
  }

  switch (cli.flags.style) {
    case "grouped":
      const groups = makeGroups(entries);
      console.log("\n\n## Changelog:");
      for (const [key, records] of Object.entries(groups)) {
        console.log(`\n### ${key}\n- ` + records.join("\n- "));
      }
      break;

    case "plain":
    default:
      console.log(
        "\n\n## Changelog:\n\n- " + entries.flat().sort().join("\n- ")
      );
      break;
  }
}

run();
