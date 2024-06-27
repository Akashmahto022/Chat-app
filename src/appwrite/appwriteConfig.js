import { Client, Databases } from 'appwrite';
// import conf from '../conf/conf';
const client = new Client();
export const database = new Databases(client)


client
.setEndpoint('https://.appwrite.io/v1')
.setProject("659af530035356f25d68");

export const projectId = "659af530035356f25d68"
export const databaseId = "659afc76b83d06532169"
export const collectionId = "659afc8e6b4ad76d6843"

export default client;