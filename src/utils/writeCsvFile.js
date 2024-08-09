export const writeCsvFile = (entityName, fileName, header, records) => {

  const headerLine = header.map(col => col.title).join(',');

  const csvData = records.map(record =>
    header.map(col => record[col.id]).join(',')
  ).join('\n');

  const csvContent = `${headerLine}\n${csvData}`;

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${entityName}_${fileName}.csv`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  console.log(`Data saved as ${entityName}_${fileName}.csv`);
};
