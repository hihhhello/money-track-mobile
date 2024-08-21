import { useCallback, useMemo, useState } from 'react';

export const useBoolean = (initialValue: boolean) => {
  const [value, setValue] = useState(initialValue);

  const setFalse = useCallback(() => setValue(false), []);
  const setTrue = useCallback(() => setValue(true), []);
  const toggle = useCallback(() => setValue((prevValue) => !prevValue), []);

  return useMemo(
    () => ({
      value,
      setFalse,
      setTrue,
      toggle,
      setValue,
    }),
    [setFalse, setTrue, toggle, value],
  );
};
