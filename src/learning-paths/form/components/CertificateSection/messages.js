import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  certificateSectionTitle: {
    id: 'course-authoring.learning-paths.certificate.section.title',
    defaultMessage: 'Certificate Attachment',
    description: 'Title for the certificate attachment section',
  },
  certificateLabel: {
    id: 'course-authoring.learning-paths.certificate.label',
    defaultMessage: 'Program Certificate',
    description: 'Label for certificate selection dropdown',
  },
  certificateNone: {
    id: 'course-authoring.learning-paths.certificate.none',
    defaultMessage: 'None (No certificate will be awarded)',
    description: 'Option for no certificate',
  },
  certificateHelpText: {
    id: 'course-authoring.learning-paths.certificate.help',
    defaultMessage: 'Select a program certificate to automatically award when learners complete this learning path and meet grade requirements.',
    description: 'Help text for certificate selection',
  },
  certificateLoadingError: {
    id: 'course-authoring.learning-paths.certificate.loading.error',
    defaultMessage: 'Unable to load certificates. The Credentials service may be unavailable.',
    description: 'Error message when certificates fail to load',
  },
  certificateSelectedLabel: {
    id: 'course-authoring.learning-paths.certificate.selected.label',
    defaultMessage: 'Selected Certificate:',
    description: 'Label for selected certificate display',
  },
  certificateIdLabel: {
    id: 'course-authoring.learning-paths.certificate.id.label',
    defaultMessage: 'Certificate ID:',
    description: 'Label for certificate ID',
  },
  certificateCreateNote: {
    id: 'course-authoring.learning-paths.certificate.create.note',
    defaultMessage: 'Note: To create new certificates, visit the',
    description: 'Note about creating new certificates',
  },
  certificateCredentialsAdmin: {
    id: 'course-authoring.learning-paths.certificate.credentials.admin',
    defaultMessage: 'Credentials Admin',
    description: 'Link text for Credentials admin',
  },
  certificateLoadingText: {
    id: 'course-authoring.learning-paths.certificate.loading',
    defaultMessage: 'Loading certificates...',
    description: 'Loading text while fetching certificates',
  },
});

export default messages;
