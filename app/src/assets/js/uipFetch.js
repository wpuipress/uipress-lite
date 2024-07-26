import { getCurrentInstance } from "vue";
import { notify } from "@/assets/js/functions/notify.js";
import { useAppStore } from "@/store/app/app.js";

/**
 * Wrapper for fetch
 *
 * Handles errors and automatic fetch types
 *
 * @param {string} endpoint
 * @param {string} type - POST | GET | DELETE
 * @param {object} data
 * @param {boolean} whether the data is formData
 * @param {object} Whether to use a specific site to query instead of current
 *
 */
export const uipFetch = async ({ endpoint = "", type = "GET", data = {}, params = {} }) => {
  const appStore = useAppStore();

  // Only get it once
  const restNonce = appStore.state.restNonce;
  const restBase = appStore.state.restBase;

  const payload = { method: type, headers: {} };

  // Inject body
  if (type != "GET") payload.body = JSON.stringify(data);

  payload.headers = { "Content-Type": "application/json", "X-WP-Nonce": restNonce };

  const queryString = getParams(params);

  const response = await fetch(`${restBase}${endpoint}${queryString}`, payload);

  // Generic error
  if (!response.ok) {
    try {
      const errorResponse = await response.json();
      return doError("Unable to connect", errorResponse.message, true);
    } catch (err) {
      return doError("Unable to connect", "Unable to connect to remote services at this time", true);
    }
  }

  // Get response
  const result = await response.json();

  // Server error
  if (result.error) return doError(result.title || result.error, result.message);

  const totalItems = response.headers.get("X-WP-Total");
  const totalPages = response.headers.get("X-WP-TotalPages");

  return { data: result, totalItems, totalPages };
};

/**
 * Helper function for errors
 *
 * @param {String} - title
 * @param {String} - message
 *
 * @since 0.0.1
 */
const doError = (title, message, dontLog) => {
  notify({ type: "error", title, message });
};

/**
 * Formats params into a URL query string, excluding null and undefined values
 *
 * @param {Object} params - The parameters to be formatted
 * @returns {string} The formatted query string, including the leading '?' if non-empty
 *
 * @since 4.0.0
 */
const getParams = (params) => {
  if (!params || typeof params !== "object") return "";

  const filteredParams = Object.entries(params)
    .filter(([_, value]) => value != null && value != "")
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

  const queryParams = new URLSearchParams(filteredParams);
  const queryString = queryParams.toString();

  return queryString ? `?${queryString}` : "";
};
