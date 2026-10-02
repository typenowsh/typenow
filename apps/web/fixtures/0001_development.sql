-- Synthetic data for local development and tests. Never load into a remote database.
INSERT INTO workspaces (id, slug, name) VALUES
  ('ws_demo_acme', 'demo-acme', 'Acme demo'),
  ('ws_demo_orbit', 'demo-orbit', 'Orbit demo')
ON CONFLICT (id) DO NOTHING;

INSERT INTO inboxes (id, workspace_id, slug, name) VALUES
  ('inbox_demo_acme', 'ws_demo_acme', 'support', 'Support'),
  ('inbox_demo_orbit', 'ws_demo_orbit', 'support', 'Support')
ON CONFLICT (id) DO NOTHING;
