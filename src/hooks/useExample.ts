import { useState } from 'react';

export const useExample = () => {
  const [value, setValue] = useState<string>('');

  const updateValue = (newValue: string) => {
    setValue(newValue);
  };

  return {
    value,
    updateValue,
  };
};

