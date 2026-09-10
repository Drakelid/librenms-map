// Match ViewState.php's Laravel string limits (Unicode code points).
export const VIEW_NAME_MAX = 100;
export const FILTER_MAX = 200;
// Positions read from browser storage before a map is loaded. Far above any
// loadable map; it only guards against a corrupt stored value.
export const STORED_POSITIONS_MAX = 100_000;
export const textLength = (value: string) => Array.from(value).length;
export const limitFilter = (value: string) => Array.from(value).slice(0, FILTER_MAX).join('');
