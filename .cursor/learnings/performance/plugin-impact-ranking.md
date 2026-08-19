# Comparable WordPress Plugin Impact Ranking

**Date:** 2026-07-17
**Category:** performance
**Context:** Correcting a plugin ranking that appeared inconsistent with its displayed execution and memory values.

## The Problem

The impact score averaged each plugin's execution time, query count, and asset bytes after independently scaling each category to its largest value. This gave every category equal influence regardless of the amount of work observed. Asset collection also included every registered asset, even when it was never requested.

Per-plugin memory was displayed beside the score despite being excluded from it. Most rows represented shared PHP process growth, while uiXpress used a direct bootstrap delta, so the values were not comparable.

## The Solution

Calculate each plugin's share of total observed work, weighted 75% toward execution time, 24% toward query count, and 1% toward delivered asset bytes. Redistribute the weights when a snapshot has no activity in a category, so measured impact shares total 100%.

Only count script and style handles that were queued, printed, or dependencies of those handles. Show query count and delivered asset size in the ranking instead of shared process memory.

## Why It Matters

A ranking should be derived from the metrics displayed beside it and should not imply that shared PHP heap growth belongs to a specific plugin. Share-based scoring also makes the number interpretable as a plugin's weighted portion of the measured workload.

## Example

```js
const weightedImpact =
  executionShare * 0.75 + queryShare * 0.24 + assetShare * 0.01;
```

## Related Files

- `app/src/pages/plugins/src/pluginImpact.js`
- `app/src/pages/plugins/src/plugin-overview.vue`
- `admin/src/Rest/PluginMetricsCollector.php`

## Tags

#wordpress #performance #ranking #assets #profiling
