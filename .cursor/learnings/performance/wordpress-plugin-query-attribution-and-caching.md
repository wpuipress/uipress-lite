# WordPress Plugin Query Attribution and Cache Safety

**Date:** 2026-07-17
**Category:** performance
**Context:** Reducing uiXpress SQL while keeping plugin impact rankings and multisite settings behavior accurate.

## The Problem

The WordPress `query` filter runs before SQL execution. A tracker defined inside the measured plugin appears in its own backtrace, so scanning the whole trace once per plugin attributed one query to uiXpress and potentially several other plugins. The recorded elapsed value measured profiler work, not database duration.

Steady-state uiXpress bootstrap also queried separate non-autoloaded migration markers and bypassed the option cache for the private settings slice. JSON repository writes used `wp_cache_flush()`, evicting unrelated persistent caches.

## The Solution

Resolve only the nearest non-infrastructure plugin frame and assign each observed query to at most one plugin. Report the global post-`plugins_loaded` `$wpdb->num_queries` delta separately, and keep bootstrap query deltas diagnostic-only.

Store tiny migration/schema markers in `alloptions`, cache private settings by config blog with complete invalidation, and use request-local repository memoization plus namespaced cache deletion. Preserve the private settings query when no persistent object cache exists instead of autoloading credentials.

Feature-specific reductions should preserve contracts:

- Batch activity inserts and cache table readiness.
- Rebuild analytics aggregates with set-based, transactional SQL.
- Combine independent counters without changing REST response fields.
- Keep aggregate REST endpoints additive and retain individual-route fallback.

## Why It Matters

Profiler code must not become the apparent owner of work it merely observes. Cache reductions must also preserve multisite isolation and avoid exposing credentials through autoloaded options. Query-count reductions are only useful when attribution, invalidation, and response compatibility remain correct.

## Example

```php
$origin = $tracker->resolveOrigin($backtrace, $hook_stack);
if ($origin) {
    // Record once for the nearest plugin only.
}

$observed = max(0, $wpdb->num_queries - $query_baseline);
```

## Related Files

- `admin/src/Rest/PluginMetricsCollector.php`
- `admin/src/Options/SettingsStorage.php`
- `admin/src/Migrations/MigrationState.php`
- `admin/src/Activity/ActivityLogger.php`
- `admin/src/Analytics/AnalyticsCron.php`

## Tags

#wordpress #sql #profiling #object-cache #multisite #performance
