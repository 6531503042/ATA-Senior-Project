package dev.bengi.main.modules.submit.dto;

import dev.bengi.main.modules.submit.model.Submit;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-10-08T05:35:23+0700",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.44.0.v20251001-1143, environment: Java 21.0.8 (Eclipse Adoptium)"
)
@Component
public class SubmitMapperImpl implements SubmitMapper {

    @Override
    public Submit toEntity(SubmitRequestDto req) {
        if ( req == null ) {
            return null;
        }

        Submit submit = new Submit();

        submit.setFeedbackId( req.feedbackId() );
        submit.setOverallComments( req.overallComments() );
        submit.setPrivacyLevel( req.privacyLevel() );
        Map<Long, String> map = req.responses();
        if ( map != null ) {
            submit.setResponses( new LinkedHashMap<Long, String>( map ) );
        }

        submit.setAnonymous( req.privacyLevel().name().equals("ANONYMOUS") );
        submit.setReviewed( false );

        return submit;
    }
}
