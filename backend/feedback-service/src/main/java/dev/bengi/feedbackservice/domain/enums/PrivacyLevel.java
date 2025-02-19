package dev.bengi.feedbackservice.domain.enums;

public enum PrivacyLevel {
    PUBLIC,          // Feedback visible to all team members
    PRIVATE,         // Feedback visible only to managers/admins
    ANONYMOUS,       // Feedback visible but without submitter information
    CONFIDENTIAL;    // Feedback visible only to specific roles/individuals
}
