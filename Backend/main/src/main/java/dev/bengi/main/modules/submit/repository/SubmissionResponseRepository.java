package dev.bengi.main.modules.submit.repository;

import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;

public interface SubmissionResponseRepository extends R2dbcRepository<SubmissionResponseRepository.Row, Long> {

    @Query("INSERT INTO submission_responses(submission_id, question_id, response) VALUES (:submissionId, :questionId, :response) ON CONFLICT (submission_id, question_id) DO UPDATE SET response = EXCLUDED.response")
    Flux<Void> upsertResponse(Long submissionId, Long questionId, String response);

    @Query("SELECT question_id FROM submission_responses WHERE submission_id = :submissionId")
    Flux<Long> findQuestionIdsBySubmission(Long submissionId);

    @Query("SELECT question_id, response FROM submission_responses WHERE submission_id = :submissionId")
    Flux<ResponseRow> findResponsesBySubmission(Long submissionId);

    class ResponseRow {
        public Long questionId;
        public String response;
        
        public ResponseRow() {}
        public ResponseRow(Long questionId, String response) {
            this.questionId = questionId;
            this.response = response;
        }
    }

    class Row { public Long id; }
}


