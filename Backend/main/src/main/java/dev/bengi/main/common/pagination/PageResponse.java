package dev.bengi.main.common.pagination;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Generic page response for paginated data
 * Provides comprehensive pagination metadata
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PageResponse<T> {
    
    private List<T> content;           // The actual data
    private PageInfo pageInfo;         // Pagination metadata
    private long totalElements;       // Total number of elements
    private int totalPages;           // Total number of pages
    private boolean first;            // Is this the first page?
    private boolean last;             // Is this the last page?
    private boolean hasNext;          // Has next page?
    private boolean hasPrevious;      // Has previous page?
    private String nextCursor;        // Cursor for next page (optional)
    private String previousCursor;    // Cursor for previous page (optional)

    public static <T> PageResponse<T> of(List<T> content, PageRequest pageRequest, long totalElements) {
        PageResponse<T> response = new PageResponse<>();
        response.content = content;
        response.totalElements = totalElements;
        
        // Create page info
        PageInfo pageInfo = new PageInfo();
        pageInfo.setPage(pageRequest.getPage());
        pageInfo.setLimit(pageRequest.getLimit());
        pageInfo.setSortBy(pageRequest.getSortBy());
        pageInfo.setSortDir(pageRequest.getSortDir());
        pageInfo.setSearch(pageRequest.getSearch());
        response.pageInfo = pageInfo;
        
        // Calculate pagination metadata
        if (pageRequest.hasLimit()) {
            response.totalPages = (int) Math.ceil((double) totalElements / pageRequest.getLimit());
            response.first = pageRequest.getPage() == 0;
            response.last = pageRequest.getPage() >= response.totalPages - 1;
            response.hasNext = !response.last && totalElements > 0;
            response.hasPrevious = !response.first;
        } else {
            // No pagination
            response.totalPages = 1;
            response.first = true;
            response.last = true;
            response.hasNext = false;
            response.hasPrevious = false;
        }
        
        return response;
    }

    public static <T> PageResponse<T> empty(PageRequest pageRequest) {
        return of(List.of(), pageRequest, 0);
    }

    public static <T> PageResponse<T> single(T item, PageRequest pageRequest) {
        return of(List.of(item), pageRequest, 1);
    }

    @Data
    @NoArgsConstructor 
    @AllArgsConstructor
    public static class PageInfo {
        private int page;
        private int limit;
        private String sortBy;
        private String sortDir;
        private String search;
    }
}
