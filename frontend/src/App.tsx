import { useState } from 'react';
import { Upload, FileText, CheckCircle } from 'lucide-react';
import axios from 'axios';

interface ParsedData {
  fileName: string;
  totalPages: number;
  headings: string[];
}

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<ParsedData | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
      setData(null);
    }
  };

  const uploadFile = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const result = await axios.post('https://pdf-docx-reader.onrender.com', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setData(result.data);
    } catch (err) {
      setError('Failed to upload and parse the document. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <FileText size={32} color="#2563eb" />
          <h1 style={styles.title}>Document Upload & Parser</h1>
          <p style={styles.subtitle}>Upload your document to extract structured data</p>
        </div>

        <div style={styles.uploadSection}>
          <label htmlFor="file-input" style={styles.fileInputLabel}>
            <Upload size={20} style={{ marginRight: '8px' }} />
            {file ? file.name : 'Choose a file'}
          </label>
          <input
            id="file-input"
            type="file"
            onChange={handleFileChange}
            style={styles.fileInput}
            accept=".pdf,.doc,.docx,.txt"
          />

          <button
            onClick={uploadFile}
            disabled={!file || isUploading}
            style={{
              ...styles.uploadButton,
              ...((!file || isUploading) && styles.uploadButtonDisabled),
            }}
          >
            {isUploading ? 'Processing...' : 'Upload & Parse'}
          </button>
        </div>

        {error && (
          <div style={styles.errorBox}>
            <p style={styles.errorText}>{error}</p>
          </div>
        )}

        {data && (
          <div style={styles.resultsSection}>
            <div style={styles.successBanner}>
              <CheckCircle size={20} color="#16a34a" />
              <span style={styles.successText}>Document parsed successfully</span>
            </div>

            <div style={styles.dataGrid}>
              <div style={styles.dataItem}>
                <span style={styles.dataLabel}>File Name</span>
                <span style={styles.dataValue}>{data.fileName}</span>
              </div>

              <div style={styles.dataItem}>
                <span style={styles.dataLabel}>Total Pages</span>
                <span style={styles.dataValue}>{data.totalPages}</span>
              </div>
            </div>

            <div style={styles.headingsSection}>
              <h3 style={styles.headingsTitle}>Detected Headings</h3>
              {data.headings.length > 0 ? (
                <ul style={styles.headingsList}>
                  {data.headings.map((heading, index) => (
                    <li key={index} style={styles.headingItem}>
                      {heading}
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={styles.noHeadings}>No headings detected in this document</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8f9fcff',
    padding: '40px 20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  card: {
    maxWidth: '800px',
    margin: '0 auto',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    padding: '48px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1e293b',
    margin: '16px 0 8px',
  },
  subtitle: {
    fontSize: '16px',
    color: '#64748b',
    margin: '0',
  },
  uploadSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginBottom: '32px',
  },
  fileInput: {
    display: 'none',
  },
  fileInputLabel: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px 24px',
    backgroundColor: '#f1f5f9',
    border: '2px dashed #cbd5e1',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '15px',
    color: '#475569',
    fontWeight: '500',
    transition: 'all 0.2s ease',
  },
  uploadButton: {
    padding: '14px 32px',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
  uploadButtonDisabled: {
    backgroundColor: '#94a3b8',
    cursor: 'not-allowed',
  },
  errorBox: {
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '24px',
  },
  errorText: {
    color: '#dc2626',
    margin: '0',
    fontSize: '14px',
  },
  resultsSection: {
    borderTop: '1px solid #e2e8f0',
    paddingTop: '32px',
  },
  successBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#f0fdf4',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '24px',
  },
  successText: {
    color: '#16a34a',
    fontSize: '15px',
    fontWeight: '500',
  },
  dataGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    marginBottom: '32px',
  },
  dataItem: {
    backgroundColor: '#f8fafc',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
  },
  dataLabel: {
    display: 'block',
    fontSize: '13px',
    color: '#64748b',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '8px',
  },
  dataValue: {
    display: 'block',
    fontSize: '20px',
    color: '#1e293b',
    fontWeight: '700',
  },
  headingsSection: {
    backgroundColor: '#f8fafc',
    padding: '24px',
    borderRadius: '8px',
  },
  headingsTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1e293b',
    marginTop: '0',
    marginBottom: '16px',
  },
  headingsList: {
    listStyle: 'none',
    padding: '0',
    margin: '0',
  },
  headingItem: {
    padding: '12px 16px',
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    marginBottom: '8px',
    fontSize: '15px',
    color: '#334155',
    lineHeight: '1.5',
  },
  noHeadings: {
    color: '#64748b',
    fontSize: '14px',
    fontStyle: 'italic',
    margin: '0',
  },
};

export default App;
