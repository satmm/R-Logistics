import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaDownload, FaEdit, FaTrash } from 'react-icons/fa';
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
    shiftTo: '',
    billTo: '',
    partyRate: 0,
    gstPercent: 0,
    vehicleRate: 0,
    remark: ''
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEntries, setSelectedEntries] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchEntries();
  }, []);

  useEffect(() => {
    if (selectedEntries.length === 0) {
      setShowDeleteConfirm(false);
      setDeleteId(null);
    }
  }, [selectedEntries]);

  const fetchEntries = async () => {
    try {
      const response = await axios.get('http://localhost:5000/entries');
      setEntries(response.data);
    } catch (error) {
      console.error('Error fetching entries:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'number') {
      setFormData({
        ...formData,
        [name]: parseFloat(value)
      });
    } else if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: name === 'vehicleNumber' ? value.toUpperCase() : value
      });
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await axios.put(`http://localhost:5000/edit-entry/${formData._id}`, formData);
        setIsEdit(false);
      } else {
        await axios.post('http://localhost:5000/add-entry', formData);
      }
      setShowForm(false);
      fetchEntries();
      resetForm();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };
  

  const handleEdit = (entry) => {
    setFormData(entry);
    setIsEdit(true);
    setShowForm(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/delete-entry/${deleteId}`);
      fetchEntries();
      setShowDeleteConfirm(false);
      setDeleteId(null);
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      driverName: '',
      vehicleNumber: '',
      date: new Date().toISOString().substring(0, 10), // Reset to today's date
      present: true,
      advance: 0,
      cngCost: 0,
      driverSalary: 0,
      shiftTo: '',
      billTo: '',
      partyRate: 0,
      gstPercent: 0,
      vehicleRate: 0,
      remark: ''
    });
  };

  const handleCheckboxChange = (entry) => {
    const isChecked = selectedEntries.includes(entry._id);
    if (isChecked) {
      setSelectedEntries(selectedEntries.filter((id) => id !== entry._id));
    } else {
      setSelectedEntries([...selectedEntries, entry._id]);
    }
  };

  const downloadCSV = () => {
    const headers = [
      'Driver Name', 'Vehicle Number', 'Date', 'Present', 'Advance', 'CNG Cost', 
      'Driver Salary', 'Shift To', 'Bill To', 'Party Rate', 'GST %', 'Vehicle Rate', 'Remark'
    ];
    const rows = entries.map((entry) => [
      entry.driverName,
      entry.vehicleNumber,
      entry.date,
      entry.present ? 'Yes' : 'No',
      entry.advance,
      entry.cngCost,
      entry.driverSalary,
      entry.shiftTo,
      entry.billTo,
      entry.partyRate,
      entry.gstPercent,
      entry.vehicleRate,
      entry.remark
    ]);

    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += headers.join(',') + '\r\n';
    rows.forEach((row) => {
      csvContent += row.join(',') + '\r\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'entries.csv');
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="admin-container">
      <div className="header-buttons">
        <button className="button-33" onClick={() => {
          setShowForm(true);
          resetForm();
        }}>
          <FaPlus /> Add Entry
        </button>
        <button className="button-33" onClick={downloadCSV}>
          <FaDownload /> Download
        </button>
        {selectedEntries.length === 1 && (
          <FaEdit onClick={() => handleEdit(entries.find(entry => entry._id === selectedEntries[0]))} />
        )}
        {selectedEntries.length > 0 && (
          <FaTrash onClick={() => {
            if (selectedEntries.length === 1) {
              setShowDeleteConfirm(true);
              setDeleteId(selectedEntries[0]);
            }
          }} />
        )}
      </div>
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search by Driver Name, Vehicle Number, or Date"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Driver Name</th>
              <th>Vehicle Number</th>
              <th>Date</th>
              <th>Present</th>
              <th>Advance</th>
              <th>CNG Cost</th>
              <th>Driver Salary</th>
              <th>Shift To</th>
              <th>Bill To</th>
              <th>Party Rate</th>
              <th>GST %</th>
              <th>Vehicle Rate</th>
              <th>Remark</th>
            </tr>
          </thead>
          <tbody>
            {entries
              .filter(entry => 
                entry.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                entry.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                entry.date.includes(searchTerm)
              )
              .map(entry => (
                <tr key={entry._id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedEntries.includes(entry._id)}
                      onChange={() => handleCheckboxChange(entry)}
                    />
                  </td>
                  <td>{entry.driverName}</td>
                  <td>{entry.vehicleNumber}</td>
                  <td>{entry.date}</td>
                  <td>{entry.present ? 'Yes' : 'No'}</td>
                  <td>{entry.advance}</td>
                  <td>{entry.cngCost}</td>
                  <td>{entry.driverSalary}</td>
                  <td>{entry.shiftTo}</td>
                  <td>{entry.billTo}</td>
                  <td>{entry.partyRate}</td>
                  <td>{entry.gstPercent}</td>
                  <td>{entry.vehicleRate}</td>
                  <td>{entry.remark}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {showForm && (
        <div className="popup-form">
          <h2>{isEdit ? 'Edit Entry' : 'Add Entry'}</h2>
          <form onSubmit={handleSubmit}>
            <label>
              Driver Name:
              <input
                type="text"
                name="driverName"
                value={formData.driverName}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Vehicle Number:
              <input
                type="text"
                name="vehicleNumber"
                value={formData.vehicleNumber}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Date:
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Present:
              <select
                name="present"
                value={formData.present}
                onChange={handleChange}
                required
              >
                <option value={true}>Yes</option>
                <option value={false}>No</option>
              </select>
            </label>
            <label>
              Advance:
              <input
                type="number"
                name="advance"
                value={formData.advance}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              CNG Cost:
              <input
                type="number"
                name="cngCost"
                value={formData.cngCost}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Driver Salary:
              <input
                type="number"
                name="driverSalary"
                value={formData.driverSalary}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Shift To:
              <input
                type="text"
                name="shiftTo"
                value={formData.shiftTo}
                onChange={handleChange}
              />
            </label>
            <label>
              Bill To:
              <input
                type="text"
                name="billTo"
                value={formData.billTo}
                onChange={handleChange}
              />
            </label>
            <label>
              Party Rate:
              <input
                type="number"
                name="partyRate"
                value={formData.partyRate}
                onChange={handleChange}
              />
            </label>
            <label>
              GST %:
              <input
                type="number"
                name="gstPercent"
                value={formData.gstPercent}
                onChange={handleChange}
              />
            </label>
            <label>
              Vehicle Rate:
              <input
                type="number"
                name="vehicleRate"
                value={formData.vehicleRate}
                onChange={handleChange}
              />
            </label>
            <label>
              Remark:
              <input
                type="text"
                name="remark"
                value={formData.remark}
                onChange={handleChange}
              />
            </label>
            <button type="submit">
              {isEdit ? 'Update Entry' : 'Add Entry'}
            </button>
            <button type="button" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </form>
        </div>
      )}
      {showDeleteConfirm && (
        <div className="confirmation-popup">
          <p>Are you sure you want to delete the selected entry?</p>
          <button onClick={handleDelete}>Yes</button>
          <button onClick={() => setShowDeleteConfirm(false)}>No</button>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
