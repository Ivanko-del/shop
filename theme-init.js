/* Runs synchronously in <head> so the theme is settled before first paint.
   Kept in its own file so the pages need no inline <script> and the CSP can
   stay at script-src 'self'. */
(function () {
  document.documentElement.classList.add('js');
  try {
    var saved = localStorage.getItem('maison-theme');
    var dark = saved === 'dark' || (saved !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (dark) document.documentElement.setAttribute('data-theme', 'dark');
  } catch (e) { /* private mode: fall back to the light default */ }
})();
