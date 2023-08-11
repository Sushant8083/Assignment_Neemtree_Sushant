const exceljs = require('exceljs');
const async = require('async');
const Candidate = require('../models/candidate');

// Define the mapping between Excel columns and schema fields
const columnToFieldMapping = {
  A: 'name',
  B: 'email',
  C: 'mobileNo',
  D: 'dateOfBirth',
  E: 'workExperience',
  F: 'resumeTitle',
  G: 'currentLocation',
  H: 'postalAddress',
  I: 'currentEmployer',
  J: 'currentDesignation'
};

const addCandidateFromRow = async (rowData) => {
  try {
    const candidateData = {};
    for (const [column, field] of Object.entries(columnToFieldMapping)) {
      const columnIndex = column.charCodeAt(0) - 64; // Convert column letter to index
      candidateData[field] = rowData[columnIndex];
    }

    const candidate = new Candidate(candidateData);
    await candidate.save();
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.email === 1) {
      // Duplicate email key error
      return { success: false, message: 'Email already exists' };
    }
    throw error;
  }
};

exports.uploadExcel = (req, res) => {
  const buffer = req.file.buffer;

  const workbook = new exceljs.Workbook();
  workbook.xlsx.load(buffer).then(() => {
    const worksheet = workbook.getWorksheet(1);
    const data = [];

    worksheet.eachRow((row) => {
      if (row.number !== 1) {
        data.push(row.values);
      }
    });

    async.eachSeries(data, addCandidateFromRow, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'An error occurred' });
      }
      return res.status(200).json({ message: 'Candidates added successfully' });
    });
  });
};
