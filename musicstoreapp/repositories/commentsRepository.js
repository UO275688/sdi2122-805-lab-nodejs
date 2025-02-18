module.exports = {
    mongoClient: null,
    app: null,

    init: function (app, mongoClient) {
        this.mongoClient = mongoClient;
        this.app = app;
    },

    updateComment: async function (newComment, filter, options) {
        try {
            const client = await this.mongoClient.connect(this.app.get('connectionStrings'));
            const database = client.db("musicStore");
            const collectionName = 'comments';
            const commentsCollection = database.collection(collectionName);
            const result = await commentsCollection.updateOne(filter, {$set: newComment}, options);
            return result;
        } catch (error) {
            throw (error);
        }
    },

    getComments: async function (filter, options) {
        try {
            const client = await this.mongoClient.connect(this.app.get('connectionStrings'));
            const database = client.db("musicStore");
            const collectionName = 'comments';
            const commentsCollection = database.collection(collectionName);
            const comments = await commentsCollection.find(filter, options).toArray();
            return comments;
        } catch (error) {
            throw (error);
        }
    },

    insertComment: function (comment, callbackFunction) {
        this.mongoClient.connect(this.app.get('connectionStrings'), function (err, dbClient) {
            if (err) {
                callbackFunction(null)
            } else {
                const database = dbClient.db("musicStore");
                const collectionName = 'comments';
                const commentsCollection = database.collection(collectionName);
                commentsCollection.insertOne(comment)
                    .then(result => callbackFunction(result.insertedId))
                    .then(() => dbClient.close())
                    .catch(err => callbackFunction({error: err.message}));
            }
        });
    },

    findComment: async function (filter, options) {
        try {
            const client = await this.mongoClient.connect(this.app.get('connectionStrings'));
            const database = client.db("musicStore");
            const collectionName = 'comments';
            const commentsCollection = database.collection(collectionName);
            const comment = await commentsCollection.findOne(filter, options);
            return comment;
        } catch (error) {
            throw (error);
        }
    }
};