const { getToken } = require('../axiosInstance');
const writeCsvFile = require('../utils/writeCsvFile');

const entityName = 'contests';

const exportEntrantsData = async () => {
  try {
    const allCompetitions = [];
    const allEntrants = [];
    let totalRecordsFound = 5;
    const limit = 100;
    let skip = 0;
    let recordsReceived = 0;

    const must = [
      {
        queryField: 'status',
        queryValues: ['Active', 'Finished', 'Finalised']
      }
    ];

    do {
      const api = await getToken();

      const { data: resultsData } = await api.post('/competitions/query', {
        limit,
        skip,
        must
      });

      const competitions = resultsData.results;

      totalRecordsFound = resultsData.meta.totalRecords;

      for (let i = 0; competitions.length && i < competitions.length; i++) {
        const competition = competitions[i];

        // Fetch contests for each competition
        let contestsSkip = 0;
        let contestsReceived = 0;
        let totalContestsFound = 1;

        //scheduledEndDate:"2024-08-10T00:00:00.000Z"

        do {
          const { data: contestsData } = await api.post('/contests/query', {
            must: [
              {
                queryField: 'competitionId',
                queryValues: [competition.id]
              },
              {
                queryField: 'status',
                queryValues: ['Finalised', 'Finished']
              },
              // {
              //   queryFields: ['scheduledEndDate'],
              //   queryValue: '2024-08-10'
              // }
            ],
            limit: 20,
            skip: contestsSkip
          });

          const contests = contestsData.results;

          totalContestsFound = contestsData.meta.totalRecords;
          contestsReceived += contests.length;
          contestsSkip += 20;

          for (let j = 0; contests.length && j < contests.length; j++) {
            const contest = contests[j];

            // Fetch entrants for each contest
            let entrantsSkip = 0;
            let entrantsReceived = 0;
            let totalEntrantsFound = 1;

            do {
              const { data: entrantsData } = await api.post('/entrants/query', {
                must: [{
                  queryField: 'participationId',
                  queryValues: [contest.id]
                }],
                limit: 20,
                skip: entrantsSkip
              });

              const entrants = entrantsData.results;

              totalEntrantsFound = entrantsData.meta.totalRecords;
              entrantsReceived += entrants.length;
              entrantsSkip += 20;

              entrants.forEach(entrant => {
                allEntrants.push({
                  competitionId: competition.id,
                  competitionName: competition.name,
                  contestId: contest.id,
                  contestName: contest.name,
                  entrantAction: entrant.entrantAction,
                  entrantStatus: entrant.entrantStatus,
                  memberId: entrant.memberId
                });
              });
            } while (entrantsReceived < totalEntrantsFound);
          }
        } while (contestsReceived < totalContestsFound);

        // Create a new record with only id, name, contests and entrants
        const filteredRecord = {
          id: competition.id,
          name: competition.name,
          entrants: allEntrants.filter(e => e.competitionId === competition.id)
        };

        allCompetitions.push(filteredRecord);
      }

      skip += limit;
      recordsReceived += competitions.length;

    } while (recordsReceived < totalRecordsFound);

    console.group('Fetch Info');
    console.log('competitions Found', totalRecordsFound);
    console.log('competitions Received', recordsReceived);
    console.log('competitions with entrants', allCompetitions.filter(comp => comp.entrants.length > 0).length);
    console.groupEnd();

    writeCsvFile(entityName, 'entrants', [
      { id: 'competitionId', title: 'Competition ID' },
      { id: 'competitionName', title: 'Competition Name' },
      { id: 'contestId', title: 'Contest ID' },
      { id: 'contestName', title: 'Contest Name' },
      { id: 'entrantAction', title: 'Entrant Action' },
      { id: 'entrantStatus', title: 'Entrant Status' },
      { id: 'memberId', title: 'Member ID' }
    ], allEntrants);
  } catch (e) {
    console.error('Fetch competitions error => ', e.response.data.errors);
  }
};

const exportAwardsData = async () => {
  try {
    const allCompetitions = [];
    const allAwards = [];
    let totalRecordsFound = 5;
    const limit = 100;
    let skip = 0;
    let recordsReceived = 0;

    const must = [
      {
        queryField: 'status',
        queryValues: ['Active', 'Finished', 'Finalised']
      }
    ];

    do {
      const api = await getToken();

      const { data: resultsData } = await api.post('/competitions/query', {
        limit,
        skip,
        must
      });

      const competitions = resultsData.results;
      totalRecordsFound = resultsData.meta.totalRecords;

      for (let i = 0; competitions.length && i < competitions.length; i++) {
        const competition = competitions[i];

        // Fetch contests for each competition
        let contestsSkip = 0;
        let contestsReceived = 0;
        let totalContestsFound = 1;

        do {
          const { data: contestsData } = await api.post('/contests/query', {
            must: [
              {
                queryField: 'competitionId',
                queryValues: [competition.id]
              },
              {
                queryField: 'status',
                queryValues: ['Finalised', 'Finished']
              }
            ],
            limit: 20,
            skip: contestsSkip
          });

          const contests = contestsData.results;
          totalContestsFound = contestsData.meta.totalRecords;
          contestsReceived += contests.length;
          contestsSkip += 20;

          for (let j = 0; contests.length && j < contests.length; j++) {
            const contest = contests[j];

            // Fetch awards for each contest
            let awardsSkip = 0;
            let awardsReceived = 0;
            let totalAwardsFound = 1;

            do {
              const { data: awardsData } = await api.post('/awards/query', {
                must: [
                  {
                    queryField: 'entityType',
                    queryValues: ['Contest']
                  },
                  {
                    queryField: 'entityId',
                    queryValues: [contest.id]
                  }
                ],
                limit: 20,
                skip: awardsSkip
              });

              const awards = awardsData.results;
              totalAwardsFound = awardsData.meta.totalRecords;
              awardsReceived += awards.length;
              awardsSkip += 20;

              awards.forEach(award => {
                allAwards.push({
                  competitionId: competition.id,
                  competitionName: competition.name,
                  contestId: contest.id,
                  contestName: contest.name,
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
          }
        } while (contestsReceived < totalContestsFound);

        // Create a new record with only id, name, contests and awards
        const filteredRecord = {
          id: competition.id,
          name: competition.name,
          awards: allAwards.filter(a => a.competitionId === competition.id)
        };

        allCompetitions.push(filteredRecord);
      }

      skip += limit;
      recordsReceived += competitions.length;

    } while (recordsReceived < totalRecordsFound);

    console.group('Fetch Info');
    console.log('competitions Found', totalRecordsFound);
    console.log('competitions Received', recordsReceived);
    console.log('competitions with awards', allCompetitions.filter(comp => comp.awards.length > 0).length);
    console.groupEnd();

    writeCsvFile(entityName, 'awards', [
      { id: 'competitionId', title: 'Competition ID' },
      { id: 'competitionName', title: 'Competition Name' },
      { id: 'contestId', title: 'Contest ID' },
      { id: 'contestName', title: 'Contest Name' },
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
    console.error('Fetch competitions error => ', e.response.data.errors);
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
