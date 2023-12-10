import { Dispatch, SetStateAction, useEffect, useState } from 'react';

type UseLocalStorageReturnType<T> = {
  storedValue: T | null;
  setValue: Dispatch<SetStateAction<T | null>>;
};

const useLocalStorage = <K, T>(key: string, initialValue: T): UseLocalStorageReturnType<T> => {
  // Function to check if we are on the client side
  const isClient = typeof window !== 'undefined';

  // Get initial value from local storage or use provided initial value
  const storedValue = isClient ? JSON.parse(localStorage.getItem(key) || 'null') : initialValue;

  // Create state to hold the current value
  const [value, setValue] = useState<T | null>(storedValue);

  // Update local storage when the state changes, but only on the client side
  useEffect(() => {
    if (isClient) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }, [key, value, isClient]);

  return { storedValue: value, setValue };
};

export default useLocalStorage;
