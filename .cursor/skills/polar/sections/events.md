# Ingest Events - Polar

This section provides detailed information on how to ingest events using the Polar API. It includes the necessary endpoints, request and response formats, and example code for implementation.

## Overview

The Ingest Events API allows users to send event data to the Polar platform. This section covers the endpoint for ingesting events, the required authorization, the request body structure, and the expected responses.

## Endpoint

### POST Request

- **URL**: `https://api.polar.sh/v1/events/ingest`
- **Sandbox URL**: `https://sandbox-api.polar.sh/v1/events/ingest`

## Authorization

- **Authorization Header**: Required
- **Type**: `string`
- **Description**: You can generate an Organization Access Token from your organization's settings.

## Request Body

The request body must be in `application/json` format and should contain a list of events to ingest.

### Required Fields

- **events**: An array of event objects. The following event types are supported:
  - `EventCreateCustomer`
  - `EventCreateExternalCustomer`

## Example Code

Here is an example of how to use the Polar Go SDK to ingest events:

```go
package main

import (
	"context"
	"os"
	polargo "github.com/polarsource/polar-go"
	"github.com/polarsource/polar-go/models/components"
	"log"
)

func main() {
    ctx := context.Background()

    s := polargo.New(
        polargo.WithSecurity(os.Getenv("POLAR_ACCESS_TOKEN")),
    )

    res, err := s.Events.Ingest(ctx, components.EventsIngest{
        Events: []components.Events{},
    })
    if err != nil {
        log.Fatal(err)
    }
    if res.EventsIngestResponse != nil {
        // handle response
    }
}
```

## Response

### Successful Response (200)

On a successful request, the response will be in `application/json` format and will include:

- **inserted**: (integer) Number of events inserted.
- **duplicates**: (integer) Number of duplicate events skipped (default: 0).

#### Example Response

```json
{
  "inserted": 123,
  "duplicates": 0
}
```

### Error Response (422)

If there is an error with the request, a 422 status code may be returned. The specific error details will be provided in the response body.

## Summary

This section outlines the process for ingesting events into the Polar platform, including the necessary API endpoint, authorization requirements, request body structure, and example code for implementation.