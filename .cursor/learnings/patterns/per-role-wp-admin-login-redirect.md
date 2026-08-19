# Per-role wp-admin login redirect

**Date:** 2026-08-17
**Category:** pattern
**Context:** Adding a classic-shell setting that sends each WordPress role to a different wp-admin page after login

## The Problem
WordPress `login_redirect` also receives an explicit `redirect_to` (expired sessions, “edit this post”, interim login). Always overwriting it would break those flows. Destinations must stay inside wp-admin to avoid open redirects.

## The Solution
Store `{ role, url }` rows where `url` is a relative admin PHP path (`edit.php`, `edit.php?post_type=page`). Apply the mapping only when `redirect_to` is empty or the dashboard (`wp-admin/` / `index.php`). Resolve with `admin_url($path)` and `wp_safe_redirect`. First matching role on the user wins.

## Why It Matters
This is a classic-shell feature (Login settings), not Admin Framework’s “redirect from wp-admin to uix-admin”. Keep those settings separate.

## Example
```php
add_filter('login_redirect', [$this, 'maybe_redirect_after_login'], 20, 3);
// Honour non-dashboard redirect_to; otherwise admin_url($path_for_role)
```

## Related Files
- `admin/src/Options/LoginOptions.php`
- `app/src/pages/settings/src/custom-renders/login-redirect-roles.vue`
- `admin/src/Pages/Login.php`

## Tags
#wordpress #login #redirect #settings #roles
