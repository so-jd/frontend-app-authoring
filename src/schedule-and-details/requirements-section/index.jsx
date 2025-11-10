import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  Form, Dropdown, SearchField, Button, Icon,
} from '@openedx/paragon';
import { Close } from '@openedx/paragon/icons';

import { TIME_FORMAT } from '../../constants';
import SectionSubHeader from '../../generic/section-sub-header';
import EntranceExam from './entrance-exam';
import messages from './messages';

const RequirementsSection = ({
  effort,
  errorFields,
  aboutPageEditable,
  preRequisiteCourses,
  entranceExamEnabled,
  isEntranceExamsEnabled,
  possiblePreRequisiteCourses,
  entranceExamMinimumScorePct,
  isPrerequisiteCoursesEnabled,
  onChange,
}) => {
  const intl = useIntl();
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddCourse = (courseKey) => {
    if (!preRequisiteCourses.includes(courseKey)) {
      onChange([...preRequisiteCourses, courseKey], 'preRequisiteCourses');
    }
  };

  const handleRemoveCourse = (courseKey) => {
    const updatedCourses = preRequisiteCourses.filter((key) => key !== courseKey);
    onChange(updatedCourses, 'preRequisiteCourses');
  };

  const getCourseName = (courseKey) => {
    const course = possiblePreRequisiteCourses.find((c) => c.courseKey === courseKey);
    return course?.displayName || courseKey;
  };

  // Filter courses based on search query and exclude already selected ones
  const availableCourses = useMemo(() => possiblePreRequisiteCourses.filter(
    (course) => !preRequisiteCourses.includes(course.courseKey)
        && course.displayName.toLowerCase().includes(searchQuery.toLowerCase()),
  ), [possiblePreRequisiteCourses, preRequisiteCourses, searchQuery]);

  const renderPrerequisiteSelector = () => (
    <Form.Group className="form-group-custom prerequisite-courses">
      <Form.Label>{intl.formatMessage(messages.dropdownLabel)}</Form.Label>

      {/* Selected courses display */}
      {preRequisiteCourses.length > 0 ? (
        <div className="mb-3 selected-courses">
          {preRequisiteCourses.map((courseKey) => (
            <div key={courseKey} className="prerequisite-chip">
              <span className="chip-label">{getCourseName(courseKey)}</span>
              <Button
                variant="link"
                className="chip-close-btn"
                onClick={() => handleRemoveCourse(courseKey)}
                aria-label={`Remove ${getCourseName(courseKey)}`}
              >
                <Icon src={Close} />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted small mb-3">
          {intl.formatMessage(messages.noCoursesSelected)}
        </p>
      )}

      {/* Searchable dropdown for adding courses */}
      <Dropdown className="bg-white prerequisite-dropdown">
        <Dropdown.Toggle
          id="prerequisite-dropdown-toggle"
          variant="outline-primary"
          disabled={availableCourses.length === 0 && !searchQuery}
        >
          {intl.formatMessage(messages.addPrerequisiteButton)}
        </Dropdown.Toggle>
        <Dropdown.Menu className="prerequisite-dropdown-menu">
          <div className="px-3 py-2">
            <SearchField
              onClear={() => setSearchQuery('')}
              onChange={(value) => setSearchQuery(value)}
              value={searchQuery}
              placeholder={intl.formatMessage(messages.searchPlaceholder)}
            />
          </div>
          <div className="dropdown-divider" />
          <div className="prerequisite-course-list">
            {availableCourses.length > 0 ? (
              availableCourses.map((course) => (
                <Dropdown.Item
                  key={course.courseKey}
                  onClick={() => {
                    handleAddCourse(course.courseKey);
                    setSearchQuery('');
                  }}
                >
                  {course.displayName}
                </Dropdown.Item>
              ))
            ) : (
              <div className="px-3 py-2 text-muted">
                {searchQuery
                  ? intl.formatMessage(messages.noResultsFound)
                  : intl.formatMessage(messages.allCoursesSelected)}
              </div>
            )}
          </div>
        </Dropdown.Menu>
      </Dropdown>

      <Form.Control.Feedback>
        {intl.formatMessage(messages.dropdownHelpText)}
      </Form.Control.Feedback>
    </Form.Group>
  );

  return (
    <section className="section-container requirements-section">
      <SectionSubHeader
        title={intl.formatMessage(messages.requirementsTitle)}
        description={intl.formatMessage(messages.requirementsDescription)}
      />
      {aboutPageEditable && (
        <Form.Group className="form-group-custom">
          <Form.Label>
            {intl.formatMessage(messages.timepickerLabel)}
          </Form.Label>
          <Form.Control
            value={effort || ''}
            placeholder={TIME_FORMAT.toUpperCase()}
            onChange={(e) => onChange(e.target.value, 'effort')}
          />
          <Form.Control.Feedback>
            {intl.formatMessage(messages.timepickerHelpText)}
          </Form.Control.Feedback>
        </Form.Group>
      )}
      {isPrerequisiteCoursesEnabled && renderPrerequisiteSelector()}
      {isEntranceExamsEnabled && (
        <EntranceExam
          errorEffort={errorFields?.entranceExamMinimumScorePct}
          isCheckedString={entranceExamEnabled}
          entranceExamMinimumScorePct={entranceExamMinimumScorePct}
          onChange={onChange}
        />
      )}
    </section>
  );
};

const preRequisitesCourse = {
  courseKey: PropTypes.string,
  displayName: PropTypes.string,
  lmsLink: PropTypes.string,
  number: PropTypes.string,
  org: PropTypes.string,
  rerunLink: PropTypes.string,
  run: PropTypes.string,
  url: PropTypes.string,
};

RequirementsSection.defaultProps = {
  effort: '',
  errorFields: {},
  entranceExamEnabled: '',
  preRequisiteCourses: [],
  entranceExamMinimumScorePct: '',
};

RequirementsSection.propTypes = {
  effort: PropTypes.string,
  errorFields: PropTypes.objectOf(PropTypes.string),
  aboutPageEditable: PropTypes.bool.isRequired,
  preRequisiteCourses: PropTypes.arrayOf(PropTypes.string),
  entranceExamEnabled: PropTypes.string,
  isEntranceExamsEnabled: PropTypes.bool.isRequired,
  possiblePreRequisiteCourses: PropTypes.arrayOf(
    PropTypes.shape(preRequisitesCourse),
  ).isRequired,
  entranceExamMinimumScorePct: PropTypes.string,
  isPrerequisiteCoursesEnabled: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default RequirementsSection;
