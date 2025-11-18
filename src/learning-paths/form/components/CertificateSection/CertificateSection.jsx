import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import { getConfig } from '@edx/frontend-platform';
import { Form, Spinner, Alert } from '@openedx/paragon';
import { useFormikContext } from 'formik';
import * as api from '../../../data/api';
import messages from './messages';

/**
 * Certificate Section Component
 *
 * Allows administrators to attach a ProgramCertificate to a learning path.
 * When learners complete the learning path and meet grade requirements,
 * they will automatically receive the selected certificate.
 *
 * Features:
 * - Fetches available certificates from Credentials service
 * - Displays dropdown of active certificates
 * - Shows selected certificate details
 * - Handles loading and error states
 * - Provides link to create new certificates
 */
const CertificateSection = () => {
  const intl = useIntl();
  const { values, setFieldValue, errors, touched } = useFormikContext();
  const [certificates, setCertificates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  // Fetch available certificates on component mount
  useEffect(() => {
    const loadCertificates = async () => {
      setIsLoading(true);
      setFetchError(null);

      try {
        const data = await api.fetchProgramCertificates();
        setCertificates(data || []);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch certificates:', error);
        setFetchError(intl.formatMessage(messages.certificateLoadingError));
      } finally {
        setIsLoading(false);
      }
    };

    loadCertificates();
  }, [intl]);

  // Find details of the currently selected certificate
  const selectedCert = certificates.find(
    (cert) => cert.id === values.programCertificateId,
  );

  return (
    <div className="certificate-section mb-4">
      <h3 className="h5 mb-3">
        {intl.formatMessage(messages.certificateSectionTitle)}
      </h3>

      {/* Error Alert */}
      {fetchError && (
        <Alert variant="warning" dismissible onClose={() => setFetchError(null)}>
          {fetchError}
        </Alert>
      )}

      {/* Certificate Selection Dropdown */}
      <Form.Group className="mb-3">
        <Form.Label>
          {intl.formatMessage(messages.certificateLabel)}
        </Form.Label>

        {isLoading ? (
          <div className="d-flex align-items-center py-2">
            <Spinner animation="border" size="sm" className="mr-2" />
            <span className="ml-2">
              {intl.formatMessage(messages.certificateLoadingText)}
            </span>
          </div>
        ) : (
          <Form.Control
            as="select"
            name="programCertificateId"
            value={values.programCertificateId || ''}
            onChange={(e) => {
              const value = e.target.value === '' ? null : parseInt(e.target.value, 10);
              setFieldValue('programCertificateId', value);
            }}
            isInvalid={touched.programCertificateId && !!errors.programCertificateId}
          >
            <option value="">
              {intl.formatMessage(messages.certificateNone)}
            </option>
            {certificates
              .filter((cert) => cert.isActive)
              .map((cert) => (
                <option key={cert.id} value={cert.id}>
                  {cert.title || `Certificate ${cert.id}`}
                </option>
              ))}
          </Form.Control>
        )}

        {/* Validation Error */}
        {touched.programCertificateId && errors.programCertificateId && (
          <div className="text-danger small mt-1">
            {errors.programCertificateId}
          </div>
        )}

        {/* Help Text */}
        <Form.Text>
          {intl.formatMessage(messages.certificateHelpText)}
        </Form.Text>
      </Form.Group>

      {/* Selected Certificate Details */}
      {selectedCert && (
        <Alert variant="info" className="mb-3">
          <strong>{intl.formatMessage(messages.certificateSelectedLabel)}</strong> {selectedCert.title}
          <br />
          <small>
            {intl.formatMessage(messages.certificateIdLabel)} {selectedCert.id}
          </small>
        </Alert>
      )}

      {/* Note with Link to Credentials Admin */}
      <Alert variant="light" className="mt-3">
        <small>
          <strong>{intl.formatMessage(messages.certificateCreateNote)}</strong>{' '}
          <a
            href={`${getConfig().LMS_BASE_URL}/admin/credentials/programcertificate/add/`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {intl.formatMessage(messages.certificateCredentialsAdmin)}
          </a>
        </small>
      </Alert>
    </div>
  );
};

CertificateSection.propTypes = {};

export default CertificateSection;
