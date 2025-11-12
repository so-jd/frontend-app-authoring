import React from 'react';
import { Nav, Container } from '@openedx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';
import { useNavigate, useLocation } from 'react-router-dom';
import { getConfig } from '@edx/frontend-platform';
import messages from './messages';
import './PageNavigation.scss';

/**
 * Page navigation component for switching between main sections.
 * Shows navigation tabs for Courses and Learning Paths (if enabled).
 */
const PageNavigation = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const location = useLocation();

  const isLearningPathsEnabled = getConfig().ENABLE_LEARNING_PATHS === 'true';

  // Don't show navigation if learning paths are not enabled
  if (!isLearningPathsEnabled) {
    return null;
  }

  const isCoursesActive = location.pathname === '/home'
    || location.pathname === '/libraries'
    || location.pathname === '/libraries-v1'
    || location.pathname === '/taxonomies';
  const isLearningPathsActive = location.pathname.startsWith('/learning-paths');

  return (
    <div className="page-navigation-wrapper">
      <Container size="xl" className="px-2.5">
        <Nav variant="tabs" className="page-navigation-tabs">
          <Nav.Item>
            <Nav.Link
              active={isCoursesActive}
              onClick={() => navigate('/home')}
            >
              {intl.formatMessage(messages['header.navigation.courses'])}
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              active={isLearningPathsActive}
              onClick={() => navigate('/learning-paths')}
            >
              {intl.formatMessage(messages['header.navigation.learningPaths'])}
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </Container>
    </div>
  );
};

export default PageNavigation;
