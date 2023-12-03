import { scavengerModel } from "./scavengerModel.js"

/**
 * Search for scavenger hunts based on a search term.
 * @param {string} searchTerm - The term to search for.
 * @returns {Promise} A promise that resolves to the search results.
 */
const filterScavengerHunts = (searchTerm) => {
  // Use a regular expression for a case-insensitive search
  const regex = new RegExp(searchTerm, "i");

  // Filter by scavengerName and description fields
  return scavengerModel.find({
    $or: [
      { scavengerName: { $regex: regex } },
      { description: { $regex: regex } },
    ],
    $or: [
      { "startLocation.address": { $regex: regex } },
      { "scavengerStops.address": { $regex: regex } },
    ],
  });
};
export { filterScavengerHunts };

// Another way to do the same thing

/*
const filterScavengerHunts = async (searchTerm) => {
  const regex = new RegExp(searchTerm, 'i');
  const filter = {
    $or: [
      { scavengerName: { $regex: regex } },
      { description: { $regex: regex } },
      { 'startLocation.address': { $regex: regex } },
      { 'scavengerStops.address': { $regex: regex } }
    ]
  };

  try {
    const result = await scavengerModel.find(filter);
    return result;
  } catch (error) {
    console.error('Error filtering scavenger hunts:', error);
    throw error;
  }
};
*/