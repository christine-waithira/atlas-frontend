import React, { useState, useEffect } from 'react';
import { fetchTickets, createTicket, fetchAssets, updateTicketStatus } from './api';

const TicketManager = () => {
  const [tickets, setTickets] = useState([]);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedAsset, setSelectedAsset] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [ticketsData, assetsData] = await Promise.all([
        fetchTickets().catch(() => []),
        fetchAssets().catch(() => [])
      ]);
      setTickets(ticketsData);
      setAssets(assetsData);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Title is required');
      return;
    }
    if (!description.trim()) {
      alert('Description is required');
      return;
    }
    if (!selectedAsset) {
      alert('Please select an asset before submitting.');
      return;
    }
  const assetId = typeof selectedAsset === 'object' ? selectedAsset._id : selectedAsset;

    setIsSubmitting(true);
    try {
      const newTicket = await createTicket({
        title: title.trim(),
        description: description.trim(),
        asset: assetId,
        priority,
        status: 'Open'
      });
      setTickets((prev) => [newTicket, ...prev]);
      
      setTitle('');
      setDescription('');
      setSelectedAsset('');
      setPriority('Medium');
      alert('Ticket submitted successfully');
    } catch (err) {
      console.error('Failed to submit ticket', err);
      alert(err.message || 'Failed to submit ticket');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      const updated = await updateTicketStatus(ticketId, newStatus);
      setTickets((prev) =>
        prev.map((t) => (t._id === ticketId || t.id === ticketId ? { ...t, status: updated.status } : t))
      );
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || ticket.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div style={styles.container}>
      <h2>IT Support Tickets</h2>

      <form onSubmit={handleSubmit} style={styles.formCard}>
        <h3>Log New Ticket</h3>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Issue Title</label>
          <input
            type="text"
            placeholder="e.g. Screen flickering / OS corrupt"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.row}>
          <div style={{ flex: 1 }}>
            <label style={styles.label}>Related Asset</label>
            <select
              value={selectedAsset}
              onChange={(e) => setSelectedAsset(e.target.value)}
              style={styles.input}
              required
            >
              <option value="">-- Select an Asset (Required) --</option>
              {assets.map((asset) => (
                <option key={asset._id || asset.id} value={asset._id || asset.id}>
                  {asset.name} ({asset.serialNumber || asset._id || asset.id})
                </option>
              ))}
            </select>
          </div>

          <div style={{ flex: 1 }}>
            <label style={styles.label}>Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              style={styles.input}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Description</label>
          <textarea
            rows="3"
            placeholder="Describe the issue in detail..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ ...styles.input, resize: 'vertical' }}
          />
        </div>

        <button type="submit" disabled={isSubmitting} style={styles.submitBtn}>
          {isSubmitting ? 'Submitting...' : 'Submit Support Ticket'}
        </button>
      </form>

      {/* Search & Filter Bar */}
      <div style={styles.filterBar}>
        <input
          type="text"
          placeholder=" Search tickets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={styles.filterSelect}
        >
          <option value="All">All Statuses</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>
      </div>

      <h3 style={{ marginTop: '20px' }}>Active Tickets</h3>
      {loading ? (
        <p>Loading tickets...</p>
      ) : filteredTickets.length === 0 ? (
        <p style={{ color: '#777', fontStyle: 'italic' }}>No tickets match your search.</p>
      ) : (
        <div style={styles.ticketGrid}>
          {filteredTickets.map((ticket) => (
            <div key={ticket._id || ticket.id} style={styles.ticketCard}>
              <div style={styles.ticketHeader}>
                <h4 style={{ margin: 0 }}>{ticket.title}</h4>
                <span
                  style={{
                    ...styles.priorityBadge,
                    backgroundColor: ticket.priority === 'Critical' ? '#fce8e6' : ticket.priority === 'High' ? '#fef7e0' : '#e8f0fe',
                    color: ticket.priority === 'Critical' ? '#c5221f' : ticket.priority === 'High' ? '#b06000' : '#1a73e8',
                  }}
                >
                  {ticket.priority} Priority
                </span>
              </div>
              <p style={{ fontSize: '13px', color: '#555', margin: '8px 0' }}>{ticket.description || 'No description provided.'}</p>
              
              <div style={styles.ticketFooter}>
                <label style={{ fontSize: '12px', fontWeight: 'bold' }}>
                  Status:{' '}
                  <select
                    value={ticket.status || 'Open'}
                    onChange={(e) => handleStatusChange(ticket._id || ticket.id, e.target.value)}
                    style={styles.statusDropdown}
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </label>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { padding: '24px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'sans-serif' },
  formCard: { backgroundColor: '#f9f9f9', border: '1px solid #e0e0e0', padding: '20px', borderRadius: '8px' },
  inputGroup: { marginBottom: '12px' },
  row: { display: 'flex', gap: '12px', marginBottom: '12px' },
  label: { display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px', color: '#444' },
  input: { width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' },
  submitBtn: { padding: '10px 18px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
  filterBar: { display: 'flex', gap: '12px', marginTop: '24px' },
  searchInput: { flex: 1, padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc' },
  filterSelect: { padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#fff' },
  ticketGrid: { display: 'flex', flexDirection: 'column', gap: '12px' },
  ticketCard: { backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: '6px', padding: '16px' },
  ticketHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  priorityBadge: { fontSize: '12px', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold' },
  ticketFooter: { marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  statusDropdown: { padding: '4px 8px', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#f0f0f0', fontWeight: 'bold' }
};

export default TicketManager;