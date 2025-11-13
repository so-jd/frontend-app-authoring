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
});

export default messages;
