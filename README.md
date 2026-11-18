# Assignment 1

`Garian_trashController.js` provides functions for finding e-waste drop-off points, recording recycling, and checking rewards and progress. It includes sample users, drop-off points, item types, and recycling records.

## Setup

From this folder, type `node` in your terminal. Paste the code in `example` below into `>` prompt.  

## Functions

| Function | Parameters | Return value |
| ---------| -----------| -------------|
| `findTrashDropOffPointsbyZipCode(zipCode)` | Postal code as a string, such as `"761339"`. | An array of matching drop-off points, or a message if there are no matches. |
| `checkAcceptedItemsDropOffPoints(itemId)` | An existing item ID as a string. | An array of drop-off points that accept the item, or a message if there are no matches. |
| `displayRecyclingRecord(UserID)` | User ID as a string, such as `"U001"`. | One table-ready row per recycling record, with items formatted as `E001(x1), E002(x3)`. Returns an empty array when there are no records. |
| `createRecyclingRecord(UserID, pointID, itemID, quantity, totalWeightkg)` | User ID and drop-off point ID as strings. non-empty array of item IDs, an equally sized array of positive quantities in the same order, and a positive total weight in kilograms. such as `"("U001", "P001", ["E001", "E002"], [1, 2], 3)"`| A confirmation message with the new record ID, or a validation message. |
| `calculateRewardPoints(recordID)` | Record ID as a string, such as `"R001"`. | A message with the sum of points per item multiplied by its quantity, or a message if the record or an item type is missing. |
| `getRecyclingProgress(userID)` | User ID as a string, such as `"U001"`. | A rounded percentage as a string without the percent sign, or a message if the user is missing. |

`checkRecyclingRecord(UserID)` retrieves raw records for `displayRecyclingRecord()` and `getRecyclingProgress()`. `checkAcceptedItems(pointId, itemId)` checks whether an existing drop-off point accepts an item and supports validation in `createRecyclingRecord()`.

## Example

Start a Node.js session and paste the tests below in order. Each test prints its result so you can compare it with the `Expected Output` comment.

```js
const trashController = require("./Garian_trashController.js");
// find drop-off points and check accepted items.
console.table(trashController.findTrashDropOffPointsbyZipCode("761339")); // Expected Output: Table with drop-off points P001 and P004
console.log(trashController.findTrashDropOffPointsbyZipCode("999999")); // Expected Output: There is no Drop Off Point at Zip Code: 999999
console.table(trashController.checkAcceptedItemsDropOffPoints("E001")); // Expected Output: Table with drop-off points that accept item "E001"
console.log(trashController.checkAcceptedItems("P001", "E001")); // Expected Output: true
console.log(trashController.checkAcceptedItems("P002", "E002")); // Expected Output: false
// look up records, reward points, and progress before adding a record.
trashController.displayRecyclingRecord("U001"); // Expected Output: Table with records belonging to user "U001" (R001)
trashController.displayRecyclingRecord("U003"); // Expected Output: Empty table
console.log("Reward Points from Record R001: " + trashController.calculateRewardPoints("R001")); // Expected Output: Reward Points from Record R001: 70
console.log(trashController.calculateRewardPoints("R003")); // Expected Output: Record R003 not found.
console.log("User Garian has reached " + trashController.getRecyclingProgress("U001") + "% of his recycling goal"); // Expected Output: User Garian has reached 28% of his recycling goal
console.log("User Javier has reached " + trashController.getRecyclingProgress("U003") + "% of his recycling goal"); // Expected Output: User Javier has reached 0% of his recycling goal

// Create a valid record and check its effect.
console.log(trashController.createRecyclingRecord("U001", "P001", ["E001", "E002"], [1, 2], 3)); // Expected Output: Recycling record R003 created successfully.
console.log("Reward Points from Record R003: " + trashController.calculateRewardPoints("R003")); // Expected Output: Reward Points from Record R003: 50
console.log("User Garian has reached " + trashController.getRecyclingProgress("U001") + "% of his recycling goal"); // Expected Output: User Garian has reached 88% of his recycling goal

// invalid recycling records.
console.log(trashController.createRecyclingRecord("U999", "P001", ["E001"], [1], 1)); // Expected Output: User not found.
console.log(trashController.createRecyclingRecord("U001", "P999", ["E001"], [1], 1)); // Expected Output: Drop-off point not found.
console.log(trashController.createRecyclingRecord("U001", "P001", ["E099"], [1], 1)); // Expected Output: Item E099 not found in e-waste types.
console.log(trashController.createRecyclingRecord("U001", "P002", ["E002"], [1], 1)); // Expected Output: Item E002 is not accepted at drop-off point P002.
console.log(trashController.createRecyclingRecord("U001", "P001", ["E001"], [0], 1)); // Expected Output: Item E001 has an invalid quantity of 0.
console.log(trashController.createRecyclingRecord("U001", "P001", ["E001"], [-2], 1)); // Expected Output: Item E001 has an invalid quantity of -2.
console.log(trashController.createRecyclingRecord("U001", "P001", ["E001"], [1], -5)); // Expected Output: Invalid total weight.
console.log(trashController.createRecyclingRecord("U001", "P001", ["E001", "E002"], [1], 3)); // Expected Output: Invalid item IDs or quantities.
console.log(trashController.createRecyclingRecord("U001", "P001", [], [], 1)); // Expected Output: Invalid item IDs or quantities.
console.log(trashController.createRecyclingRecord("U001", "P001", ["E001"], ["1"], 1)); // Expected Output: Item E001 has an invalid quantity of 1.
console.log(trashController.createRecyclingRecord("U001", "P001", ["E001"], [1], "1")); // Expected Output: Invalid total weight.

// Create a valid record with duplicate item IDs.
console.log(trashController.createRecyclingRecord("U001", "P001", ["E001", "E001"], [1, 2], 1.5),); // Expected Output: Recycling record R004 created successfully.

trashController.displayRecyclingRecord("U001"); // Expected Output: Table with records belonging to user "U001" (R001, R003 and R004)
```

New records are stored in memory and reset when you exit Node.js. Start a fresh session before rerunning the tests to create record `R003` again.

# References

- [ALBA E-Waste Singapore](https://alba-ewaste.sg/earn-rewards/) describes how users find nearby e-waste drop-off points and earn recycling reward points.

- [EARTH911](https://search.earth911.com/) describes how users can find e-waste drop-off points based off zipcode

- (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart) describes how to create incrementing record IDs using the `padStart()` string method

- (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray) describes how to check if an Array is an Array

- Used ChatGPT to generate mock schemas and data
