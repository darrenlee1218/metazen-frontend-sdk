import { useState, useEffect } from 'react';

const useFetch = <T>(request: () => PromiseLike<T>, defaultData?: T) => {
  const [data, setData] = useState(defaultData);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    request().then(
      (response: T) => {
        console.log(`response ${JSON.stringify(response)}`);
        setData(response);
        setIsLoading(false);
      },
      (e: any) => {
        console.error(`response error: ${JSON.stringify(e)}`);
        setError(e);
        setIsLoading(false);
      },
    );
  }, [request]);

  return [data, error, isLoading];
};

export default useFetch;
