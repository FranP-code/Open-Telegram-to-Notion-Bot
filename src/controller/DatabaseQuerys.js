const { decrypt } = require('../models/crypto');
const NotionQuerys = require('./NotionQuerys');

const addUser = require('../models/querys/addUser');
const searchUser = require('../models/querys/searchUser');
const searchAllUsers = require('../models/querys/searchAllUsers');
const uploadImage = require('../models/querys/uploadImage');
const addDefaultDatabaseQuery = require('../models/querys/addDefaultDatabaseQuery');
const getDefaultDatabaseQuery = require('../models/querys/getDefaultDatabaseQuery');
const removeDefaultDatabaseQuery = require('../models/querys/removeDefaultDatabaseQuery');

function DatabaseQuerys() {
  async function uploadApiKey(userId, apiKey) {
    const responseNotion = await NotionQuerys(apiKey).checkAuthCode();

    if (responseNotion.status === 'error') {
      responseNotion.message = 'Auth key not valid';
      return responseNotion;
    }

    const responseMongoDB = await addUser(userId, apiKey);
    return responseMongoDB;
  }

  async function checkUserRegistered(userId) {
    return searchUser(userId);
  }

  async function getNotionAuthKey(userId) {
    const response = await searchUser(userId);

    if (response.status === 'error') {
      return response;
    }

    return { success: true, data: decrypt(response.data.notionAuthKey) };
  }

  async function getUser(userId) {
    try {
      return await searchUser(userId);
    } catch (err) {
      console.log(err);
      throw Error(err);
    }
  }

  async function getAllUsers() {
    try {
      return await searchAllUsers();
    } catch (err) {
      console.log(err);
      throw Error(err);
    }
  }

  async function uploadAndGetImageURL(url) {
    try {
      const data = await uploadImage(url);

      return {
        status: 'success',
        data: {
          url: data.url,
        },
      };
    } catch (err) {
      console.log(err);
      return { status: 'error' };
    }
  }

  async function addDefaultDatabase(databaseId, userId) {
    try {
      const notionAuthKey = await getNotionAuthKey(userId);
      const data = await addDefaultDatabaseQuery(databaseId, userId, notionAuthKey.data);
      return {
        status: 'success',
        data,
      };
    } catch (err) {
      console.log(err);
      return { status: 'error' };
    }
  }

  async function removeDefaultDatabase(userId) {
    try {
      const data = await removeDefaultDatabaseQuery(userId);
      return {
        data,
        status: 'success',
      };
    } catch (err) {
      console.log(err);
      return { status: 'error' };
    }
  }

  async function getDefaultDatabase(userId) {
    try {
      const data = await getDefaultDatabaseQuery(userId);
      return data;
    } catch (error) {
      console.log(error);
      return { status: 'error' };
    }
  }

  return {
    addDefaultDatabase,
    checkUserRegistered,
    getAllUsers,
    getDefaultDatabase,
    getNotionAuthKey,
    getUser,
    removeDefaultDatabase,
    uploadAndGetImageURL,
    uploadApiKey,
  };
}

module.exports = DatabaseQuerys;
