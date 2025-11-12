import React, { useState, useMemo, useEffect } from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Button, Form, Dropdown, SearchField, Spinner } from '@openedx/paragon';
import { Add as AddIcon } from '@openedx/paragon/icons';
import { useFormikContext, FieldArray } from 'formik';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import CourseStepItem from './CourseStepItem';
import messages from '../messages';

/**
 * Component displaying the list of course steps with ability to add/remove courses.
 */
const CourseStepsList = () => {
  const intl = useIntl();
  const { values, handleChange, handleBlur, errors, touched, setFieldValue } = useFormikContext();
  const [courseSearchQuery, setCourseSearchQuery] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualCourseKey, setManualCourseKey] = useState('');
  const [availableCourses, setAvailableCourses] = useState([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);
  const [coursesError, setCoursesError] = useState(null);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  const steps = Array.isArray(values.steps) ? values.steps : [];
  const stepsErrors = errors.steps;
  const stepsTouched = touched.steps;

  // @dnd-kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Debounce the search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(courseSearchQuery);
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [courseSearchQuery]);

  // Fetch available courses from the LMS
  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoadingCourses(true);
      setCoursesError(null);
      try {
        const { data } = await getAuthenticatedHttpClient().get(
          `${getConfig().LMS_BASE_URL}/api/courses/v1/courses/`,
          {
            params: {
              page_size: 100, // Fetch up to 100 courses
              ...(debouncedSearchQuery && { search_term: debouncedSearchQuery }),
            },
          }
        );

        // Transform the response to match our expected format
        const courses = (data.results || []).map(course => ({
          courseKey: course.id || course.course_id,
          displayName: course.name || course.display_name || course.id,
        }));

        setAvailableCourses(courses);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
        setCoursesError('Failed to load courses. You can still enter course keys manually.');
        setAvailableCourses([]);
      } finally {
        setIsLoadingCourses(false);
      }
    };

    fetchCourses();
  }, [debouncedSearchQuery]);

  // Filter courses based on search and exclude already added ones
  const filteredCourses = useMemo(() => {
    return availableCourses.filter(course =>
      !steps.some(step => step.courseKey === course.courseKey)
    );
  }, [availableCourses, steps]);

  const handleAddCourse = (arrayHelpers, courseKey, displayName = null) => {
    if (courseKey && courseKey.trim()) {
      arrayHelpers.push({
        courseKey: courseKey.trim(),
        displayName: displayName || courseKey.trim(),
        order: steps.length + 1,
        weight: 1.0,
      });
      setCourseSearchQuery('');
      setManualCourseKey('');
      setShowManualInput(false);
    }
  };

  // @dnd-kit drag handler
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = steps.findIndex((step) => step.courseKey === active.id);
      const newIndex = steps.findIndex((step) => step.courseKey === over.id);

      const reorderedSteps = arrayMove(steps, oldIndex, newIndex).map((step, index) => ({
        ...step,
        order: index + 1,
      }));

      setFieldValue('steps', reorderedSteps);
    }
  };

  return (
    <div className="course-steps-list mb-4">
      <h3 className="h5 mb-3">
        {intl.formatMessage(messages.coursesTitle)}
      </h3>

      <FieldArray name="steps">
        {(arrayHelpers) => (
          <>
            {steps.length === 0 && (
              <p className="text-muted small mb-3">
                {intl.formatMessage(messages.coursesEmptyMessage)}
              </p>
            )}

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={steps.map((step) => step.courseKey)}
                strategy={verticalListSortingStrategy}
              >
                {steps.map((step, index) => (
                  <div key={step.courseKey} style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '12px' }}>
                    {/* Order Number - Outside Card */}
                    <div style={{ marginTop: '-14px' }}>
                      <div
                        style={{
                          minWidth: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundColor: '#f8f9fa',
                          border: '2px solid #dee2e6',
                          color: '#495057',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          flexShrink: 0,
                        }}
                      >
                        {index + 1}
                      </div>
                    </div>

                    {/* Course Card */}
                    <div style={{ flex: 1 }}>
                      <CourseStepItem
                        id={step.courseKey}
                        step={step}
                        index={index}
                        onRemove={arrayHelpers.remove}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        errors={stepsErrors?.[index]}
                        touched={stepsTouched?.[index]}
                      />
                    </div>
                  </div>
                ))}
              </SortableContext>
            </DndContext>

            {/* Course Selector Dropdown */}
            <div className="mt-3">
              {!showManualInput ? (
                <Dropdown className="bg-white">
                  <Dropdown.Toggle
                    id="course-dropdown-toggle"
                    variant="outline-primary"
                  >
                    {intl.formatMessage(messages.coursesAddButton)}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <div className="px-3 py-2">
                      <SearchField
                        onClear={() => {
                          setCourseSearchQuery('');
                        }}
                        onSubmit={(value) => setCourseSearchQuery(value)}
                        onChange={(value) => setCourseSearchQuery(value)}
                        value={courseSearchQuery}
                        placeholder={intl.formatMessage(messages.coursesSearchPlaceholder)}
                      />
                    </div>
                    <div className="dropdown-divider" />
                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                      {isLoadingCourses ? (
                        <div className="px-3 py-3 text-center">
                          <Spinner animation="border" size="sm" className="mr-2" />
                          <span className="text-muted">Loading courses...</span>
                        </div>
                      ) : coursesError ? (
                        <>
                          <div className="px-3 py-2 text-warning">
                            {coursesError}
                          </div>
                          <div className="dropdown-divider" />
                          <Dropdown.Item
                            onClick={() => setShowManualInput(true)}
                          >
                            <div className="text-primary">
                              + Enter course key manually
                            </div>
                          </Dropdown.Item>
                        </>
                      ) : filteredCourses.length > 0 ? (
                        <>
                          {filteredCourses.map((course) => (
                            <Dropdown.Item
                              key={course.courseKey}
                              onClick={() => {
                                handleAddCourse(arrayHelpers, course.courseKey, course.displayName);
                              }}
                            >
                              <div>
                                <div className="font-weight-bold">{course.displayName}</div>
                                <div className="small text-muted">{course.courseKey}</div>
                              </div>
                            </Dropdown.Item>
                          ))}
                          <div className="dropdown-divider" />
                          <Dropdown.Item
                            onClick={() => setShowManualInput(true)}
                          >
                            <div className="text-primary">
                              + Enter course key manually
                            </div>
                          </Dropdown.Item>
                        </>
                      ) : (
                        <>
                          <div className="px-3 py-2 text-muted">
                            {courseSearchQuery
                              ? 'No courses found matching your search'
                              : 'All available courses have been added'}
                          </div>
                          <div className="dropdown-divider" />
                          <Dropdown.Item
                            onClick={() => setShowManualInput(true)}
                          >
                            <div className="text-primary">
                              + Enter course key manually
                            </div>
                          </Dropdown.Item>
                        </>
                      )}
                    </div>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <div className="d-flex gap-2">
                  <Form.Control
                    type="text"
                    placeholder="Enter course key (e.g., course-v1:edX+DemoX+Demo)"
                    value={manualCourseKey}
                    onChange={(e) => setManualCourseKey(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCourse(arrayHelpers, manualCourseKey);
                      }
                    }}
                  />
                  <Button
                    variant="outline-primary"
                    onClick={() => handleAddCourse(arrayHelpers, manualCourseKey)}
                    disabled={!manualCourseKey.trim()}
                  >
                    Add
                  </Button>
                  <Button
                    variant="outline-secondary"
                    onClick={() => {
                      setShowManualInput(false);
                      setManualCourseKey('');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      </FieldArray>
    </div>
  );
};

export default CourseStepsList;
