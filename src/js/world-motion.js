// Movimiento visual del marcador 2D, separado de su posición y colisiones del mundo.
(function () {
  function markerPose(timeMs, moving, size) {
    if (!moving) return { bob: 0, shadowScale: 1 };
    const amplitude = Math.min(2, Math.max(0, size) * 0.07);
    const bob = Math.sin(Math.max(0, Number(timeMs) || 0) * 0.012) * amplitude;
    return { bob, shadowScale: Math.max(0.84, 1 - Math.abs(bob) * 0.08) };
  }
  window.WorldMotion = Object.freeze({ markerPose });
})();
