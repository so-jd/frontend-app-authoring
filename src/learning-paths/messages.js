import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  headingTitle: {
    id: 'course-authoring.learning-paths.heading.title',
    defaultMessage: 'Learning Paths',
  },
  headingSubtitle: {
    id: 'course-authoring.learning-paths.heading.subtitle',
    defaultMessage: 'Create and manage learning paths',
  },
  createButton: {
    id: 'course-authoring.learning-paths.button.create',
    defaultMessage: 'New Learning Path',
  },
  emptyTitle: {
    id: 'course-authoring.learning-paths.empty.title',
    defaultMessage: 'No learning paths yet',
  },
  emptyDescription: {
    id: 'course-authoring.learning-paths.empty.description',
    defaultMessage: 'Create your first learning path to group courses together for learners.',
  },
  sidebarTitle: {
    id: 'course-authoring.learning-paths.sidebar.title',
    defaultMessage: 'About Learning Paths',
  },
  sidebarDescription: {
    id: 'course-authoring.learning-paths.sidebar.description',
    defaultMessage: 'Learning paths allow you to group related courses together to guide learners through a structured learning journey. You can set prerequisites, define completion criteria, and track learner progress across multiple courses.',
  },
  cardEditButton: {
    id: 'course-authoring.learning-paths.card.button.edit',
    defaultMessage: 'Edit',
  },
  cardDeleteButton: {
    id: 'course-authoring.learning-paths.card.button.delete',
    defaultMessage: 'Delete',
  },
  cardDuplicateButton: {
    id: 'course-authoring.learning-paths.card.button.duplicate',
    defaultMessage: 'Duplicate',
  },
  cardCoursesLabel: {
    id: 'course-authoring.learning-paths.card.label.courses',
    defaultMessage: '{count, plural, one {# course} other {# courses}}',
  },
  formTitle: {
    id: 'course-authoring.learning-paths.form.title',
    defaultMessage: 'Learning Path Details',
  },
  formTitleCreate: {
    id: 'course-authoring.learning-paths.form.title.create',
    defaultMessage: 'Create Learning Path',
  },
  formTitleEdit: {
    id: 'course-authoring.learning-paths.form.title.edit',
    defaultMessage: 'Edit Learning Path',
  },
  formLabelKey: {
    id: 'course-authoring.learning-paths.form.label.key',
    defaultMessage: 'Learning Path Key',
  },
  formLabelOrganization: {
    id: 'course-authoring.learning-paths.form.label.organization',
    defaultMessage: 'Organization',
  },
  formLabelPathNumber: {
    id: 'course-authoring.learning-paths.form.label.pathNumber',
    defaultMessage: 'Path Number/ID',
  },
  formLabelPathRun: {
    id: 'course-authoring.learning-paths.form.label.pathRun',
    defaultMessage: 'Run',
  },
  formLabelPathGroup: {
    id: 'course-authoring.learning-paths.form.label.pathGroup',
    defaultMessage: 'Group',
  },
  formLabelDisplayName: {
    id: 'course-authoring.learning-paths.form.label.displayName',
    defaultMessage: 'Display Name',
  },
  formLabelSubtitle: {
    id: 'course-authoring.learning-paths.form.label.subtitle',
    defaultMessage: 'Subtitle',
  },
  formLabelDescription: {
    id: 'course-authoring.learning-paths.form.label.description',
    defaultMessage: 'Description',
  },
  formLabelImage: {
    id: 'course-authoring.learning-paths.form.label.image',
    defaultMessage: 'Image',
  },
  formLabelLevel: {
    id: 'course-authoring.learning-paths.form.label.level',
    defaultMessage: 'Level',
  },
  formLabelDuration: {
    id: 'course-authoring.learning-paths.form.label.duration',
    defaultMessage: 'Duration',
  },
  formLabelTimeCommitment: {
    id: 'course-authoring.learning-paths.form.label.timeCommitment',
    defaultMessage: 'Time Commitment',
  },
  formLabelSequential: {
    id: 'course-authoring.learning-paths.form.label.sequential',
    defaultMessage: 'Sequential',
  },
  formLabelInviteOnly: {
    id: 'course-authoring.learning-paths.form.label.inviteOnly',
    defaultMessage: 'Invite Only',
  },
  formHelpTextKey: {
    id: 'course-authoring.learning-paths.form.help.key',
    defaultMessage: 'Unique identifier (format: path-v1:ORG+NUM+RUN+GRP)',
  },
  formHelpTextSequential: {
    id: 'course-authoring.learning-paths.form.help.sequential',
    defaultMessage: 'Require courses to be completed in order',
  },
  formHelpTextInviteOnly: {
    id: 'course-authoring.learning-paths.form.help.inviteOnly',
    defaultMessage: 'Only enrolled users can see this learning path',
  },
  formLevelBeginner: {
    id: 'course-authoring.learning-paths.form.level.beginner',
    defaultMessage: 'Beginner',
  },
  formLevelIntermediate: {
    id: 'course-authoring.learning-paths.form.level.intermediate',
    defaultMessage: 'Intermediate',
  },
  formLevelAdvanced: {
    id: 'course-authoring.learning-paths.form.level.advanced',
    defaultMessage: 'Advanced',
  },
  coursesTitle: {
    id: 'course-authoring.learning-paths.courses.title',
    defaultMessage: 'Courses',
  },
  coursesAddButton: {
    id: 'course-authoring.learning-paths.courses.button.add',
    defaultMessage: 'Add Course',
  },
  coursesSearchPlaceholder: {
    id: 'course-authoring.learning-paths.courses.search.placeholder',
    defaultMessage: 'Search courses...',
  },
  coursesEmptyMessage: {
    id: 'course-authoring.learning-paths.courses.empty',
    defaultMessage: 'No courses added yet',
  },
  courseStepOrder: {
    id: 'course-authoring.learning-paths.course-step.label.order',
    defaultMessage: 'Order',
  },
  courseStepWeight: {
    id: 'course-authoring.learning-paths.course-step.label.weight',
    defaultMessage: 'Weight',
  },
  courseStepRemove: {
    id: 'course-authoring.learning-paths.course-step.button.remove',
    defaultMessage: 'Remove',
  },
  skillsRequiredTitle: {
    id: 'course-authoring.learning-paths.skills.required.title',
    defaultMessage: 'Required Skills',
  },
  skillsAcquiredTitle: {
    id: 'course-authoring.learning-paths.skills.acquired.title',
    defaultMessage: 'Acquired Skills',
  },
  skillsAddButton: {
    id: 'course-authoring.learning-paths.skills.button.add',
    defaultMessage: 'Add Skill',
  },
  skillsSearchPlaceholder: {
    id: 'course-authoring.learning-paths.skills.search.placeholder',
    defaultMessage: 'Search or create skill...',
  },
  skillsLevel: {
    id: 'course-authoring.learning-paths.skills.label.level',
    defaultMessage: 'Level',
  },
  skillsRemove: {
    id: 'course-authoring.learning-paths.skills.button.remove',
    defaultMessage: 'Remove',
  },
  gradingTitle: {
    id: 'course-authoring.learning-paths.grading.title',
    defaultMessage: 'Grading Criteria',
  },
  gradingRequiredCompletion: {
    id: 'course-authoring.learning-paths.grading.label.requiredCompletion',
    defaultMessage: 'Required Completion (%)',
  },
  gradingRequiredGrade: {
    id: 'course-authoring.learning-paths.grading.label.requiredGrade',
    defaultMessage: 'Required Grade (%)',
  },
  gradingHelpTextCompletion: {
    id: 'course-authoring.learning-paths.grading.help.completion',
    defaultMessage: 'Average completion percentage required across all courses',
  },
  gradingHelpTextGrade: {
    id: 'course-authoring.learning-paths.grading.help.grade',
    defaultMessage: 'Weighted average grade required across all courses',
  },
  formButtonCancel: {
    id: 'course-authoring.learning-paths.form.button.cancel',
    defaultMessage: 'Cancel',
  },
  formButtonSave: {
    id: 'course-authoring.learning-paths.form.button.save',
    defaultMessage: 'Save',
  },
  formButtonCreate: {
    id: 'course-authoring.learning-paths.form.button.create',
    defaultMessage: 'Create',
  },
  deleteConfirmTitle: {
    id: 'course-authoring.learning-paths.delete.confirm.title',
    defaultMessage: 'Delete Learning Path',
  },
  deleteConfirmMessage: {
    id: 'course-authoring.learning-paths.delete.confirm.message',
    defaultMessage: 'Are you sure you want to delete "{displayName}"? This action cannot be undone.',
  },
  deleteConfirmButton: {
    id: 'course-authoring.learning-paths.delete.confirm.button',
    defaultMessage: 'Delete',
  },
  errorLoadingPaths: {
    id: 'course-authoring.learning-paths.error.loading',
    defaultMessage: 'Failed to load learning paths',
  },
  errorSavingPath: {
    id: 'course-authoring.learning-paths.error.saving',
    defaultMessage: 'Failed to save learning path',
  },
  errorDeletingPath: {
    id: 'course-authoring.learning-paths.error.deleting',
    defaultMessage: 'Failed to delete learning path',
  },
  successCreated: {
    id: 'course-authoring.learning-paths.success.created',
    defaultMessage: 'Learning path created successfully',
  },
  successUpdated: {
    id: 'course-authoring.learning-paths.success.updated',
    defaultMessage: 'Learning path updated successfully',
  },
  successDeleted: {
    id: 'course-authoring.learning-paths.success.deleted',
    defaultMessage: 'Learning path deleted successfully',
  },
  bulkEnrollButton: {
    id: 'course-authoring.learning-paths.button.bulkEnroll',
    defaultMessage: 'Manage Enrollments',
  },
  bulkEnrollTitle: {
    id: 'course-authoring.learning-paths.bulk-enroll.title',
    defaultMessage: 'Bulk Enrollment Management',
  },
  bulkEnrollSubtitle: {
    id: 'course-authoring.learning-paths.bulk-enroll.subtitle',
    defaultMessage: 'Enroll or unenroll multiple users in learning paths',
  },
  bulkEnrollTabEnroll: {
    id: 'course-authoring.learning-paths.bulk-enroll.tab.enroll',
    defaultMessage: 'Enroll Users',
  },
  bulkEnrollTabUnenroll: {
    id: 'course-authoring.learning-paths.bulk-enroll.tab.unenroll',
    defaultMessage: 'Unenroll Users',
  },
  bulkEnrollSelectPaths: {
    id: 'course-authoring.learning-paths.bulk-enroll.label.selectPaths',
    defaultMessage: 'Select Learning Paths',
  },
  bulkEnrollSelectPathsHelp: {
    id: 'course-authoring.learning-paths.bulk-enroll.help.selectPaths',
    defaultMessage: 'Choose one or more learning paths for enrollment',
  },
  bulkEnrollInputMethod: {
    id: 'course-authoring.learning-paths.bulk-enroll.label.inputMethod',
    defaultMessage: 'Input Method',
  },
  bulkEnrollTabPasteEmails: {
    id: 'course-authoring.learning-paths.bulk-enroll.tab.pasteEmails',
    defaultMessage: 'Paste Emails',
  },
  bulkEnrollTabUploadCsv: {
    id: 'course-authoring.learning-paths.bulk-enroll.tab.uploadCsv',
    defaultMessage: 'Upload CSV',
  },
  bulkEnrollTabSelectGroups: {
    id: 'course-authoring.learning-paths.bulk-enroll.tab.selectGroups',
    defaultMessage: 'Select Groups',
  },
  bulkEnrollGroupsLabel: {
    id: 'course-authoring.learning-paths.bulk-enroll.label.groups',
    defaultMessage: 'Django Groups',
  },
  bulkEnrollGroupsHelp: {
    id: 'course-authoring.learning-paths.bulk-enroll.help.groups',
    defaultMessage: 'Select one or more groups to enroll all their members',
  },
  bulkEnrollGroupMemberCount: {
    id: 'course-authoring.learning-paths.bulk-enroll.groupMemberCount',
    defaultMessage: '{count, plural, one {# member} other {# members}}',
  },
  bulkEnrollLoadingGroups: {
    id: 'course-authoring.learning-paths.bulk-enroll.loadingGroups',
    defaultMessage: 'Loading groups...',
  },
  bulkEnrollNoGroups: {
    id: 'course-authoring.learning-paths.bulk-enroll.noGroups',
    defaultMessage: 'No groups available',
  },
  bulkEnrollEmailsLabel: {
    id: 'course-authoring.learning-paths.bulk-enroll.label.emails',
    defaultMessage: 'Email Addresses',
  },
  bulkEnrollEmailsPlaceholder: {
    id: 'course-authoring.learning-paths.bulk-enroll.placeholder.emails',
    defaultMessage: 'Enter email addresses (one per line or comma-separated)',
  },
  bulkEnrollEmailsHelp: {
    id: 'course-authoring.learning-paths.bulk-enroll.help.emails',
    defaultMessage: 'You can enter multiple emails separated by commas or new lines',
  },
  bulkEnrollReasonLabel: {
    id: 'course-authoring.learning-paths.bulk-enroll.label.reason',
    defaultMessage: 'Reason (Optional)',
  },
  bulkEnrollReasonPlaceholder: {
    id: 'course-authoring.learning-paths.bulk-enroll.placeholder.reason',
    defaultMessage: 'e.g., Q1 2024 cohort enrollment',
  },
  bulkEnrollReasonHelp: {
    id: 'course-authoring.learning-paths.bulk-enroll.help.reason',
    defaultMessage: 'This will be recorded in the audit trail',
  },
  bulkEnrollOrgLabel: {
    id: 'course-authoring.learning-paths.bulk-enroll.label.org',
    defaultMessage: 'Organization (Optional)',
  },
  bulkEnrollRoleLabel: {
    id: 'course-authoring.learning-paths.bulk-enroll.label.role',
    defaultMessage: 'Role (Optional)',
  },
  bulkEnrollButtonSubmit: {
    id: 'course-authoring.learning-paths.bulk-enroll.button.submit',
    defaultMessage: 'Enroll Users',
  },
  bulkUnenrollButtonSubmit: {
    id: 'course-authoring.learning-paths.bulk-enroll.button.unenroll',
    defaultMessage: 'Unenroll Users',
  },
  bulkEnrollCsvDragDrop: {
    id: 'course-authoring.learning-paths.bulk-enroll.csv.dragDrop',
    defaultMessage: 'Drag and drop a CSV file here, or click to browse',
  },
  bulkEnrollCsvDownloadTemplate: {
    id: 'course-authoring.learning-paths.bulk-enroll.csv.downloadTemplate',
    defaultMessage: 'Download CSV Template',
  },
  bulkEnrollCsvFormatHelp: {
    id: 'course-authoring.learning-paths.bulk-enroll.csv.formatHelp',
    defaultMessage: 'CSV should have columns: email, learning_path_key',
  },
  bulkEnrollCsvPreviewTitle: {
    id: 'course-authoring.learning-paths.bulk-enroll.csv.previewTitle',
    defaultMessage: 'CSV Preview',
  },
  bulkEnrollCsvRowsFound: {
    id: 'course-authoring.learning-paths.bulk-enroll.csv.rowsFound',
    defaultMessage: '{count, plural, one {# row} other {# rows}} found',
  },
  bulkEnrollSuccessEnroll: {
    id: 'course-authoring.learning-paths.bulk-enroll.success.enroll',
    defaultMessage: 'Successfully enrolled {enrollmentsCreated} users. {enrollmentAllowedCreated, plural, =0 {} one {# user will be enrolled when they register.} other {# users will be enrolled when they register.}}',
  },
  bulkEnrollSuccessUnenroll: {
    id: 'course-authoring.learning-paths.bulk-enroll.success.unenroll',
    defaultMessage: 'Successfully unenrolled {enrollmentsUnenrolled} users. {enrollmentAllowedDeactivated, plural, =0 {} one {Deactivated # pending enrollment.} other {Deactivated # pending enrollments.}}',
  },
  bulkEnrollErrorGeneric: {
    id: 'course-authoring.learning-paths.bulk-enroll.error.generic',
    defaultMessage: 'Failed to process bulk enrollment. Please try again.',
  },
  bulkEnrollErrorNoEmails: {
    id: 'course-authoring.learning-paths.bulk-enroll.error.noEmails',
    defaultMessage: 'Please enter at least one email address',
  },
  bulkEnrollErrorNoPaths: {
    id: 'course-authoring.learning-paths.bulk-enroll.error.noPaths',
    defaultMessage: 'Please select at least one learning path',
  },
  bulkEnrollErrorInvalidEmail: {
    id: 'course-authoring.learning-paths.bulk-enroll.error.invalidEmail',
    defaultMessage: 'Some email addresses are invalid: {emails}',
  },
  bulkEnrollUnenrollWarning: {
    id: 'course-authoring.learning-paths.bulk-enroll.warning.unenroll',
    defaultMessage: 'Warning: This will remove user access to the selected learning paths. This action creates an audit record but cannot be undone automatically.',
  },
  // Individual Enrollment Management
  individualEnrollTabTitle: {
    id: 'course-authoring.learning-paths.individual-enroll.tab.title',
    defaultMessage: 'Individual Enrollment',
  },
  individualEnrollSectionTitleEnroll: {
    id: 'course-authoring.learning-paths.individual-enroll.section.title.enroll',
    defaultMessage: 'Enroll a User',
  },
  individualEnrollSectionTitleSearch: {
    id: 'course-authoring.learning-paths.individual-enroll.section.title.search',
    defaultMessage: 'Search Enrollments',
  },
  individualEnrollLabelLearningPath: {
    id: 'course-authoring.learning-paths.individual-enroll.label.learningPath',
    defaultMessage: 'Learning Path',
  },
  individualEnrollPlaceholderLearningPath: {
    id: 'course-authoring.learning-paths.individual-enroll.placeholder.learningPath',
    defaultMessage: 'Select a learning path...',
  },
  individualEnrollLabelUsername: {
    id: 'course-authoring.learning-paths.individual-enroll.label.username',
    defaultMessage: 'Username or Email',
  },
  individualEnrollPlaceholderUsername: {
    id: 'course-authoring.learning-paths.individual-enroll.placeholder.username',
    defaultMessage: 'Enter username or email...',
  },
  individualEnrollLabelReason: {
    id: 'course-authoring.learning-paths.individual-enroll.label.reason',
    defaultMessage: 'Reason (Optional)',
  },
  individualEnrollPlaceholderReason: {
    id: 'course-authoring.learning-paths.individual-enroll.placeholder.reason',
    defaultMessage: 'e.g., Requested by instructor',
  },
  individualEnrollLabelOrg: {
    id: 'course-authoring.learning-paths.individual-enroll.label.org',
    defaultMessage: 'Organization (Optional)',
  },
  individualEnrollLabelRole: {
    id: 'course-authoring.learning-paths.individual-enroll.label.role',
    defaultMessage: 'Role (Optional)',
  },
  individualEnrollButtonEnroll: {
    id: 'course-authoring.learning-paths.individual-enroll.button.enroll',
    defaultMessage: 'Enroll User',
  },
  individualEnrollButtonClear: {
    id: 'course-authoring.learning-paths.individual-enroll.button.clear',
    defaultMessage: 'Clear',
  },
  individualEnrollSearchByUsername: {
    id: 'course-authoring.learning-paths.individual-enroll.search.byUsername',
    defaultMessage: 'Search by Username',
  },
  individualEnrollSearchByPath: {
    id: 'course-authoring.learning-paths.individual-enroll.search.byPath',
    defaultMessage: 'Search by Learning Path',
  },
  individualEnrollButtonSearch: {
    id: 'course-authoring.learning-paths.individual-enroll.button.search',
    defaultMessage: 'Search',
  },
  individualEnrollTableHeaderUser: {
    id: 'course-authoring.learning-paths.individual-enroll.table.header.user',
    defaultMessage: 'User',
  },
  individualEnrollTableHeaderPath: {
    id: 'course-authoring.learning-paths.individual-enroll.table.header.path',
    defaultMessage: 'Learning Path',
  },
  individualEnrollTableHeaderStatus: {
    id: 'course-authoring.learning-paths.individual-enroll.table.header.status',
    defaultMessage: 'Status',
  },
  individualEnrollTableHeaderEnrolled: {
    id: 'course-authoring.learning-paths.individual-enroll.table.header.enrolled',
    defaultMessage: 'Enrolled Date',
  },
  individualEnrollTableHeaderAction: {
    id: 'course-authoring.learning-paths.individual-enroll.table.header.action',
    defaultMessage: 'Action',
  },
  individualEnrollButtonUnenroll: {
    id: 'course-authoring.learning-paths.individual-enroll.button.unenroll',
    defaultMessage: 'Unenroll',
  },
  individualEnrollStatusActive: {
    id: 'course-authoring.learning-paths.individual-enroll.status.active',
    defaultMessage: 'Active',
  },
  individualEnrollStatusInactive: {
    id: 'course-authoring.learning-paths.individual-enroll.status.inactive',
    defaultMessage: 'Inactive',
  },
  individualEnrollSuccessEnroll: {
    id: 'course-authoring.learning-paths.individual-enroll.success.enroll',
    defaultMessage: 'Successfully enrolled {username} in {pathName}',
  },
  individualEnrollSuccessUnenroll: {
    id: 'course-authoring.learning-paths.individual-enroll.success.unenroll',
    defaultMessage: 'Successfully unenrolled {username} from {pathName}',
  },
  individualEnrollErrorGeneric: {
    id: 'course-authoring.learning-paths.individual-enroll.error.generic',
    defaultMessage: 'An error occurred. Please try again.',
  },
  individualEnrollErrorNoResults: {
    id: 'course-authoring.learning-paths.individual-enroll.error.noResults',
    defaultMessage: 'No enrollments found for this search.',
  },
  individualEnrollErrorRequiredFields: {
    id: 'course-authoring.learning-paths.individual-enroll.error.requiredFields',
    defaultMessage: 'Please select a learning path and enter a username/email.',
  },
});

export default messages;
