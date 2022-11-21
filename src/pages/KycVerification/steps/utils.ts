export const restoreFileFromBase64String = async (content: string | undefined, filename: string, mimetype: string) => {
  if (!content) return null;
  const response = await fetch(`data:${mimetype};base64,${content}`);
  return new File([await response.blob()], filename, { type: mimetype });
};
