# Assignment 1

`Garian_trashController.js` provides functions for finding e-waste drop-off points, recording recycling, and checking rewards and progress. It includes sample users, drop-off points, item types, and recycling records.

## Setup

From this folder, type `node` in your terminal. Paste the code in `example` below into `>` prompt.  

## Functions

| Function | Parameters | Return value |
| ---------| -----------| -------------|
| `findTrashDropOffPointsbyZipCode(zipCode)` | Postal code as a string, such as `"761339"`. | An array of matching drop-off points, or a message if there are no matches. |
| `checkAcceptedItems(pointId, itemId)` | An existing drop-off point ID and an item ID, both strings. | `true` if the point accepts the item, otherwise `false`. |
| `checkRecyclingRecord(UserID)` | User ID as a string, such as `"U001"`. | An array of the user's records. An empty array means there are no matches. |
| `createRecyclingRecord(UserID, pointID, itemID, quantity, totalWeightkg)` | User ID and drop-off point ID as strings. non-empty array of item IDs, an equally sized array of positive quantities in the same order, and a positive total weight in kilograms. such as `"("U001", "P001", ["E001", "E002"], [1, 2], 3)"`| A confirmation message with the new record ID, or a validation message. |
| `calculateRewardPoints(recordID)` | Record ID as a string, such as `"R001"`. | A message with the sum of points per item multiplied by its quantity, or a message if the record or an item type is missing. |
| `getRecyclingProgress(userID)` | User ID as a string, such as `"U001"`. | A rounded percentage as a string without the percent sign, or a message if the user is missing. |

## Example

Start a Node.js session and paste the tests below in order. Each test prints its result so you can compare it with the `Expected Output` comment.

```js
const trashController = require("./Garian_trashController.js");

// find drop-off points and check accepted items.
console.log(trashController.findTrashDropOffPointsbyZipCode("761339")); // Expected Output: Array of drop-off points P001 and P004 at zip code 761339
console.log(trashController.findTrashDropOffPointsbyZipCode("999999")); // Expected Output: There is no Trash Drop Off Point at Zip Code: 999999
console.log(trashController.checkAcceptedItems("P001", "E002")); // Expected Output: true
console.log(trashController.checkAcceptedItems("P002", "E002")); // Expected Output: false

// look up records, reward points, and progress before adding a record.
console.log(JSON.stringify(trashController.checkRecyclingRecord("U001"),null,2)); // Expected Output: Array containing record R001 belonging to user U001
console.log(trashController.checkRecyclingRecord("U003")); // Expected Output: []
console.log(trashController.calculateRewardPoints("R001")); // Expected Output: Reward Points from Record R001: 70
console.log(trashController.calculateRewardPoints("R999")); // Expected Output: Record R999 not found.
console.log(trashController.getRecyclingProgress("U001")); // Expected Output: 28
console.log(trashController.getRecyclingProgress("U003")); // Expected Output: 0

// Create a valid record and check its effect.
console.log(trashController.createRecyclingRecord("U001", "P001", ["E001", "E002"], [1, 2], 3)); // Expected Output: Recycling record R003 created successfully.
console.log(trashController.calculateRewardPoints("R003")); // Expected Output: Reward Points from Record R003: 50
console.log(trashController.getRecyclingProgress("U001")); // Expected Output: 88

// invalid recycling records.
console.log(trashController.createRecyclingRecord("U999", "P001", ["E001"], [1], 1)); // Expected Output: User not found.
console.log(trashController.createRecyclingRecord("U001", "P999", ["E001"], [1], 1)); // Expected Output: Drop-off point not found.
console.log(trashController.createRecyclingRecord("U001", "P002", ["E002"], [1], 1)); // Expected Output: Item E002 is not accepted at drop - off point P002.
console.log(trashController.createRecyclingRecord("U001", "P001", ["E001"], [0], 1)); // Expected Output: Item E001 has an invalid quantity of 0.
console.log(trashController.createRecyclingRecord("U001", "P001", ["E001"], [-2], 1)); // Expected Output: Item E001 has an invalid quantity of -2.
console.log(trashController.createRecyclingRecord("U001", "P001", ["E001"], [1], -5)); // Expected Output: Invalid total weight.
console.log(trashController.createRecyclingRecord("U001", "P001", ["E001", "E002"], [1], 3)); // Expected Output: Invalid item IDs or quantities.
console.log(trashController.createRecyclingRecord("U001", "P001", [], [], 1)); // Expected Output: Invalid item IDs or quantities.
console.log(trashController.checkRecyclingRecord("U001")); // Expected Output: Array containing records R001 and R003 for U001
```

New records are stored in memory and reset when you exit Node.js. Start a fresh session before rerunning the tests to create record `R003` again.

# References

- [ALBA E-Waste Singapore](https://alba-ewaste.sg/earn-rewards/) describes how users find nearby e-waste drop-off points and earn recycling reward points.

- [EARTH911](https://search.earth911.com/) describes how users can find e-waste drop-off points based off zipcode

- (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart) describes how to create incrementing record IDs using the `padStart()` string method

- (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray) describes how to check if an Array is an Array

- Used ChatGPT to generate mock schemas and data
