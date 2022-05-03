import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import watch from 'redux-watch';
import reducer from '../reducers';
import { getGraphInput } from '../selectors/layout';
import { calculateGraph } from '../actions/graph';
import { saveState, pruneFalseyKeys } from './helpers';

/**
 * Watch the getGraphInput selector, and dispatch an asynchronous action to
 * update state.graph via a web worker when it changes.
 * @param {object} store Redux store
 */
const updateGraphOnChange = (store) => {
  // we need to dispatch the calculateGraph action to ensure the graph nodes still gets rendered
  // on initial load if using static data
  store.dispatch(calculateGraph(getGraphInput(store.getState())));
  const watchGraph = watch(() => getGraphInput(store.getState()));
  store.subscribe(
    watchGraph((graphInput) => {
      console.log('graphInput', graphInput);
      store.dispatch(calculateGraph(graphInput));
    })
  );
};

/**
 * Save selected state properties to window.localStorage
 * @param {object} state Redux state snapshot
 */
const saveStateToLocalStorage = (state) => {
  // does not save modal state to localStorage
  const {
    exportModal,
    plotModal,
    settingsModal,
    modularPipelineFocusMode,
    ...otherVisibleProps
  } = state.visible;
  saveState({
    node: {
      disabled: pruneFalseyKeys(state.node.disabled),
    },
    nodeType: {
      disabled: state.nodeType.disabled,
    },
    pipeline: {
      active: state.pipeline.active,
    },
    layer: {
      visible: state.layer.visible,
    },
    tag: {
      enabled: state.tag.enabled,
    },
    textLabels: state.textLabels,
    visible: otherVisibleProps,
    theme: state.theme,
    prettyName: state.prettyName,
    flags: state.flags,
  });
};

/**
 * Configure initial state and create the Redux store
 * @param {Object} initialState Initial Redux state (from initial-state.js)
 * @return {Object} Redux store
 */
export default function configureStore(initialState) {
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const store = createStore(
    reducer,
    initialState,
    composeEnhancers(applyMiddleware(thunk))
  );
  updateGraphOnChange(store);
  store.subscribe(() => {
    saveStateToLocalStorage(store.getState());
  });

  return store;
}
