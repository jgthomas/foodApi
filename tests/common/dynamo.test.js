const AWS = require('aws-sdk');
const Dynamo = require('../../lambdas/common/dynamo');

jest.mock('aws-sdk', () => {
  const mDocumentClient = { get: jest.fn() };
  const mDynamoDB = { DocumentClient: jest.fn(() => mDocumentClient) };
  return { DynamoDB: mDynamoDB };
});
const mDynamoDb = new AWS.DynamoDB.DocumentClient();

describe('dynamo common module', () => {
  describe('Get method', () => {
    it('Should throw an error if not in the database', async () => {
      const id = 'fakeId';
      const table = 'fakeTable';
      mDynamoDb.get.mockImplementation(() => {
        return {
          promise: () => null,
        };
      });
      await expect(Dynamo.get(id, table)).rejects.toThrow(
        `There was an error fetching the data for ID: ${id}, from ${table}`,
      );
    });
  });
});
