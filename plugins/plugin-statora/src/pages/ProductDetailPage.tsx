// frontend ProductDetailPage.tsx (simplified to use backend APIs)
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Grid, Card, CardContent,
  Tooltip, Button, IconButton, Stack,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useApi } from '@backstage/core-plugin-api';
import { statoraApiRef } from '../api/apiRef';

export const ProductDetailPage = () => {
  const { productName } = useParams<{ productName: string }>();
  const navigate = useNavigate();

  const [services, setServices] = useState<any[]>([]);
  const [doraMetrics, setDoraMetrics] = useState<Record<string, any>>({});

  const statoraApi = useApi(statoraApiRef);

  useEffect(() => {
    const fetchData = async () => {
      const componentsData = await statoraApi.getComponentsByProduct(productName || '');
      const doraData = await statoraApi.getDoraMetrics();
  
      setServices(componentsData);
  
      const doraMap = (doraData || []).reduce((acc: Record<string, any>, d: any) => {
        acc[d.component_name] = d;
        return acc;
      }, {});
      setDoraMetrics(doraMap);
    };
  
    fetchData();
  }, [productName, statoraApi]);
  

  const getHealthScore = (dora: any): number => {
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

  const copyToClipboard = (text: string) => navigator.clipboard.writeText(text);

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>{productName} — Product Health</Typography>
      <Box mb={2} mt={2}>
        <Button variant="outlined" onClick={() => navigate(-1)}>⬅ Back to Dashboard</Button>
      </Box>

      {services.length === 0 ? (
        <Typography>No microservices are mapped to this product yet.</Typography>
      ) : (
        <Grid container spacing={3}>
          {services.map(service => {
            const name = service.component_name;
            const dora = doraMetrics[name];
            const score = dora ? getHealthScore(dora) : null;

            return (
              <Grid item={true} xs={12} sm={6} md={4} key={name}>
                <Card onClick={() => navigate(`/catalog/default/component/${name}/statora`)} sx={{ cursor: 'pointer', '&:hover': { boxShadow: 6 } }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>{name}</Typography>
                    {service.github_repo && (
                      <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                        <Typography variant="body2" color="textSecondary" noWrap>{service.github_repo}</Typography>
                        <Tooltip title="Copy to clipboard">
                          <IconButton size="small" onClick={e => { e.stopPropagation(); copyToClipboard(service.github_repo); }}>
                            <ContentCopyIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    )}
                    {score !== null && (
                      <>
                        <Tooltip title={`Deploys: ${dora.deploy_frequency}, Lead: ${dora.lead_time_minutes} min, Fail: ${dora.change_failure_rate}%, Restore: ${dora.time_to_restore_minutes} min`}>
                          <Typography variant="body2" fontWeight="bold">Health Score: {score}%</Typography>
                        </Tooltip>
                        <Box mt={0.5} height={8} bgcolor="#eee" borderRadius={5}>
                          <Box sx={{ width: `${score}%`, height: '100%', background: getHealthColor(score) }} />
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
