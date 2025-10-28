// Example: src/utils/dateFormatter.ts
export const formatDate = (dateString: string, short = false): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  
  const options: Intl.DateTimeFormatOptions = short
    ? { year: 'numeric', month: 'short', day: 'numeric' }
    : { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    
  return new Intl.DateTimeFormat('en-US', options).format(date);
};