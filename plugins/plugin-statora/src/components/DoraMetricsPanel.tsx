import { Grid, Typography, Paper, Chip } from '@mui/material';
import { DoraMetrics } from '../types';

type DoraMetricKey = keyof Pick<
  DoraMetrics,
  'deploy_frequency' | 'lead_time_minutes' | 'change_failure_rate' | 'time_to_restore_minutes'
>;

type Thresholds = {
  good: number;
  warn: number;
  lowerIsBetter?: boolean;
};

const METRIC_CONFIG: Record<DoraMetricKey, { label: string; unit: string; thresholds: Thresholds }> = {
  deploy_frequency: {
    label: 'Deploy Frequency',
    unit: '/week',
    thresholds: { good: 7, warn: 3, lowerIsBetter: false },
  },
  lead_time_minutes: {
    label: 'Lead Time',
    unit: 'min',
    thresholds: { good: 60, warn: 240, lowerIsBetter: true },
  },
  change_failure_rate: {
    label: 'Change Failure Rate',
    unit: '%',
    thresholds: { good: 15, warn: 30, lowerIsBetter: true },
  },
  time_to_restore_minutes: {
    label: 'Time to Restore',
    unit: 'min',
    thresholds: { good: 60, warn: 240, lowerIsBetter: true },
  },
};

const getHealthColor = (
  key: DoraMetricKey,
  value: number
): 'success' | 'warning' | 'error' => {
  const { good, warn, lowerIsBetter } = METRIC_CONFIG[key].thresholds;
  if (lowerIsBetter) {
    return value <= good ? 'success' : value <= warn ? 'warning' : 'error';
  } else {
    return value >= good ? 'success' : value >= warn ? 'warning' : 'error';
  }
};

export const DoraMetricsPanel = ({ dora }: { dora: DoraMetrics }) => (
  <>
    <Typography variant="h6" gutterBottom>DORA Metrics</Typography>
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Grid container spacing={2}>
        {(Object.keys(METRIC_CONFIG) as DoraMetricKey[]).map((key) => {
          const config = METRIC_CONFIG[key];
          const value = dora[key];
          const color = getHealthColor(key, value);

          return (
            <Grid item xs={12} sm={6} key={key}>
              <Typography variant="subtitle2">{config.label}</Typography>
              <Chip label={`${value}${config.unit}`} color={color} />
            </Grid>
          );
        })}
      </Grid>
    </Paper>
  </>
);
