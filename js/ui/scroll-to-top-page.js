window.nutriCalc = window.nutriCalc || {};

nutriCalc.scrollToPageTop = function () {
  const anchor = document.getElementById('pageTopAnchor');
  if (document.activeElement && document.activeElement !== document.body) {
    document.activeElement.blur();
  }
  const doImmediateScroll = () => {
    if (anchor) {
      try {
        anchor.focus({ preventScroll: true });
      } catch (err) {
        try {
          anchor.focus();
        } catch (e) {}
      }
      try {
        anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } catch (e) {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      }
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  };
  doImmediateScroll();
  if (window.nutriCalc._scrollTopRetry) {
    clearInterval(window.nutriCalc._scrollTopRetry);
    window.nutriCalc._scrollTopRetry = null;
  }
  let tries = 0;
  window.nutriCalc._scrollTopRetry = setInterval(() => {
    const y =
      document.documentElement.scrollTop || document.body.scrollTop || 0;
    if (y <= 1 || ++tries > 10) {
      clearInterval(window.nutriCalc._scrollTopRetry);
      window.nutriCalc._scrollTopRetry = null;
      window.scrollTo(0, 0);
      return;
    }
    doImmediateScroll();
  }, 50);
};
