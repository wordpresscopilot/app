export enum Role {
  USER = "user",
  SYSTEM = "system",
}

export interface Artifact {
  id: string;
  name: string;
  description?: string;
  type: string;
  content: string[];
}

export interface Messages {
  role: Role;
  text: string | string[];
  artifacts?: Artifact[];
  createdAt: Date;
}
