<template>
  <div>
    <h1>Export Data</h1>
    <div class="form">
      <div>
        <label for="dataSpace">Space name:</label>
        <input type="text" v-model="dataSpace" id="dataSpace" required/>
      </div>
      <div class="credentials-label">
        Space login credentials.
      </div>
      <div>
        <label for="username">Username:</label>
        <input type="text" v-model="username" id="username" required/>
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" v-model="password" id="password" required/>
      </div>
      <div>
        <label for="exportType">Export Type:</label>
        <select v-model="exportType" id="exportType" required>
          <option value="" disabled>Select export type</option>
          <option value="achievements">Achievements</option>
          <option value="contests">Contests</option>
        </select>
      </div>
      <div v-if="exportType === 'contests'">
        <div class="date-range-label">Date Range</div>
        <p class="date-range-description">
          <u>To get accurate data, you must fill out both date fields.</u><br/> Use the format YYYY-MM-DD.
          <br/>
          <br/>
          <em>For example, to get contests ending on the 11th, set:</em>
          <br/>
          <span class="example">
            <em>Greater Than: '2024-05-10';</em>
            <br/>
            <em>Less Than: '2024-05-11';</em>
          </span>
        </p>
        <label for="greaterThan">Date Greater Than:</label>
        <input
          type="text"
          v-model="greaterThan"
          id="greaterThan"
          placeholder="YYYY-MM-DD"
        />
        <span v-if="dateErrors.greaterThan" class="error-message">{{ dateErrors.greaterThan }}</span>

        <label for="lessThan">Date Less Than:</label>
        <input
          type="text"
          v-model="lessThan"
          id="lessThan"
          placeholder="YYYY-MM-DD"
        />
        <span v-if="dateErrors.lessThan" class="error-message">{{ dateErrors.lessThan }}</span>
      </div>

      <div v-if="isLoading" class="loading-message">
        Loading, please wait...
      </div>

      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>

      <button :disabled="isLoading" @click.prevent="exportEntrants">Export Entrants</button>
      <button :disabled="isLoading" @click.prevent="exportAwards">Export Awards</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { exportAwardsDataForAchievements, exportEntrantsDataForAchievements } from '@/utils/exportAchievementsData';
import { exportAwardsDataForContests, exportEntrantsDataForContests } from '@/utils/exportContestsData';

const dataSpace = ref('');
const username = ref('');
const password = ref('');

const exportType = ref('achievements');
const greaterThan = ref('');
const lessThan = ref('');

const dateErrors = ref({ greaterThan: '', lessThan: '' });

const isLoading = ref(false);
const errorMessage = ref('');

function isValidDate(dateString) {
  // Check if the date follows YYYY-MM-DD format
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;

  // Parse the date parts
  const [year, month, day] = dateString.split('-').map(Number);

  // Check for invalid month or day
  if (month < 1 || month > 12 || day < 1 || day > 31) return false;

  // Check for valid days in month
  const daysInMonth = new Date(year, month, 0).getDate();
  return day <= daysInMonth;
}

function validateDate(field, value) {
  dateErrors.value[field] = isValidDate(value) ? '' : 'Invalid date format. Use YYYY-MM-DD';
}

