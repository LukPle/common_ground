import { formatDistanceToNowStrict } from 'date-fns';

export function getProjectStatus(deadline: string | null): 'Waiting for Input' | 'Assessment Phase' {
  if (!deadline) {
    return 'Waiting for Input';
  }

  const now = new Date();
  const deadlineDate = new Date(deadline);

  if (deadlineDate > now) {
    return 'Waiting for Input';
  }

  return 'Assessment Phase';
}

export function getRelativeTime(date: string, showSuffix: boolean = false): string {
  const dateObj = new Date(date);
  const isFuture = dateObj.getTime() > Date.now();

  const distance = formatDistanceToNowStrict(dateObj, {
    addSuffix: !isFuture && showSuffix,
  });

  return distance
    .replace('in ', '')
    .replace(/\s?seconds?/, 's')
    .replace(/\s?minutes?/, 'm')
    .replace(/\s?hours?/, 'h')
    .replace(/\s?days?/, 'd')
    .replace(/\s?months?/, 'mo')
    .replace(/\s?years?/, 'y');
}
