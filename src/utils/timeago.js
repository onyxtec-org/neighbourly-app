const timeAgo = (dateString) => {
    const now = new Date();
    const created = new Date(dateString);
    const seconds = Math.floor((now - created) / 1000);
  
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return `${interval}y ago`;
  
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return `${interval}m ago`;
  
    interval = Math.floor(seconds / 604800);
    if (interval >= 1) return `${interval}w ago`;
  
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return `${interval}d ago`;
  
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return `${interval}h ago`;
  
    interval = Math.floor(seconds / 60);
    if (interval >= 1) return `${interval}m ago`;
  
    return "Just now";
  };
  
  export default timeAgo;  