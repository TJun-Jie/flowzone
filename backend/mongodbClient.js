const { MongoClient, ObjectId } = require('mongodb');
const User = require('./models/users');


async function getUserContext(userId) {
  const client = new MongoClient('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.
    connect();
    const database = client.db('calendar_db'); 
    const usersCollection = database.collection('users'); 

    const pipeline = [
        {
          $match: { clerk_user_id: userId } // Match the user by clerk_user_id
        },
        {
          $lookup: {
            from: 'events', // Assumes your events are stored in a collection named 'events'
            localField: 'calendar.past_activities.events', // Field in users collection
            foreignField: '_id', // Field in events collection
            as: 'calendar.past_activities.events' // Where to put the joined documents
          }
        },
        {
          $lookup: {
            from: 'tasks', // Assumes your tasks are stored in a collection named 'tasks'
            localField: 'calendar.past_activities.tasks', // Field in users collection
            foreignField: '_id', // Field in tasks collection
            as: 'calendar.past_activities.tasks' // Where to put the joined documents
          }
        },
        {
          $limit: 1 // Since we're looking for a single user, limit the result to 1
        }
      ];
      
      // Execute the aggregation pipeline
      const usersWithPopulatedData = await usersCollection.aggregate(pipeline).toArray();
      
      // The result is an array, so take the first element
      const user = usersWithPopulatedData[0] || null;
      
      if (user) {
        console.log('User with populated events and tasks:', user);
      } else {
        console.log('No user found with the specified clerk_user_id.');
      }
    return user;
  } catch (error) {
    console.error('Error during aggregation:', error);
    throw error; // Or handle the error as needed
  } finally {
    await client.close();
  }
}

async function getUserProfile(userId) {
  const client = new MongoClient('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.
    connect();
    const database = client.db('calendar_db'); 
    const usersCollection = database.collection('users'); 

    const userProfile = await usersCollection.findOne({clerk_user_id: userId});
    return userProfile;
  } finally {
    await client.close();
  }
}

async function updateUserContext(userId, document) {
    const uri = "mongodb://localhost:27017/calendar_db";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db('calendar_db'); // Your database name
        const collection = database.collection('users'); // Your collection name
        console.log(userId);
        console.log(document);

        // Save the given document for a specific user
        const userContext = await collection.updateOne({ clerk_user_id: userId }, {$set: document});
        // const userContext = await collection.findOne({clerk_user_id: userId});

        return userContext;
    } finally {
        await client.close();
    }
}

module.exports = { getUserContext, getUserProfile, updateUserContext };