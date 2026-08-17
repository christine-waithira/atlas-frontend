import React, { useState, useEffect } from 'react';
import { fetchAssets, deleteAsset } from './api';
import AddAssetModal from './AddAssetModal';
import EditAssetModal from './EditAssetModal';

const AssetList = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modal States
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);

  const loadAssets = async () => {
    try {
      setLoading(true);
      const data = await fetchAssets();
      setAssets(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssets();
  }, []);

  const handleAssetAdded = (newAsset) => {
    setAssets((prev) => [newAsset, ...prev]);
  };

  const handleAssetUpdated = (updatedAsset) => {
    setAssets((prev) =>
      prev.map((a) => (a._id === updatedAsset._id ? updatedAsset : a))
    );
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await deleteAsset(id);
        setAssets((prev) => prev.filter((a) => a._id !== id));
      } catch (err) {
        alert('Failed to delete asset: ' + err.message);
      }
    }
  };

  const handleEditClick = (asset) => {
    setSelectedAsset(asset);
    setIsEditOpen(true);
  };

  // REAL-TIME FILTERING LOGIC
  const filteredAssets = assets.filter((asset) => {
    // Checks if search matches Name, Serial Number, or Type
    const matchesSearch =
      asset.name && asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.serialNumber && asset.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.type && asset.type.toLowerCase().includes(searchTerm.toLowerCase());

    // Checks if status matches selected dropdown filter
    const matchesStatus =
      statusFilter === 'All' || asset.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) return <div>Loading assets...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Asset Inventory</h2>
        <button onClick={() => setIsAddOpen(true)} style={styles.addBtn}>
          + Add New Asset
        </button>
      </div>

      {/* SEARCH AND FILTER BAR */}
      <div style={styles.filterControls}>
        <div style={styles.searchWrapper}>
          <input
            type="text"
            placeholder="🔍 Search by name, serial number, or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <div style={styles.filterWrapper}>
          <label style={styles.filterLabel}>Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={styles.selectInput}
          >
            <option value="All">All Statuses</option>
            <option value="Available">Available</option>
            <option value="In Use">In Use</option>
            <option value="Under Maintenance">Under Maintenance</option>
          </select>
        </div>
      </div>

      <table style={styles.table}>
        <thead>
          <tr style={styles.tr}>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Type</th>
            <th style={styles.th}>Serial Number</th>
            <th style={styles.th}>Location</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAssets.length > 0 ? (
            filteredAssets.map((asset) => (
              <tr key={asset._id} style={styles.tr}>
                <td style={styles.td}>{asset.name}</td>
                <td style={styles.td}>{asset.type}</td>
                <td style={styles.td}>{asset.serialNumber}</td>
                <td style={styles.td}>{asset.location || 'N/A'}</td>
                <td style={styles.td}>
                  <span style={getStatusBadgeStyle(asset.status)}>
                    {asset.status}
                  </span>
                </td>
                <td style={styles.td}>
                  <button onClick={() => handleEditClick(asset)} style={styles.editBtn}
                  > Edit
                  </button>
                  <button onClick={() => handleDelete(asset._id, asset.name)}style={styles.deleteBtn}
                  > Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center', color: '#64748b', fontSize: '14px', padding:'20px'}}>
                No assets found matching your criteria.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Add Modal */}
      <AddAssetModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAssetAdded={handleAssetAdded}
      />

      {/* Edit Modal */}
      <EditAssetModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        asset={selectedAsset}
        onAssetUpdated={handleAssetUpdated}
      />
    </div>
  );
};

const getStatusBadgeStyle = (status) => {
  const base = { padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' };
  switch (status) {
    case 'Available':
      return { ...base, backgroundColor: '#dcfce7', color: '#15803d' };
    case 'In Use':
      return { ...base, backgroundColor: '#e0f2fe', color: '#0369a1' };
    case 'Under Maintenance':
      return { ...base, backgroundColor: '#fef3c7', color: '#b45309' };
    default:
      return { ...base, backgroundColor: '#f1f5f9', color: '#475569' };
  }
};

const styles = {
  container: { backgroundColor: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  addBtn: { backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
  filterControls: { display: 'flex', gap: '16px', marginBottom: '20px', alignItems: 'center', flexWrap: 'wrap' },
  searchWrapper: { flex: 1, minWidth: '240px' },
  searchInput: { width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box' },
  filterWrapper: { display: 'flex', alignItems: 'center', gap: '8px' },
  filterLabel: { fontSize: '13px', fontWeight: 'bold', color: '#475569' },
  selectInput: { padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', backgroundColor: '#fff' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  th: { padding: '12px', borderBottom: '2px solid #e2e8f0', color: '#475569', fontSize: '13px' },
  td: { padding: '12px', borderBottom: '1px solid #e2e8f0', fontSize: '14px' },
  emptyTd: { padding: '24px', textAlign: 'center', color: '#64748b', fontSize: '14px' },
  tr: {},
  editBtn: { padding: '6px 12px', backgroundColor: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: 'pointer', marginRight: '6px', fontSize: '12px' },
  deleteBtn: { padding: '6px 12px', backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' },
};

export default AssetList;