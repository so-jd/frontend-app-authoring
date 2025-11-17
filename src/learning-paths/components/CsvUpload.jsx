import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  Button,
  Alert,
  Spinner,
  Icon,
  DataTable,
} from '@openedx/paragon';
import { FileUpload, Download } from '@openedx/paragon/icons';
import messages from '../messages';

const CsvUpload = ({ onDataParsed, onError }) => {
  const intl = useIntl();
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [fileName, setFileName] = useState('');

  const parseCSV = (text) => {
    const lines = text.trim().split('\n');
    if (lines.length === 0) {
      return { headers: [], rows: [] };
    }

    const headers = lines[0].split(',').map((h) => h.trim());
    const rows = lines.slice(1).map((line) => {
      const values = line.split(',').map((v) => v.trim());
      const row = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      return row;
    });

    return { headers, rows };
  };

  const handleFileUpload = useCallback(async (file) => {
    if (!file) {
      return;
    }

    if (!file.name.endsWith('.csv')) {
      onError('Please upload a CSV file');
      return;
    }

    setIsProcessing(true);
    setFileName(file.name);

    try {
      const text = await file.text();
      const { headers, rows } = parseCSV(text);

      if (!headers.includes('email')) {
        onError('CSV must contain an "email" column');
        setIsProcessing(false);
        return;
      }

      const emails = rows.map((row) => row.email).filter((email) => email);
      const learningPaths = rows
        .map((row) => row.learning_path_key)
        .filter((key) => key);

      setPreviewData({
        headers,
        rows: rows.slice(0, 10),
        totalRows: rows.length,
      });

      onDataParsed({ emails, learningPaths });
    } catch (error) {
      onError(`Failed to parse CSV: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  }, [onDataParsed, onError]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const downloadTemplate = () => {
    const csvContent = 'email,learning_path_key\nuser@example.com,path-v1:ORG+NUM+RUN+GRP\n';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bulk_enrollment_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="csv-upload-container">
      <div className="mb-3">
        <Button
          variant="link"
          iconBefore={Download}
          onClick={downloadTemplate}
          size="sm"
        >
          {intl.formatMessage(messages.bulkEnrollCsvDownloadTemplate)}
        </Button>
        <p className="small text-muted mt-1">
          {intl.formatMessage(messages.bulkEnrollCsvFormatHelp)}
        </p>
      </div>

      <div
        className={`csv-dropzone ${isDragging ? 'dragging' : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        style={{
          border: '2px dashed #ccc',
          borderRadius: '8px',
          padding: '2rem',
          textAlign: 'center',
          backgroundColor: isDragging ? '#f0f0f0' : '#fafafa',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
      >
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          id="csv-file-input"
          disabled={isProcessing}
        />
        <label
          htmlFor="csv-file-input"
          style={{
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {isProcessing ? (
            <>
              <Spinner animation="border" size="sm" className="mb-2" />
              <p className="text-muted mb-0">Processing...</p>
            </>
          ) : (
            <>
              <Icon src={FileUpload} className="mb-2" style={{ fontSize: '2rem' }} />
              <p className="mb-0">
                {intl.formatMessage(messages.bulkEnrollCsvDragDrop)}
              </p>
              {fileName && (
                <p className="small text-muted mt-2 mb-0">
                  Current file: {fileName}
                </p>
              )}
            </>
          )}
        </label>
      </div>

      {previewData && (
        <Alert variant="info" className="mt-3">
          <h5 className="mb-3">
            {intl.formatMessage(messages.bulkEnrollCsvPreviewTitle)}
          </h5>
          <p className="small mb-2">
            {intl.formatMessage(messages.bulkEnrollCsvRowsFound, {
              count: previewData.totalRows,
            })}
          </p>
          <DataTable
            data={previewData.rows}
            columns={previewData.headers.map((header) => ({
              Header: header,
              accessor: header,
            }))}
            itemCount={previewData.rows.length}
          >
            <DataTable.Table />
          </DataTable>
        </Alert>
      )}
    </div>
  );
};

CsvUpload.propTypes = {
  onDataParsed: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
};

export default CsvUpload;
