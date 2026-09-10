// Match ViewState.php's Laravel string limits (Unicode code points).
export const VIEW_NAME_MAX = 100;
export const FILTER_MAX = 200;
export const textLength = (value: string) => Array.from(value).length;
export const limitFilter = (value: string) => Array.from(value).slice(0, FILTER_MAX).join('');
