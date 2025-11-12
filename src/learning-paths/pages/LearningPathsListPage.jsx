import React from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Button,
  AlertModal,
  Spinner,
  Alert,
} from '@openedx/paragon';
import { Add as AddIcon } from '@openedx/paragon/icons';
import { StudioFooterSlot } from '@edx/frontend-component-footer';

import Header from '../../header';
import SubHeader from '../../generic/sub-header/SubHeader';
import { useLearningPaths } from '../hooks/useLearningPaths';
import PathCard from '../components/PathCard';
import EmptyPlaceholder from '../components/EmptyPlaceholder';
import messages from '../messages';
import '../LearningPaths.scss';

/**
 * Main page component for managing learning paths.
 * Displays a list of learning paths with ability to create, edit, and delete.
 */
const LearningPaths = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const {
    paths,
    errorMessage,
    isLoading,
    isLoadingFailed,
    pathToDelete,
    handleDelete,
    handleConfirmDelete,
    handleCancelDelete,
  } = useLearningPaths();

  const handleCreateClick = () => {
    navigate('/learning-paths/new');
  };

  const handleEditClick = (path) => {
    navigate(`/learning-paths/${encodeURIComponent(path.key)}/edit`);
  };

  if (isLoading) {
    return (
      <>
        <Helmet>
          <title>{intl.formatMessage(messages.headingTitle)}</title>
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
          <title>{intl.formatMessage(messages.headingTitle)}</title>
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

  return (
    <>
      <Helmet>
        <title>{intl.formatMessage(messages.headingTitle)}</title>
      </Helmet>
      <Header isHiddenMainMenu showPageNavigation />
      <Container size="xl" className="learning-paths px-4 mt-4">
      <SubHeader
        title={intl.formatMessage(messages.headingTitle)}
        headerActions={(
          <Button
            variant="primary"
            iconBefore={AddIcon}
            onClick={handleCreateClick}
          >
            {intl.formatMessage(messages.createButton)}
          </Button>
        )}
      />

      {errorMessage && (
        <Alert variant="danger" className="mb-3">
          {errorMessage}
        </Alert>
      )}

      {paths.length === 0 ? (
        <EmptyPlaceholder onCreateClick={handleCreateClick} />
      ) : (
        <div
          className="learning-paths-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {paths.map((path) => (
            <PathCard
              key={path.key}
              path={path}
              onEdit={handleEditClick}
              onDelete={handleConfirmDelete}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {pathToDelete && (
        <AlertModal
          title={intl.formatMessage(messages.deleteConfirmTitle)}
          isOpen={!!pathToDelete}
          onClose={handleCancelDelete}
          footerNode={(
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <Button variant="tertiary" onClick={handleCancelDelete}>
                {intl.formatMessage(messages.formButtonCancel)}
              </Button>
              <Button
                variant="danger"
                onClick={() => handleDelete(pathToDelete.key)}
              >
                {intl.formatMessage(messages.deleteConfirmButton)}
              </Button>
            </div>
          )}
        >
          <p>
            {intl.formatMessage(messages.deleteConfirmMessage, {
              displayName: pathToDelete.displayName,
            })}
          </p>
        </AlertModal>
      )}
      </Container>
      <StudioFooterSlot />
    </>
  );
};

export default LearningPaths;
