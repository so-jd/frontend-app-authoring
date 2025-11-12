import React from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Hyperlink } from '@openedx/paragon';

import messages from '../messages';

/**
 * Sidebar component with help content and documentation links.
 */
const PathSidebar = () => {
  const intl = useIntl();

  return (
    <div className="learning-paths-sidebar">
      <h3 className="h5">
        {intl.formatMessage(messages.sidebarTitle)}
      </h3>
      <p className="small text-muted">
        {intl.formatMessage(messages.sidebarDescription)}
      </p>

      <div className="mt-4">
        <h4 className="h6">Documentation</h4>
        <ul className="list-unstyled small">
          <li className="mb-2">
            <Hyperlink
              destination="https://docs.openedx.org/"
              target="_blank"
              showLaunchIcon
            >
              Learning Paths Guide
            </Hyperlink>
          </li>
          <li className="mb-2">
            <Hyperlink
              destination="https://docs.openedx.org/"
              target="_blank"
              showLaunchIcon
            >
              Managing Enrollments
            </Hyperlink>
          </li>
          <li className="mb-2">
            <Hyperlink
              destination="https://docs.openedx.org/"
              target="_blank"
              showLaunchIcon
            >
              Grading & Completion
            </Hyperlink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PathSidebar;
