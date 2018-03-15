const PropTypes = require('proptypes').default;

const propTypesShape = module.exports.propTypesShape = PropTypes.shape({
  pending: PropTypes.bool.isRequired,
  error: PropTypes.bool.isRequired,
  ready: PropTypes.bool.isRequired,
  data: PropTypes.any
});

const initialState = module.exports.initialState = {
  pending: false,
  error: false,
  ready: false,
  data: null
};

const createPromiseAction = module.exports.createPromiseAction = function(promise, actionType, options) {
  return function() {
    const args = arguments;
    return function(dispatch) {
      return dispatch({
        type: actionType,
        payload: promise.apply(this, args).then(function(data) {
          if (options && options.onSuccess) dispatch(onSuccess.apply(this, [data].concat(args)));
          return data;
        }).catch(function(error) {
          if (options && options.onError) {
            dispatch(onError.apply(this, [error].concat(args)));
          }
          throw error;
        })
      });
    };
  };
}

const createPromiseReducer = module.exports.createPromiseReducer = function(actionType) {
  const pendingActionType = actionType + '_PENDING';
  const fulfilledActionType = actionType + '_FULFILLED';
  const rejectedActionType = actionType + '_REJECTED';

  return function(state, action) {
    if (!state) state = initialState;

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
