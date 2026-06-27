import React, { useState } from 'react';
import './index.css';
import logo from './assets/logo.jpeg';

const UserIcon = () => (
  <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16" style={{ marginRight: '6px' }}>
    <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
  </svg>
);

function App() {
  const [view, setView] = useState('home'); // 'home', 'login', 'result'
  const [regNo, setRegNo] = useState('');
  const [resultData, setResultData] = useState([]);
  const [studentInfo, setStudentInfo] = useState({});

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (regNo.trim()) {
      try {
        const response = await fetch(`/api/results/${regNo}`);
        if (!response.ok) {
          const err = await response.json();
          alert(err.detail || "please entry the vaild register_no");
          return;
        }
        const data = await response.json();
        setResultData(data.results);
        setStudentInfo({
          regNo: data.register_no,
          name: data.student_name || "HARISANKAR S",
          program: "B.E - Electronics and Communication Engineering"
        });
        setView('result');
      } catch (error) {
        alert("Failed to connect to the server. Please ensure the backend is running.");
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (view === 'result') {
    return (
      <div className="result-page">
        <header className="result-header">
          <img src={logo} alt="College Logo" className="result-logo" />
          <div className="result-header-text">
            <h2>K.S.R COLLEGE OF ENGINEERING, TIRUCHENGODE - 637 215</h2>
            <p>(Autonomous)</p>
            <h3>UG & PG END SEMESTER EXAMINATIONS - June 2026</h3>
          </div>
        </header>

        <div className="student-info">
          <div className="info-row">
            <span className="info-label">Register Number</span>
            <span className="info-value">: <span className="blue-text">{studentInfo.regNo || regNo}</span></span>
          </div>
          <div className="info-row">
            <span className="info-label">Name of the Candidate</span>
            <span className="info-value">: <span className="blue-text">{studentInfo.name || 'HARISANKAR S'}</span></span>
          </div>
          <div className="info-row">
            <span className="info-label">Programme</span>
            <span className="info-value">: <span className="blue-text">{studentInfo.program || 'B.E - Electronics and Communication Engineering'}</span></span>
          </div>
        </div>

        <div className="table-responsive">
          <table className="result-table">
            <thead>
              <tr>
                <th>S.NO</th>
                <th>SEMESTER</th>
                <th>COURSE CODE</th>
                <th>COURSE NAME</th>
                <th>GRADE OBTAINED</th>
                <th>RESULT</th>
              </tr>
            </thead>
            <tbody>
              {resultData.map((res, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{res.semester || '3'}</td>
                  <td>{res.subject_code}</td>
                  <td className="left-align">{res.subject_name}</td>
                  <td>{res.grade}</td>
                  <td>{res.Result}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="revaluation-info">
          <p className="rev-title">Revaluation Schedule</p>
          <p className="rev-date">Last date for Applying & Remitting fees for Photocopy is <span className="blue-text">:01-08-2026</span></p>
          <p className="rev-warning">"Utmost care has been taken in publishing the result on website. In case of any error the controller of examination's decision is final."</p>
        </div>

        <div className="result-actions">
          <button className="action-btn" onClick={() => setView('login')}>Back</button>
          <button className="action-btn" onClick={handlePrint}>Print</button>
        </div>
      </div>
    );
  }

  if (view === 'login') {
    return (
      <div className="form-page">
        <header className="form-header">
          <h2 className="form-college">K.S.R COLLEGE OF ENGINEERING</h2>
          <p className="form-auto">(Autonomous)</p>
          <p className="form-coe">Controller of Examinations</p>
          <p className="form-title">UG & PG END SEMESTER EXAMINATIONS RESULTS</p>
        </header>

        <div className="form-container">
          <div className="form-box">
            <label className="form-label">
              <UserIcon />
              Register Number
            </label>
            <form onSubmit={handleLoginSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Enter User Regno"
                value={regNo}
                onChange={(e) => setRegNo(e.target.value)}
                required
              />
              <button type="submit" className="form-submit">Submit</button>
            </form>
            <button className="form-back" onClick={() => setView('home')}>
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <header className="header">
        <h1 className="college-name">K.S.R COLLEGE OF ENGINEERING</h1>
        <p className="autonomous">(Autonomous)</p>
        <p className="address">K.S.R Kalvi Nagar,Tiruchengode - 637 215,Namakkal Dt.Tamilnadu</p>
      </header>

      <main className="main-content">
        <div className="logo-wrapper">
          <img src={logo} alt="K.S.R College of Engineering Logo" className="logo" />
        </div>

        <p className="subtitle">End Semester Examination Results Published for June 2026</p>

        <div className="semester-btn-wrapper">
          <button className="semester-btn" onClick={() => setView('login')}>
            <span className="semester-btn-text">SEMESTER RESULTS</span>
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;
