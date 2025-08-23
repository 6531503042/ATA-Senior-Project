package dev.bengi.main.common.pagination;

import org.springframework.stereotype.Service;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Set;
import java.util.function.Function;

/**
 * Service for handling pagination logic and SQL query building
 * Provides utilities for common pagination patterns
 */
@Service
public class PaginationService {

    // Default values
    public static final int DEFAULT_PAGE = 0;
    public static final int DEFAULT_LIMIT = 10;
    public static final int MAX_LIMIT = 100;

    /**
     * Parse pagination parameters from HTTP request
     */
    public PageRequest parsePageRequest(ServerWebExchange exchange) {
        var request = exchange.getRequest();
        var queryParams = request.getQueryParams();

        // Parse parameters with defaults
        int page = parseIntParam(queryParams.getFirst("page"), DEFAULT_PAGE);
        int limit = parseIntParam(queryParams.getFirst("limit"), DEFAULT_LIMIT);
        String sortBy = queryParams.getFirst("sortBy");
        String sortDir = queryParams.getFirst("sortDir");
        String search = queryParams.getFirst("search");
        String cursor = queryParams.getFirst("cursor");

        // Apply limits and validation
        if (limit > MAX_LIMIT) limit = MAX_LIMIT;
        
        PageRequest pageRequest = new PageRequest(page, limit, sortBy, sortDir, search, cursor);
        return pageRequest.validate();
    }

    /**
     * Build ORDER BY clause for SQL queries
     */
    public String buildOrderByClause(PageRequest pageRequest, Set<String> allowedSortFields) {
        String sortBy = pageRequest.getSortBy();
        
        // Validate sort field
        if (!allowedSortFields.contains(sortBy)) {
            sortBy = "id"; // Fallback to id
        }
        
        String direction = pageRequest.isAscending() ? "ASC" : "DESC";
        return String.format("ORDER BY %s %s", sortBy, direction);
    }

    /**
     * Build LIMIT clause for SQL queries
     */
    public String buildLimitClause(PageRequest pageRequest) {
        if (!pageRequest.hasLimit()) {
            return "";
        }
        return String.format("LIMIT %d OFFSET %d", pageRequest.getLimit(), pageRequest.getOffset());
    }

    /**
     * Build complete SQL query with pagination
     */
    public String buildPaginatedQuery(String baseQuery, PageRequest pageRequest, Set<String> allowedSortFields) {
        StringBuilder query = new StringBuilder(baseQuery);
        
        // Add ORDER BY
        query.append(" ").append(buildOrderByClause(pageRequest, allowedSortFields));
        
        // Add LIMIT/OFFSET
        String limitClause = buildLimitClause(pageRequest);
        if (!limitClause.isEmpty()) {
            query.append(" ").append(limitClause);
        }
        
        return query.toString();
    }

    /**
     * Build search WHERE clause
     */
    public String buildSearchClause(PageRequest pageRequest, Set<String> searchableFields) {
        if (!pageRequest.hasSearch() || searchableFields.isEmpty()) {
            return "";
        }

        String searchTerm = pageRequest.getSearch().toLowerCase();
        StringBuilder clause = new StringBuilder(" AND (");
        
        boolean first = true;
        for (String field : searchableFields) {
            if (!first) clause.append(" OR ");
            clause.append(String.format("LOWER(%s) LIKE '%%%s%%'", field, searchTerm));
            first = false;
        }
        
        clause.append(")");
        return clause.toString();
    }

    /**
     * Execute paginated query with automatic count
     */
    public <T> Mono<PageResponse<T>> executePaginatedQuery(
            String baseQuery,
            String countQuery,
            PageRequest pageRequest,
            Set<String> allowedSortFields,
            Set<String> searchableFields,
            Function<String, Flux<T>> queryExecutor,
            Function<String, Mono<Long>> countExecutor) {
        
        // Build search clause
        String searchClause = buildSearchClause(pageRequest, searchableFields);
        
        // Build final queries
        String finalCountQuery = countQuery + searchClause;
        String finalDataQuery = buildPaginatedQuery(baseQuery + searchClause, pageRequest, allowedSortFields);
        
        // Execute count and data queries in parallel
        Mono<Long> totalCountMono = countExecutor.apply(finalCountQuery);
        Mono<java.util.List<T>> contentMono = queryExecutor.apply(finalDataQuery).collectList();
        
        return Mono.zip(totalCountMono, contentMono)
                .map(tuple -> PageResponse.of(tuple.getT2(), pageRequest, tuple.getT1()));
    }

    /**
     * Simple pagination for small datasets (load all then paginate in memory)
     */
    public <T> Mono<PageResponse<T>> paginateInMemory(Flux<T> allData, PageRequest pageRequest) {
        return allData.collectList()
                .map(list -> {
                    long totalElements = list.size();
                    
                    if (!pageRequest.hasLimit()) {
                        return PageResponse.of(list, pageRequest, totalElements);
                    }
                    
                    int start = (int) pageRequest.getOffset();
                    int end = Math.min(start + pageRequest.getLimit(), list.size());
                    
                    if (start >= list.size()) {
                        return PageResponse.empty(pageRequest);
                    }
                    
                    java.util.List<T> pagedContent = list.subList(start, end);
                    return PageResponse.of(pagedContent, pageRequest, totalElements);
                });
    }

    private int parseIntParam(String value, int defaultValue) {
        if (value == null || value.isEmpty()) {
            return defaultValue;
        }
        try {
            return Integer.parseInt(value);
        } catch (NumberFormatException e) {
            return defaultValue;
        }
    }
}
