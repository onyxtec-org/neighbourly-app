
import { createSelector } from '@reduxjs/toolkit';

export const selectJobs = (state) => state.job.jobs;

export const selectJobsByStatus = (status) =>
  createSelector([selectJobs], (jobs) =>
    jobs.filter((job) => job.status === status)
  );
