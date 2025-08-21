export function normalizeNotificationData(data) {
    if (!data) return null;
  
    return {
      type: data.type || data.Type,
      job_id:
        data.job_id ||
        data.jobId ||
        data.jobID ||
        data.jobid ||
        data.id ||
        data.offer_id ||
        data?.raw?.offer_id,
      raw: data,
    };
  }