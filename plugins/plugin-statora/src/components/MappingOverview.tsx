import { Grid, Typography, Paper } from '@mui/material';
import { Mapping } from '../types';


export const MappingOverview = ({ mapping }: { mapping: Mapping }) => (
  <>
    <Typography variant="h6" gutterBottom>Mapping Overview</Typography>
    <Paper variant="outlined" sx={{ p: 2, mb: 4 }}>
      <Grid container spacing={2}>
        {Object.entries(mapping).map(([key, value]) => (
          <Grid item={true} xs={12} md={6} key={key}>
            <Typography variant="subtitle2" color="textSecondary">
              {key.replace('_', ' ').toUpperCase()}
            </Typography>
            <Typography variant="body1">{value}</Typography>
          </Grid>
        ))}
      </Grid>
    </Paper>
  </>
);
