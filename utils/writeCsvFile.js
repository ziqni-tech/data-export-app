const fs = require('fs');
const path = require('path');
const { createObjectCsvWriter } = require('csv-writer');

const writeCsvFile = (entityName, fileName, header, records) => {
  const dataDir = path.join('exportedData', entityName);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const csvFile = path.join(dataDir, `${ fileName }.csv`);

  const csvWriter = createObjectCsvWriter({
    path: csvFile,
    header
  });

  csvWriter.writeRecords(records)
    .then(() => {
      console.log(`Data saved to filePath - ${ csvFile }`);
    })
    .catch(error => {
      console.error('Error writing CSV file:', error);
    });
};

module.exports = writeCsvFile;
