-- schema.sql

-- Components Table
create table if not exists components (
  component_name text primary key,
  github_repo text,
  sentry_project text,
  argocd_app text,
  gcp_project text,
  jira_project text,
  product_name text
);

-- DORA Metrics Table
create table if not exists dora_metrics (
  component_name text primary key,
  deploy_frequency float,
  lead_time_minutes float,
  change_failure_rate float,
  time_to_restore_minutes float
);

-- Row-Level Security (for demo purposes)
alter table components enable row level security;
alter table dora_metrics enable row level security;

create policy "Allow read for all" on components for select using (true);
create policy "Allow read for all" on dora_metrics for select using (true);

