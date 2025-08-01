import { useEffect, useState } from 'react';

export default function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value);
  
  useEffect(() => {
    const id = setTimeout(() => {
      setDebounced(value);
    }, delay);
    
    return () => {
      clearTimeout(id);
    };
  }, [value, delay]);
  
  return debounced;
}