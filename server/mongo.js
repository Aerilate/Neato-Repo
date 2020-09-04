require('dotenv').config();
const { MongoClient } = require('mongodb');


const URL = process.env.mongoDB_url;
const DB_NAME = process.env.mongoDB_db_name;
const COLLECTION_NAME = process.env.mongoDB_collection_name;

async function connectToDB() {
    const client = new MongoClient(URL, { useUnifiedTopology: true });
    await client.connect();
    return client;
}

async function disconnectFromDB(client) {
    await client.close();
}

async function insertImageDoc(client, user, key, isPublic) {
    await client.db(DB_NAME).collection(COLLECTION_NAME).insertOne(
        {
            user: user,
            key: key,
            isPublic: isPublic
        }
    );
}

async function updateImageDocAccess(client, key, isPublic) {
    const query = { key: key };
    console.log(isPublic)
    const newValue = { $set: { isPublic: isPublic } };
    await client.db(DB_NAME).collection(COLLECTION_NAME).updateOne(query, newValue);
}

async function deleteImageDoc(client, key) {
    const query = { key: key };
    await client.db(DB_NAME).collection(COLLECTION_NAME).deleteOne(query);
}

async function getPersonalImageDocs(client, user) {
    const query = { user: user };
    return await client.db(DB_NAME).collection(COLLECTION_NAME).find(query).toArray();
}

async function getPublicImageDocs(client) {
    const query = { isPublic: true };
    return await client.db(DB_NAME).collection(COLLECTION_NAME).find(query).toArray();
}



module.exports = {
    connectToDB,
    disconnectFromDB,
    insertImageDoc,
    updateImageDocAccess,
    deleteImageDoc,
    getPersonalImageDocs,
    getPublicImageDocs
};