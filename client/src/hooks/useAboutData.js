// Encapsulates loading and error handling for fetching the about information.
import { useEffect, useState } from 'react';
import { fetchAbout } from '../services/api';

export default function useAboutData() {
  const [about, setAbout] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ignore = false; // Prevents state updates if the component unmounts mid-request.

    async function loadAbout() {
      try {
        const latestAbout = await fetchAbout();
        if (!ignore) {
          setAbout(latestAbout);
          setError(null);
        }
      } catch (apiError) {
        if (!ignore) {
          setError(apiError.message || 'Unable to load bio information.');
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadAbout();

    return () => {
      ignore = true;
    };
  }, []);

  return { about, error, isLoading };
}
