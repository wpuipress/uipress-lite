<?php
namespace UipressLite\Classes\Utils;

!defined('ABSPATH') ? exit() : '';

class ErrorLog
{
  /**
   * Gets all errors and filters based on input / search / per page
   *
   * @since 3.2.13
   */
  public static function get($logdir, $perPage, $order, $search, $page)
  {
    $allErrrors = [];
    foreach (self::parse($logdir) as $err) {
      $allErrrors[] = $err;
    }

    $allErrrors = $allErrrors[0];

    if ($search && $search != '') {
      $sL = strtolower($search);
      $errHolder = $allErrrors;
      $allErrrors = [];

      foreach ($errHolder as $err) {
        if (!$err || !isset($err['message'])) {
          continue;
        }

        $hs = strtolower($err['message']);
        $file = strtolower($err['file']);
        $trace = strtolower(json_encode($err['stackTrace']));

        if (strpos($hs, $sL) !== false || strpos($file, $sL) !== false || strpos($trace, $sL) !== false) {
          $allErrrors[] = $err;
        }
      }
    }

    // Ensure array response
    if (!is_array($allErrrors)) {
      $allErrrors = [];
    }

    $totalFound = number_format(count($allErrrors));
    $totalPages = round(count($allErrrors) / $perPage);

    if ($order == 'desc') {
      $allErrrors = array_reverse($allErrrors);
      $startPoint = $perPage * $page;
      if (count($allErrrors) > $perPage) {
        $allErrrors = array_slice($allErrrors, $startPoint, $perPage);
      }
    }

    return ['errors' => $allErrrors, 'totalFound' => $totalFound, 'totalPages' => $totalPages];
  }
  /**
   * Parses given error log
   *
   * @since 3.2.13
   */
  private static function parse($logFilePath)
  {
    $parsedLogs = [];
    $logFileHandle = fopen($logFilePath, 'rb');
    $key = -1;

    while (!feof($logFileHandle)) {
      $currentLine = str_replace(PHP_EOL, '', fgets($logFileHandle));

      if (!isset($currentLine[0])) {
        continue;
      }

      // Normal error log line starts with the date & time in []
      if ('[' === $currentLine[0] && !preg_match('/Stack trace/', $currentLine) && !preg_match('/.*PHP.*[0-9]\. /', $currentLine)) {
        $key += 1;
        // Get the datetime when the error occurred and convert it to formatted
        try {
          $dateArr = [];
          preg_match('~^\[(.*?)\]~', $currentLine, $dateArr);
          $currentLine = str_replace($dateArr[0], '', $currentLine);
          $currentLine = trim($currentLine);

          $errorDate = date(get_option('date_format'), strtotime($dateArr[1]));
          $errorTime = date(get_option('time_format'), strtotime($dateArr[1]));
        } catch (\Exception $e) {
          $errorDate = 'unknown date';
          $errorTime = 'unknown time';
        }

        // Get the type of the error
        if (false !== strpos($currentLine, 'PHP Warning')) {
          $currentLine = str_replace('PHP Warning:', '', $currentLine);
          $currentLine = trim($currentLine);
          $errorType = 'WARNING';
        } elseif (false !== strpos($currentLine, 'PHP Notice')) {
          $currentLine = str_replace('PHP Notice:', '', $currentLine);
          $currentLine = trim($currentLine);
          $errorType = 'NOTICE';
        } elseif (false !== strpos($currentLine, 'PHP Fatal error')) {
          $currentLine = str_replace('PHP Fatal error:', '', $currentLine);
          $currentLine = trim($currentLine);
          $errorType = 'FATAL';
        } elseif (false !== strpos($currentLine, 'PHP Parse error')) {
          $currentLine = str_replace('PHP Parse error:', '', $currentLine);
          $currentLine = trim($currentLine);
          $errorType = 'SYNTAX';
        } elseif (false !== strpos($currentLine, 'PHP Exception')) {
          $currentLine = str_replace('PHP Exception:', '', $currentLine);
          $currentLine = trim($currentLine);
          $errorType = 'EXCEPTION';
        } else {
          $errorType = 'UNKNOWN';
        }

        if (false !== strpos($currentLine, ' on line ')) {
          $errorLine = explode(' on line ', $currentLine);
          $errorLine = trim($errorLine[1]);
          $currentLine = str_replace(' on line ' . $errorLine, '', $currentLine);
        } else {
          $errorLine = substr($currentLine, strrpos($currentLine, ':') + 1);
          $currentLine = str_replace(':' . $errorLine, '', $currentLine);
        }

        $errorFile = explode(' in /', $currentLine);

        if (isset($errorFile[1])) {
          $errorFile = '/' . trim($errorFile[1]);
        } else {
          $errorFile = '';
        }
        $currentLine = str_replace(' in ' . $errorFile, '', $currentLine);

        // The message of the error
        $errorMessage = trim($currentLine);

        $parsedLogs[] = [
          'date' => $errorDate,
          'time' => $errorTime,
          'type' => $errorType,
          'file' => $errorFile,
          'line' => (int) $errorLine,
          'message' => $errorMessage,
          'stackTrace' => [],
        ];
      }
      // Stack trace beginning line
      elseif (preg_match('/Stack trace:/', $currentLine)) {
        continue;
      } elseif ('#' === $currentLine[0]) {
        if (preg_match('/#[0-9]\s/', $currentLine, $matches)) {
          $pieces = explode($matches[0], $currentLine);
          $currentLine = $pieces[1];
          $parsedLogs[$key]['stackTrace'][] = trim($currentLine);
        }
      } elseif (preg_match('/.*PHP.*[0-9]\. /', $currentLine, $matches)) {
        $pieces = explode($matches[0], $currentLine);
        $currentLine = $pieces[1];
        $parsedLogs[$key]['stackTrace'][] = trim($currentLine);
      }
    }

    yield $parsedLogs;
  }
}
