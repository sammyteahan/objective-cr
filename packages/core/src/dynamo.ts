import { DynamoDB } from "aws-sdk";
import { Table } from "sst/node/table";

const client = new DynamoDB.DocumentClient()

export const Configuration = {
  client,
  table: Table.table.tableName,
}
