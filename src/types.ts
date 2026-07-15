export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  fork: boolean;
  private: boolean;
  topics: string[];
  updated_at: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  year?: number;
  githubUrl: string;
  liveUrl?: string;
  image?: string;
  language: string;
  stars: number;
  featured: boolean;
  order: number;
  hasCaseStudy: boolean;
  isPrivate: boolean;
}
