import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Button } from '@openedx/paragon';
import { Add as AddIcon } from '@openedx/paragon/icons';

import messages from '../../messages';

/**
 * Empty state placeholder shown when no learning paths exist.
 */
const EmptyPlaceholder = ({ onCreateClick }) => {
  const intl = useIntl();

  return (
    <div className="learning-paths-empty text-center py-5">
      <h3>{intl.formatMessage(messages.emptyTitle)}</h3>
      <p className="text-muted mb-4">
        {intl.formatMessage(messages.emptyDescription)}
      </p>
      <Button
        variant="primary"
        iconBefore={AddIcon}
        onClick={onCreateClick}
      >
        {intl.formatMessage(messages.createButton)}
      </Button>
    </div>
  );
};

EmptyPlaceholder.propTypes = {
  onCreateClick: PropTypes.func.isRequired,
};

export default EmptyPlaceholder;
