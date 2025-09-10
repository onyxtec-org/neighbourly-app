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
          ).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
          break;
        case 'my_jobs': // "To Start"
          filteredJobs = jobs.filter(job => job.status === 'scheduled').sort((a, b) => new Date(b.starts_at) - new Date(a.starts_at));
          break;
        case 'in_progress':
          filteredJobs = jobs.filter(job => job.status === 'in_progress');
          break;
        case 'completed':
          filteredJobs = jobs.filter(job => job.status === 'completed');
          break;
       case 'invited':
          filteredJobs = jobs.filter(job => job.status === 'invited');
          break;
       case 'rejected':
          filteredJobs = jobs.filter(job => job.status === 'rejected' ||job.status === 'declined');
          break;
        default:
          filteredJobs = [];
      }
    } else if (role === 'provider') {
      switch (tabKey) {
        case 'new':
          filteredJobs = jobs.filter(
            job => job.status === 'open' && job.my_offer === null
          ).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
          break;
        case 'pending':
          filteredJobs = jobs.filter(
            job =>
              (job.status === 'open' || job.status==='invited') &&
              job.my_offer !== null &&
              (job.accepted_offer === null ||
                job.my_offer?.id !== job.accepted_offer?.id)
          ).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
          break;
        case 'my_jobs':
          filteredJobs = jobs.filter(job => job.status === 'scheduled').sort((a, b) => new Date(b.starts_at) - new Date(a.starts_at));
          break;
        case 'in_progress':
          filteredJobs = jobs.filter(job => job.status === 'in_progress');
          break;
        case 'completed':
          filteredJobs = jobs.filter(job => job.status === 'completed');
          break;
        case 'invited':
          filteredJobs = jobs.filter(job => job.status === 'invited' && job.my_offer === null);
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