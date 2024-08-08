import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { FaSearch, FaDownload } from 'react-icons/fa';
import './UserView.css';

const UserView = () => {
  const [entries, setEntries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await axios.get('http://localhost:5000/entries');
        setEntries(response.data);
      } catch (error) {
        console.error('Error fetching entries', error);
      }
    };
    fetchEntries();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredEntries = entries.filter((entry) =>
    entry.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.date.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(entries);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Entries');
    XLSX.writeFile(workbook, 'entries.xlsx');
  };

  return (
    <div className="user-view-container">
      <h1>Entries</h1>
      <div className="search-download-container">
        <div className="search-bar-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by driver name, vehicle number or date"
            value={searchTerm}
            onChange={handleSearch}
            className="search-bar"
          />
        </div>
        <button className="button-33" onClick={handleDownload}>
          <FaDownload /> Download
        </button>
      </div>
      <div className="table-container">
        <table className="entries-table">
          <thead>
            <tr>
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
            {filteredEntries.map((entry) => (
              <tr key={entry._id}>
                <td>{entry.driverName}</td>
                <td>{entry.vehicleNumber}</td>
                <td>{entry.date}</td>
                <td>{entry.present}</td>
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
    </div>
  );
};

export default UserView;
