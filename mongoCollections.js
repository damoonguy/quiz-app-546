import { dbConnection } from './mongoConnection.js';

const getCollectionFn = (collection) => {
  let _col = undefined;

  return async () => {
    if (!_col) {
      const db = await dbConnection();
      _col = await db.collection(collection);
    }

    return _col;
  };
};

// Just import these collections and call them on-demand to access the mongodb
export const users = getCollectionFn('users');
export const quizzes = getCollectionFn('quizzes'); 

export const dashboardStats = getCollectionFn('dashboardStats'); // Added this for Dashboard