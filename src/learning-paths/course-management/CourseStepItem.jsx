import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Form, IconButton, Card, Icon } from '@openedx/paragon';
import { Delete as DeleteIcon, DragIndicator } from '@openedx/paragon/icons';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import messages from '../messages';

/**
 * Component displaying a single course step with order and weight inputs.
 */
const CourseStepItem = ({
  id,
  step,
  index,
  onRemove,
  onChange,
  onBlur,
  errors,
  touched,
}) => {
  const intl = useIntl();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    setActivatorNodeRef,
    isOver,
  } = useSortable({
    id,
    animateLayoutChanges: () => false,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    position: 'relative',
    zIndex: isDragging ? 1000 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card
        className="course-step-item mb-3"
        style={{
          border: '1px solid #dee2e6',
          borderRadius: '8px',
          boxShadow: isDragging
            ? '0 4px 12px rgba(0, 0, 0, 0.2)'
            : '0 1px 3px rgba(0, 0, 0, 0.08)',
          cursor: isDragging ? 'grabbing' : 'grab',
          opacity: isDragging ? 0.6 : 1,
          backgroundColor: 'white',
        }}
      >
      <Card.Section style={{ padding: '20px' }}>
        <div className="d-flex" style={{ gap: '16px', alignItems: 'center' }}>
          {/* Drag Handle */}
          <button
            ref={setActivatorNodeRef}
            type="button"
            style={{
              background: 'none',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              color: '#adb5bd',
              cursor: 'grab',
              padding: '4px',
            }}
            {...attributes}
            {...listeners}
          >
            <Icon src={DragIndicator} size="sm" />
          </button>

          {/* Course Info - Improved Layout */}
          <div className="flex-grow-1" style={{ minWidth: 0, paddingRight: '12px' }}>
            <div
              style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: '#1a1a1a',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                marginBottom: '4px',
                lineHeight: '1.4',
              }}
            >
              {step.displayName || step.courseKey}
            </div>
            {step.displayName && (
              <div
                style={{
                  fontSize: '0.75rem',
                  color: '#868e96',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  fontFamily: 'monospace',
                }}
              >
                {step.courseKey}
              </div>
            )}
          </div>

          {/* Weight Input */}
          <div style={{ width: '110px', alignSelf: 'center' }}>
            <Form.Label
              style={{
                fontSize: '0.7rem',
                fontWeight: '600',
                color: '#495057',
                marginBottom: '4px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                display: 'block',
              }}
            >
              {intl.formatMessage(messages.courseStepWeight)}
            </Form.Label>
            <Form.Control
              type="number"
              name={`steps.${index}.weight`}
              value={step.weight !== undefined ? step.weight : 1.0}
              onChange={onChange}
              onBlur={onBlur}
              min="0"
              max="1"
              step="0.1"
              size="sm"
              style={{
                borderRadius: '6px',
                fontSize: '0.875rem',
                border: '1px solid #ced4da',
                padding: '6px 10px',
              }}
            />
          </div>

          {/* Delete Button */}
          <IconButton
            src={DeleteIcon}
            iconAs={DeleteIcon}
            alt={intl.formatMessage(messages.courseStepRemove)}
            onClick={() => onRemove(index)}
            variant="link"
            className="text-danger"
            size="sm"
            style={{
              padding: '8px',
            }}
          />
        </div>
      </Card.Section>
    </Card>
    </div>
  );
};

CourseStepItem.propTypes = {
  id: PropTypes.string.isRequired,
  step: PropTypes.shape({
    courseKey: PropTypes.string.isRequired,
    displayName: PropTypes.string,
    order: PropTypes.number,
    weight: PropTypes.number,
  }).isRequired,
  index: PropTypes.number.isRequired,
  onRemove: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  errors: PropTypes.shape({
    order: PropTypes.string,
    weight: PropTypes.string,
  }),
  touched: PropTypes.shape({
    order: PropTypes.bool,
    weight: PropTypes.bool,
  }),
};

CourseStepItem.defaultProps = {
  errors: {},
  touched: {},
};

export default CourseStepItem;
