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

