import { baseAPI } from './base.api';

/**
 * GET /api/holdings — auth required.
 * See report.md "Frontend Task B" for the plan to wire this into the
 * dashboard views without a full rewrite.
 */
export const getHoldingsApi = () => baseAPI('/holdings', 'GET', undefined, '/api');
