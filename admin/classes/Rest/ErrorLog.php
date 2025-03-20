<?php
namespace UipressLite\Classes\Rest;

// Prevent direct access to this file
defined("ABSPATH") || exit();

/**
 * Class PostMetaQuery
 *
 * Extends rest api to handle meta query objects
 */
class ErrorLog
{
  /**
   * PostMetaQuery constructor.
   */
  public function __construct()
  {
    add_action("rest_api_init", ["UipressLite\Classes\Rest\ErrorLog", "register_custom_endpoint"]);
  }

  /**
   * Registers custom properties for all public post types.
   */
  public static function register_custom_endpoint()
  {
    register_rest_route("uipress/v1", "/errorlog", [
      "methods" => "GET",
      "callback" => ["UipressLite\Classes\Rest\ErrorLog", "get_error_items"],
      "permission_callback" => function () {
        return current_user_can("manage_options");
      },
    ]);
  }

  /**
   * Checks for meta query and pushes it to request
   *
   * @return Array
   * @since 3.2.13
   */
  public static function get_error_items($request)
  {
    // Get the pagination and search parameters from the request
    $page = $request->get_param("page") ? intval($request->get_param("page")) : 1;
    $per_page = $request->get_param("per_page") ? intval($request->get_param("per_page")) : 10;
    $search = $request->get_param("search") ? sanitize_text_field($request->get_param("search")) : "";

    $logdir = self::get_log_directory();

    if (is_wp_error($logdir)) {
      return $logdir;
    }

    $errors = self::prepare_errors($logdir, $per_page, "desc", $search, $page);

    // Set the response headers
    $response = new \WP_REST_Response($errors["errors"]);
    $response->header("X-WP-Total", $errors["totalFound"]);
    $response->header("X-WP-TotalPages", $errors["totalPages"]);

    return $response;
  }

  /**
   * Gets the log directory
   *
   * @since 3.2.13
   */
  public static function get_log_directory()
  {
    $logdir = ini_get("error_log");

    if (is_wp_error($logdir)) {
      $error_string = $logdir->get_error_message();
      // Log file does not exist
      $returndata["error"] = true;
      $returndata["message"] = __("Log file does not exist", "uipress-lite");
      $returndata["description"] = $error_string;
      return new \WP_Error("log_file_not_found", $returndata["message"], ["status" => 404]);
    }

    // Check if error_log is set to a file path
    if (is_string($logdir) && !empty($logdir)) {
      // Check if the log file exists
      if (file_exists($logdir)) {
        // Log file exists, return the directory path
        return $logdir;
      } else {
        // Log file does not exist
        $returndata["error"] = true;
        $returndata["message"] = __("Log file does not exist", "uipress-lite");
        $returndata["description"] = __("The specified PHP error log path does not exist. Path: ", "uipress-lite") . $logdir;
        return new \WP_Error("log_file_not_found", $returndata["message"], ["status" => 404]);
      }
    }

    // Check if error_log is set to 'syslog'
    if ($logdir === "syslog") {
      // Errors are logged to the system log
      $returndata["error"] = true;
      $returndata["message"] = __("Errors are logged to the system log", "uipress-lite");
      $returndata["description"] = __("The PHP error_log directive is set to 'syslog'. Please check your system log for errors.", "uipress-lite");
      return new \WP_Error("syslog_logging", $returndata["message"], ["status" => 400]);
    }

    // Check if error_log is set to 'stderr'
    if ($logdir === "stderr") {
      // Errors are sent to the standard error output
      $returndata["error"] = true;
      $returndata["message"] = __("Errors are sent to the standard error output", "uipress-lite");
      $returndata["description"] = __("The PHP error_log directive is set to 'stderr'. Errors are not logged to a file.", "uipress-lite");
      return new \WP_Error("stderr_logging", $returndata["message"], ["status" => 400]);
    }

    // Unable to determine the error log directory
    $returndata["error"] = true;
    $returndata["message"] = __("Unable to determine the error log directory", "uipress-lite");
    $returndata["description"] = __("The PHP error_log directive is not set or has an unsupported value.", "uipress-lite");
    return new \WP_Error("error_log_not_set", $returndata["message"], ["status" => 500]);
  }

  /**
   * Gets all errors and filters based on input / search / per page
   *
   * @since 3.2.13
   * @param string $logdir The directory path of the error log file
   * @param int $perPage The number of errors to display per page
   * @param string $order The order of the errors ("asc" or "desc")
   * @param string $search The search term to filter errors
   * @param int $page The current page number
   * @return array An array containing the errors, total found, and total pages
   */
  public static function prepare_errors($logdir, $perPage, $order, $search, $page)
  {
    $allErrors = [];
    foreach (self::parse($logdir) as $errors) {
      $allErrors[] = $errors;
    }

    $allErrors = $allErrors[0];

    if ($search !== "") {
      $searchLower = strtolower($search);
      $filteredErrors = [];

      foreach ($allErrors as $error) {
        if (!$error || !isset($error["message"])) {
          continue;
        }

        $messageLower = strtolower($error["message"]);
        $fileLower = strtolower($error["file"]);
        $traceLower = strtolower(wp_json_encode($error["stackTrace"]));

        if (strpos($messageLower, $searchLower) !== false || strpos($fileLower, $searchLower) !== false || strpos($traceLower, $searchLower) !== false) {
          $filteredErrors[] = $error;
        }
      }

      $allErrors = $filteredErrors;
    }

    $totalFound = count($allErrors);
    $totalPages = ceil($totalFound / $perPage);

    if ($order === "desc") {
      $allErrors = array_reverse($allErrors);
    }

    $startPoint = $perPage * ($page - 1);
    $allErrors = array_slice($allErrors, $startPoint, $perPage);

    return ["errors" => $allErrors, "totalFound" => $totalFound, "totalPages" => $totalPages];
  }

