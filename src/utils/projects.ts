import type { CollectionEntry } from 'astro:content';
import type { GitHubRepo, Project } from '../types';

export function mergeWithMarkdown(
  repos: GitHubRepo[],
  markdownEntries: CollectionEntry<'projects'>[],
): Project[] {
  const ownRepos = repos.filter((r) => !r.fork && r.name !== 'Portfolio');

  const projects: Project[] = ownRepos.map((repo) => {
    const md = markdownEntries.find((m) => m.data.githubUrl?.includes(repo.name));
    return {
      id: repo.name,
      title: md?.data.title || repo.name,
      description: md?.data.description || repo.description || '',
      tags:
        md?.data.tags?.length
          ? md.data.tags
          : [...(repo.language ? [repo.language] : []), ...repo.topics],
      year: md?.data.year,
      githubUrl: repo.html_url,
      liveUrl: md?.data.liveUrl,
      image: md?.data.image,
      language: repo.language || '',
      stars: repo.stargazers_count,
      featured: md?.data.featured || false,
      order: md?.data.order ?? 999,
      hasCaseStudy: !!md,
      isPrivate: repo.private,
    };
  });

  for (const md of markdownEntries) {
    if (!projects.some((p) => p.githubUrl === md.data.githubUrl)) {
      projects.push({
        id: md.id,
        title: md.data.title,
        description: md.data.description || '',
        tags: md.data.tags,
        year: md.data.year,
        githubUrl: md.data.githubUrl || '',
        liveUrl: md.data.liveUrl,
        image: md.data.image,
        language: '',
        stars: 0,
        featured: md.data.featured,
        order: md.data.order ?? 999,
        hasCaseStudy: true,
        isPrivate: true,
      });
    }
  }

  return projects.sort((a, b) => a.order - b.order);
}
