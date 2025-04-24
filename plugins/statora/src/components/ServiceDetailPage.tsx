import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
} from '@mui/material';
import { useApi } from '@backstage/core-plugin-api';
import { useEntity } from '@backstage/plugin-catalog-react';
import { statoraApiRef } from '../api/apiRef';
import { MappingOverview } from './MappingOverview';
import { DoraMetricsPanel } from './DoraMetricsPanel';

type Mapping = {
  github_repo: string;
  argocd_app: string;
  sentry_project: string;
  gcp_project: string;
  jira_project: string;
};

type DoraMetrics = {
  deploy_frequency: number;
  lead_time_minutes: number;
  change_failure_rate: number;
  time_to_restore_minutes: number;
};

export const ServiceDetailPage = () => {
  const { entity } = useEntity();
  const componentName = entity.metadata.name;

  const statoraApi = useApi(statoraApiRef);

  const [mapping, setMapping] = useState<Mapping | null>(null);
  const [dora, setDora] = useState<DoraMetrics | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newMappingData, setNewMappingData] = useState<Mapping>({
    github_repo: '',
    argocd_app: '',
    sentry_project: '',
    gcp_project: '',
    jira_project: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const m = await statoraApi.getComponentMapping(componentName);
        const d = await statoraApi.getComponentDora(componentName);
        setMapping(m);
        setDora(d);
      } catch (err) {
        console.error('Failed to fetch service data:', err);
      }
    };

    fetchData();
  }, [componentName, statoraApi]);

  const handleSave = async () => {
    if (!mapping) return;
    setIsSaving(true);

    try {
      const updated = await statoraApi.updateComponentMapping(componentName, mapping);
      setMapping(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      alert('Failed to save: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreate = async () => {
    try {
      const created = await statoraApi.createComponentMapping(componentName, newMappingData);
      setMapping(created);
      setCreateModalOpen(false);
    } catch (err: any) {
      alert('Failed to create mapping: ' + err.message);
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Statora Service: <strong>{componentName}</strong>
      </Typography>

      <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
        <Button variant="contained" onClick={() => setEditMode(prev => !prev)}>
          {editMode ? 'Back to Overview' : 'Edit Mapping'}
        </Button>
        {!mapping && (
          <Button variant="outlined" onClick={() => setCreateModalOpen(true)}>
            + Create Mapping
          </Button>
        )}
      </Box>

      {editMode ? (
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>Mapping Editor</Typography>
          {mapping ? (
            <Paper elevation={2} sx={{ p: 3 }}>
              {(['github_repo', 'argocd_app', 'sentry_project', 'gcp_project', 'jira_project'] as const).map(key => (
                <Box key={key} mb={2}>
                  <TextField
                    fullWidth
                    label={key.replace('_', ' ').toUpperCase()}
                    value={mapping[key]}
                    onChange={e => setMapping({ ...mapping, [key]: e.target.value })}
                  />
                </Box>
              ))}
              <Box display="flex" alignItems="center" gap={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save Mapping'}
                </Button>
                {saveSuccess && <Alert severity="success">Mapping saved!</Alert>}
              </Box>
            </Paper>
          ) : (
            <Typography>No mapping found.</Typography>
          )}
        </Box>
      ) : (
        <Box mt={4}>
          {mapping ? (
            <MappingOverview mapping={mapping} />
          ) : (
            <Typography>No mapping found for this service.</Typography>
          )}

          <Divider sx={{ my: 4 }} />

          {dora ? (
            <DoraMetricsPanel dora={dora} />
          ) : (
            <Typography>No DORA metrics available.</Typography>
          )}
        </Box>
      )}

      <Dialog open={createModalOpen} onClose={() => setCreateModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create Mapping for {componentName}</DialogTitle>
        <DialogContent>
          {(['github_repo', 'argocd_app', 'sentry_project', 'gcp_project', 'jira_project'] as const).map(key => (
            <Box key={key} mb={2}>
              <TextField
                fullWidth
                label={key.replace('_', ' ').toUpperCase()}
                value={newMappingData[key]}
                onChange={e => setNewMappingData({ ...newMappingData, [key]: e.target.value })}
              />
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateModalOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
