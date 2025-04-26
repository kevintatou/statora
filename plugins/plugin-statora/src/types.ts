export type Mapping = {
    component_name: string;
    github_repo: string;
    argocd_app?: string;
    sentry_project?: string;
    gcp_project?: string;
    jira_project?: string;
    product_name?: string;
  };
  
  
  export type DoraMetrics = {
    component_name: string;
    deploy_frequency: number;
    lead_time_minutes: number;
    change_failure_rate: number;
    time_to_restore_minutes: number;
  };
  