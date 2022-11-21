export const openLinkInNewTab = (url: string): void => {
  window.open(url, '_blank', 'noopener,noreferrer');
};
