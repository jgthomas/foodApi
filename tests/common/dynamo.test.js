const AWS = require('aws-sdk');
const Dynamo = require('../../lambdas/common/dynamo');

jest.mock('aws-sdk', () => {
  const mDocumentClient = { get: jest.fn(), put: jest.fn() };
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

    it('Should return a result if found', async () => {
      const id = 'fakeId';
      const table = 'fakeTable';
      const item = { id: 'fakeingredient' };
      mDynamoDb.get.mockImplementation(() => {
        return {
          promise: () => {
            return { Item: item };
          },
        };
      });
      const responseItem = await Dynamo.get(id, table);
      expect(responseItem).toEqual(item);
    });
  });

  describe('Put method', () => {
    it('Should successfully add item to database', async () => {
      const table = 'fakeTable';
      const item = { ID: 'fakeingredient' };
      mDynamoDb.put.mockImplementation(() => {
        return {
          promise: () => {
            return item; // value is not null
          },
        };
      });
      const responseItem = await Dynamo.write(item, table);
      expect(responseItem).toEqual(item);
    });
  });
});
