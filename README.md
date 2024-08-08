# data-export-app

## Description
This project is a data export tool designed to retrieve and export entrant and award data from achievements and contests within competitions. It fetches data from contests and achievements with statuses 'Finished' and 'Finalised', navigates through competitions, contests, and associated entrants and awards, and then converts the data into a CSV format for easy saving and analysis.

## Installation
1. Clone this repository to your local machine.
   https://github.com/ziqni-tech/data-export-app
2. Install the required dependencies by running `npm install` in the project directory.

## Usage
### Cloning Steps
Step 1: Set up Credentials
1. In your repository, locate the file named `.env.example`.
2. Rename it to `.env` or create a new file with the same name.
3. Fill in the following credentials in the `.env` file:
    - DATA_SPACE: Name of the space from which data is being exported.
    - USER_NAME: Space login credentials.
    - PASSWORD: Space login credentials.

## Step 2: Export Data from Space

To export data, follow these steps:

1. **Choose the Data to Export**

   You can export data for either awards or entrants. Use the commands below based on the type of data you need:

2. **Run Export Commands**

   - To get awards for contests:
     ```bash
     node ./contests/exportData.js getAwards
     ```

   - To get entrants for contests:
     ```bash
     node ./contests/exportData.js getEntrants
     ```

   - To get awards for achievements:
     ```bash
     node ./achievements/exportData.js getAwards
     ```

   - To get entrants for achievements:
     ```bash
     node ./achievements/exportData.js getEntrants
     ```

3. **Check the Output**

   The exported data will be saved in the `exportedData` directory with the following structure:
   - `exportedData/achievements/awards.csv`
   - `exportedData/achievements/entrants.csv`
   - `exportedData/contests/awards.csv`
   - `exportedData/contests/entrants.csv`

### Configuring Date Range for Contests

For contests, you can specify a date range for `scheduledEndDate` in the `queryData.js` file located in the `utils` directory. This allows you to filter the data based on this date range.

1. Open the `queryData.js` file:
   ```javascript
   // queryData.js
   const greaterThan = '2024-05-10T00:00:00Z';
   const lessThan = '2024-05-11T23:59:59Z';

   module.exports = {
     greaterThan,
     lessThan
   };
   ```
2. **Set** `greaterThan` **to the start of the date range.**
3. **Set** `lessThan` **to the end of the date range.**
4. **If you don't want to apply a date range and want to retrieve all data, you can set** `greaterThan` **and** `lessThan` **to empty strings.**

   The `getDateRange` function will process these values:

   ```javascript
   // utils/getDateRange.js
   module.exports = function getDateRange(greaterThan, lessThan) {
     if (!greaterThan || !lessThan) {
       return null;
     }
     return {
       greaterThan: new Date(greaterThan),
       lessThan: new Date(lessThan)
     };
   };
   ```

