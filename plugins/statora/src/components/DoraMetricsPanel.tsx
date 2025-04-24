import React from 'react';
import { Grid, Typography, Paper, Chip } from '@mui/material';

type DoraMetrics = {
  deploy_frequency: number;
  lead_time_minutes: number;
  change_failure_rate: number;
  time_to_restore_minutes: number;
};

const getHealthColor = (metric: string, value: number): 'success' | 'warning' | 'error' => {
  switch (metric) {
    case 'deploy_frequency':
      return value >= 7 ? 'success' : value >= 3 ? 'warning' : 'error';
    case 'lead_time_minutes':
      return value <= 60 ? 'success' : value <= 240 ? 'warning' : 'error';
    case 'change_failure_rate':
      return value <= 15 ? 'success' : value <= 30 ? 'warning' : 'error';
    case 'time_to_restore_minutes':
      return value <= 60 ? 'success' : value <= 240 ? 'warning' : 'error';
    default:
      return 'error';
  }
};

export const DoraMetricsPanel = ({ dora }: { dora: DoraMetrics }) => (
  <>
    <Typography variant="h6" gutterBottom>DORA Metrics</Typography>
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2">Deploy Frequency</Typography>
          <Chip
            label={`${dora.deploy_frequency}/week`}
            color={getHealthColor('deploy_frequency', dora.deploy_frequency)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2">Lead Time</Typography>
          <Chip
            label={`${dora.lead_time_minutes} min`}
            color={getHealthColor('lead_time_minutes', dora.lead_time_minutes)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2">Change Failure Rate</Typography>
          <Chip
            label={`${dora.change_failure_rate}%`}
            color={getHealthColor('change_failure_rate', dora.change_failure_rate)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2">Time to Restore</Typography>
          <Chip
            label={`${dora.time_to_restore_minutes} min`}
            color={getHealthColor('time_to_restore_minutes', dora.time_to_restore_minutes)}
          />
        </Grid>
      </Grid>
    </Paper>
  </>
);
