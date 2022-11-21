export const formatAddress = (address: string) => {
  if (address.length <= 11) return address;
  const headCharacters = address.slice(0, 4);
  const lastCharacters = address.slice(-4);
  return `${headCharacters}...${lastCharacters}`;
};
