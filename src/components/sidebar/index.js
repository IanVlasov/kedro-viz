import React, { useState } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import MiniMap from '../minimap';
import MiniMapToolbar from '../minimap-toolbar';
import NodeList from '../node-list';
import PipelineList from '../pipeline-list';
import PrimaryToolbar from '../primary-toolbar';
import Switch from '../switch';

import RunsList from '../experiment-tracking/runs-list';

import './sidebar.css';

/**
 * Main app container. Handles showing/hiding the sidebar nav, and theme classes.
 * @param {boolean} props.visible Whether the sidebar is open/closed
 */
export const Sidebar = ({
  disableRunSelection,
  enableComparisonView,
  isExperimentView = false,
  onRunSelection,
  onToggleComparisonView,
  runsListData,
  selectedRuns,
  visible,
}) => {
  const [pipelineIsOpen, togglePipeline] = useState(false);

  if (isExperimentView) {
    return (
      <>
        <div
          className={classnames('pipeline-sidebar', {
            'pipeline-sidebar--visible': visible,
          })}
        >
          <div className="pipeline-ui">
            <div className="compare-switch-wrapper">
              <span className="compare-switch-wrapper__text">
                Compare runs (max. 3)
              </span>
              <Switch onChange={onToggleComparisonView} />
            </div>
            <RunsList
              disableRunSelection={disableRunSelection}
              enableComparisonView={enableComparisonView}
              onRunSelection={onRunSelection}
              runData={runsListData}
              selectedRuns={selectedRuns}
            />
          </div>
          <nav className="pipeline-toolbar">
            <PrimaryToolbar isExperimentView />
          </nav>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div
          className={classnames('pipeline-sidebar', {
            'pipeline-sidebar--visible': visible,
          })}
        >
          <div className="pipeline-ui">
            <PipelineList onToggleOpen={togglePipeline} />
            <NodeList faded={pipelineIsOpen} />
          </div>
          <nav className="pipeline-toolbar">
            <PrimaryToolbar />
            <MiniMapToolbar />
          </nav>
          <MiniMap />
        </div>
      </>
    );
  }
};

const mapStateToProps = (state) => ({
  visible: state.visible.sidebar,
});

export default connect(mapStateToProps)(Sidebar);
