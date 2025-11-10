import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  requirementsTitle: {
    id: 'course-authoring.schedule-section.requirements.title',
    defaultMessage: 'Requirements',
  },
  requirementsDescription: {
    id: 'course-authoring.schedule-section.requirements.description',
    defaultMessage: 'Expectations of the students taking this course',
  },
  timepickerLabel: {
    id: 'course-authoring.schedule-section.requirements.timepicker.label',
    defaultMessage: 'Hours of effort per week',
  },
  timepickerHelpText: {
    id: 'course-authoring.schedule-section.requirements.timepicker.help-text',
    defaultMessage: 'Time spent on all course work',
  },
  dropdownLabel: {
    id: 'course-authoring.schedule-section.requirements.dropdown.label',
    defaultMessage: 'Prerequisite courses',
  },
  dropdownHelpText: {
    id: 'course-authoring.schedule-section.requirements.dropdown.help-text',
    defaultMessage: 'Courses that students must complete before beginning this course',
  },
  dropdownEmptyText: {
    id: 'course-authoring.schedule-section.requirements.dropdown.empty-text',
    defaultMessage: 'None',
  },
  noCoursesSelected: {
    id: 'course-authoring.schedule-section.requirements.no-courses-selected',
    defaultMessage: 'No prerequisite courses selected',
  },
  addPrerequisiteButton: {
    id: 'course-authoring.schedule-section.requirements.add-prerequisite-button',
    defaultMessage: 'Add prerequisite course',
  },
  searchPlaceholder: {
    id: 'course-authoring.schedule-section.requirements.search-placeholder',
    defaultMessage: 'Search courses...',
  },
  noResultsFound: {
    id: 'course-authoring.schedule-section.requirements.no-results-found',
    defaultMessage: 'No courses found',
  },
  allCoursesSelected: {
    id: 'course-authoring.schedule-section.requirements.all-courses-selected',
    defaultMessage: 'All available courses have been selected',
  },
});

export default messages;
