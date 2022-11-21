import { useState, useEffect } from 'react';

const REACT_APP_METAZENS_POLL_MS = parseInt(String(process.env.REACT_APP_METAZENS_POLL_MS), 10) || 5000;

const usePollingFetch = <T>(request: () => PromiseLike<T>, defaultData?: T, interval = REACT_APP_METAZENS_POLL_MS) => {
  const [data, setData] = useState(defaultData);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const pollFunc = async () => {
      setIsLoading(true);
      try {
        const response = await request();
        setData(response);
        setIsLoading(false);
      } catch (e: any) {
        console.error(`polling response error: ${JSON.stringify(e)}`);
        setError(e);
        setIsLoading(false);
      }
    };

    console.log(`polling interval ${interval}`);
    pollFunc();
    const id = setInterval(pollFunc, interval);

    return () => {
      clearInterval(id);
    };
  }, [request, interval]);

  return [data, error, isLoading];
};

export default usePollingFetch;
