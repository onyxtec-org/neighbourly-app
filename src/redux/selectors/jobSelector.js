import { createSelector } from '@reduxjs/toolkit';

export const selectJobs = state => state.job.jobs;

export const selectJobsByTab = (tabKey, role) =>
  createSelector([selectJobs], jobs => {
    let filteredJobs = [];

    if (role === 'consumer') {
      switch (tabKey) {
        case 'pending':
          filteredJobs = jobs.filter(
            job => job.status === 'open' && job.accepted_offer === null
          );
          break;
        case 'my_jobs': // "To Start"
          filteredJobs = jobs.filter(job => job.status === 'scheduled');
          break;
        case 'in_progress':
          filteredJobs = jobs.filter(job => job.status === 'in_progress');
          break;
        case 'completed':
          filteredJobs = jobs.filter(job => job.status === 'completed');
          break;
        default:
          filteredJobs = [];
      }
    } else if (role === 'provider') {
      switch (tabKey) {
        case 'new':
          filteredJobs = jobs.filter(
            job => job.status === 'open' && job.my_offer === null
          );
          break;
        case 'pending':
          filteredJobs = jobs.filter(
            job =>
              job.status === 'open' &&
              job.my_offer !== null &&
              (job.accepted_offer == null ||
                job.my_offer?.id !== job.accepted_offer?.id)
          );
          break;
        case 'my_jobs':
          filteredJobs = jobs.filter(job => job.status === 'scheduled');
          break;
        case 'in_progress':
          filteredJobs = jobs.filter(job => job.status === 'in_progress');
          break;
        case 'completed':
          filteredJobs = jobs.filter(job => job.status === 'completed');
          break;
        default:
          filteredJobs = [];
      }
    }

    return {
      jobs: filteredJobs,
      count: filteredJobs.length,
    };
  });