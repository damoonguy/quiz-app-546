import { dbConnection } from './mongoConnection.js';

const getCollectionFn = (collection) => {
  let _col = undefined;
  console.log(collection)
  return async () => {
    if (!_col) {
      const db = await dbConnection();
      _col = await db.collection(collection);
    }

    return _col;
  };
};

// Just import these collections and call them on-demand to access the mongodb
export const users = getCollectionFn('users'); // collection of users of the web app
export const subjects = getCollectionFn('subjects'); // collection of subjects (ex. history, science, etc.)
export const questions = getCollectionFn('questions'); // collection of the questions 
export const quizzes = getCollectionFn('quizzes'); // collection of the quizzes

export const dashboardStats = getCollectionFn('dashboardStats'); // Added this for Dashboard
