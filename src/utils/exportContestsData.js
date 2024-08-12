import { getApiInstance, stopTokenRefresh }  from '../axiosInstance';
import { writeCsvFile } from './writeCsvFile';
import { getDateRange } from './dateRange';

const entityName = 'contests';

export const exportEntrantsDataForContests = async (dataSpace, username, password, greaterThan, lessThan) => {
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

    const dateRange = getDateRange(greaterThan, lessThan);

    do {
      const api = await getApiInstance(dataSpace, username, password);

      const { data: resultsData } = await api.post('/competitions/query', {
        limit,
        skip,
        must,
      });

      const competitions = resultsData.results;

      totalRecordsFound = resultsData.meta.totalRecords;

      for (let i = 0; competitions.length && i < competitions.length; i++) {
        const competition = competitions[i];

        // Fetch contests for each competition
        let contestsSkip = 0;
        let contestsReceived = 0;
        let totalContestsFound = 1;

        const rangeFilter = dateRange
          ? [
            {
              queryField: 'options.scheduledDates.end',
              gt: dateRange.greaterThan,
              constraints: []
            },
            {
              queryField: 'options.scheduledDates.end',
              lt: dateRange.lessThan,
              constraints: []
            }
          ]
          : [];

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
            ],
            range: rangeFilter,
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
                  scheduledEndDate: contest.scheduledEndDate,
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
      { id: 'scheduledEndDate', title: 'Contest Scheduled End Date' },
      { id: 'entrantAction', title: 'Entrant Action' },
      { id: 'entrantStatus', title: 'Entrant Status' },
      { id: 'memberId', title: 'Member ID' }
    ], allEntrants);
    stopTokenRefresh();
  } catch (e) {
    console.error('Fetch competitions error => ', e);
    stopTokenRefresh();
  }
};

export const exportAwardsDataForContests = async (dataSpace, username, password, greaterThan, lessThan) => {
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

    const dateRange = getDateRange(greaterThan, lessThan);

    do {
      const api = await getApiInstance(dataSpace, username, password);

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

        const rangeFilter = dateRange
          ? [
            {
              queryField: 'options.scheduledDates.end',
              gt: dateRange.greaterThan,
              constraints: []
            },
            {
              queryField: 'options.scheduledDates.end',
              lt: dateRange.lessThan,
              constraints: []
            }
          ]
          : [];

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
            range: rangeFilter,
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
                  scheduledEndDate: contest.scheduledEndDate,
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
      { id: 'scheduledEndDate', title: 'Contest Scheduled End Date' },
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

    stopTokenRefresh();
  } catch (e) {
    console.error('Fetch competitions error => ', e);
    stopTokenRefresh();
  }
};

