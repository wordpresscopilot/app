export enum Role {
  USER = "user",
  SYSTEM = "system",
  ASSISTANT = "assistant",
  FUNCTION = "function",
  DATA = "data",
  TOOL = "tool",
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
  BUTTONS = "buttons",
  SITE = "site",
}

export interface Artifact {
  id: string;
  title: string;
  description?: string;
  type: ArtifactType;
  content: string[];
  toolName: ToolType;
  isError?: boolean;
}

export enum ToolType {
  GENERATE_SQL = "generate-sql",
  RUN_SQL_QUERY = "runSQLQuery",
  GET_CURRENT_SITE_PLUGINS = "getCurrentSitePlugins",
  GET_CORE_SITE_DATA = "getCoreSiteData",
  SEARCH_PLUGINS = "searchPlugins",
  INSTALL_PLUGIN = "installPlugin",
  ASK_FOR_PERMISSION = "askForPermission",
  ANSWER = "answer",
  SHOW_SITE = "showSite",
  ERROR = "error",
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
  ERROR = "error",
}

export interface Content {
  title?: string;
  text: string;
  type: TextContentType;
}

export interface Message {
  id?: string;
  role: Role;
  content?: Content[];
  text?: Content[];
  artifacts?: Artifact[];
  isError?: boolean;
  createdAt: Date;
}

export enum UserRequestCategoryType {
  DATA_EXTRACTION_REQUEST = "data_extraction_request",
  RUN_SQL_QUERY = "run_sql_query",
  DATA_EXPLANATION = "data_explanation",
  CONTENT_CREATION = "content_creation",
  SITE_MANAGEMENT = "site_management",
  PLUGIN_INSTALL = "plugin_install",
  PLUGIN_SEARCH = "plugin_search",
  PLUGIN_UPDATE = 'plugin_update',
  PLUGIN_RELATED = "plugin_related",
  OTHER = "other",
}