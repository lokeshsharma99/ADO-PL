export type ContentType = 'blog' | 'news' | 'announcement';

export interface ContentPrompt {
  systemPrompt: string;
  temperature: number;
  maxTokens: number;
  guidelines: string[];
}

export interface ContentData {
  title: string;
  content: string;
  type: ContentType;
  author?: {
    name: string;
    role: string;
  };
  categories?: string[];
  images?: string[];
  createdAt?: string;
}

export interface PublishAction {
  type: 'submit_for_review' | 'approve' | 'reject' | 'publish' | 'unpublish';
  comment?: string;
  reviewedBy?: string;
} 