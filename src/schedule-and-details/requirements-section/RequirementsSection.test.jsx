import React from 'react';
import {
  render, fireEvent, act,
} from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';

import { courseDetailsMock, courseSettingsMock } from '../__mocks__';
import messages from './messages';
import entranceExamMessages from './entrance-exam/messages';
import RequirementsSection from '.';

const onChangeMock = jest.fn();
const courseIdMock = 'course-id-bar';

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useParams: () => ({
    courseId: courseIdMock,
  }),
}));

const RootWrapper = (props) => (
  <IntlProvider locale="en">
    <RequirementsSection {...props} />
  </IntlProvider>
);
const {
  effort,
  entranceExamEnabled,
  preRequisiteCourses,
  entranceExamMinimumScorePct,
} = courseDetailsMock;

const {
  aboutPageEditable,
  isEntranceExamsEnabled,
  possiblePreRequisiteCourses,
  isPrerequisiteCoursesEnabled,
} = courseSettingsMock;

const props = {
  effort,
  errorFields: {},
  aboutPageEditable,
  preRequisiteCourses,
  entranceExamEnabled,
  isEntranceExamsEnabled,
  possiblePreRequisiteCourses,
  entranceExamMinimumScorePct,
  isPrerequisiteCoursesEnabled,
  onChange: onChangeMock,
};