  /**
   * Parses the given error log file using WP_Filesystem
   *
   * @since 3.2.13
   * @param string $logFilePath The file path of the error log
   * @return \Generator A generator yielding the parsed errors
   */
  private static function parse($logFilePath)
  {
    // Ensure that the WordPress filesystem abstraction is loaded
    require_once ABSPATH . "wp-admin/includes/file.php";

    // Initialize the WP_Filesystem
    global $wp_filesystem;
    if (!WP_Filesystem()) {
      yield [];
      return;
    }

    // Check if the file exists and is readable
    if (!$wp_filesystem->exists($logFilePath) || !$wp_filesystem->is_readable($logFilePath)) {
      yield [];
      return;
    }

    $parsedLogs = [];
    $key = -1;
    $date_format = get_option("date_format");
    $time_format = get_option("time_format");

    // Read the file content line by line
    $lines = $wp_filesystem->get_contents_array($logFilePath);
    if ($lines === false) {
      yield [];
      return;
    }

    foreach ($lines as $currentLine) {
      $currentLine = str_replace(PHP_EOL, "", $currentLine);
      if (!isset($currentLine[0])) {
        continue;
      }
      // Normal error log line starts with the date & time in []
      if ("[" === $currentLine[0] && !preg_match("/Stack trace/", $currentLine) && !preg_match("/.*PHP.*[0-9]\. /", $currentLine)) {
        $key += 1;
        // Get the datetime when the error occurred and convert it to formatted
        try {
          $dateArr = [];
          preg_match("~^\[(.*?)\]~", $currentLine, $dateArr);
          $currentLine = str_replace($dateArr[0], "", $currentLine);
          $currentLine = trim($currentLine);
          $errorDate = gmdate($date_format, strtotime($dateArr[1]));
          $errorTime = gmdate($time_format, strtotime($dateArr[1]));
        } catch (\Exception $e) {
          $errorDate = "unknown date";
          $errorTime = "unknown time";
        }
        // Get the type of the error
        $errorTypes = [
          "PHP Warning" => "WARNING",
          "PHP Notice" => "NOTICE",
          "PHP Fatal error" => "FATAL",
          "PHP Parse error" => "SYNTAX",
          "PHP Exception" => "EXCEPTION",
        ];
        $errorType = "MESSAGE";
        foreach ($errorTypes as $prefix => $type) {
          if (false !== strpos($currentLine, $prefix)) {
            $errorType = $type;
            $currentLine = str_replace($prefix . ":", "", $currentLine);
            $currentLine = trim($currentLine);
            break;
          }
        }
        if (preg_match("/on line (\d+)/", $currentLine, $matches)) {
          $errorLine = (int) $matches[1];
          $currentLine = str_replace(" on line " . $matches[1], "", $currentLine);
        } else {
          $errorLine = 0;
        }
        $errorFile = explode(" in /", $currentLine);
        if (isset($errorFile[1])) {
          $errorFile = "/" . trim($errorFile[1]);
        } else {
          $errorFile = "";
        }
        $currentLine = str_replace(" in " . $errorFile, "", $currentLine);
        // The message of the error
        $errorMessage = trim($currentLine);
        $parsedLogs[] = [
          "date" => $errorDate,
          "time" => $errorTime,
          "type" => $errorType,
          "file" => $errorFile,
          "line" => self::extractLineNumber($errorFile),
          "message" => $errorMessage,
          "stackTrace" => [],
        ];
      } elseif (preg_match("/Stack trace:/", $currentLine)) {
        continue;
      } elseif ("#" === $currentLine[0]) {
        if (preg_match("/#[0-9]\s/", $currentLine, $matches)) {
          $pieces = explode($matches[0], $currentLine);
          $currentLine = $pieces[1];
          $parsedLogs[$key]["stackTrace"][] = trim($currentLine);
        }
      } elseif (preg_match("/.*PHP.*[0-9]\. /", $currentLine, $matches)) {
        $pieces = explode($matches[0], $currentLine);
        $currentLine = $pieces[1];
        $parsedLogs[$key]["stackTrace"][] = trim($currentLine);
      }
    }

    yield $parsedLogs;
  }

  /**
   * Extracts the line number from the end of a file path.
   *
   * @param string $filePath The file path string containing the line number at the end.
   * @return int|null The extracted line number as an integer, or null if no line number is found.
   */
  public static function extractLineNumber($filePath)
  {
    // Check if the file path contains a colon followed by a number at the end
    if (preg_match('/:\d+$/', $filePath, $matches)) {
      // Extract the number after the colon
      $lineNumber = substr($matches[0], 1);
      return intval($lineNumber);
    }

    // If no line number is found, return null or a default value
    return null;
  }
}
