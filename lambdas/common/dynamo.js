import { DynamoDB } from 'aws-sdk';

const documentClient = new DynamoDB.DocumentClient();

const Dynamo = {
  async get(ID, TableName) {
    const params = {
      TableName,
      Key: {
        ID,
      },
    };

    const data = await documentClient.get(params).promise();

    if (!data || !data.Item) {
      throw Error(
        `There was an error fetching the data for ID: ${ID}, from ${TableName}`,
      );
    }

    return data.Item;
  },

  async write(data, TableName) {
    if (!data.ID) {
      throw Error('no ID on the data');
    }

    const params = {
      TableName,
      Item: data,
    };

    const res = await documentClient.put(params).promise();

    if (!res) {
      throw Error(
        `There was an error inserting ID: ${data.ID}, in table ${TableName}`,
      );
    }

    return data;
  },

  async batchGet(data, TableName) {
    const result = await Promise.all(
      data.map(async (chunk) => {
        const params = {
          RequestItems: {
            [TableName]: {
              Keys: chunk,
            },
          },
        };

        const res = await documentClient.batchGet(params).promise();

        if (!res || !res.Responses || res.Responses[TableName].length === 0) {
          throw Error(`There was an error fetching the data from ${TableName}`);
        }

        return res;
      }),
    );

    return result;
  },
};

export default Dynamo;
