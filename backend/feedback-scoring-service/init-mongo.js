db = db.getSiblingDB("feedback_analytics");

// Create collections with validation
db.createCollection("feedback_analyses", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["feedback_id", "project_id", "submitted_by", "submitted_at"],
      properties: {
        feedback_id: { bsonType: "number" },
        project_id: { bsonType: "number" },
        project_name: { bsonType: "string" },
        submitted_by: { bsonType: "string" },
        submitted_at: { bsonType: "date" },
        overall_score: { bsonType: "number" },
        overall_sentiment: { bsonType: "string" },
        categories: { bsonType: "array" },
        question_analyses: { bsonType: "array" },
      },
    },
  },
});

// Create indexes
db.feedback_analyses.createIndex({ feedback_id: 1 }, { unique: true });
db.feedback_analyses.createIndex({ project_id: 1 });
db.feedback_analyses.createIndex({ submitted_by: 1 });

// Create user for the application
db.createUser({
  user: "feedback_app",
  pwd: "feedback_password",
  roles: [
    {
      role: "readWrite",
      db: "feedback_analytics",
    },
  ],
});
