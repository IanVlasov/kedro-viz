import React, { useState } from 'react';
import classnames from 'classnames';
import { useUpdateRunDetails } from '../../../apollo/mutations';
import { toHumanReadableTime } from '../../../utils/date-utils';
import CloseIcon from '../../icons/close';
import IconButton from '../../ui/icon-button';
import KebabIcon from '../../icons/kebab';
import SelectedPin from '../../icons/selected-pin';
import UnSelectedPin from '../../icons/un-selected-pin';

import './run-metadata.css';

// Return a '-' character if the value is empty or null
const sanitiseEmptyValue = (value) => {
  return value === '' || value === null ? '-' : value;
};

const HiddenMenu = ({ children, isBookmarked, runId }) => {
  const [isVisible, setIsVisible] = useState(false);
  const { updateRunDetails } = useUpdateRunDetails();

  const toggleBookmark = () => {
    updateRunDetails({
      runId,
      runInput: { bookmark: !isBookmarked },
    });
  };

  return (
    <div
      className="hidden-menu-wrapper"
      onClick={() => setIsVisible(!isVisible)}
    >
      <div
        className={classnames('hidden-menu', {
          'hidden-menu--visible': isVisible,
        })}
      >
        <div className="hidden-menu__item" onClick={() => toggleBookmark()}>
          {isBookmarked ? 'Unbookmark' : 'Bookmark'}
        </div>
      </div>
      {children}
    </div>
  );
};

const RunMetadata = ({
  enableShowChanges = false,
  isSingleRun,
  onRunSelection,
  pinnedRun,
  runs = [],
  setPinnedRun,
  setRunMetadataToEdit,
  setShowRunDetailsModal,
}) => {
  let initialState = {};
  for (let i = 0; i < runs.length; i++) {
    initialState[i] = false;
  }

  const [toggleNotes, setToggleNotes] = useState(initialState);

  const onToggleNoteExpand = (index) => {
    setToggleNotes({ ...toggleNotes, [index]: !toggleNotes[index] });
  };

  const onTitleOrNoteClick = (id) => {
    const metadata = runs.find((run) => run.id === id);

    setRunMetadataToEdit(metadata);
    setShowRunDetailsModal(true);
  };

  return (
    <div
      className={classnames('details-metadata', {
        'details-metadata--single': isSingleRun,
      })}
    >
      {runs.map((run, i) => {
        const humanReadableTime = toHumanReadableTime(run.id);

        return (
          <div
            className={classnames('details-metadata__run', {
              'details-metadata__run--single': isSingleRun,
            })}
            key={run.id}
          >
            <table className="details-metadata__table">
              <tbody>
                {isSingleRun ? (
                  <tr>
                    <td className="details-metadata__title" colSpan="2">
                      <span
                        onClick={() => onTitleOrNoteClick(run.id)}
                        title={sanitiseEmptyValue(run.title)}
                      >
                        {sanitiseEmptyValue(run.title)}
                      </span>
                    </td>
                  </tr>
                ) : (
                  <tr>
                    {i === 0 ? <td></td> : null}
                    <td className="details-metadata__title">
                      <span
                        onClick={() => onTitleOrNoteClick(run.id)}
                        title={sanitiseEmptyValue(run.title)}
                      >
                        {sanitiseEmptyValue(run.title)}
                      </span>
                      <ul className="details-metadata__buttons">
                        <IconButton
                          ariaLive="polite"
                          className={classnames(
                            'pipeline-menu-button--labels',
                            'pipeline-menu-button__pin',
                            {
                              'details-metadata__buttons--selected-pin':
                                run.id === pinnedRun,
                            }
                          )}
                          onClick={() => setPinnedRun(run.id)}
                          icon={
                            run.id === pinnedRun ? SelectedPin : UnSelectedPin
                          }
                          visible={enableShowChanges}
                        />
                        <HiddenMenu isBookmarked={run.bookmark} runId={run.id}>
                          <IconButton
                            ariaLive="polite"
                            className="pipeline-menu-button--labels"
                            icon={KebabIcon}
                          />
                        </HiddenMenu>
                        <IconButton
                          ariaLive="polite"
                          className="pipeline-menu-button--labels"
                          onClick={() => onRunSelection(run.id)}
                          icon={CloseIcon}
                        />
                      </ul>
                    </td>
                  </tr>
                )}
                <tr>
                  {i === 0 ? <td>Created By</td> : null}
                  <td>{sanitiseEmptyValue(run.author)}</td>
                </tr>
                <tr>
                  {i === 0 ? <td>Creation Date</td> : null}
                  <td>{`${humanReadableTime} (${sanitiseEmptyValue(
                    run.id
                  )})`}</td>
                </tr>
                <tr>
                  {i === 0 ? <td>Git SHA</td> : null}
                  <td>{sanitiseEmptyValue(run.gitSha)}</td>
                </tr>
                <tr>
                  {i === 0 ? <td>Git Branch</td> : null}
                  <td>{sanitiseEmptyValue(run.gitBranch)}</td>
                </tr>
                <tr>
                  {i === 0 ? <td>Run Command</td> : null}
                  <td>{sanitiseEmptyValue(run.runCommand)}</td>
                </tr>
                <tr>
                  {i === 0 ? <td>Notes</td> : null}
                  <td>
                    <p
                      className="details-metadata__notes"
                      onClick={() => onTitleOrNoteClick(run.id)}
                      style={toggleNotes[i] ? { display: 'block' } : null}
                    >
                      {run.notes !== '' ? run.notes : '- Add notes here'}
                    </p>
                    {run.notes.length > 100 ? (
                      <button
                        className="details-metadata__show-more kedro"
                        onClick={() => onToggleNoteExpand(i)}
                      >
                        {toggleNotes[i] ? 'Show less' : 'Show more'}
                      </button>
                    ) : null}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
};

export default RunMetadata;
