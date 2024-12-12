import { subjects } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import validation from '../helpers.js';
import quizzes from './quizzes.js';
import questions from './quizzes.js';

let subjectDataFunctions = {
    // get all the subjects in the subjects collection
    async getAllSubjects() {
        const subjectCollection = await subjects();
        const subjectList = await subjectCollection.find({}).toArray();
        return subjectList;
    },

    // get subject based on their subject id
    async getSubjectById(subjectId) {
        subjectId = validation.checkId(subjectId);
        const subjectCollection = await subjects();
        const subject = await subjectCollection.findOne({ _id: new ObjectId(subjectId) });
        if (!subject) throw 'Error: Subject not found'; // if there is no user with that id, then that user does not exist
        return subject;
    },

    // create a new subject
    async createSubject(subjectName, userId) {
        
        // error checking for subjectName
        subjectName = validation.checkString(subjectName);

        // error checking for userId
        userId = validation.checkId(userId);

        // add new subject to DB
        let newSubject = {
            id: new ObjectId(),
            subjectName: subjectName,
            createDate: new Date(),
            userId: userId
        };

        let res = { createdSubject: false }; // this object will tell use if the registration was successful or not
        const subjectCollection = await subjects();
        const insertInfo = await subjectCollection.insertOne(newSubject); // insert new user info into the collection
        if (!insertInfo.acknowledged || !insertInfo.insertedId) { // check if the insertInfo is acknowledged, and if the insertedId exists
            throw 'Could not add subject'; // if either condition is met, then the user cannot be added
        }
        else {
            res.createdSubject = true; // otherwise, return that it's successful
        }
    
        // we need to choose whether we return a status report or the new quiz itself
        // const newSubjectId = insertInfo.insertedId.toString(); // turn the new quiz's id into a string

        // const sub = await this.getQuizById(newSubjectId); // find the quiz that was just added

        return res; // return whether adding the new quiz is successful or not
    },

    // delete subject
    async deleteSubject(subjectId) {
        subjectId = validation.checkId(subjectId);
        const subjectCollection = await subjects();
        const deletionInfo = await subjectCollection.findOneAndDelete({
            _id: new ObjectId(subjectId)
        });
        if(!deletionInfo) throw 'Error: Could not delete subject with id of ${subjectId}.';
        return{...deletionInfo, deleted: true}; // return an object of which subject is deleted and the deletion status
    }   

    // we don't need isSubjectExists because we can just do
    // subjectId = validation.checkId(subjectId);
    // const subjectCollection = await subjects();
    // const sub = await subjectCollection.findOne({ _id: new ObjectId(subjectId) });
    // if (!sub) throw 'Error: Subject not found'; // if there is no user with that id, then that user does not exist
    // return sub;
};

export default subjectDataFunctions;