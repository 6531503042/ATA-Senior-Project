package dev.bengi.feedbackservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Collection;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class CollectionResponse<T> {

    private Collection<T> items;
    private String content;
    private int page;
    private int size;
    private long totalElements;
    private int totalPages;
}