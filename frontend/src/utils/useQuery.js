import { useState } from 'react';

const useQuery = () => {
  const [result, setResult] = useState({});
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  return [
    { result, error, isLoading },
    (query) => {
      setIsLoading(true);
      return fetch('/graphql', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          operationName: null,
          variables: {},
          query: query
        })
      })
        .then((r) => r.json())
        .then((res) => setResult(res.data))
        .catch((err) => setError(err))
        .finally(() => setIsLoading(false));
    }
  ];
};

export default useQuery;