const exportAwards = async () => {
  if (exportType.value === 'achievements') {
    isLoading.value = true;
    errorMessage.value = '';

    try {
      await exportAwardsDataForAchievements(dataSpace.value, username.value, password.value);
      // You can also add a success message here
      console.log('Data export complete!');
    } catch (error) {
      errorMessage.value = 'An error occurred while fetching achievements data. Please try again.';
      console.error('Fetch Achievements error => ', error);
    } finally {
      isLoading.value = false;
    }
  } else {
    // Validate dates
    if (greaterThan.value) validateDate('greaterThan', greaterThan.value);
    if (lessThan.value) validateDate('lessThan', lessThan.value);

    if (dateErrors.value.greaterThan || dateErrors.value.lessThan) {
      // If there's an error, display the error messages (you should handle this in your template)
      console.log(dateErrors.value);
      return;
    }

    // Format dates
    const formattedGreaterThan = greaterThan.value ? `${ greaterThan.value }T00:00:00Z` : '';
    const formattedLessThan = lessThan.value ? `${ lessThan.value }T23:59:59Z` : '';

    isLoading.value = true;
    errorMessage.value = '';

    try {
      await exportAwardsDataForContests(dataSpace.value, username.value, password.value, formattedGreaterThan, formattedLessThan);
      console.log('Data export complete!');
    } catch (error) {
      errorMessage.value = 'An error occurred while fetching contest data. Please try again.';
      console.error('Fetch Contests error => ', error);
    } finally {
      isLoading.value = false;
    }
  }
};

const exportEntrants = async () => {
  if (exportType.value === 'achievements') {
    isLoading.value = true;
    errorMessage.value = '';

    try {
      await exportEntrantsDataForAchievements(dataSpace.value, username.value, password.value);
      // You can also add a success message here
      console.log('Data export complete!');
    } catch (error) {
      errorMessage.value = 'An error occurred while fetching achievements data. Please try again.';
      console.error('Fetch Achievements error => ', error);
    } finally {
      isLoading.value = false;
    }
  } else {
    // Validate dates
    if (greaterThan.value) validateDate('greaterThan', greaterThan.value);
    if (lessThan.value) validateDate('lessThan', lessThan.value);

    if (dateErrors.value.greaterThan || dateErrors.value.lessThan) {
      // If there's an error, display the error messages (you should handle this in your template)
      console.log(dateErrors.value);
      return;
    }

    // Format dates
    const formattedGreaterThan = greaterThan.value ? `${ greaterThan.value }T00:00:00Z` : '';
    const formattedLessThan = lessThan.value ? `${ lessThan.value }T23:59:59Z` : '';

    isLoading.value = true;
    errorMessage.value = '';

    try {
      await exportEntrantsDataForContests(dataSpace.value, username.value, password.value, formattedGreaterThan, formattedLessThan);
      console.log('Data export complete!');
    } catch (error) {
      errorMessage.value = 'An error occurred while fetching contest data. Please try again.';
      console.error('Fetch Contests error => ', error);
    } finally {
      isLoading.value = false;
    }
  }
};

</script>


<style scoped>

.form {
  background-color: #f0f0f5;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  margin: 0 auto;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #555;
}

.credentials-label {
  font-size: 16px;
  font-weight: bold;
  color: #555;
  margin: 15px 0;
  text-align: center;
}

.date-range-label {
  font-size: 18px;
  font-weight: bold;
  color: #555;
  margin-bottom: 10px;
  text-align: center;
}

.date-range-description {
  font-size: 14px;
  color: #555;
  margin-bottom: 15px;
}

.example {
  font-weight: bold;
  border-radius: 4px;
  display: inline-block;
}

input[type="text"],
input[type="password"],
select {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 15px;
  border: 1px solid #ccc;
  box-sizing: border-box;
  background-color: #ffffff;
}

input[type="text"]:focus,
input[type="password"]:focus,
select:focus {
  outline: none;
  border-color: #888;
}

.error-message {
  color: red;
  font-size: 14px;
  margin-top: -10px;
  margin-bottom: 5px;
}

button {
  width: 100%;
  padding: 10px;
  border-radius: 15px;
  border: none;
  background-color: #4caf50;
  color: white;
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 10px;
  transition: background-color 0.3s ease;
}

.loading-message {
  color: #007bff;
  font-weight: bold;
  margin-bottom: 15px;
}

.error-message {
  color: #dc3545;
  font-weight: bold;
  margin-bottom: 15px;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

button:hover {
  background-color: #45a049;
}

button:last-child {
  background-color: #2196f3;
}

button:last-child:hover {
  background-color: #1e88e5;
}
</style>