describe('<RequirementsSection />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders successfully', () => {
    const {
      getByText, getByLabelText, getByDisplayValue, getAllByRole,
    } = render(<RootWrapper {...props} />);
    const checkboxList = getAllByRole('checkbox');
    expect(getByText(messages.requirementsTitle.defaultMessage)).toBeInTheDocument();
    expect(getByText(messages.requirementsDescription.defaultMessage)).toBeInTheDocument();
    expect(getByLabelText(messages.timepickerLabel.defaultMessage)).toBeInTheDocument();
    expect(getByDisplayValue(props.effort)).toBeInTheDocument();
    expect(getByText(messages.timepickerHelpText.defaultMessage)).toBeInTheDocument();
    expect(getByText(messages.dropdownLabel.defaultMessage)).toBeInTheDocument();
    expect(getByText(messages.dropdownHelpText.defaultMessage)).toBeInTheDocument();
    expect(getByText(entranceExamMessages.requirementsEntrance.defaultMessage)).toBeInTheDocument();
    // Should have checkbox for entrance exam only
    expect(checkboxList.length).toBe(1);
    expect(checkboxList[0].checked).toBeTruthy();
  });

  it('should call onChange on input change', () => {
    const { getByDisplayValue } = render(<RootWrapper {...props} />);
    const input = getByDisplayValue(props.effort);
    act(() => {
      fireEvent.change(input, { target: { value: '12h' } });
    });
    expect(props.onChange).toHaveBeenCalledWith('12h', 'effort');
  });

  it('should hide content depend on flags', () => {
    const initialProps = {
      ...props,
      aboutPageEditable: false,
      isEntranceExamsEnabled: false,
      isPrerequisiteCoursesEnabled: false,
    };
    const { queryAllByLabelText } = render(<RootWrapper {...initialProps} />);
    expect(queryAllByLabelText(messages.timepickerLabel.defaultMessage).length).toBe(0);
    expect(queryAllByLabelText(messages.dropdownLabel.defaultMessage).length).toBe(0);
    expect(queryAllByLabelText(entranceExamMessages.requirementsEntrance.defaultMessage).length).toBe(0);
  });

  it('should display selected prerequisites as chips', () => {
    const propsWithPrereqs = {
      ...props,
      preRequisiteCourses: ['course-v1:edX+P315+2T2023'],
    };
    const { getByText } = render(<RootWrapper {...propsWithPrereqs} />);
    expect(getByText('Quantum Entanglement')).toBeInTheDocument();
  });

  it('should show "no courses selected" message when no prerequisites are selected', () => {
    const { getByText } = render(<RootWrapper {...props} />);
    expect(getByText(messages.noCoursesSelected.defaultMessage)).toBeInTheDocument();
  });

  it('should render add prerequisite button', () => {
    const { getByText } = render(<RootWrapper {...props} />);
    expect(getByText(messages.addPrerequisiteButton.defaultMessage)).toBeInTheDocument();
  });

  it('should add prerequisite course when dropdown item is clicked', () => {
    const { getByText } = render(<RootWrapper {...props} />);
    const dropdownToggle = getByText(messages.addPrerequisiteButton.defaultMessage);

    act(() => {
      fireEvent.click(dropdownToggle);
    });

    const courseOption = getByText('Quantum Entanglement');
    act(() => {
      fireEvent.click(courseOption);
    });

    expect(onChangeMock).toHaveBeenCalledWith(['course-v1:edX+P315+2T2023'], 'preRequisiteCourses');
  });

  it('should filter courses based on search query', () => {
    const { getByText, getByPlaceholderText } = render(<RootWrapper {...props} />);
    const dropdownToggle = getByText(messages.addPrerequisiteButton.defaultMessage);

    act(() => {
      fireEvent.click(dropdownToggle);
    });

    const searchInput = getByPlaceholderText(messages.searchPlaceholder.defaultMessage);

    act(() => {
      fireEvent.change(searchInput, { target: { value: 'Quantum' } });
    });

    expect(getByText('Quantum Entanglement')).toBeInTheDocument();
  });

  it('should not show already selected courses in dropdown', () => {
    const propsWithPrereqs = {
      ...props,
      preRequisiteCourses: ['course-v1:edX+P315+2T2023'],
    };
    const { getByText, queryByText } = render(<RootWrapper {...propsWithPrereqs} />);
    const dropdownToggle = getByText(messages.addPrerequisiteButton.defaultMessage);

    act(() => {
      fireEvent.click(dropdownToggle);
    });

    // Should not show the already selected course in dropdown
    expect(queryByText('Quantum Entanglement')).not.toBeInTheDocument();
    // Should show other courses
    expect(getByText('Demonstration Course')).toBeInTheDocument();
  });

  it('should show "all courses selected" message when all courses are selected', () => {
    const propsWithAllPrereqs = {
      ...props,
      preRequisiteCourses: [
        'course-v1:edX+P315+2T2023',
        'course-v1:edX+DemoX+Demo_Course',
      ],
    };
    const { getByText } = render(<RootWrapper {...propsWithAllPrereqs} />);
    const dropdownToggle = getByText(messages.addPrerequisiteButton.defaultMessage);

    act(() => {
      fireEvent.click(dropdownToggle);
    });

    expect(getByText(messages.allCoursesSelected.defaultMessage)).toBeInTheDocument();
  });

  it('should allow multiple prerequisites to be selected', () => {
    const { getByText, rerender } = render(<RootWrapper {...props} />);

    // Add first course
    const dropdownToggle = getByText(messages.addPrerequisiteButton.defaultMessage);
    act(() => {
      fireEvent.click(dropdownToggle);
    });

    const firstCourse = getByText('Quantum Entanglement');
    act(() => {
      fireEvent.click(firstCourse);
    });

    expect(onChangeMock).toHaveBeenCalledWith(['course-v1:edX+P315+2T2023'], 'preRequisiteCourses');

    // Simulate adding second course
    const propsWithOnePrereq = {
      ...props,
      preRequisiteCourses: ['course-v1:edX+P315+2T2023'],
    };
    rerender(<RootWrapper {...propsWithOnePrereq} />);

    const dropdownToggle2 = getByText(messages.addPrerequisiteButton.defaultMessage);
    act(() => {
      fireEvent.click(dropdownToggle2);
    });

    const secondCourse = getByText('Demonstration Course');
    act(() => {
      fireEvent.click(secondCourse);
    });

    expect(onChangeMock).toHaveBeenCalledWith(
      ['course-v1:edX+P315+2T2023', 'course-v1:edX+DemoX+Demo_Course'],
      'preRequisiteCourses'
    );
  });
});
