import { topics } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import validation from '../helpers.js';

let topicDataFunctions = {
    // get all the topics in the subjects collection
    async getAllTopics() {
        const topicCollection = await topics();
        const topicList = await topicCollection.find({}).toArray();
        return topicList;
    },

    // get subject based on their subject id
    async getTopicById(topicId) {
        topicId = validation.checkId(topicId);
        const topicCollection = await topics();
        const topic = await topicCollection.findOne({ _id: new ObjectId(topicId) });
        if (!topic) throw 'Error: Topic not found'; // if there is no user with that id, then that user does not exist
        return topic;
    },

    // same thing, we don't need a isCategoryExists function because we can always just:
    // topicId = validation.checkId(topicId);
    // const topicCollection = await topics();
    // const topic = await topicCollection.findOne({ _id: new ObjectId(topicId) });
    // if(!topic) throw 'Error: Topic not found'; // if there is no user with that id, then that user does not exist
    // return topic;

    // create a new topic
    // need userId?
    async createTopic(topicName) {
        
        // error checking for topicname
        topicName = validation.checkString(topicName);

        // // error checking for userId
        // userId = validation.checkId(userId);

        // add new subject to DB
        let newTopic = {
            id: new ObjectId(),
            topicName: topicName,
            // createDate: new Date(),
            // userId: userId
        };

        let res = { createdTopic: false }; // this object will tell use if the registration was successful or not
        const topicCollection = await topics();
        const insertInfo = await topicCollection.insertOne(newTopic); // insert new topic info into the collection
        if (!insertInfo.acknowledged || !insertInfo.insertedId) { // check if the insertInfo is acknowledged, and if the insertedId exists
            throw 'Could not add topic'; // if either condition is met, then the topic cannot be added
        }
        else {
            res.createdTopic = true; // otherwise, return that it's successful
        }
    
        // we need to choose whether we return a status report or the new topic itself
        // const newTopicId = insertInfo.insertedId.toString(); // turn the new topic's id into a string

        // const topic = await this.getTopicById(newTopicId); // find the topic that was just added

        return res; // return whether adding the new topic is successful or not
    },
};

export default topicDataFunctions;