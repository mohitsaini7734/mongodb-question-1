/*
SET A - Scenario A1: Online Store Inventory Update
Database: shopDB
Collection: products

Run this file in MongoDB Shell (mongosh):
  mongosh < A1_Online_Store_Inventory.js

The script drops the products collection first so it can be run repeatedly.
*/

use shopDB

// ------------------------------------------------------------
// Setup: Insert sample data
// ------------------------------------------------------------
db.products.drop();

db.products.insertMany([
  {
    _id: 1,
    name: "Wireless Mouse",
    category: "Accessories",
    price: 800,
    stock: 50,
    discontinued: false,
    oldCode: "WM-01"
  },
  {
    _id: 2,
    name: "Keyboard",
    category: "Accessories",
    price: 1500,
    stock: 30,
    discontinued: false,
    oldCode: "KB-02"
  },
  {
    _id: 3,
    name: "USB Cable",
    category: "Accessories",
    price: 200,
    stock: 100,
    discontinued: false
  },
  {
    _id: 4,
    name: "Laptop",
    category: "Computers",
    price: 55000,
    stock: 10,
    discontinued: false
  },
  {
    _id: 5,
    name: "Monitor",
    category: "Computers",
    price: 12000,
    stock: 15,
    discontinued: false
  },
  {
    _id: 6,
    name: "Old Floppy Drive",
    category: "Computers",
    price: 300,
    stock: 0,
    discontinued: true
  },
  {
    _id: 7,
    name: "Dial-Up Modem",
    category: "Computers",
    price: 500,
    stock: 0,
    discontinued: true
  },
  {
    _id: 8,
    name: "CD Drive",
    category: "Computers",
    price: 400,
    stock: 0,
    discontinued: true
  }
]);

// ------------------------------------------------------------
// Task 1: Change Keyboard price to 1400 using $set
// ------------------------------------------------------------
print("\nTASK 1: Update Keyboard price using $set");
printjson(
  db.products.updateOne(
    { name: "Keyboard" },
    { $set: { price: 1400 } }
  )
);
print("Check updated Keyboard:");
printjson(db.products.findOne({ name: "Keyboard" }));

// ------------------------------------------------------------
// Task 2: Increase Wireless Mouse stock by 25 using $inc
// ------------------------------------------------------------
print("\nTASK 2: Increase Wireless Mouse stock using $inc");
printjson(
  db.products.updateOne(
    { name: "Wireless Mouse" },
    { $inc: { stock: 25 } }
  )
);
print("Check updated Wireless Mouse:");
printjson(db.products.findOne({ name: "Wireless Mouse" }));

// ------------------------------------------------------------
// Task 3: Remove oldCode from all products using $unset
// ------------------------------------------------------------
print("\nTASK 3: Remove oldCode using $unset");
printjson(
  db.products.updateMany(
    {},
    { $unset: { oldCode: "" } }
  )
);

// ------------------------------------------------------------
// Task 4: Replace the complete USB Cable document (_id: 3)
// ------------------------------------------------------------
print("\nTASK 4: Replace USB Cable document");
printjson(
  db.products.replaceOne(
    { _id: 3 },
    {
      name: "USB-C Cable",
      category: "Accessories",
      price: 350,
      stock: 100,
      discontinued: false
    }
  )
);
print("Check replaced document:");
printjson(db.products.findOne({ _id: 3 }));

// ------------------------------------------------------------
// Task 5: Delete Old Floppy Drive using deleteOne
// ------------------------------------------------------------
print("\nTASK 5: Delete Old Floppy Drive");
printjson(
  db.products.deleteOne({ name: "Old Floppy Drive" })
);

// ------------------------------------------------------------
// Task 6: Delete all remaining discontinued products
// ------------------------------------------------------------
print("\nTASK 6: Delete remaining discontinued products");
printjson(
  db.products.deleteMany({ discontinued: true })
);
print("Remaining product count:");
print(db.products.countDocuments());

// ------------------------------------------------------------
// Task 7: Aggregation - category stock summary
// Include products with price >= 500, then sort by totalStock
// in descending order.
// ------------------------------------------------------------
print("\nTASK 7: Aggregation - stock summary per category");
printjson(
  db.products.aggregate([
    {
      $match: {
        price: { $gte: 500 }
      }
    },
    {
      $group: {
        _id: "$category",
        totalStock: { $sum: "$stock" },
        avgPrice: { $avg: "$price" }
      }
    },
    {
      $sort: {
        totalStock: -1
      }
    }
  ]).toArray()
);

/*
Expected key results:
- Keyboard price: 1400
- Wireless Mouse stock: 75
- Task 3: matchedCount 8, modifiedCount 2
- USB-C Cable: price 350, stock 100, discontinued false
- Task 5 deletedCount: 1
- Task 6 deletedCount: 2
- Remaining documents: 5
- Aggregation:
  Accessories: totalStock 105, avgPrice 1100
  Computers: totalStock 25, avgPrice 33500
*/
