export type DocCategory =
  | "all"
  | "landing"
  | "services"
  | "trainings"
  | "therapists"
  | "events"
  | "blogs"
  | "pages"
  | "appointments"
  | "admins"
  | "static";

export interface ImageSpecs {
  recommendedDimensions: string;
  aspectRatio: string;
  format: string;
  maxFileSize: string;
  notes?: string;
}

export interface LivePageReference {
  name: string;
  url: string;
}

export interface AdminDocItem {
  id: string;
  title: string;
  category: DocCategory;
  isEditable: boolean;
  livePage: LivePageReference;
  adminPath?: string;
  summary: string;
  fields: string[];
  imageSpecs?: ImageSpecs;
  steps: string[];
  proTips?: string[];
  previewImage: string;
  imageCaption: string;
  codeLocation?: string;
  staticNotice?: string;
}

export type DocFilterTab = "all" | "editable" | "static";
