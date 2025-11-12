import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Button, Form, IconButton } from '@openedx/paragon';
import { Add as AddIcon, Delete as DeleteIcon } from '@openedx/paragon/icons';
import { useFormikContext, FieldArray } from 'formik';

import messages from '../messages';

/**
 * Form section for managing required and acquired skills.
 */
const SkillsSection = ({ fieldName, title }) => {
  const intl = useIntl();
  const { values, handleChange, handleBlur, errors, touched } = useFormikContext();

  const skills = Array.isArray(values[fieldName]) ? values[fieldName] : [];
  const fieldErrors = errors[fieldName];
  const fieldTouched = touched[fieldName];

  return (
    <div className="skills-section mb-4">
      <h3 className="h5 mb-3">{title}</h3>

      <FieldArray name={fieldName}>
        {(arrayHelpers) => (
          <>
            {skills.map((skill, index) => (
              <div key={index} className="d-flex gap-2 mb-2 align-items-start">
                <Form.Group className="flex-grow-1">
                  <Form.Control
                    type="text"
                    name={`${fieldName}.${index}.displayName`}
                    placeholder={intl.formatMessage(messages.skillsSearchPlaceholder)}
                    value={skill.displayName || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Form.Group>

                <Form.Group style={{ width: '100px' }}>
                  <Form.Control
                    type="number"
                    name={`${fieldName}.${index}.level`}
                    placeholder={intl.formatMessage(messages.skillsLevel)}
                    value={skill.level || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    min="1"
                    max="10"
                  />
                </Form.Group>

                <IconButton
                  src={DeleteIcon}
                  iconAs={DeleteIcon}
                  alt={intl.formatMessage(messages.skillsRemove)}
                  onClick={() => arrayHelpers.remove(index)}
                  variant="link"
                  className="text-danger"
                />
              </div>
            ))}

            <Button
              variant="link"
              iconBefore={AddIcon}
              onClick={() => arrayHelpers.push({ displayName: '', level: '' })}
              className="mt-2"
            >
              {intl.formatMessage(messages.skillsAddButton)}
            </Button>
          </>
        )}
      </FieldArray>
    </div>
  );
};

SkillsSection.propTypes = {
  fieldName: PropTypes.oneOf(['requiredSkills', 'acquiredSkills']).isRequired,
  title: PropTypes.string.isRequired,
};

export default SkillsSection;
