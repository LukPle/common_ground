export function getProjectStatus(deadline: string | null): 'Active' | 'Expired' {
    if (!deadline) {
      return 'Active';
    }
  
    const now = new Date();
    const deadlineDate = new Date(deadline);
  
    if (deadlineDate > now) {
      return 'Active';
    }
  
    return 'Expired';
  }
