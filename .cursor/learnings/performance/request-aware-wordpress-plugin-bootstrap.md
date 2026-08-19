# Request-Aware WordPress Plugin Bootstrap

**Date:** 2026-07-17
**Category:** performance
**Context:** Reviewing a reported 22 MB uiXpress memory peak on frontend requests.

## The Problem

The plugin-performance collector reported `memory_get_peak_usage(true)` from the shared PHP process as if each plugin owned that memory. The UI then summed overlapping peaks, producing a 200 MB combined value from repeated 20–24 MB rows.

Separately, `UiXpress::__construct()` instantiated roughly 50 admin and REST services on every request. Public requests parsed classes, registered hooks, and loaded WordPress admin dependencies that could not run on the frontend.

## The Solution

Measure uiXpress directly from plugin entry through app construction using both emalloc usage and allocator-reserved usage. Treat later hook-level memory as observed shared-process growth, not plugin ownership.

Split bootstrap into:

- Always-on core services.
- Admin/REST services started immediately for admin/AJAX or at early `rest_api_init`.
- Cron services started only for cron/backoffice contexts.
- Activity services started only when the feature is enabled.

Move plugin/theme/update `wp-admin/includes` loads from file scope to REST route initialization, cache successful analytics table checks, and omit admin-only toolbar bootstrap data on logged-in frontend pages.

## Why It Matters

PHP cannot attribute a shared request heap to plugins after the fact. A global process peak is useful for page capacity planning, but it is not a per-plugin metric. Direct lifecycle checkpoints provide a defensible uiXpress bootstrap delta.

On the local homepage, contextual bootstrap changed:

- Retained memory: 948,464 B to 482,592 B (49.1% lower).
- Included files: 110 to 33.
- Declared classes: 106 to 29.
- Warm construction time: about 1.96 ms to 1.07 ms.
- Allocator-reserved delta after bootstrap: 0 B in both measured modes.

## Example

```php
add_action("rest_api_init", [$this, "start_backoffice_services"], -1000);

if (is_admin() || wp_doing_ajax()) {
    $this->start_backoffice_services();
} elseif (wp_doing_cron()) {
    $this->start_cron_services();
}
```

Registering the bootstrap callback before normal REST callbacks allows constructors to add their route callbacks during `rest_api_init` without loading them on public HTML requests.

## Related Files

- `uixpress.php`
- `admin/src/App/UiXpress.php`
- `admin/src/Performance/BootstrapMetrics.php`
- `admin/src/Rest/PluginMetricsCollector.php`
- `app/src/pages/plugins/src/usePluginPerformance.js`

## Tags

#wordpress #php #memory #bootstrap #rest-api #profiling
