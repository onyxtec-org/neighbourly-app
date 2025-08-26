import { createSelector } from '@reduxjs/toolkit';

export const selectJobs = state => state.job.jobs;

export const selectJobsByTab = (tabKey, role) =>
  createSelector([selectJobs], jobs => {
    if (role === 'consumer') {
      switch (tabKey) {
        case 'pending':
          return jobs.filter(
            job => job.status === 'open' && job.accepted_offer === null,
          );
        case 'my_jobs': // "To Start"
          return jobs.filter(
            job => job.status === 'scheduled',
          );
        case 'in_progress':
          return jobs.filter(job => job.status === 'in_progress');
        case 'completed':
          return jobs.filter(job => job.status === 'completed');
        default:
          return [];
      }
    }

    if (role === 'provider') {
      switch (tabKey) {
        case 'new':
          return jobs.filter(
            job => job.status === 'open' && job.my_offer === null,
          );
        case 'pending':
          return jobs.filter(
            job =>
              job.status === 'open' &&
              job.my_offer !== null &&
              (job.accepted_offer == null ||
                job.my_offer?.id !== job.accepted_offer?.id),
          );
        case 'my_jobs':
         return jobs.filter(
            job => job.status === 'scheduled',
          );
        case 'in_progress':
          return jobs.filter(job => job.status === 'in_progress');
        case 'completed':
          return jobs.filter(job => job.status === 'completed');
        default:
          return [];
      }
    }

    return [];
  });
