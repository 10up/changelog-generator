# Changelog Generator

A simple tool to automate changelog generation during release process.

## Usage

Go to your project git folder and run the script.

```bash
cd ~/my-project

npx github:10up/changelog-generator 
```

The script will:
- Read all closed PRs within a milestone
- Search for "Changelog" section in the PR description, take all records from it. Use PR title by default if no "Changelog" section found
- Read all events from the PR and form participants list. Add participants as "props" to the entry.
- Add link to the PR (via ...) to the end of entry.
- Check if one of known prefixes is applied to the changelog entry (Added, Changed, Deprecated, Removed, Fixed, Security)
- If no prefix given, but @dependabot is in the list of participants, consider this is a "Secutiry" update, otherwise set "Other" prefix.

## Command-line Arguments

### --milestone, -m
(Required) Specify the name of target milestone to extract changelog entries from.

### --pat, -p
(Optional) GitHub personal access token. Default is `empty`

### --repo
(Optional) Custom GitHub repository address. Default is `empty`, use repository from the current folder.

### --style, -s
(Optional) Output style
- `grouped` Group changelog entries (Added, Fixed, etc.)
- `plain` (default) plain list of changelog entries

### --quiet
(Optional) Disable debug output, only the resulting changelog will be printed.

## Example with Simple Podcasting

Let's create a changelog for the [release version 1.2.3](https://github.com/10up/simple-podcasting/milestone/11?closed=1)

```bash
git clone git@github.com:10up/simple-podcasting.git

cd simple-podcasting

npx github:10up/changelog-generator --milestone=1.2.3 --style=grouped
```

Output for "Grouped" style:

```
❯ npx github:10up/changelog-generator -m 1.2.3 --style=grouped --quiet
npx: installed 163 in 307.466s


## Changelog:

### Added
- Dependency security scanning. (props [@jeffpaul](https://github.com/jeffpaul), [@cadic](https://github.com/cadic)) via [#168](https://github.com/10up/simple-podcasting/pull/168))
- Default Pull Request Reviewers via `CODEOWNERS` file. (props [@jeffpaul](https://github.com/jeffpaul), [@cadic](https://github.com/cadic)) via [#156](https://github.com/10up/simple-podcasting/pull/156))
- Compatibility tests against PHP 7 and 8. (props [@cadic](https://github.com/cadic), [@jeffpaul](https://github.com/jeffpaul), [@dkotter](https://github.com/dkotter)) via [#150](https://github.com/10up/simple-podcasting/pull/150))

### Security
- Bump async from 2.6.3 to 2.6.4 (props [@dependabot[bot]](https://github.com/apps/dependabot), [@jeffpaul](https://github.com/jeffpaul), [@cadic](https://github.com/cadic)) via [#166](https://github.com/10up/simple-podcasting/pull/166))
- Bump minimist from 1.2.5 to 1.2.6 (props [@dependabot[bot]](https://github.com/apps/dependabot), [@cadic](https://github.com/cadic)) via [#160](https://github.com/10up/simple-podcasting/pull/160))
- Bump node-forge from 1.2.1 to 1.3.0 (props [@dependabot[bot]](https://github.com/apps/dependabot), [@cadic](https://github.com/cadic)) via [#159](https://github.com/10up/simple-podcasting/pull/159))

### Changed
- Upgrade node dependencies (props [@cadic](https://github.com/cadic), [@jeffpaul](https://github.com/jeffpaul)) via [#163](https://github.com/10up/simple-podcasting/pull/163))
- Replaced custom commands with @10up/cypress-wp-utils in end-to-end tests (props [@dinhtungdu](https://github.com/dinhtungdu), [@jeffpaul](https://github.com/jeffpaul), [@cadic](https://github.com/cadic)) via [#162](https://github.com/10up/simple-podcasting/pull/162))
- Upgrade wp-scripts, wp-env, cypress and other minor dependencies to latest versions (props [@cadic](https://github.com/cadic), [@jeffpaul](https://github.com/jeffpaul)) via [#158](https://github.com/10up/simple-podcasting/pull/158))
- Unit tests against PHP 8 (props [@cadic](https://github.com/cadic), [@jeffpaul](https://github.com/jeffpaul), [@dkotter](https://github.com/dkotter)) via [#150](https://github.com/10up/simple-podcasting/pull/150))
- Bump required PHP 7.0 (props [@cadic](https://github.com/cadic), [@jeffpaul](https://github.com/jeffpaul), [@dkotter](https://github.com/dkotter)) via [#150](https://github.com/10up/simple-podcasting/pull/150))

### Fixed
- Add `<enclosure>` to feed item. (props [@davexpression](https://github.com/davexpression), [@cadic](https://github.com/cadic), [@jeffpaul](https://github.com/jeffpaul)) via [#155](https://github.com/10up/simple-podcasting/pull/155))
```