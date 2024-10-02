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
  PHP = "php",
  MARKDOWN = "markdown",
  CODE = "code",
  JSON_TABLE = "json_table",
  BUTTONS = "buttons",
  SITE = "site",
  PLAYGROUND = "playground",
}

import { IconType } from 'react-icons';
import {
  FaCode,
  FaDatabase,
  FaFile,
  FaFileAlt,
  FaFileCode,
  FaFileExcel,
  FaFilePdf,
  FaFileWord, FaGlobe,
  FaHtml5,
  FaImage, FaLink,
  FaMarkdown,
  FaPhp,
  FaTable,
} from 'react-icons/fa';

export function getArtifactIcon(type: ArtifactType): IconType {
  switch (type) {
    case ArtifactType.TEXT:
      return FaFileAlt;
    case ArtifactType.TABLE:
      return FaTable;
    case ArtifactType.JSON_TABLE:
      return FaTable;
    case ArtifactType.IMAGE:
      return FaImage;
    case ArtifactType.LINK:
      return FaLink;
    case ArtifactType.FILE:
      return FaFile;
    case ArtifactType.JSON:
    case ArtifactType.CODE:
      return FaCode;
    case ArtifactType.CSV:
      return FaFileExcel;
    case ArtifactType.PDF:
      return FaFilePdf;
    case ArtifactType.HTML:
      return FaHtml5;
    case ArtifactType.XML:
      return FaFileCode;
    case ArtifactType.SQL:
      return FaDatabase;
    case ArtifactType.PHP:
      return FaPhp;
    case ArtifactType.MARKDOWN:
      return FaMarkdown;
    case ArtifactType.BUTTONS:
      return FaFileWord;
    case ArtifactType.SITE:
      return FaGlobe;
    default:
      return FaFile;
  }
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
  INSTALL_PLUGIN_FILE = "installPluginFile",
  REMOVE_PLUGIN = "removePlugin",
  ASK_FOR_PERMISSION = "askForPermission",
  GENERATE_PAGE = "generatePage",
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