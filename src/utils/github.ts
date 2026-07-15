import type { GitHubRepo } from '../types';

export async function fetchRepos(): Promise<GitHubRepo[]> {
  const token = import.meta.env.GITHUB_TOKEN || process.env.GITHUB_TOKEN;
  const username = import.meta.env.GITHUB_USERNAME || process.env.GITHUB_USERNAME || 'AmineAce';

  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const url = `https://api.github.com/users/${username}/repos?per_page=100&sort=updated&type=owner&direction=desc`;

  const res = await fetch(url, { headers });

  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}
