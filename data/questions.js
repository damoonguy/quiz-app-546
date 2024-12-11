import { questions } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import validation from '../helpers.js';

let questionsDataFunctions = {
    // get all the questions in the questions collection
    async getAllQuestions() {
        const questionCollection = await questions();
        const questionList = await questionCollection.find({}).toArray();
        return questionList;
    },

    // get question based on their question id
    async getQuestionById(id) {
        id = validation.checkId(id);
        const questionCollection = await questions();
        const question = await questionCollection.findOne({ _id: new ObjectId(id) });
        if (!question) throw 'Error: User not found'; // if there is no user with that id, then that user does not exist
        return question;
    },

    // create a new question
    // work in progress: may have to add a function per type of question (mc, T/F, short answer)
    async addQuestion(question, correctAnswer, choices) { // add quizId? we need to know which quiz it belongs to
        
        // error checking for question
        question = validation.checkString(question);

        // error checking for correctAnswer
        correctAnswer = validation.checkString(correctAnswer);

        // error checking for choices
        // choices is an array of the answers that the user can choose from (for multiple choice questions)
        if(!choices) throw 'Error: There are no choices provided for the answers for the questions.';
        if(choices.length === 0) throw 'Error: The choices cannot be empty.';
        if(choices.length === 1) throw 'Error: There must be more than one choice for the answers.';

        // insert net question into DB
        let newQuestion = {
            id: new ObjectId(),
            question: question,
            correctAnswer: correctAnswer,
            choices: choices 
        };

        let res = { addedQuestionStatus: false }; // this object will tell use if the registration was successful or not
        const questionCollection = await questions();
        const insertInfo = await questionCollection.insertOne(newQuestion); // insert new user info into the collection
        if (!insertInfo.acknowledged || !insertInfo.insertedId) { // check if the insertInfo is acknowledged, and if the insertedId exists
            throw 'Could not add question'; // if either condition is met, then the user cannot be added
        }
        else {
            res.addedQuestionStatus = true; // otherwise, return that it's successful
        }
    
        // we need to choose whether we return a status report or the new question itself
        // const newQuestionId = insertInfo.insertedId.toString(); // turn the new question's id into a string

        // const q = await this.getQuestionById(newQuestionId); // find the question that was just added

        return res; // return whether adding the new question is successful or not
    },

    async deleteQuestion(questionId) {
        questionId = validation.checkId(questionId);
        const questionCollection = await questions();
        const deletionInfo = await questionCollection.findOneAndDelete({
            _id: new ObjectId(questionId)
        });
        if(!deletionInfo) throw 'Error: Could not delete question with id of ${questionId}.';
        return{...deletionInfo, deleted: true}; // return an object of which question is deleted and the deletion status
    }   
};

export default questionsDataFunctions;

/*
we can ignore these for now. These are some functions I made I thought we would need but they may not actually be necessary.

// get question based on their subject
    async getQuestionBySubject(subjectId) {
        subjectId = validation.checkId(subjectId);
        const questionCollection = await questions();
        const question = await questionCollection.findOne({ _id: new ObjectId(subjectId) });
        if (!question) throw 'Error: User not found'; // if there is no user with that id, then that user does not exist
        return question;
    },


*/