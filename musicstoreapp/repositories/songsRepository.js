module.exports = {
    //Variables
    mongoClient: null,
    app: null,
    init: function (app, mongoClient) {
        this.mongoClient = mongoClient;
        this.app = app;
    },

    getSongs: async function (filter, options) {
        try {
            const client = await this.mongoClient.connect(this.app.get('connectionStrings'));
            const database = client.db("musicStore");
            const collectionName = 'songs';
            const songsCollection = database.collection(collectionName);
            const songs = await songsCollection.find(filter, options).toArray();
            return songs;
        } catch (error) {
            throw (error);
        }
    },

    //función asíncrona no puede tener return, para devolver el valor lo pasa como parametro
    insertSong: function (song, callbackFunction) {
        this.mongoClient.connect(this.app.get('connectionStrings'), function (err, dbClient) {
            if (err) {
                callbackFunction(null)
            } else {
                const database = dbClient.db("musicStore");
                const collectionName = 'songs';
                const songsCollection = database.collection(collectionName);
                songsCollection.insertOne(song)
                    .then(result => callbackFunction(result.insertedId))
                    .then(() => dbClient.close())
                    .catch(err => callbackFunction({error: err.message}));
            }
        });
    },

    findSong: async function (filter, options) {
        try {
            const client = await this.mongoClient.connect(this.app.get('connectionStrings'));
            const database = client.db("musicStore");
            const collectionName = 'songs';
            const songsCollection = database.collection(collectionName);
            const song = await songsCollection.findOne(filter, options);
            return song;
        } catch (error) {
            throw (error);
        }
    }

};