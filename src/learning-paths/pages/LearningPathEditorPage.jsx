import React, { useEffect, useState, useCallback } from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Helmet } from 'react-helmet';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Layout,
  Spinner,
  Alert,
} from '@openedx/paragon';
import { StudioFooterSlot } from '@edx/frontend-component-footer';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';

import Header from '../../header';
import SubHeader from '../../generic/sub-header/SubHeader';
import PathForm from '../form/PathForm';
import PathSidebar from '../components/PathSidebar';
import { useLearningPaths } from '../hooks/useLearningPaths';
import messages from '../messages';
import '../LearningPaths.scss';

/**
 * Page component for creating or editing a learning path.
 * Displays the path form with sidebar help content.
 */
const LearningPathEditor = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const location = useLocation();
  const { pathKey } = useParams();
  const isEditMode = !!pathKey;
  const isDuplicateMode = !isEditMode && location.state?.duplicateFrom;

  const {
    paths,
    isLoading,
    isLoadingFailed,
    isSaving,
    handleCreate,
    handleUpdate,
  } = useLearningPaths();

  const [currentPath, setCurrentPath] = useState(null);
  const [isEnrichingCourses, setIsEnrichingCourses] = useState(false);

  // Fetch course details to get display names
  const enrichCoursesWithDisplayNames = useCallback(async (steps) => {
    if (!Array.isArray(steps) || steps.length === 0) {
      return steps;
    }

    try {
      const enrichedSteps = await Promise.all(
        steps.map(async (step) => {
          // If displayName already exists, keep it
          if (step.displayName) {
            return step;
          }

          // Otherwise, fetch course details
          try {
            const { data } = await getAuthenticatedHttpClient().get(
              `${getConfig().LMS_BASE_URL}/api/courses/v1/courses/${step.courseKey}/`
            );
            return {
              ...step,
              displayName: data.name || data.display_name || step.courseKey,
            };
          } catch (error) {
            // If course fetch fails, use courseKey as displayName
            console.warn(`Failed to fetch course details for ${step.courseKey}:`, error);
            return {
              ...step,
              displayName: step.courseKey,
            };
          }
        })
      );
      return enrichedSteps;
    } catch (error) {
      console.error('Failed to enrich courses:', error);
      return steps;
    }
  }, []);

  // Load the path data if in edit mode and enrich course steps
  useEffect(() => {
    const loadAndEnrichPath = async () => {
      if (isEditMode && paths.length > 0) {
        const path = paths.find((p) => p.key === decodeURIComponent(pathKey));
        if (path) {
          setIsEnrichingCourses(true);
          const enrichedSteps = await enrichCoursesWithDisplayNames(path.steps);
          setCurrentPath({
            ...path,
            steps: enrichedSteps,
          });
          setIsEnrichingCourses(false);
        } else {
          setCurrentPath(null);
        }
      }
    };

    loadAndEnrichPath();
  }, [isEditMode, pathKey, paths, enrichCoursesWithDisplayNames]);

  const parsePathKey = (key) => {
    if (!key) {
      return { organization: '', pathNumber: '', pathRun: '', pathGroup: '' };
    }
    const match = key.match(/^path-v1:([^+]+)\+([^+]+)\+([^+]+)\+([^+]+)$/);
    if (match) {
      return {
        organization: match[1],
        pathNumber: match[2],
        pathRun: match[3],
        pathGroup: match[4],
      };
    }
    return { organization: '', pathNumber: '', pathRun: '', pathGroup: '' };
  };

  const getInitialValues = () => {
    // Handle duplicate mode - pre-fill with duplicateFrom data but clear key fields
    if (isDuplicateMode) {
      const duplicatePath = location.state.duplicateFrom;
      return {
        key: '',
        organization: '',
        pathNumber: '',
        pathRun: '',
        pathGroup: 'default',
        displayName: `${duplicatePath.displayName || ''} (Copy)`,
        subtitle: duplicatePath.subtitle || '',
        description: duplicatePath.description || '',
        image: duplicatePath.image || null,
        level: duplicatePath.level || '',
        duration: duplicatePath.duration || '',
        timeCommitment: duplicatePath.timeCommitment || '',
        sequential: duplicatePath.sequential || false,
        inviteOnly: duplicatePath.inviteOnly !== undefined ? duplicatePath.inviteOnly : true,
        steps: Array.isArray(duplicatePath.steps) ? duplicatePath.steps : [],
        requiredSkills: Array.isArray(duplicatePath.requiredSkills) ? duplicatePath.requiredSkills : [],
        acquiredSkills: Array.isArray(duplicatePath.acquiredSkills) ? duplicatePath.acquiredSkills : [],
        requiredCompletion: duplicatePath.requiredCompletion || 80,
        requiredGrade: duplicatePath.requiredGrade || 75,
      };
    }

    // Handle edit mode - pre-fill with current path data
    if (currentPath) {
      const keyParts = parsePathKey(currentPath.key);
      return {
        key: currentPath.key || '',
        organization: keyParts.organization,
        pathNumber: keyParts.pathNumber,
        pathRun: keyParts.pathRun,
        pathGroup: keyParts.pathGroup,
        displayName: currentPath.displayName || '',
        subtitle: currentPath.subtitle || '',
        description: currentPath.description || '',
        image: currentPath.image || null,
        level: currentPath.level || '',
        duration: currentPath.duration || '',
        timeCommitment: currentPath.timeCommitment || '',
        sequential: currentPath.sequential || false,
        inviteOnly: currentPath.inviteOnly !== undefined ? currentPath.inviteOnly : true,
        steps: Array.isArray(currentPath.steps) ? currentPath.steps : [],
        requiredSkills: Array.isArray(currentPath.requiredSkills) ? currentPath.requiredSkills : [],
        acquiredSkills: Array.isArray(currentPath.acquiredSkills) ? currentPath.acquiredSkills : [],
        requiredCompletion: currentPath.requiredCompletion || 80,
        requiredGrade: currentPath.requiredGrade || 75,
      };
    }

    // Handle create mode - empty form
    return {
      key: '',
      organization: '',
      pathNumber: '',
      pathRun: '',
      pathGroup: 'default',
      displayName: '',
      subtitle: '',
      description: '',
      image: null,
      level: '',
      duration: '',
      timeCommitment: '',
      sequential: true,
      inviteOnly: true,
      steps: [],
      requiredSkills: [],
      acquiredSkills: [],
      requiredCompletion: 80,
      requiredGrade: 75,
    };
  };

  const handleSubmit = async (values) => {
    let success = false;
    if (isEditMode) {
      success = await handleUpdate(currentPath.key, values);
    } else {
      success = await handleCreate(values);
    }

    if (success) {
      navigate('/learning-paths');
    }
  };

  const handleCancel = () => {
    navigate('/learning-paths');
  };

  if ((isLoading && isEditMode && !currentPath) || isEnrichingCourses) {
    return (
      <>
        <Helmet>
          <title>
            {intl.formatMessage(
              isEditMode ? messages.formTitleEdit : messages.formTitleCreate
            )}
          </title>
        </Helmet>
        <Header isHiddenMainMenu showPageNavigation />
        <Container size="xl" className="px-4 py-5 text-center">
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </Container>
        <StudioFooterSlot />
      </>
    );
  }

  if (isLoadingFailed) {
    return (
      <>
        <Helmet>
          <title>
            {intl.formatMessage(
              isEditMode ? messages.formTitleEdit : messages.formTitleCreate
            )}
          </title>
        </Helmet>
        <Header isHiddenMainMenu showPageNavigation />
        <Container size="xl" className="px-4 py-5">
          <Alert variant="danger">
            {intl.formatMessage(messages.errorLoadingPaths)}
          </Alert>
        </Container>
        <StudioFooterSlot />
      </>
    );
  }

  if (isEditMode && !currentPath && !isLoading) {
    return (
      <>
        <Helmet>
          <title>{intl.formatMessage(messages.formTitleEdit)}</title>
        </Helmet>
        <Header isHiddenMainMenu showPageNavigation />
        <Container size="xl" className="px-4 py-5">
          <Alert variant="warning">
            Learning path not found. It may have been deleted.
          </Alert>
        </Container>
        <StudioFooterSlot />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>
          {intl.formatMessage(
            isEditMode ? messages.formTitleEdit : messages.formTitleCreate
          )}
        </title>
      </Helmet>
      <Header isHiddenMainMenu showPageNavigation />
      <Container size="xl" className="learning-paths px-4 mt-4">
        <SubHeader
          title={intl.formatMessage(
            isEditMode ? messages.formTitleEdit : messages.formTitleCreate
          )}
        />

        <Layout
          lg={[{ span: 9 }, { span: 3 }]}
          md={[{ span: 12 }]}
        >
          <Layout.Element>
            <PathForm
              initialValues={getInitialValues()}
              isEditMode={isEditMode}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isSaving={isSaving}
            />
          </Layout.Element>
          <Layout.Element>
            <PathSidebar />
          </Layout.Element>
        </Layout>
      </Container>
      <StudioFooterSlot />
    </>
  );
};

export default LearningPathEditor;
