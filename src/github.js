import { execa } from "execa";
import { Octokit } from "octokit";

export default class GitHub {
  constructor(args = {}) {
    this.octokit = new Octokit(args);
  }

  async init() {
    this.repo = await this.getRepoInfo();
  }

  async getRepoInfo() {
    const { stdout } = await execa("git", [
      "config",
      "--get",
      "remote.origin.url",
    ]);

    let result = /:(\w+)\/([A-Za-z0-9-_]+)/.exec(stdout);

    if (!result) {
      result = /github.com\/(\w+)\/([A-Za-z0-9-_]+)/.exec(stdout);
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
      "GET /repos/{owner}/{repo}/issues/{issue}/events",
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

    const newParticipants = batch.data.map((item) => item.actor);

    if (newParticipants.length >= 100) {
      return await this.getParticipants(
        issue,
        participants.concat(newParticipants),
        page + 1
      );
    }

    return [...new Set(participants.concat(newParticipants))];
  }
}
