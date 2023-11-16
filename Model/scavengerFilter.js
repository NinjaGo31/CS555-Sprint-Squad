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
  });
};s

export { filterScavengerHunts };