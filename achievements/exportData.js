const { getToken } = require('../axiosInstance');
const writeCsvFile = require('../utils/writeCsvFile');

const entityName = 'achievements';

const exportEntrantsData = async () => {
  try {
    const allAchievements = [];
    const allEntrants = [];
    let totalRecordsFound = 5;
    const limit = 100;
    let skip = 0;
    let recordsReceived = 0;

    const must =
      [
        {
          queryField: 'status',
          queryValues: ['Finished']
        }
      ];

    do {
      const api = await getToken();

      const { data: resultsData } = await api.post('/achievements/query', {
        limit,
        skip,
        must
      });

      const achievements = resultsData.results;
      totalRecordsFound = resultsData.meta.totalRecords;

      for (let i = 0; i < achievements.length; i++) {
        const record = achievements[i];

        // Fetch entrants only if record exists
        if (record) {
          let entrantsSkip = 0;
          let entrantsReceived = 0;
          let totalEntrantsFound = 1;

          do {
            const { data: entrantsData } = await api.post('/entrants/query', {
              should: [{
                queryField: 'participationId',
                queryValues: [record.id]
              }],
              shouldMatch: 1,
              limit: 20,
              skip: entrantsSkip
            });

            const entrants = entrantsData.results;
            totalEntrantsFound = entrantsData.meta.totalRecords;
            entrantsReceived += entrants.length;
            entrantsSkip += 20;

            entrants.forEach(entrant => {
              allEntrants.push({
                achievementId: record.id,
                achievementName: record.name,
                entrantAction: entrant.entrantAction,
                entrantStatus: entrant.entrantStatus,
                memberId: entrant.memberId
              });
            });
          } while (entrantsReceived < totalEntrantsFound);

          // Check if entrants exist
          if (allEntrants.length > 0) {
            record.entrants = allEntrants;
          } else {
            record.entrants = [];
          }
        }

        // Create a new record with only id and entrants
        const filteredRecord = {
          id: record.id,
          entrants: record.entrants
        };

        allAchievements.push(filteredRecord);
      }

      skip += limit;
      recordsReceived += achievements.length;

    } while (recordsReceived < totalRecordsFound && recordsReceived - allAchievements.length < limit);

    console.group('Fetch Info');
    console.log('achievements Found', totalRecordsFound);
    console.log('achievements Received', recordsReceived);
    console.log('achievements with entrants', allAchievements.filter(ach => ach.entrants.length > 0).length);
    console.groupEnd();


    writeCsvFile(entityName, 'entrants', [
      { id: 'achievementId', title: 'Achievement ID' },
      { id: 'achievementName', title: 'Achievement Name' },
      { id: 'entrantAction', title: 'Entrant Action' },
      { id: 'entrantStatus', title: 'Entrant Status' },
      { id: 'memberId', title: 'Member ID' }
    ], allEntrants);
  } catch (e) {
    console.error('Fetch Achievements error => ', e);
  }
};

const exportAwardsData = async () => {
  try {
    const allAchievements = [];
    const allAwards = [];
    let totalRecordsFound = 5;
    const limit = 100;
    let skip = 0;
    let recordsReceived = 0;

    const must =
      [
        {
          queryField: 'status',
          queryValues: ['Finished']
        }
      ];

    do {
      const api = await getToken();

      const { data: resultsData } = await api.post('/achievements/query', {
        limit,
        skip,
        must
      });

      const achievements = resultsData.results;
      totalRecordsFound = resultsData.meta.totalRecords;

      for (let i = 0; i < achievements.length; i++) {
        const record = achievements[i];

        // Fetch awards only if record exists
        if (record) {
          let awardsSkip = 0;
          let awardsReceived = 0;
          let totalAwardsFound = 1;

          do {
            const { data: awardsData } = await api.post('/awards/query', {
              must: [
                {
                  queryField: 'entityType',
                  queryValues: ['Achievement'],
                },
                {
                  queryField: 'entityId',
                  queryValues: [record.id],
                }
              ],
              limit: 20,
              skip: awardsSkip
            });

            const awards = awardsData.results;
            totalAwardsFound = awardsData.meta.totalRecords;
            awardsReceived += awardsData.length;
            awardsSkip += 20;

            awards.forEach(award => {
              allAwards.push({
                achievementId: record.id,
                achievementName: record.name,
                awardId: award.id,
                memberId: award.memberId,
                rewardId: award.rewardId,
                rewardTypeKey: award.rewardType.key,
                rewardTypeId: award.rewardType.id,
                rewardRank: award.rewardRank,
                rewardValue: award.rewardValue,
                memberRefId: award.memberRefId,
                status: award.status
              });
            });
          } while (awardsReceived < totalAwardsFound);

          // Check if awards exist
          if (allAwards.length > 0) {
            record.awards = allAwards;
          } else {
            record.awards = [];
          }
        }

        // Create a new record with only id and awards
        const filteredRecord = {
          id: record.id,
          awards: record.awards
        };

        allAchievements.push(filteredRecord);
      }

      skip += limit;
      recordsReceived += achievements.length;

    } while (recordsReceived < totalRecordsFound && recordsReceived - allAchievements.length < limit);

    console.group('Fetch Info');
    console.log('achievements Found', totalRecordsFound);
    console.log('achievements Received', recordsReceived);
    console.log('achievements with awards', allAchievements.filter(ach => ach.awards.length > 0).length);
    console.groupEnd();

    writeCsvFile(entityName, 'awards', [
      { id: 'achievementId', title: 'Achievement ID' },
      { id: 'achievementName', title: 'Achievement Name' },
      { id: 'awardId', title: 'Award ID' },
      { id: 'memberId', title: 'Member ID' },
      { id: 'rewardId', title: 'Reward ID' },
      { id: 'rewardTypeKey', title: 'Reward Type Key' },
      { id: 'rewardTypeId', title: 'Reward Type ID' },
      { id: 'rewardRank', title: 'Reward Rank' },
      { id: 'rewardValue', title: 'Reward Value' },
      { id: 'memberRefId', title: 'Member Ref ID' },
      { id: 'status', title: 'Status' }
    ], allAwards);
  } catch (e) {
    console.error('Fetch Achievements error => ', e);
  }
};

const args = process.argv.slice(2);

if (args.length > 0) {
  switch (args[0]) {
    case 'getAwards':
      exportAwardsData();
      break;
    case 'getEntrants':
      exportEntrantsData();
      break;
  }
} else {
  console.log('You must specify the function name (create / transform / fetch) in the command line argument! ' +
    'For example - node fileName.js create');
}