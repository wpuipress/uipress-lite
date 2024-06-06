import { computed, ref } from "vue";

function defaultEstimatedProgress(duration, elapsed) {
  const completionPercentage = (elapsed / duration) * 100;
  return (2 / Math.PI) * 100 * Math.atan(completionPercentage / 50);
}

function createLoadingIndicator(opts = {}) {
  const { duration = 2000, throttle = 200, hideDelay = 500, resetDelay = 400 } = opts;
  const getProgress = opts.estimatedProgress || defaultEstimatedProgress;
  const progress = ref(0);
  const isLoading = ref(false);
  let done = false;
  let rafId;

  let throttleTimeout;
  let hideTimeout;
  let resetTimeout;

  const start = () => set(0);

  function set(at = 0) {
    if (at >= 100) {
      return finish();
    }
    clear();
    progress.value = at < 0 ? 0 : at;
    if (throttle) {
      throttleTimeout = setTimeout(() => {
        isLoading.value = true;
        _startProgress();
      }, throttle);
    } else {
      isLoading.value = true;
      _startProgress();
    }
  }

  function _hide() {
    hideTimeout = setTimeout(() => {
      isLoading.value = false;
      resetTimeout = setTimeout(() => {
        progress.value = 0;
      }, resetDelay);
    }, hideDelay);
  }

  function finish(opts = {}) {
    progress.value = 100;
    done = true;
    clear();
    _clearTimeouts();
    if (opts.force) {
      progress.value = 0;
      isLoading.value = false;
    } else {
      _hide();
    }
  }

  function _clearTimeouts() {
    clearTimeout(hideTimeout);
    clearTimeout(resetTimeout);
  }

  function clear() {
    clearTimeout(throttleTimeout);
    cancelAnimationFrame(rafId);
  }

  function _startProgress() {
    done = false;
    let startTimeStamp;

    function step(timeStamp) {
      if (done) {
        return;
      }

      startTimeStamp ??= timeStamp;
      const elapsed = timeStamp - startTimeStamp;
      progress.value = Math.max(0, Math.min(100, getProgress(duration, elapsed)));

      rafId = requestAnimationFrame(step);
    }

    rafId = requestAnimationFrame(step);
  }

  let _cleanup = () => {};
  _cleanup = () => {
    unsubError();
    unsubLoadingStartHook();
    unsubLoadingFinishHook();
    clear();
  };

  return {
    _cleanup,
    progress: computed(() => progress.value),
    isLoading: computed(() => isLoading.value),
    start,
    set,
    finish,
    clear,
  };
}

/**
 * composable to handle the loading state of the page
 * @since 3.9.0
 */
export function useLoadingIndicator(opts = {}) {
  // Initialise global loading indicator if it doesn't exist already
  const indicator = createLoadingIndicator(opts);

  return indicator;
}
