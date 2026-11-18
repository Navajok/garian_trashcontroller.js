module.exports = {
  //DATA
  Users: [
    {
      UserID: "U001",
      Name: "Garian",
      "Zip Code": "761339",
      "Target(KG)": 5,
    },
    {
      UserID: "U002",
      Name: "Matt",
      "Zip Code": "761330",
      "Target(KG)": 6,
    },
    {
      UserID: "U003",
      Name: "Javier",
      "Zip Code": "761331",
      "Target(KG)": 7,
    },
  ],

  trashDropOffPoints: [
    {
      PointID: "P001",
      Name: "Point 1",
      Address: "123 Street",
      zipCode: "761339",
      accepteditemIds: ["E001", "E002", "E003"],
    },
    {
      PointID: "P002",
      Name: "Point 2",
      Address: "1234 Street",
      zipCode: "761330",
      accepteditemIds: ["E003"],
    },
    {
      PointID: "P003",
      Name: "Point 3",
      Address: "1235 Street",
      zipCode: "761331",
      accepteditemIds: ["E002", "E003"],
    },
    {
      PointID: "P004",
      Name: "Point 4",
      Address: "123 Street",
      zipCode: "761339",
      accepteditemIds: ["E001", "E002", "E003"],
    },
  ],

  eWasteTypes: [
    {
      itemID: "E001",
      Name: "Mobile Phone",
      Category: "Mobile Devices",
      Points: "10",
    },
    {
      itemID: "E002",
      Name: "Laptop",
      Category: "Computers",
      Points: "20",
    },
    {
      itemID: "E003",
      Name: "Monitor",
      Category: "Display Screens",
      Points: "30",
    },
    {
      itemID: "E004",
      Name: "Charger Plug",
      Category: "Accessories",
      Points: "5",
    },
  ],

  recyclingRecords: [
    {
      recordID: "R001",
      UserID: "U001",
      pointID: "P001",
      items: [
        {
          itemID: "E001",
          quantity: "1",
        },
        {
          itemID: "E002",
          quantity: "3",
        },
      ],
      totalWeightkg: 1.4,
      date: "06/11/2026",
    },
    {
      recordID: "R002",
      UserID: "U002",
      pointID: "P001",
      items: [
        {
          itemID: "E001",
          quantity: "1",
        },
        {
          itemID: "E002",
          quantity: "3",
        },
      ],
      totalWeightkg: 0.2,
      date: "06/11/2026",
    },
  ],

  //FUNCTIONS
  findTrashDropOffPointsbyZipCode(zipCode) {
    let DropOffPoints = this.trashDropOffPoints.filter(
      (point) => point.zipCode === zipCode,
    );
    return DropOffPoints.length > 0
      ? DropOffPoints
      : `There is no Drop Off Point at Zip Code: ${zipCode}`;
  },

  checkAcceptedItemsDropOffPoints(itemId) {
    let AcceptedItemsDropOffPoints = this.trashDropOffPoints.filter((point) =>
      point.accepteditemIds.includes(itemId),
    );

    return AcceptedItemsDropOffPoints.length > 0
      ? AcceptedItemsDropOffPoints
      : `There is no Drop Off Point that accepts itemId ${itemId}`;
  },

  checkRecyclingRecord(UserID) {
    let record = this.recyclingRecords.filter(
      (record) => record.UserID === UserID,
    );

    return record;
  },

  displayRecyclingRecord(UserID) {
    const records = this.checkRecyclingRecord(UserID);

    const formattedRecord = [];

    for (let i = 0; i < records.length; i++) {
      let itemSummary = "";
      for (let x = 0; x < records[i].items.length; x++) {
        itemSummary +=
          records[i].items[x].itemID +
          "(x" +
          records[i].items[x].quantity +
          ")";

        if (x < records[i].items.length - 1) {
          itemSummary += ", ";
        }
      }

      // Push ONE row for the entire recycling record
      formattedRecord.push({
        recordID: records[i].recordID,
        UserID: records[i].UserID,
        pointID: records[i].pointID,
        items: itemSummary,
        totalWeightkg: records[i].totalWeightkg,
        date: records[i].date,
      });
    }

    console.table(formattedRecord);
  },

  checkAcceptedItems(pointId, itemId) {
    return this.trashDropOffPoints
      .find((point) => point.PointID === pointId)
      .accepteditemIds.includes(itemId);
  },

  createRecyclingRecord(UserID, pointID, itemID, quantity, totalWeightkg) {
    let user = this.Users.find((user) => user.UserID === UserID);

    if (!user) {
      return "User not found.";
    }

    let point = this.trashDropOffPoints.find(
      (point) => point.PointID === pointID,
    );

    if (!point) {
      return "Drop-off point not found.";
    }

    if (
      !Array.isArray(itemID) ||
      !Array.isArray(quantity) ||
      itemID.length === 0 ||
      itemID.length !== quantity.length
    ) {
      return "Invalid item IDs or quantities.";
    }

    for (let i = 0; i < itemID.length; i++) {
      const eWaste = this.eWasteTypes.find((type) => type.itemID === itemID[i]);

      if (!eWaste) {
        return `Item ${itemID[i]} not found in e-waste types.`;
      }

      if (!this.checkAcceptedItems(pointID, itemID[i])) {
        return `Item ${itemID[i]} is not accepted at drop-off point ${pointID}.`;
      }

      if (quantity[i] <= 0) {
        return `Item ${itemID[i]} has an invalid quantity of ${quantity[i]}.`;
      }
    }

    if (totalWeightkg <= 0) {
      return "Invalid total weight.";
    }

    let recordID =
      "R" + String(this.recyclingRecords.length + 1).padStart(3, "0");

    let items = itemID.map((id, index) => ({
      itemID: id,
      quantity: quantity[index],
    }));

    this.recyclingRecords.push({
      recordID: recordID,
      UserID: UserID,
      pointID: pointID,
      items: items,
      totalWeightkg: totalWeightkg,
      date: new Date().toLocaleDateString(),
    });

    return `Recycling record ${recordID} created successfully.`;
  },

  calculateRewardPoints(recordID) {
    let record = this.recyclingRecords.find(
      (record) => record.recordID === recordID,
    );

    if (!record) {
      return `Record ${recordID} not found.`;
    }

    let totalPoints = 0;

    for (let i = 0; i < record.items.length; i++) {
      let eWaste = this.eWasteTypes.find(
        (type) => type.itemID === record.items[i].itemID,
      );

      totalPoints += Number(eWaste.Points) * Number(record.items[i].quantity);
    }

    return totalPoints;
  },

  getRecyclingProgress(userID) {
    let user = this.Users.find((user) => user.UserID === userID);

    if (!user) {
      return `user ${user} not found.`;
    }

    let userRecords = this.checkRecyclingRecord(userID);

    let totalWeightRecycled = 0;

    for (let i = 0; i < userRecords.length; i++) {
      totalWeightRecycled += userRecords[i].totalWeightkg;
    }

    const percentage = (
      (totalWeightRecycled / user["Target(KG)"]) *
      100
    ).toFixed(2);

    return percentage;
  },
};
