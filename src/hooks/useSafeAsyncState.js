import {
  useCallback, useState,
} from 'react';
import useIsMounted from './useIsMounted';

export default function useSafeAsyncState(initialSate) {
  const [state, setState] = useState(initialSate);

  const isMounted = useIsMounted();

  const setSafeAsyncState = useCallback((data) => {
    if (isMounted()) {
      setState(data);
    }
  }, [isMounted]);

  return [state, setSafeAsyncState];
}
