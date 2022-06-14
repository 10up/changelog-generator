import { execa } from "execa";
import { Octokit } from "octokit";

export default class GitHub {
  constructor(args = {}) {
    this.octokit = new Octokit(args);
  }

  async init(repo) {
    this.repo = await this.getRepoInfo(repo);
  }

  async getRepoInfo(repo = "") {
    if (repo.length === 0) {
      const { stdout } = await execa("git", [
        "config",
        "--get",
        "remote.origin.url",
      ]);
      repo = stdout;
    }

    let result = /:(\w+)\/([A-Za-z0-9-_]+)/.exec(repo);

    if (!result) {
      result = /github.com\/(\w+)\/([A-Za-z0-9-_]+)/.exec(repo);
    }

    if (!result) {
      return null;
    }

    return {
      owner: result[1],
      name: result[2],
    };
  }

  async getIssues(milestone, issues = [], page = 1) {
    const query = `milestone:"${milestone}" type:pr state:closed repo:${this.repo.owner}/${this.repo.name}`;
    const batch = await this.octokit.request("GET /search/issues", {
      owner: this.repo.owner,
      repo: this.repo.name,
      q: query,
      direction: "asc",
      sort: "created",
      per_page: 100,
      page: page,
    });

    if (batch.status !== 200) {
      return issues;
    }

    const newIssues = batch.data.items;

    if (newIssues.length >= 100) {
      return await this.getIssues(
        milestone,
        issues.concat(newIssues),
        page + 1
      );
    }

    return issues.concat(newIssues);
  }

  async getParticipants(issue, participants = [], page = 1) {
    const batch = await this.octokit.request(
      "GET /repos/{owner}/{repo}/issues/{issue}/timeline",
      {
        owner: this.repo.owner,
        repo: this.repo.name,
        issue: issue.number,
        direction: "asc",
        sort: "created",
        per_page: 100,
        page: page,
      }
    );

    if (batch.status !== 200) {
      return participants;
    }

    const newParticipants = batch.data
      .filter((item) => {
        if (
          !["subscribed", "unsubscribed"].includes(item.event) &&
          (item.hasOwnProperty("actor") || item.hasOwnProperty("user"))
        ) {
          // Only take items from timeline which are
          // not subscription events and have extractable user
          return true;
        } else {
          return false;
        }
      })
      .map((item) => {
        const result = item.hasOwnProperty("actor")
          ? { login: item.actor.login, html_url: item.actor.html_url }
          : { login: item.user.login, html_url: item.user.html_url };

        return result;
      });

    if (newParticipants.length >= 100) {
      return await this.getParticipants(
        issue,
        participants.concat(newParticipants),
        page + 1
      );
    }

    // Make unique results array.
    const result = [];
    const map = new Map();
    for (const item of participants.concat(newParticipants)) {
      if (!map.has(item.login)) {
        map.set(item.login, true);
        result.push({
          login: item.login,
          html_url: item.html_url,
        });
      }
    }
    return result;
  }
}
