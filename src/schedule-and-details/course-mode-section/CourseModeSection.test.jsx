import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';

import CourseModeSection from '.';
import messages from './messages';

const onChangeMock = jest.fn();

const RootWrapper = (props) => (
  <IntlProvider locale="en">
    <CourseModeSection {...props} />
  </IntlProvider>
);

const props = {
  courseMode: 'honor',
  onChange: onChangeMock,
};

describe('<CourseModeSection />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders successfully', () => {
    const { getByText, getAllByRole } = render(<RootWrapper {...props} />);
    const radioButtons = getAllByRole('radio');

    expect(getByText(messages.courseModeTitle.defaultMessage)).toBeInTheDocument();
    expect(getByText(messages.courseModeDescription.defaultMessage)).toBeInTheDocument();
    expect(getByText(messages.courseModeLabel.defaultMessage)).toBeInTheDocument();
    expect(radioButtons.length).toBe(5); // honor, audit, verified, professional, no-id-professional
  });

  it('should call onChange when selecting a different mode', () => {
    const { getByLabelText } = render(<RootWrapper {...props} />);
    const verifiedRadio = getByLabelText(messages.courseModeVerifiedLabel.defaultMessage);

    act(() => {
      fireEvent.click(verifiedRadio);
    });

    expect(onChangeMock).toHaveBeenCalledWith('verified', 'courseMode');
  });

  it('should display all course mode options', () => {
    const { getByText } = render(<RootWrapper {...props} />);

    expect(getByText(messages.courseModeHonorLabel.defaultMessage)).toBeInTheDocument();
    expect(getByText(messages.courseModeAuditLabel.defaultMessage)).toBeInTheDocument();
    expect(getByText(messages.courseModeVerifiedLabel.defaultMessage)).toBeInTheDocument();
    expect(getByText(messages.courseModeProfessionalLabel.defaultMessage)).toBeInTheDocument();
    expect(getByText(messages.courseModeNoIdProfessionalLabel.defaultMessage)).toBeInTheDocument();
  });

  it('should default to honor mode when no mode is provided', () => {
    const propsWithoutMode = {
      ...props,
      courseMode: undefined,
    };
    const { getByLabelText } = render(<RootWrapper {...propsWithoutMode} />);
    const honorRadio = getByLabelText(messages.courseModeHonorLabel.defaultMessage);

    expect(honorRadio).toBeChecked();
  });
});
