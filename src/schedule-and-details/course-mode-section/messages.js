import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  courseModeTitle: {
    id: 'course-authoring.schedule-section.course-mode.title',
    defaultMessage: 'Course Enrollment Modes',
  },
  courseModeDescription: {
    id: 'course-authoring.schedule-section.course-mode.description',
    defaultMessage: 'Configure the enrollment tracks available for this course. Each mode represents a different enrollment option with its own pricing and certificate settings.',
  },
  manageModes: {
    id: 'course-authoring.schedule-section.course-mode.manage',
    defaultMessage: 'Manage Enrollment Modes',
  },
  modesExplanation: {
    id: 'course-authoring.schedule-section.course-mode.explanation',
    defaultMessage: 'Click the buttons below to view existing enrollment modes or add a new mode for this course. Changes are managed in the admin interface.',
  },
  viewModesButton: {
    id: 'course-authoring.schedule-section.course-mode.view-button',
    defaultMessage: 'View Course Modes',
  },
  addModeButton: {
    id: 'course-authoring.schedule-section.course-mode.add-button',
    defaultMessage: 'Add New Mode',
  },
  availableModesTitle: {
    id: 'course-authoring.schedule-section.course-mode.available-title',
    defaultMessage: 'Available Enrollment Modes',
  },
  auditDescription: {
    id: 'course-authoring.schedule-section.course-mode.audit-desc',
    defaultMessage: 'Free enrollment with access to course materials but no certificate',
  },
  honorDescription: {
    id: 'course-authoring.schedule-section.course-mode.honor-desc',
    defaultMessage: 'Free enrollment with honor certificate upon completion',
  },
  verifiedDescription: {
    id: 'course-authoring.schedule-section.course-mode.verified-desc',
    defaultMessage: 'Paid enrollment with verified certificate and ID verification',
  },
  professionalDescription: {
    id: 'course-authoring.schedule-section.course-mode.professional-desc',
    defaultMessage: 'Professional education course with verified identity',
  },
  noIdProfessionalDescription: {
    id: 'course-authoring.schedule-section.course-mode.no-id-professional-desc',
    defaultMessage: 'Professional education course without ID verification requirement',
  },
});

export default messages;
