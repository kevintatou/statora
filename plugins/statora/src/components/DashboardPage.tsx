import React, { useEffect, useState } from 'react';
import { catalogApiRef, Entity } from '@backstage/plugin-catalog-react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Tooltip,
  ToggleButton,
  ToggleButtonGroup,
  Stack,
} from '@mui/material';
import { ViewModule, ViewQuilt } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useApi } from '@backstage/core-plugin-api';
import { statoraApiRef } from '../api/apiRef';

type Mapping = {
  component_name: string;
  github_repo: string;
  product_name?: string;
};

type DoraMetrics = {
  component_name: string;
  deploy_frequency: number;
  lead_time_minutes: number;
  change_failure_rate: number;
  time_to_restore_minutes: number;
};

export const DashboardPage = () => {
  const catalogApi = useApi(catalogApiRef);
  const navigate = useNavigate();

  const [components, setComponents] = useState<Entity[]>([]);
  const [mappings, setMappings] = useState<Record<string, Mapping>>({});
  const [doraMetrics, setDoraMetrics] = useState<Record<string, DoraMetrics>>({});
  const [viewMode, setViewMode] = useState<'microservices' | 'products'>('products');

  const statoraApi = useApi(statoraApiRef);

  useEffect(() => {
    const fetchData = async () => {
      const entities = await catalogApi.getEntities({ filter: { kind: 'Component' } });
      setComponents(entities.items);
  
      const mappingsData = await statoraApi.getComponentMappings();
      const doraData = await statoraApi.getDoraMetrics();
  
      const mappingMap = (mappingsData || []).reduce((acc: Record<string, Mapping>, m: Mapping) => {
        acc[m.component_name] = m;
        return acc;
      }, {});
      setMappings(mappingMap);
  
      const doraMap = (doraData || []).reduce((acc: Record<string, DoraMetrics>, d: DoraMetrics) => {
        acc[d.component_name] = d;
        return acc;
      }, {});
      setDoraMetrics(doraMap);
    };
  
    fetchData();
  }, [catalogApi, statoraApi]);
  const getHealthScore = (dora: DoraMetrics): number => {
    let score = 100;
    if (dora.deploy_frequency < 1) score -= 25;
    if (dora.lead_time_minutes > 60) score -= 25;
    if (dora.change_failure_rate > 15) score -= 25;
    if (dora.time_to_restore_minutes > 60) score -= 25;
    return Math.max(0, score);
  };

  const getHealthColor = (score: number) => {
    if (score >= 90) return 'green';
    if (score >= 75) return 'orange';
    return 'red';
  };

  const groupedByProduct = components.reduce((acc, entity) => {
    const name = entity.metadata.name;
    const mapping = mappings[name];
    const key = mapping?.product_name || 'Unassigned';
    acc[key] = [...(acc[key] || []), entity];
    return acc;
  }, {} as Record<string, Entity[]>);

  const renderCard = (name: string, repo?: string, score?: number) => (
    <Card
      key={name}
      onClick={() => navigate(`/catalog/default/component/${name}/statora`)}
      sx={{
        width: '100%',
        minHeight: 140,
        borderRadius: 3,
        cursor: 'pointer',
        transition: 'all 0.2s',
        '&:hover': { boxShadow: 6 },
        p: 2,
      }}
    >
      <CardContent>
        <Typography variant="h6" fontWeight="bold">{name}</Typography>
        {repo && (
          <Typography variant="body2" color="textSecondary">{repo}</Typography>
        )}
        {typeof score === 'number' && (
          <>
            <Tooltip title="DORA-based health score">
              <Typography variant="body2" fontWeight="bold" mt={1}>
                Service Health: {score}%
              </Typography>
            </Tooltip>
            <Box mt={0.5} height={8} bgcolor="#eee" borderRadius={5}>
              <Box
                sx={{
                  width: `${score}%`,
                  height: '100%',
                  backgroundColor: getHealthColor(score),
                }}
              />
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Box padding={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            🚦 Statora Dashboard
          </Typography>
          <Typography variant="subtitle1">
            Visualize microservice health and mappings at a glance.
          </Typography>
        </Box>

        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(_, newView) => newView && setViewMode(newView)}
          size="small"
          sx={{ borderRadius: 2, bgcolor: '#2c2c2c' }}
        >
          <ToggleButton value="microservices" sx={{ border: 'none' }}>
            <ViewModule fontSize="small" /> Microservices
          </ToggleButton>
          <ToggleButton value="products" sx={{ border: 'none' }}>
            <ViewQuilt fontSize="small" /> Products
          </ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      {viewMode === 'microservices' ? (
        <Grid container spacing={3}>
          {components.map(entity => {
            const name = entity.metadata.name;
            const mapping = mappings[name];
            const dora = doraMetrics[name];
            const score = dora ? getHealthScore(dora) : undefined;
            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={name}>
                {renderCard(name, mapping?.github_repo, score)}
              </Grid>
            );
          })}
        </Grid>
      ) : (
        <Grid container spacing={3}>
          {Object.entries(groupedByProduct).map(([product, group]) => {
            const scores = group
              .map(e => doraMetrics[e.metadata.name])
              .filter(Boolean)
              .map(getHealthScore);

            const avg = scores.length
              ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
              : null;

            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product}>
                <Card
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': { boxShadow: 6 },
                  }}
                  onClick={() => navigate(`/statora/product/${encodeURIComponent(product)}`)}
                >
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold">{product}</Typography>
                    {avg !== null && (
                      <>
                        <Tooltip title="Average DORA health of all services in this product">
                          <Typography variant="body2" mt={1}>Product Health: {avg}%</Typography>
                        </Tooltip>
                        <Box mt={0.5} height={8} bgcolor="#eee" borderRadius={5}>
                          <Box
                            sx={{
                              width: `${avg}%`,
                              height: '100%',
                              backgroundColor: getHealthColor(avg),
                            }}
                          />
                        </Box>
                      </>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
};
