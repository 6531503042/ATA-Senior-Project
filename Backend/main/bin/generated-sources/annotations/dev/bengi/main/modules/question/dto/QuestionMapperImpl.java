package dev.bengi.main.modules.question.dto;

import dev.bengi.main.modules.question.enums.QuestionCategory;
import dev.bengi.main.modules.question.model.Question;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-10-08T05:35:23+0700",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.44.0.v20251001-1143, environment: Java 21.0.8 (Eclipse Adoptium)"
)
@Component
public class QuestionMapperImpl implements QuestionMapper {

    @Override
    public Question toEntity(QuestionRequestDto req) {
        if ( req == null ) {
            return null;
        }

        Question question = new Question();

        if ( req.category() != null ) {
            question.setCategory( Enum.valueOf( QuestionCategory.class, req.category() ) );
        }
        question.setDescription( req.description() );
        question.setQuestionType( req.questionType() );
        question.setRequired( req.required() );
        question.setText( req.text() );
        question.setValidationRules( req.validationRules() );

        return question;
    }

    @Override
    public void updateEntity(Question target, QuestionUpdateRequestDto req) {
        if ( req == null ) {
            return;
        }

        if ( req.category() != null ) {
            target.setCategory( Enum.valueOf( QuestionCategory.class, req.category() ) );
        }
        if ( req.description() != null ) {
            target.setDescription( req.description() );
        }
        if ( req.questionType() != null ) {
            target.setQuestionType( req.questionType() );
        }
        if ( req.required() != null ) {
            target.setRequired( req.required() );
        }
        if ( req.text() != null ) {
            target.setText( req.text() );
        }
        if ( req.validationRules() != null ) {
            target.setValidationRules( req.validationRules() );
        }
    }
}
