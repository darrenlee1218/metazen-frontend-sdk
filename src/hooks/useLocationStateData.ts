import { useLocation } from 'react-router-dom';

export const useLocationStateData = <T>() => {
  const location = useLocation();

  return (location.state as { data: T } | undefined)?.data;
};
