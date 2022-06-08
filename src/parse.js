const knownPrefixes =
  /^(Added|Changed|Deprecated|Removed|Fixed|Security) - (.*?)$/;

export function makeChangelog(issue, participants) {
  // PR title by default.
  let lines = [issue.title];

  // Try to extract changelog entries from the description.
  const cleanBody = issue.body.replace(/<!--.*?-->/gs, "");

  const matches = /#\s*Changelog.*\r?\n([^#]+)/.exec(cleanBody);
  if (matches !== null) {
    const changelog = matches[1];
    lines = changelog.split(/\r?\n/);
  }

  return lines
    .filter((line) => line.length > 0) // non-empty
    .map((line) => line.replace(/^>\s/, "")) // remove "RE" prefix
    .map((line) => addProps(line, participants))
    .map((line) => addVia(line, issue))
    .map((line) => makePrefix(line, participants)); // Add prefix to lines which don't have it;
}

export function makeGroups(entries) {
  const groups = [];

  entries.forEach((entry) => {
    const matches = knownPrefixes.exec(entry);
    if (matches !== null) {
      const prefix = matches[1];
      const remain = matches[2];

      if ("undefined" === typeof groups[prefix]) {
        groups[prefix] = [remain];
      } else {
        groups[prefix].push(remain);
      }
    }
  });

  return groups;
}

function makePrefix(line, participants) {
  if (!knownPrefixes.test(line)) {
    if (participants.find((el) => el.login === "dependabot[bot]")) {
      // Put @dependabot PRs to "Security" group
      line = "Security - " + line;
    } else {
      line = "Other - " + line;
    }
  }

  return line;
}

function addProps(line, participants) {
  const props = participants.map(
    (item) => `[@${item.login}](${item.html_url})`
  );

  const propsStr = [...new Set(props)].join(", ");
  return line + ` (props ${propsStr})`;
}

function addVia(line, issue) {
  return line + ` via [#${issue.number}](${issue.html_url}))`;
}
