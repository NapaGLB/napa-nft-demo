import { useEffect, useState } from 'react';

const useDebounce = (input: string | null, delay: number) => {
  const [value, setValue] = useState(input);

  useEffect(() => {
    const prevInput = setTimeout(() => {
      setValue(input);
    }, delay);

    return () => clearTimeout(prevInput);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input]);

  return value;
};

export default useDebounce;
