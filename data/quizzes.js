import { quizzes } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import validation from '../helpers.js';
import subjectDataFunctions from './subjects.js';
import questionsDataFunctions from './questions.js';

let quizDataFunctions = {
    // get all the quizzes in the quizzes collection
    async getAllQuizzes() {
        const quizCollection = await quizzes();
        const quizList = await quizCollection.find({}).toArray();
        return quizList;
    },

    // get all the quizzes made by a specific user??
    async getQuizById(quizId) {
        quizId = validation.checkId(quizId); // error checking for quizId
        const quizCollection = await quizzes();
        const idQuiz = await quizCollection.find({ 'quizId': quizId }).toArray();

        if (!idQuiz) throw 'Error: Quiz not found';

        return idQuiz;  // return the quiz 
    },

    // get all the quizzes made by a specific user??
    async getAllQuizzesByUser(userId) {
        userId = validation.checkId(userId); // error checking for userId
        const quizCollection = await quizzes();
        const userQuizList = await quizCollection.find({ 'userId': userId }).toArray();

        if (userQuizList.length === 0) { // if the list of quizzes they made is empty,
            throw 'Error: No quizzes found for this user.' // throw an error
        }

        return userQuizList; // return a list of quizzes made by the user
    },

    // get all the quizzes by subject??
    async getAllQuizzesBySubject(subjectId) {
        subjectId = validation.checkId(subjectId); // error checking for subjectId
        const quizCollection = await quizzes();
        const subjectQuizList = await quizCollection.find({ 'subjectId': subjectId }).toArray();

        if (subjectQuizList.length === 0) { // if the list of quizzes they made is empty,
            throw 'Error: No quizzes found for this subject.' // throw an error
        }

        return subjectQuizList; // return a list of quizzes that belong to that subject
    },

    // create a new quiz
    // this will create an empty quiz initially. then, the user can add questions to it.
    async createQuiz(userId, subjectId, questionCount) {

        // error checking for userId
        userId = validation.checkId(userId);

        // error checking for subjectId
        subjectId = validation.checkId(subjectId);

        // add new quiz to DB
        let newQuiz = {
            id: new ObjectId(),
            userId: userId,
            subject: subject.subjectName,
            createDate: new Date(),
            score: 0,
            isQuizCompleted: false,
            hasQuizStarted: false, // if the user already started taking the quiz
            isQuizInSession: false, // is set to false once the user logs out
            // questions: qIds,
            requiredScore: requiredScore
        };

        let res = { createdQuiz: false }; // this object will tell use if the registration was successful or not
        const quizCollection = await quizzes();
        const insertInfo = await quizCollection.insertOne(newQuiz); // insert new user info into the collection
        if (!insertInfo.acknowledged || !insertInfo.insertedId) { // check if the insertInfo is acknowledged, and if the insertedId exists
            throw 'Could not add quiz'; // if either condition is met, then the user cannot be added
        }
        else {
            res.createdQuiz = true; // otherwise, return that it's successful
        }

        // we need to choose whether we return a status report or the new question itself
        // const newQuizId = insertInfo.insertedId.toString(); // turn the new question's id into a string

        // const qz = await this.getQuizById(newQuizId); // find the question that was just added

        return res; // return whether adding the new question is successful or not
    },

    // delete quiz
    async deleteQuiz(quizId) {
        quizId = validation.checkId(quizId);
        const quizCollection = await quizzes();
        const deletionInfo = await quizCollection.findOneAndDelete({
            _id: new ObjectId(quizId)
        });
        if (!deletionInfo) throw 'Error: Could not delete quiz with id of ${quizId}.';
        return { ...deletionInfo, deleted: true }; // return an object of which quiz is deleted and the deletion status
    }
}