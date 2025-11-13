import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  Card,
  Badge,
  Button,
  Stack,
  Dropdown,
  IconButton,
  Icon,
} from '@openedx/paragon';
import {
  MoreVert as MoreVertIcon,
  Schedule,
  AccessTime,
  Lock,
  LockOpen,
  Edit,
  Delete,
  ContentCopy,
} from '@openedx/paragon/icons';

import messages from '../../messages';
import './PathCard.scss';

/**
 * Card component displaying a learning path with its metadata and actions.
 */
const PathCard = ({ path, onEdit, onDelete, onDuplicate }) => {
  const intl = useIntl();

  const courseCount = path.steps?.length || 0;
  const levelBadgeVariant = {
    beginner: 'success',
    intermediate: 'warning',
    advanced: 'danger',
  }[path.level] || 'secondary';

  return (
    <Card
      className="learning-paths-card h-100"
      style={{
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    >
      {/* Image Section */}
      {path.image ? (
        <div style={{
          position: 'relative',
          height: '200px',
          width: '100%',
          overflow: 'hidden',
          backgroundColor: '#dee2e6',
        }}>
          <img
            src={path.image}
            alt={path.displayName}
            style={{
              height: '100%',
              width: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              display: 'block',
            }}
          />
          {/* Actions Menu Overlay */}
          <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
            <Dropdown>
              <Dropdown.Toggle
                as={IconButton}
                src={MoreVertIcon}
                iconAs={MoreVertIcon}
                variant="primary"
                alt="Actions"
                size="sm"
                className="path-card-menu-button"
                style={{
                  backgroundColor: '#e9ecef',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  padding: '4px',
                  border: 'none',
                  color: '#0a4a82',
                }}
              />
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => onEdit(path)}>
                  <Icon src={Edit} size="sm" className="mr-2" />
                  {intl.formatMessage(messages.cardEditButton)}
                </Dropdown.Item>
                <Dropdown.Item onClick={() => onDuplicate(path)}>
                  <Icon src={ContentCopy} size="sm" className="mr-2" />
                  {intl.formatMessage(messages.cardDuplicateButton)}
                </Dropdown.Item>
                <Dropdown.Item onClick={() => onDelete(path)} className="text-danger">
                  <Icon src={Delete} size="sm" className="mr-2" />
                  {intl.formatMessage(messages.cardDeleteButton)}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      ) : (
        <div
          style={{
            height: '200px',
            background: '#dee2e6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          {/* Actions Menu Overlay */}
          <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
            <Dropdown>
              <Dropdown.Toggle
                as={IconButton}
                src={MoreVertIcon}
                iconAs={MoreVertIcon}
                variant="primary"
                alt="Actions"
                size="sm"
                className="path-card-menu-button"
                style={{
                  backgroundColor: '#e9ecef',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  padding: '4px',
                  border: 'none',
                  color: '#0a4a82',
                }}
              />
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => onEdit(path)}>
                  <Icon src={Edit} size="sm" className="mr-2" />
                  {intl.formatMessage(messages.cardEditButton)}
                </Dropdown.Item>
                <Dropdown.Item onClick={() => onDuplicate(path)}>
                  <Icon src={ContentCopy} size="sm" className="mr-2" />
                  {intl.formatMessage(messages.cardDuplicateButton)}
                </Dropdown.Item>
                <Dropdown.Item onClick={() => onDelete(path)} className="text-danger">
                  <Icon src={Delete} size="sm" className="mr-2" />
                  {intl.formatMessage(messages.cardDeleteButton)}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      )}

      {/* Content Section */}
      <div style={{ padding: '20px' }}>
        {/* Title and Subtitle */}
        <div className="mb-3">
          <h3
            className="mb-1"
            style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#1a1a1a',
              lineHeight: '1.4',
            }}
          >
            {path.displayName}
          </h3>
          {path.subtitle && (
            <p
              className="text-muted mb-0"
              style={{
                fontSize: '0.875rem',
                lineHeight: '1.5',
              }}
            >
              {path.subtitle}
            </p>
          )}
        </div>

        {/* Description */}
        {path.description && (
          <p
            className="text-muted mb-3"
            style={{
              fontSize: '0.875rem',
              lineHeight: '1.6',
              minHeight: '60px',
            }}
          >
            {path.description.length > 100
              ? `${path.description.substring(0, 100)}...`
              : path.description}
          </p>
        )}

        {/* Badges */}
        <div className="mb-3 d-flex flex-wrap gap-2" style={{ gap: '8px' }}>
          {path.level && (
            <Badge
              variant={levelBadgeVariant}
              style={{
                fontSize: '0.75rem',
                fontWeight: '500',
                padding: '4px 10px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              {intl.formatMessage(messages[`formLevel${path.level.charAt(0).toUpperCase()}${path.level.slice(1)}`])}
            </Badge>
          )}
          {path.inviteOnly ? (
            <Badge
              variant="warning"
              style={{
                fontSize: '0.75rem',
                fontWeight: '500',
                padding: '4px 10px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Icon src={Lock} size="xs" />
              <span>Invite Only</span>
            </Badge>
          ) : (
            <Badge
              variant="success"
              style={{
                fontSize: '0.75rem',
                fontWeight: '500',
                padding: '4px 10px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Icon src={LockOpen} size="xs" />
              <span>Open</span>
            </Badge>
          )}
          {path.sequential && (
            <Badge
              variant="info"
              style={{
                fontSize: '0.75rem',
                fontWeight: '500',
                padding: '4px 10px',
              }}
            >
              Sequential
            </Badge>
          )}
        </div>

        <hr style={{ margin: '16px 0', borderTop: '1px solid #e0e0e0' }} />

        {/* Metadata Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: '0.875rem',
              color: '#4a4a4a',
            }}
          >
            <span style={{ fontWeight: '500' }}>
              {intl.formatMessage(messages.cardCoursesLabel, { count: courseCount })}
            </span>
          </div>

          {path.duration && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: '0.875rem',
                color: '#4a4a4a',
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  backgroundColor: '#f0f0f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '12px',
                }}
              >
                <Icon src={Schedule} size="sm" style={{ color: '#667eea' }} />
              </div>
              <span>{path.duration}</span>
            </div>
          )}

          {path.timeCommitment && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: '0.875rem',
                color: '#4a4a4a',
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  backgroundColor: '#f0f0f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '12px',
                }}
              >
                <Icon src={AccessTime} size="sm" style={{ color: '#667eea' }} />
              </div>
              <span>{path.timeCommitment}</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          padding: '16px 20px',
          backgroundColor: '#f8f9fa',
          borderTop: '1px solid #e0e0e0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 'auto',
        }}
      >
        <div
          style={{
            fontSize: '0.7rem',
            fontFamily: 'monospace',
            color: '#6c757d',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            flex: 1,
            marginRight: '12px',
          }}
        >
          {path.key}
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => onEdit(path)}
          style={{
            fontWeight: '500',
            padding: '6px 16px',
          }}
        >
          {intl.formatMessage(messages.cardEditButton)}
        </Button>
      </div>
    </Card>
  );
};

PathCard.propTypes = {
  path: PropTypes.shape({
    key: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    description: PropTypes.string,
    image: PropTypes.string,
    level: PropTypes.oneOf(['beginner', 'intermediate', 'advanced']),
    duration: PropTypes.string,
    timeCommitment: PropTypes.string,
    sequential: PropTypes.bool,
    inviteOnly: PropTypes.bool,
    steps: PropTypes.arrayOf(PropTypes.shape({
      courseKey: PropTypes.string,
      order: PropTypes.number,
      weight: PropTypes.number,
    })),
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onDuplicate: PropTypes.func.isRequired,
};

export default PathCard;
