import { scavengerModel } from './scavengerModel';

// Assuming userId is the user's ID and scavengerHuntsCompleted is an array of completed scavenger hunt IDs
const userId = 'your_user_id';
const scavengerHuntsCompleted = ['completed_id_1', 'completed_id_2'];


const query = {
  _id: { $nin: scavengerHuntsCompleted },
};

// Execute the query
const filteredScavengerHunts = await scavengerModel.find(query);

console.log(filteredScavengerHunts);