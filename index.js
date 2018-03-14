const PropTypes = require('proptypes').default;

module.exports.propTypesShape = PropTypes.shape({
  pending: PropTypes.bool.isRequired,
  error: PropTypes.bool.isRequired,
  ready: PropTypes.bool.isRequired,
  data: PropTypes.any
});

module.exports.initialState = { pending: false, error: false, ready: false, data: null };

module.exports.createPromiseAction = function(promise, actionType, { onSuccess, onError } = {}) {
  return (...args) => {
    return (dispatch) => {
      return dispatch({
        type: actionType,
        payload: promise(...args).then((data) => {
          if (onSuccess) dispatch(onSuccess(data, ...args));
          return data;
        }).catch((error) => {
          if (onError) dispatch(onError(error, ...args))
          throw error;
        })
      });
    };
  };
}

module.exports.createPromiseReducer = function(actionType) {
  const pendingActionType = `${actionType}_PENDING`;
  const fulfilledActionType = `${actionType}_FULFILLED`;
  const rejectedActionType = `${actionType}_REJECTED`;

  return (state = initialState, action) => {
    switch (action.type) {
      case pendingActionType:
        return {
          pending: true,
          error: false,
          ready: false,
          data: null
        };

      case fulfilledActionType:
        return {
          pending: false,
          error: false,
          ready: true,
          data: action.payload
        };

      case rejectedActionType:
        return {
          pending: false,
          ready: false,
          error: true,
          data: null
        };

      default:
        return state;
    }
  }
}
