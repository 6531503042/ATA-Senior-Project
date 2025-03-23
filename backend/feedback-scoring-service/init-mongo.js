// Create feedback_analytics database user
db.createUser(
  {
    user: "feedback_user",
    pwd: "feedback_password",
    roles: [
      {
        role: "readWrite",
        db: "feedback_analytics"
      }
    ]
  }
);

// Create collections
db = db.getSiblingDB('feedback_analytics');

db.createCollection('feedback_submissions');
db.createCollection('scoring_results');
db.createCollection('text_analyses');

// Create collections with validation
db.createCollection('feedback_analyses', {
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
                question_analyses: { bsonType: "array" }
            }
        }
    }
});

// Create indexes
db.feedback_submissions.createIndex({ "feedback_id": 1 });
db.scoring_results.createIndex({ "feedback_id": 1 });
db.text_analyses.createIndex({ "text_hash": 1 }, { unique: true });
db.feedback_analyses.createIndex({ "feedback_id": 1 }, { unique: true });
db.feedback_analyses.createIndex({ "project_id": 1 });
db.feedback_analyses.createIndex({ "submitted_by": 1 }); 