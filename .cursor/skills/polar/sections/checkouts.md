# Create Checkout Session - Polar

This section provides detailed information on how to create a checkout session using the Polar API. It includes the necessary request structure, parameters, and response formats.

## Overview

The `Create Checkout Session` API allows you to initiate a checkout process for a list of products. Customers can select from these products, and metadata set on the checkout will be copied to the resulting order or subscription.

## Endpoint

### POST Request

```
POST https://api.polar.sh/v1/checkouts
```

## Authorization

You must include an Organization Access Token in the header for authorization.

```
Authorization: Bearer <your_access_token>
```

## Request Body

The request body must be in `application/json` format and include the following fields:

| Field                     | Type                     | Required | Description                                                                                   |
|---------------------------|--------------------------|----------|-----------------------------------------------------------------------------------------------|
| products                  | string<uuid4>[]          | Yes      | List of product IDs available to select at checkout. Minimum length: 1.                      |
| trial_interval            | enum<string> | null     | The interval unit for the trial period. Options: `day`, `week`, `month`, `year`.            |
| trial_interval_count      | integer | null         | Number of interval units for the trial period. Range: `1 <= x <= 1000`.                     |
| metadata                  | object                   | No       | Key-value pairs for additional information (max 50 pairs).                                  |
| custom_field_data         | object                   | No       | Key-value pairs for custom field values.                                                    |
| discount_id               | string<uuid4> | null    | ID of the discount to apply to the checkout.                                                |
| allow_discount_codes      | boolean                  | No       | Default: true. Whether to allow discount codes.                                             |
| require_billing_address   | boolean                  | No       | Default: false. Whether to require full billing address.                                     |
| amount                    | integer | null         | Amount in cents before discounts and taxes. Range: `0 <= x <= 99999999`.                   |
| seats                     | integer | null         | Number of seats for seat-based pricing. Range: `1 <= x <= 1000`.                            |
| allow_trial               | boolean                  | No       | Default: true. Whether to enable the trial period.                                          |
| customer_id               | string<uuid4> | null    | ID of an existing customer in the organization.                                             |
| is_business_customer      | boolean                  | No       | Default: false. Whether the customer is a business.                                         |
| external_customer_id      | string | null          | ID of the customer in your system.                                                          |
| customer_name             | string | null          | Name of the customer. Maximum length: 256.                                                  |
| customer_email            | string<email> | null    | Email address of the customer.                                                               |
| customer_ip_address       | string<ipvanyaddress> | null | IP address of the customer.                                                                  |
| customer_billing_name     | string | null          | Billing name of the customer.                                                                 |
| customer_billing_address   | AddressInput | object   | Billing address of the customer.                                                             |
| customer_tax_id           | string | null          | Tax ID of the customer.                                                                       |
| customer_metadata         | object                   | No       | Key-value pairs for additional customer information.                                         |
| subscription_id           | string<uuid4> | null    | ID of a subscription to upgrade.                                                             |
| success_url               | string<uri> | null      | URL for redirection after successful payment.                                                |
| return_url                | string<uri> | null      | URL for the back button in the checkout.                                                    |
| embed_origin              | string | null          | Origin of the embedding page for embedded checkout sessions.                                  |
| currency                  | enum<string> | null      | Available options: `usd`, `eur`, `gbp`, `cad`, `aud`, `jpy`, `chf`, `sek`.                  |
| prices                    | object                   | No       | Mapping of product IDs to a list of ad-hoc prices.                                          |

### Example Request

```json
{
  "products": ["<value 1>", "<value 2>", "<value 3>"],
  "trial_interval": "day",
  "trial_interval_count": 30,
  "metadata": {
    "key1": "value1",
    "key2": "value2"
  },
  "allow_discount_codes": true,
  "require_billing_address": true,
  "customer_name": "John Doe",
  "customer_email": "john.doe@example.com"
}
```

## Response

### Success Response

**Status Code:** `201 Created`

The response will contain the details of the created checkout session.

```json
{
  "id": "<string>",
  "created_at": "2023-11-07T05:31:56Z",
  "modified_at": "2023-11-07T05:31:56Z",
  "payment_processor": "stripe",
  "status": "open",
  "client_secret": "<string>",
  "url": "<string>",
  "expires_at": "2023-11-07T05:31:56Z",
  "success_url": "<string>",
  "return_url": "<string>",
  "amount": 123,
  "currency": "<string>",
  "customer_id": "<string>",
  "customer_name": "<string>",
  "customer_email": "<string>",
  "customer_billing_address": {
    "country": "AD",
    "line1": "<string>",
    "line2": "<string>",
    "postal_code": "<string>",
    "city": "<string>",
    "state": "<string>"
  }
}
```

### Error Responses

- **422 Unprocessable Entity**: If the request body is invalid or missing required fields.

## Conclusion

This section provides the necessary details to create a checkout session using the Polar API. Ensure to follow the structure and include all required fields in your request for successful session creation.