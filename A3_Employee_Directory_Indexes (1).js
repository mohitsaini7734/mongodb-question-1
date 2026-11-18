

use companyDB

// ------------------------------------------------------------
// Setup: Insert sample employee data
// ------------------------------------------------------------
db.employees.drop();

db.employees.insertMany([
  {
    _id: 1,
    name: "Anil",
    dept: "IT",
    city: "Chennai",
    salary: 50000,
    skills: ["MongoDB", "Python"]
  },
  {
    _id: 2,
    name: "Bhavna",
    dept: "HR",
    city: "Mumbai",
    salary: 45000,
    skills: ["Excel", "Communication"]
  },
  {
    _id: 3,
    name: "Charan",
    dept: "IT",
    city: "Chennai",
    salary: 75000,
    skills: ["Java", "MongoDB"]
  },
  {
    _id: 4,
    name: "Deepa",
    dept: "Finance",
    city: "Pune",
    salary: 52000,
    skills: ["Excel", "Tally"]
  },
  {
    _id: 5,
    name: "Elan",
    dept: "IT",
    city: "Bengaluru",
    salary: 68000,
    skills: ["Python", "Docker"]
  },
  {
    _id: 6,
    name: "Farida",
    dept: "HR",
    city: "Delhi",
    salary: 48000,
    skills: ["Communication", "Recruitment"]
  },
  {
    _id: 7,
    name: "Gokul",
    dept: "Finance",
    city: "Chennai",
    salary: 58000,
    skills: ["Tally", "Excel"]
  },
  {
    _id: 8,
    name: "Hema",
    dept: "IT",
    city: "Pune",
    salary: 82000,
    skills: ["MongoDB", "Kubernetes"]
  }
]);

// ------------------------------------------------------------
// Task 1: Explain IT department query without an index
// ------------------------------------------------------------
print("\nTASK 1: Explain IT query before creating indexes");
printjson(
  db.employees.find({ dept: "IT" }).explain("executionStats")
);

// ------------------------------------------------------------
// Task 2: Create single-field index on dept and explain again
// ------------------------------------------------------------
print("\nTASK 2: Create single-field index on dept");
print("Created index:");
print(db.employees.createIndex({ dept: 1 }));

print("Explain IT query after dept index:");
printjson(
  db.employees.find({ dept: "IT" }).explain("executionStats")
);

// ------------------------------------------------------------
// Task 3: Compound index dept ascending, salary descending
// Find IT employees from highest salary to lowest.
// ------------------------------------------------------------
print("\nTASK 3: Create compound index on dept and salary");
print("Created index:");
print(
  db.employees.createIndex({
    dept: 1,
    salary: -1
  })
);

print("IT employees sorted by salary descending:");
printjson(
  db.employees.find({ dept: "IT" }).sort({ salary: -1 }).toArray()
);

print("Explain sorted IT query:");
printjson(
  db.employees.find({ dept: "IT" })
    .sort({ salary: -1 })
    .explain("executionStats")
);

// ------------------------------------------------------------
// Task 4: Create multikey index on skills array and search MongoDB
// ------------------------------------------------------------
print("\nTASK 4: Create multikey index on skills");
print("Created index:");
print(db.employees.createIndex({ skills: 1 }));

print("Employees who know MongoDB:");
printjson(
  db.employees.find({ skills: "MongoDB" }).toArray()
);

print("Explain MongoDB skill query:");
printjson(
  db.employees.find({ skills: "MongoDB" }).explain("executionStats")
);

// ------------------------------------------------------------
// Task 5: Hide skills_1, explain query, then unhide and explain again
// ------------------------------------------------------------
print("\nTASK 5: Hide skills_1 index");
printjson(db.employees.hideIndex("skills_1"));

print("Explain query while skills_1 is hidden:");
printjson(
  db.employees.find({ skills: "MongoDB" }).explain("executionStats")
);

print("Unhide skills_1 index:");
printjson(db.employees.unhideIndex("skills_1"));

print("Explain query after skills_1 is unhidden:");
printjson(
  db.employees.find({ skills: "MongoDB" }).explain("executionStats")
);

// ------------------------------------------------------------
// Task 6: Attempt unique index on city (expected to fail because
// Chennai is repeated). Then create unique index on name.
// ------------------------------------------------------------
print("\nTASK 6: Attempt unique index on city (expected duplicate error)");
try {
  print(db.employees.createIndex(
    { city: 1 },
    { unique: true }
  ));
} catch (error) {
  print("Expected error while creating unique city index:");
  print(error.message);
}

print("Create unique index on employee name:");
print(
  db.employees.createIndex(
    { name: 1 },
    { unique: true }
  )
);

// ------------------------------------------------------------
// Task 7: List all indexes on employees collection
// ------------------------------------------------------------
print("\nTASK 7: List all indexes");
printjson(db.employees.getIndexes());

/*
 results:
- Task 1: COLLSCAN, nReturned 4, totalDocsExamined 8
- Task 2: dept_1 index; query should use IXSCAN (often under FETCH)
- Task 3: dept_1_salary_-1; IT salary order:
  Hema 82000, Charan 75000, Elan 68000, Anil 50000
  Query should not need a blocking SORT stage.
- Task 4: skills_1; isMultiKey true; MongoDB matches Anil, Charan, Hema
- Task 5: hidden index is ignored (COLLSCAN); after unhide it can be used again
- Task 6: unique city index fails because Chennai occurs more than once;
  unique name index succeeds because all names are distinct.
- Task 7: indexes include _id_, dept_1, dept_1_salary_-1, skills_1, name_1.
*/
