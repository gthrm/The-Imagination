import { bindActionCreators } from 'redux';
import { useDispatch } from 'react-redux';
import { useMemo } from 'react';

const useActions = (actions) => {
  const dispatch = useDispatch();
  return useMemo(() => {
    if (Array.isArray(actions)) {
      return actions.map((action) => bindActionCreators(action, dispatch));
    }
    return bindActionCreators(actions, dispatch);
  }, [actions, dispatch]);
};

export default useActions;
