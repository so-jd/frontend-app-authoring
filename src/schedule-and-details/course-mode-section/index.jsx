import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import { getConfig } from '@edx/frontend-platform';
import {
  Card, Button,
} from '@openedx/paragon';
import { OpenInNew } from '@openedx/paragon/icons';

import SectionSubHeader from '../../generic/section-sub-header';
import messages from './messages';

const CourseModeSection = ({ courseId }) => {
  const intl = useIntl();

  // Generate the Django admin URL for course modes
  const courseModesAdminUrl = `${getConfig().STUDIO_BASE_URL}/admin/course_modes/coursemode/?course__id=${encodeURIComponent(courseId)}`;
  const addCourseModeUrl = `${getConfig().STUDIO_BASE_URL}/admin/course_modes/coursemode/add/?course=${encodeURIComponent(courseId)}`;

  return (
    <section className="section-container course-mode-section">
      <SectionSubHeader
        title={intl.formatMessage(messages.courseModeTitle)}
        description={intl.formatMessage(messages.courseModeDescription)}
      />

      <Card className="p-4">
        <div className="mb-3">
          <h5>{intl.formatMessage(messages.manageModes)}</h5>
          <p className="text-muted">
            {intl.formatMessage(messages.modesExplanation)}
          </p>
        </div>

        <div className="d-flex gap-2">
          <Button
            variant="primary"
            iconAfter={OpenInNew}
            href={courseModesAdminUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {intl.formatMessage(messages.viewModesButton)}
          </Button>
          <Button
            variant="outline-primary"
            iconAfter={OpenInNew}
            href={addCourseModeUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {intl.formatMessage(messages.addModeButton)}
          </Button>
        </div>

        <div className="mt-4 p-3 bg-light rounded">
          <h6>{intl.formatMessage(messages.availableModesTitle)}</h6>
          <ul className="mb-0">
            <li><strong>Audit:</strong> {intl.formatMessage(messages.auditDescription)}</li>
            <li><strong>Honor:</strong> {intl.formatMessage(messages.honorDescription)}</li>
            <li><strong>Verified:</strong> {intl.formatMessage(messages.verifiedDescription)}</li>
            <li><strong>Professional:</strong> {intl.formatMessage(messages.professionalDescription)}</li>
            <li><strong>No-ID Professional:</strong> {intl.formatMessage(messages.noIdProfessionalDescription)}</li>
          </ul>
        </div>
      </Card>
    </section>
  );
};

CourseModeSection.propTypes = {
  courseId: PropTypes.string.isRequired,
};

export default CourseModeSection;
