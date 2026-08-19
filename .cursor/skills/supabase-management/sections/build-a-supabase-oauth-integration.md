# Scopes for Your OAuth App

This section provides an overview of OAuth scopes within the Supabase platform, detailing the levels of access that can be specified for your OAuth app integration. Scopes are essential for restricting access to specific Supabase Management API endpoints and are set during the creation of an OAuth app in the Supabase Dashboard.

## Overview of OAuth Scopes

- **Purpose**: Scopes define the level of access your integration requires.
- **Availability**: Scopes are applicable only to OAuth apps.
- **Modification**: Scopes can be updated at any time; however, existing users must re-authorize the app to apply new scopes.

## Available Scopes

The following table outlines the available scopes, their types, and descriptions:

| Name              | Type  | Description                                                                                      |
|-------------------|-------|--------------------------------------------------------------------------------------------------|
| Auth              | Read  | Retrieve a project's auth configuration and SAML SSO providers.                                 |
| Auth              | Write | Update a project's auth configuration, and manage SAML SSO providers.                           |
| Database          | Read  | Retrieve database configuration, pooler configuration, SQL snippets, and schema types.         |
| Database          | Write | Create SQL queries, enable webhooks, and manage database configurations.                        |
| Domains           | Read  | Retrieve custom domains and vanity subdomain configurations for a project.                      |
| Domains           | Write | Manage custom domains and vanity subdomains for a project.                                      |
| Edge Functions     | Read  | Retrieve information about a project's edge functions.                                          |
| Edge Functions     | Write | Create, update, or delete an edge function.                                                    |
| Environment       | Read  | Retrieve branches in a project.                                                                  |
| Environment       | Write | Create, update, or delete a branch.                                                             |
| Organizations     | Read  | Retrieve an organization's metadata and members.                                                |
| Organizations     | Write | N/A                                                                                              |
| Projects          | Read  | Retrieve project metadata, database eligibility for upgrades, and network restrictions.         |
| Projects          | Write | Create projects, upgrade databases, and manage network restrictions.                             |
| Rest              | Read  | Retrieve a project's PostgREST configuration.                                                   |
| Rest              | Write | Update a project's PostgREST configuration.                                                     |
| Secrets           | Read  | Retrieve API keys, secrets, and pgsodium configuration for a project.                          |
| Secrets           | Write | Create or update secrets and pgsodium configuration for a project.                             |

### Additional Information

For more details on building an OAuth app integration, refer to the Supabase documentation.