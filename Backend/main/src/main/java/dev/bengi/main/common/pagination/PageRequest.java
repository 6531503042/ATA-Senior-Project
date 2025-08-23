package dev.bengi.main.common.pagination;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Page request for pagination
 * Supports both offset-based and cursor-based pagination patterns
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PageRequest {
    
    private int page = 0;          // 0-based page number
    private int limit = 10;        // Number of items per page (0 = no limit)
    private String sortBy = "id";  // Field to sort by
    private String sortDir = "asc"; // Sort direction: asc or desc
    private String search;         // Optional search term
    private String cursor;         // Optional cursor for cursor-based pagination

    public static PageRequest of(int page, int limit) {
        return new PageRequest(page, limit, "id", "asc", null, null);
    }

    public static PageRequest of(int page, int limit, String sortBy, String sortDir) {
        return new PageRequest(page, limit, sortBy, sortDir, null, null);
    }

    public static PageRequest unlimited() {
        return new PageRequest(0, 0, "id", "asc", null, null);
    }

    public boolean hasLimit() {
        return limit > 0;
    }

    public long getOffset() {
        if (!hasLimit()) return 0;
        return (long) page * limit;
    }

    public boolean isAscending() {
        return "asc".equalsIgnoreCase(sortDir);
    }

    public boolean hasSearch() {
        return search != null && !search.trim().isEmpty();
    }

    public boolean hasCursor() {
        return cursor != null && !cursor.trim().isEmpty();
    }

    // Validation
    public PageRequest validate() {
        if (page < 0) this.page = 0;
        if (limit < 0) this.limit = 10;
        if (sortBy == null || sortBy.isBlank()) this.sortBy = "id";
        if (sortDir == null || (!sortDir.equalsIgnoreCase("asc") && !sortDir.equalsIgnoreCase("desc"))) {
            this.sortDir = "asc";
        }
        return this;
    }
}
