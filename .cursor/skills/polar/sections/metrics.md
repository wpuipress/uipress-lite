# Get Metrics Limits - Polar

This section provides detailed information on how to retrieve the limits for metrics using the Polar API. It includes the necessary endpoint, request examples, response formats, and authorization requirements.

## Overview

The `Get Metrics Limits` API endpoint allows users to obtain the minimum date and limits for various time intervals (hour, day, week, month, year) when retrieving metrics data.

## Endpoint

### Request URL

```
GET https://api.polar.sh/v1/metrics/limits
```

### Authorization

- **Authorization**: `string` (header, required)
  - You can generate an Organization Access Token from your organization's settings.

## Example Code

### Go SDK Example

```go
package main

import (
	"context"
	"os"
	polargo "github.com/polarsource/polar-go"
	"log"
)

func main() {
	ctx := context.Background()

	s := polargo.New(
		polargo.WithSecurity(os.Getenv("POLAR_ACCESS_TOKEN")),
	)

	res, err := s.Metrics.Limits(ctx)
	if err != nil {
		log.Fatal(err)
	}
	if res.MetricsLimits != nil {
		// handle response
	}
}
```

## Response

### Successful Response (200 - application/json)

The response contains the following fields:

| Field        | Type          | Description                                  |
|--------------|---------------|----------------------------------------------|
| min_date     | string<date>  | Minimum date to get metrics.                 |
| intervals     | object        | Limits for each interval.                    |

#### Intervals Object

The `intervals` object contains limits for different time intervals:

| Interval | min_days | max_days |
|----------|----------|----------|
| hour     | 123      | 123      |
| day      | 123      | 123      |
| week     | 123      | 123      |
| month    | 123      | 123      |
| year     | 123      | 123      |

## Error Responses

### Common Error Codes

- **422**: Unprocessable Entity - The request was well-formed but was unable to be followed due to semantic errors.

## Conclusion

This document outlines how to use the `Get Metrics Limits` endpoint in the Polar API, including the request format, authorization requirements, and response structure. For further details, refer to the [Polar API Documentation](https://polar.sh/docs/api-reference/metrics/get-limits).