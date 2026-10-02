CREATE TABLE workspaces (
  id TEXT PRIMARY KEY NOT NULL CHECK (length(trim(id)) > 0),
  slug TEXT NOT NULL UNIQUE CHECK (length(trim(slug)) > 0),
  name TEXT NOT NULL CHECK (length(trim(name)) > 0),
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
) STRICT;

CREATE TABLE inboxes (
  id TEXT PRIMARY KEY NOT NULL CHECK (length(trim(id)) > 0),
  workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE RESTRICT,
  slug TEXT NOT NULL CHECK (length(trim(slug)) > 0),
  name TEXT NOT NULL CHECK (length(trim(name)) > 0),
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  UNIQUE (workspace_id, slug),
  -- Later tables can reference this pair to enforce a matching workspace and inbox.
  UNIQUE (workspace_id, id)
) STRICT;
