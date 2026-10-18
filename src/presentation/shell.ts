export const shell = (tree: string, count: number) => `
  <a class="skip-link" href="#experiment">Skip to experiment</a>
  <header class="site-header">
    <a class="wordmark" href="#tree">Tree of Life</a>
    <button class="text-button" id="about-button">Jerry Zhang / About</button>
  </header>
  <div class="atlas-layout">
    <section class="collection" aria-label="The collection"><details id="tree-panel">
      <summary><span class="tree-toggle">Browse the tree <span aria-hidden="true" class="toggle-sign">+</span></span><span id="selected-branch"></span></summary>
      <div class="collection-intro"><p>${count} organisms &amp; groups</p><label class="tree-search" for="branch-search"><span>Find an organism or idea</span><input id="branch-search" type="search" placeholder="Try “growth”"></label></div>
      <p id="search-status" role="status"></p>
      <nav aria-label="Species">${tree}</nav>
      <div class="tree-caption"><p class="tree-note">A small selection from a much bigger tree.<br>Branch lengths don’t measure evolutionary time.</p><p>Cropped model previews: seed 42, after 600 steps.<br>Open an organism to run it.</p></div>
    </details></section>
    <main id="experiment" tabindex="-1">
      <div id="species-header"></div>
      <div class="workspace">
        <section class="habitat" aria-label="Interactive simulation">
          <div class="habitat-bar"><span id="model-label"></span><span class="run-state" id="run-state"></span></div>
          <canvas id="habitat" tabindex="0" aria-describedby="scene-caption interaction-help" aria-label="Simulation habitat">The simulation requires canvas support. Read its rules and live measurements below.</canvas>
          <p class="scene-caption" id="scene-caption"></p>
          <div class="playback"><div class="playback-buttons"><button id="play" class="primary"></button><button id="step" title="Advance one model step">Step</button><button id="advance" title="Advance exactly 600 model steps, then pause">+600 steps</button><button id="reset" title="Restart with the same seed and settings">Reset</button></div><label class="speed-label">Speed <select id="speed"><option value=".5">½×</option><option value="1" selected>1×</option><option value="2">2×</option><option value="4">4×</option></select></label></div>
          <div class="metrics" id="metrics" aria-label="Simulation measurements"></div>
          <p class="canvas-help" id="interaction-help"></p>
        </section>
        <aside class="controls" aria-label="Experiment controls">
          <div class="model-choices"><label class="field-label" for="mode">Model</label><select id="mode"></select><div id="presets" class="presets" aria-label="Experiment presets"></div></div>
          <div id="parameters"></div>
          <div class="view-control" id="view-control"><label for="angle">View angle <output id="angle-value">25°</output></label><input id="angle" type="range" min="-180" max="180" step="1" value="25"></div>
          <details class="repeat-settings"><summary>Repeat or share this setup</summary><div class="seed-row"><label for="seed">Random seed<input id="seed" type="number" min="1" max="999999" step="1" value="42"></label><button id="new-seed" title="Restart with a new random seed">New seed</button></div><button class="share-button" id="share">Copy experiment link</button><p class="control-note">Reset starts over with these settings. A link saves the starting setup; it won’t resume this moment.</p></details>
          <p id="status" class="status" role="status"></p>
        </aside>
        <div class="try-this" id="try-this"></div>
      </div>
      <section class="field-notes" aria-label="Research and model notes" id="notes"></section>
      <section class="notebook" id="notebook" aria-label="Experiment notebook"></section>
      <footer><span>Tree of Life / Jerry Zhang</span><span>Calculations run locally in your browser.</span></footer>
    </main>
  </div>
  <dialog id="about"><div class="dialog-top"><h2>About Tree of Life</h2><button id="close-about" aria-label="Close about dialog">×</button></div><p>This is a collection of experiments about how living things move, grow and coordinate. Pick an organism, change a rule and see what happens. There are twelve branches here, with twenty-eight models between them.</p><p>The interesting part is how much you can get from a small set of rules. It’s also where these models fall short: a convincing-looking flock or vine can still leave out most of the biology. Each experiment explains what it actually calculates and links to the papers behind the idea.</p><h3>Keeping a result</h3><p>Save a run to compare its measurements with the next one. Your latest twelve saved runs stay in this browser. Export a copy if you want to keep them elsewhere. A saved run contains observations and starting settings, not a paused simulation you can resume.</p><h3>About the tree</h3><p>It’s a small selection, not a complete phylogeny. Archaea, fungi and most other branches are missing. Some entries are groups or growth forms rather than species. Branch lengths don’t represent time.</p><p><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC4758236/" target="_blank" rel="noreferrer">Why slime molds sit outside plants, animals and fungi</a></p></dialog>`;
