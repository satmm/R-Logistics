import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch, FaPlus, FaDownload, FaEdit, FaTrash } from 'react-icons/fa';
import './AdminPage.css';

const AdminPage = () => {
  const [entries, setEntries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({
    driverName: '',
    vehicleNumber: '',
    date: new Date().toISOString().substring(0, 10), // Today's date
    present: true,
    advance: 0,
    cngCost: 0,
    driverSalary: 0,
    remark: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await axios.get('${window.location.origin}/entries');
      setEntries(response.data);
    } catch (error) {
      console.error('Error fetching entries:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'vehicleNumber') {
      setFormData({
        ...formData,
        [name]: value.toUpperCase()
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Submitting form with data:', formData); // Debug log
      if (isEdit) {
        await axios.put(`${window.location.origin}/edit-entry/${formData._id}`, formData);
        setIsEdit(false);
      } else {
        await axios.post('${window.location.origin}/add-entry', formData);
      }
      setShowForm(false);
      fetchEntries();
      resetForm();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleEdit = (entry) => {
    console.log('Editing entry:', entry); // Debug log
    setFormData(entry);
    setIsEdit(true);
    setShowForm(true);
    setSelectedEntry(entry);
  };

  const handleDelete = async () => {
    try {
      if (deleteId) {
        await axios.delete(`${window.location.origin}/delete-entry/${deleteId}`);
        fetchEntries();
        setShowDeleteConfirm(false);
        setDeleteId(null);
      }
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  const handleAddEntry = () => {
    resetForm();
    setIsEdit(false);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      driverName: '',
      vehicleNumber: '',
      date: new Date().toISOString().substring(0, 10),
      present: true,
      advance: 0,
      cngCost: 0,
      driverSalary: 0,
      remark: ''
    });
  };

  const filteredEntries = entries.filter(entry =>
    entry.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const downloadCSV = () => {
    const csvContent = [
      ["Driver Name", "Vehicle Number", "Date", "Present", "Advance", "CNG Cost", "Driver Salary", "Remark"],
      ...entries.map(entry => [
        entry.driverName,
        entry.vehicleNumber,
        entry.date,
        entry.present ? 'Yes' : 'No',
        entry.advance,
        entry.cngCost,
        entry.driverSalary,
        entry.remark
      ])
    ]
    .map(e => e.join(","))
    .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "entries.csv");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="admin-container">
      <div className="header-buttons">
        <button onClick={handleAddEntry}><FaPlus />Add Entry</button>
        <button onClick={downloadCSV}><FaDownload />Download</button>
        <div className="search-container">
          <FaSearch className="search-icon" onClick={() => setShowSearch(!showSearch)} />
          {showSearch && (
            <input
              type="text"
              className="search-input"
              placeholder="Search by Driver or Vehicle"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onBlur={() => setShowSearch(false)}
            />
          )}
        </div>
      </div>
      {showForm && (
        <div className="popup-form">
          <h2>{isEdit ? 'Edit Entry' : 'Add Entry'}</h2>
          <form onSubmit={handleSubmit}>
            <label>Driver Name</label>
            <input name="driverName" value={formData.driverName} onChange={handleChange} required />
            <label>Vehicle Number</label>
            <input name="vehicleNumber" value={formData.vehicleNumber} onChange={handleChange} required />
            <label>Date</label>
            <input name="date" type="date" value={formData.date} onChange={handleChange} required />
            <label>Present</label>
            <select name="present" value={formData.present} onChange={handleChange}>
              <option value={true}>Present</option>
              <option value={false}>Absent</option>
            </select>
            <label>Advance</label>
            <input name="advance" type="number" value={formData.advance} onChange={handleChange} />
            <label>CNG Cost</label>
            <input name="cngCost" type="number" value={formData.cngCost} onChange={handleChange} />
            <label>Driver Salary</label>
            <input name="driverSalary" type="number" value={formData.driverSalary} onChange={handleChange} required />
            <label>Remark</label>
            <input name="remark" value={formData.remark} onChange={handleChange} />
            <button type="submit">{isEdit ? 'Save' : 'Submit'}</button>
            <button type="button" className="cancel-button" onClick={() => setShowForm(false)}>Cancel</button>
          </form>
        </div>
      )}
      {showDeleteConfirm && (
        <div className="popup-confirm">
          <p>Are you sure you want to delete this entry?</p>
          <button onClick={handleDelete}>Yes</button>
          <button onClick={() => setShowDeleteConfirm(false)}>No</button>
        </div>
      )}
      <table>
        <thead>
          <tr>
            <th>Select</th>
            <th>Driver Name</th>
            <th>Vehicle Number</th>
            <th>Date</th>
            <th>Present</th>
            <th>Advance</th>
            <th>CNG Cost</th>
            <th>Driver Salary</th>
            <th>Remark</th>
          </tr>
        </thead>
        <tbody>
          {filteredEntries.map((entry, index) => (
            <tr key={index}>
              <td>
                <input
                  type="checkbox"
                  id={`checkbox-${index}`}
                  onClick={() => {
                    setSelectedEntry(entry);
                    setDeleteId(entry._id);
                  }}
                />
                {selectedEntry && selectedEntry._id === entry._id && (
                  <div className="action-buttons">
                    <FaEdit onClick={() => handleEdit(entry)} />
                    <FaTrash onClick={() => setShowDeleteConfirm(true)} />
                  </div>
                )}
              </td>
              <td>{entry.driverName}</td>
              <td>{entry.vehicleNumber}</td>
              <td>{entry.date}</td>
              <td>{entry.present ? 'Yes' : 'No'}</td>
              <td>{entry.advance}</td>
              <td>{entry.cngCost}</td>
              <td>{entry.driverSalary}</td>
              <td>{entry.remark}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPage;
