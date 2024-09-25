export enum Role {
  USER = "user",
  SYSTEM = "system",
}

export enum ArtifactType {
  TEXT = "text",
  TABLE = "table",
  IMAGE = "image",
  LINK = "link",
  FILE = "file",
  JSON = "json",
  CSV = "csv",
  PDF = "pdf",
  HTML = "html",
  XML = "xml",
  YAML = "yaml",
  SQL = "sql",
  MARKDOWN = "markdown",
  CODE = "code",
  JSON_TABLE = "json_table",
}

export interface Artifact {
  id: number;
  title: string;
  description?: string;
  type: ArtifactType;
  content: string[];
}

export enum TextContentType {
  TEXT = "text",
  HTML = "html",
  MARKDOWN = "markdown",
  JSON = "json",
  CODE = "code",
  XML = "xml",
  YAML = "yaml",
  CSV = "csv",
  SQL = "sql",
}

export interface TextContent {
  title?: string;
  text: string;
  type: TextContentType;
}

export interface Messages {
  id: number;
  role: Role;
  text: TextContent[];
  artifacts?: Artifact[];
  isError?: boolean;
  createdAt: Date;
}
