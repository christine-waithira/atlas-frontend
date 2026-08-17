import React, { useState, useEffect } from 'react';
import { updateAsset } from './api';

const EditAssetModal = ({ isOpen, onClose, asset, onAssetUpdated }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('Laptop');
  const [serialNumber, setSerialNumber] = useState('');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState('Available');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Pre-fills form fields whenever an asset is selected for editing
  useEffect(() => {
    if (asset) {
      setName(asset.name || '');
      setType(asset.type || 'Laptop');
      setSerialNumber(asset.serialNumber || '');
      setLocation(asset.location || '');
      setStatus(asset.status || 'Available');
    }
  }, [asset]);

  if (!isOpen || !asset) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const updated = await updateAsset(asset._id, {
        name,
        type,
        serialNumber,
        status,
        location,
      });

      onAssetUpdated(updated);
      onClose();
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3 style={{ marginTop: 0 }}>Edit Asset</h3>

        {errorMessage && (
          <div style={styles.errorBox}>
            <strong>Error:</strong> {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={styles.group}>
            <label style={styles.label}>Asset Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.group}>
            <label style={styles.label}>Asset Type *</label>
            <select value={type} onChange={(e) => setType(e.target.value)} style={styles.input}>
              <option value="Laptop">Laptop</option>
              <option value="Desktop">Desktop</option>
              <option value="Printer">Printer</option>
              <option value="Scanner">Scanner</option>
              <option value="Networking">Networking</option>
            </select>
          </div>

          <div style={styles.group}>
            <label style={styles.label}>Serial Number *</label>
            <input
              type="text"
              required
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.group}>
            <label style={styles.label}>Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.group}>
            <label style={styles.label}>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} style={styles.input}>
              <option value="Available">Available</option>
              <option value="In Use">In Use</option>
              <option value="Under Maintenance">Under Maintenance</option>
            </select>
          </div>

          <div style={styles.actions}>
            <button type="button" onClick={onClose} style={styles.cancelBtn}>
              Cancel
            </button>
            <button type="submit" disabled={loading} style={styles.submitBtn}>
              {loading ? 'Saving...' : 'Update Asset'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: '#fff',
    padding: '24px',
    borderRadius: '8px',
    width: '400px',
    maxWidth: '90%',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  },
  errorBox: {
    padding: '10px',
    backgroundColor: '#fce8e6',
    color: '#c5221f',
    borderRadius: '4px',
    fontSize: '13px',
    marginBottom: '14px',
    border: '1px solid #f5c6cb',
  },
  group: { marginBottom: '14px' },
  label: { display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px', color: '#333' },
  input: { width: '100%', padding: '8px 10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' },
  actions: { display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '20px' },
  cancelBtn: { padding: '8px 14px', border: '1px solid #ccc', backgroundColor: '#fff', borderRadius: '4px', cursor: 'pointer' },
  submitBtn: { padding: '8px 14px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
};

export default EditAssetModal;