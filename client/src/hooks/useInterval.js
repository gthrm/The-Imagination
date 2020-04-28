import { useRef, useEffect } from 'react';

const useInterval = (callback, delay, value, stopValue) => {
  const savedCallback = useRef();
  // console.log("Start =>>>>>>>>>",value);
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    // console.log("SECOND => ", value);
    function tick(timer) {
      // console.log(value, stopValue);
      if (value > stopValue) {
        savedCallback.current();
        --value;
      } else {
        clearInterval(timer);
      }
    }
    if (delay !== null) {
      const id = setInterval(() => tick(id), delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

export default useInterval;
