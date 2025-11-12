import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Form } from '@openedx/paragon';
import { useFormikContext } from 'formik';

import messages from '../../../messages';

/**
 * Form section for grading criteria (required completion % and required grade %).
 */
const GradingCriteriaSection = () => {
  const intl = useIntl();
  const { values, handleChange, handleBlur, errors, touched } = useFormikContext();

  return (
    <div className="grading-criteria-section mb-4">
      <h3 className="h5 mb-3">
        {intl.formatMessage(messages.gradingTitle)}
      </h3>

      <Form.Group className="mb-3">
        <Form.Label>
          {intl.formatMessage(messages.gradingRequiredCompletion)}
        </Form.Label>
        <Form.Control
          type="number"
          name="requiredCompletion"
          value={values.requiredCompletion || 80}
          onChange={handleChange}
          onBlur={handleBlur}
          min="0"
          max="100"
          step="1"
        />
        <Form.Text>
          {intl.formatMessage(messages.gradingHelpTextCompletion)}
        </Form.Text>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>
          {intl.formatMessage(messages.gradingRequiredGrade)}
        </Form.Label>
        <Form.Control
          type="number"
          name="requiredGrade"
          value={values.requiredGrade || 75}
          onChange={handleChange}
          onBlur={handleBlur}
          min="0"
          max="100"
          step="1"
        />
        <Form.Text>
          {intl.formatMessage(messages.gradingHelpTextGrade)}
        </Form.Text>
      </Form.Group>
    </div>
  );
};

GradingCriteriaSection.propTypes = {};

export default GradingCriteriaSection;
