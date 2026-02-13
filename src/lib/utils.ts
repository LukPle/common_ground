import { formatDistanceToNowStrict } from 'date-fns';
import { MouseEvent } from 'react';

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

export const handleShare = async (
  title: string,
  text: string,
  url: string,
  event?: MouseEvent
) => {
  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }

  const shareData = {
    title,
    text,
    url: url || (typeof window !== 'undefined' ? window.location.href : ''),
  };

  if (navigator.share && navigator.canShare(shareData)) {
    try {
      await navigator.share(shareData);
      return { success: true, type: 'native' };
    } catch (err) {
      if ((err as Error).name !== 'AbortError') console.error('Share failed:', err);
    }
  }

  try {
    await navigator.clipboard.writeText(shareData.url);
    return { success: true, type: 'clipboard' };
  } catch (err) {
    return { success: false, type: 'error' };
  }
};
