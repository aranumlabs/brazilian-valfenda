// ============================================================================
// CHAPADA DOS VEADEIROS - APP v2
// Leaflet Map, Kanban with smart slots, Detail Modal, Real-time Calculators
// ============================================================================
(function () {
  'use strict';

  // ========================================================================
  // STATE
  // ========================================================================
  const state = {
    activeFilter: 'all',
    searchQuery: '',
    selectedCar: 'localiza-tcross',
    selectedAccommodations: { Cavalcante: 'pousada-vale-araras', 'Alto Paraíso': ['camelot', 'pousada-dente-leao'] }, // Need a way to hold multiple, or just hardcode for calculation
    attractionsInKanban: new Set(),
    kanbanCards: {},
    leafletMap: null,
    markers: [],
  };

  const $ = (s) => document.querySelector(s);
  const $$ = (s) => document.querySelectorAll(s);

  // Region colors for map markers
  const REGION_COLORS = {
    'Cavalcante': '#e67e22',
    'Alto Paraíso': '#3498db',
    'São Jorge': '#2ecc71',
    'São João da Aliança': '#9b59b6',
  };

  // ========================================================================
  // INIT
  // ========================================================================
  function init() {
    const hasSavedState = loadState();

    setupTripSettings();
    renderLeafletMap();
    renderKanban();
    renderAttractions();
    renderCalculators();
    renderCarOptions();
    renderAccommodations();
    setupFilterButtons();
    setupSearch();
    setupModal();
    setupPrint();
    updateStats();

    if (hasSavedState) {
      // Re-apply visual selection for car and acc
      updateCalculators();
    }
  }

  // ========================================================================
  // TRIP SETTINGS
  // ========================================================================
  function setupTripSettings() {
    const startInput = $('#input-start-date');
    const endInput = $('#input-end-date');
    const adultsInput = $('#input-adults');
    const childrenInput = $('#input-children');
    const applyBtn = $('#apply-settings');

    if (!startInput || !applyBtn) return;

    // Set initial values
    startInput.value = TRIP_CONFIG.startDate;
    endInput.value = TRIP_CONFIG.endDate;
    adultsInput.value = TRIP_CONFIG.adults;
    childrenInput.value = TRIP_CONFIG.children;

    applyBtn.addEventListener('click', () => {
      const start = startInput.value;
      const end = endInput.value;
      const adults = parseInt(adultsInput.value) || 0;
      const children = parseInt(childrenInput.value) || 0;
      const origin = $('#input-origin').value || 'Brasília';

      if (new Date(start) > new Date(end)) {
        alert('A data de ida não pode ser posterior à volta!');
        return;
      }

      // Update Config
      TRIP_CONFIG.startDate = start;
      TRIP_CONFIG.endDate = end;
      TRIP_CONFIG.adults = adults;
      TRIP_CONFIG.children = children;
      TRIP_CONFIG.origin = origin;
      TRIP_CONFIG.travelers = adults + children;
      TRIP_CONFIG.couples = Math.ceil(TRIP_CONFIG.travelers / 2);

      // Save to persistence
      saveState();

      // Update origin label in hero
      const originLabel = $('#stat-origin-label');
      if (originLabel) {
        // Safe check for BSB to keep it short
        originLabel.textContent = origin.toLowerCase().includes('brasília') || origin.toLowerCase().includes('bsb') ? 'BSB' : origin.substring(0, 10);
      }

      // Regenerate Days
      regenerateTripDays(start, end);

      // Reset kanban if days changed (or try to preserve - simplified: re-render)
      // state.kanbanCards = {}; 
      // state.attractionsInKanban = new Set();

      // Refresh UI
      renderKanban();
      updateCalculators();
      updateStats();

      // Notify
      applyBtn.textContent = '✅ Atualizado!';
      setTimeout(() => applyBtn.textContent = 'Atualizar Roteiro', 2000);
    });
  }

  function regenerateTripDays(startStr, endStr) {
    const start = new Date(startStr + 'T00:00:00');
    const end = new Date(endStr + 'T00:00:00');
    const days = [];
    const weekdayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    // Preserve bases if possible
    const oldBases = TRIP_DAYS.reduce((acc, d) => {
      acc[d.date] = d.base;
      return acc;
    }, {});

    let current = new Date(start);
    while (current <= end) {
      const dateStr = current.toISOString().split('T')[0];
      const day = current.getDate().toString().padStart(2, '0');
      const month = (current.getMonth() + 1).toString().padStart(2, '0');

      let base = oldBases[dateStr] || (days.length < 4 ? 'Cavalcante' : 'Alto Paraíso');
      if (current.getTime() === end.getTime()) base = 'Retorno';

      days.push({
        date: dateStr,
        label: `${day}/${month}`,
        weekday: weekdayNames[current.getDay()],
        base: base
      });
      current.setDate(current.getDate() + 1);
    }

    TRIP_DAYS.length = 0;
    days.forEach(d => TRIP_DAYS.push(d));
  }

  // ========================================================================
  // LEAFLET MAP
  // ========================================================================
  function renderLeafletMap() {
    const map = L.map('leafletMap', {
      center: [-14.1, -47.55],
      zoom: 10,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 16,
    }).addTo(map);

    // City markers
    const cities = [
      { name: 'Cavalcante', lat: -13.7967, lng: -47.4569 },
      { name: 'Alto Paraíso', lat: -14.1289, lng: -47.5129 },
      { name: 'São Jorge', lat: -14.1747, lng: -47.6147 },
      { name: 'São João da Aliança', lat: -14.2628, lng: -47.5236 },
    ];

    cities.forEach((c) => {
      L.marker([c.lat, c.lng], {
        icon: L.divIcon({
          className: 'city-map-marker',
          html: `<div style="background:#f0c040;color:#0f1a12;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,0.5);">📍 ${c.name}</div>`,
          iconSize: [0, 0],
          iconAnchor: [0, 0],
        }),
      }).addTo(map);
    });

    // Attraction pins
    ATTRACTIONS.forEach((attr) => {
      const color = REGION_COLORS[attr.region] || '#2ecc71';
      const marker = L.circleMarker([attr.lat, attr.lng], {
        radius: 8,
        fillColor: color,
        color: '#fff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.85,
      }).addTo(map);

      marker.bindTooltip(`
        <div style="font-family:Inter,sans-serif;min-width:220px">
          <strong style="font-size:14px">${attr.name}</strong><br>
          <span style="font-size:12px;color:#666">${attr.region}</span>
          <hr style="margin:6px 0;border:none;border-top:1px solid #ddd">
          <div style="font-size:12px;line-height:1.6">
            🥾 Trilha: <strong>${attr.trailLength}km</strong> • ${attr.difficulty}<br>
            ⏱️ Duração: <strong>${attr.duration}</strong><br>
            💰 Entrada: <strong>${attr.entranceFee > 0 ? 'R$' + attr.entranceFee : 'Grátis'}</strong><br>
            ${attr.guideRequired ? '⚠️ <strong style="color:#e74c3c">Guia obrigatório</strong> (R$' + attr.guideCost + ')<br>' : ''}
            ${attr.fourWheelRequired ? '🚙 <strong style="color:#e67e22">4x4 recomendado</strong><br>' : ''}
          </div>
          <div style="margin-top:8px;font-size:11px;color:#888">Clique nos cards abaixo para mais detalhes</div>
        </div>
      `, { maxWidth: 280, direction: 'top', offset: [0, -10] });

      state.markers.push({ id: attr.id, marker });
    });

    state.leafletMap = map;

    // Fix map rendering after animations
    setTimeout(() => map.invalidateSize(), 600);
  }

  // ========================================================================
  // ATTRACTION CARDS
  // ========================================================================
  function renderAttractions() {
    const grid = $('#attractionsGrid');
    grid.innerHTML = '';

    const filtered = ATTRACTIONS.filter((a) => {
      const regionMatch = state.activeFilter === 'all' || a.region === state.activeFilter;
      const safeName = a.name ? a.name.toLowerCase() : '';
      const safeSearch = state.searchQuery ? state.searchQuery.toLowerCase() : '';
      const searchMatch = !safeSearch || safeName.includes(safeSearch);
      return regionMatch && searchMatch;
    }).sort((a, b) => {
      // Sort by Region (A-Z) then by Name (A-Z)
      const rA = a.region || '';
      const rB = b.region || '';
      if (rA !== rB) return rA.localeCompare(rB);

      const nA = a.name || '';
      const nB = b.name || '';
      return nA.localeCompare(nB);
    });
    console.log(`Rendered ${filtered.length} attractions sorted by region and name.`);

    filtered.forEach((attr) => {
      const card = document.createElement('div');
      card.className = 'attraction-card';
      card.draggable = true;
      card.dataset.id = attr.id;
      if (state.attractionsInKanban.has(attr.id)) card.classList.add('in-kanban');

      card.innerHTML = `
        <span class="card-drag-hint">⠿ arraste</span>
        <span class="card-region-tag" data-region="${attr.region}">${attr.region}</span>
        <div class="card-title">${attr.name}</div>
        <div class="card-description">${attr.description}</div>
        <div class="card-stats">
          <div class="card-stat">🥾 <span class="card-stat-value">${attr.trailLength}km</span> trilha</div>
          <div class="card-stat">⏱️ <span class="card-stat-value">${attr.duration}</span></div>
          <div class="card-stat" style="grid-column: 1 / span 2; display: flex; gap: 8px; font-size: 0.75rem; margin-top: 2px;">
            <span title="Alto Paraíso" style="color: var(--alto-paraiso-color); font-weight: 600;">AP: ${attr.distances.altoParaiso}km</span>
            <span style="color: var(--text-muted)">•</span>
            <span title="São Jorge" style="color: var(--sao-jorge-color); font-weight: 600;">SJ: ${attr.distances.saoJorge !== null ? attr.distances.saoJorge + 'km' : '-'}</span>
            <span style="color: var(--text-muted)">•</span>
            <span title="Cavalcante" style="color: var(--cavalcante-color); font-weight: 600;">CV: ${attr.distances.cavalcante !== null ? attr.distances.cavalcante + 'km' : '-'}</span>
          </div>
          <div class="card-stat">📊 <span class="card-stat-value">${attr.difficulty}</span></div>
        </div>
        <div class="card-badges">
          ${attr.entranceFee > 0 ? `<span class="card-badge badge-fee">R$${attr.entranceFee}</span>` : '<span class="card-badge badge-free">Grátis</span>'}
          ${attr.guideRequired ? '<span class="card-badge badge-guide">Guia obrigatório</span>' : ''}
          ${attr.fourWheelRequired ? '<span class="card-badge badge-4x4">4x4</span>' : ''}
          ${attr.durationSlots === 'full' ? '<span class="card-badge badge-fullday">Dia inteiro</span>' : ''}
        </div>
        <div style="margin-top: 12px; display: flex; gap: 8px;">
            <button class="add-btn" style="flex:1; background: var(--primary); color: white; border: none; padding: 6px 10px; border-radius: 6px; cursor: pointer; font-size: 0.85rem; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 4px;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              Ao Roteiro
            </button>
            <button class="details-btn" style="flex:1; background: var(--surface-light); color: var(--text); border: 1px solid var(--border); padding: 6px 10px; border-radius: 6px; cursor: pointer; font-size: 0.85rem; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 4px;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              Detalhes
            </button>
        </div>
      `;

      // Click to open detail modal
      card.addEventListener('click', (e) => {
        if (e.target.closest('.card-drag-hint') || e.target.closest('.add-btn') || e.target.closest('.details-btn')) return;
        openDetailModal(attr);
      });

      const detailsBtn = card.querySelector('.details-btn');
      if (detailsBtn) {
        detailsBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          openDetailModal(attr);
        });
      }

      const addBtn = card.querySelector('.add-btn');
      if (addBtn) {
        addBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          // Find first available slot (dumb assignment for now, user can drag to fix)
          let added = false;
          for (const day of TRIP_DAYS) {
            for (const period of PERIODS) {
              const key = `${day.date}-${period.id}`;
              const currentInSlot = state.kanbanCards[key] || [];
              // Very basic check: add to first empty morning/afternoon slot
              if (currentInSlot.length === 0 && !added) {
                addToKanban(attr.id, day.date, period.id);
                added = true;
                // Scroll to kanban
                document.getElementById('kanbanBoard').scrollIntoView({ behavior: 'smooth' });
                break;
              }
            }
            if (added) break;
          }
          if (!added) {
            alert('Não foi possível achar um espaço vazio automático. Arraste a atração manualmente.');
          }
        });
      }

      // Drag
      card.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', attr.id);
        e.dataTransfer.effectAllowed = 'move';
        card.classList.add('dragging');
      });
      card.addEventListener('dragend', () => card.classList.remove('dragging'));

      grid.appendChild(card);
    });
  }

  // ========================================================================
  // FILTER BUTTONS
  // ========================================================================
  function setupFilterButtons() {
    $('#filterBar').addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-btn');
      if (!btn) return;
      $$('.filter-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      state.activeFilter = btn.dataset.region;
      renderAttractions();
    });
  }

  function setupSearch() {
    const searchInput = $('#searchAttraction');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value.trim();
        renderAttractions();
      });
    }
  }

  // ========================================================================
  // DETAIL MODAL
  // ========================================================================
  function setupModal() {
    const overlay = $('#modalOverlay');
    const close = $('#modalClose');
    close.addEventListener('click', () => overlay.classList.remove('active'));
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.classList.remove('active');
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') overlay.classList.remove('active');
    });
  }

  function openDetailModal(attr) {
    const overlay = $('#modalOverlay');
    const body = $('#modalBody');

    // Link to Google Photos - Centralized highlight
    const galleryHtml = `
      <div class="modal-gallery-link" style="margin: 20px 20px 24px; border-radius: 12px; padding: 24px; background: rgba(46, 204, 113, 0.05); border: 2px dashed var(--border-color); text-align: center;">
        <div style="font-size: 2.5rem; margin-bottom: 12px;">📷</div>
        <a href="${attr.googlePhotosUrl}" target="_blank" rel="noopener" style="color: var(--accent-primary); font-size: 1.1rem; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 10px; text-decoration: none;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
          Ver acervo de fotos no Google Photos
        </a>
        <p style="margin-top: 12px; font-size: 0.85rem; color: var(--text-muted);">Confira fotos atualizadas e vídeos desta atração</p>
      </div>
    `;

    body.innerHTML = `
      ${galleryHtml}
      <div class="modal-details">
        <span class="card-region-tag" data-region="${attr.region}" style="margin-bottom:8px">${attr.region}</span>
        <div class="modal-title" style="display:flex; justify-content:space-between; align-items:center;">
          ${attr.name}
        </div>
        <div class="modal-desc">${attr.description}</div>
        
        <div class="modal-info-grid">
          <div class="modal-info-item">
            <div class="modal-info-label">💰 Entrada</div>
            <div class="modal-info-value">${attr.entranceFee > 0 ? 'R$ ' + attr.entranceFee + ' /pessoa' : '🆓 Gratuito'}</div>
          </div>
          <div class="modal-info-item">
            <div class="modal-info-label">🥾 Trilha</div>
            <div class="modal-info-value">${attr.trailLength}km — ${attr.difficulty}</div>
          </div>
          <div class="modal-info-item">
            <div class="modal-info-label">⏱️ Duração</div>
            <div class="modal-info-value">${attr.duration}</div>
          </div>
          <div class="modal-info-item">
            <div class="modal-info-label">🚗 Distâncias</div>
            <div class="modal-info-value" style="font-size: 0.8rem; line-height: 1.2;">
                📍 Alto Paraíso: ${attr.distances.altoParaiso}km<br>
                📍 São Jorge: ${attr.distances.saoJorge !== null ? attr.distances.saoJorge + 'km' : '-'}<br>
                📍 Cavalcante: ${attr.distances.cavalcante !== null ? attr.distances.cavalcante + 'km' : '-'}
            </div>
          </div>
          <div class="modal-info-item">
            <div class="modal-info-label">👤 Guia</div>
            <div class="modal-info-value">${attr.guideRequired ? '⚠️ Obrigatório (R$' + attr.guideCost + '/grupo de ' + attr.guideGroupSize + ')' : '✅ Não necessário'}</div>
          </div>
          <div class="modal-info-item">
            <div class="modal-info-label">🚙 4x4</div>
            <div class="modal-info-value">${attr.fourWheelRequired ? '⚠️ Recomendado' : '✅ Não necessário'}</div>
          </div>
          <div class="modal-info-item">
            <div class="modal-info-label">🕐 Melhor Horário</div>
            <div class="modal-info-value">${attr.bestTime}</div>
          </div>
          <div class="modal-info-item">
            <div class="modal-info-label">📍 Coordenadas</div>
            <div class="modal-info-value"><a href="https://www.google.com/maps?q=${attr.lat},${attr.lng}" target="_blank" style="color:var(--accent-primary)">${attr.lat.toFixed(4)}, ${attr.lng.toFixed(4)}</a></div>
          </div>
        </div>

        <div class="modal-tips">
          <div class="modal-tips-title">💡 Dicas</div>
          <p>${attr.tips}</p>
        </div>
      </div>
    `;

    // Image click viewer - Removed as images are gone

    overlay.classList.add('active');
  }


  function openImageViewer(src) {
    let viewer = $('#imgViewer');
    if (!viewer) {
      viewer = document.createElement('div');
      viewer.className = 'img-viewer';
      viewer.id = 'imgViewer';
      viewer.innerHTML = '<img />';
      viewer.addEventListener('click', () => viewer.classList.remove('active'));
      document.body.appendChild(viewer);
    }
    viewer.querySelector('img').src = src;
    viewer.classList.add('active');
  }

  // ========================================================================
  // KANBAN
  // ========================================================================
  const PERIODS = [
    { id: 'morning', label: 'Manhã', icon: '🌅' },
    { id: 'afternoon', label: 'Tarde', icon: '☀️' },
    { id: 'evening', label: 'Noite', icon: '🌙' },
  ];

  function renderKanban() {
    const board = $('#kanbanBoard');
    board.innerHTML = '';

    TRIP_DAYS.forEach((day, index) => {
      const col = document.createElement('div');
      col.className = 'kanban-column';
      col.innerHTML = `
        <div class="kanban-column-header">
          <div class="kanban-weekday">${day.weekday}</div>
          <div class="kanban-date">${day.label}</div>
          <div class="kanban-base">
            📍 <select class="kanban-base-select" data-index="${index}" style="background:transparent; border:none; color:inherit; font-size:inherit; font-weight:inherit; cursor:pointer; outline:none; text-align:center; padding:0; margin:0; appearance:auto;">
              <option style="color:black" value="Cavalcante" ${day.base === 'Cavalcante' ? 'selected' : ''}>Cavalcante</option>
              <option style="color:black" value="Alto Paraíso" ${day.base === 'Alto Paraíso' ? 'selected' : ''}>Alto Paraíso</option>
              <option style="color:black" value="São Jorge" ${day.base === 'São Jorge' ? 'selected' : ''}>São Jorge</option>
              <option style="color:black" value="Brasília" ${day.base === 'Brasília' ? 'selected' : ''}>Brasília</option>
              <option style="color:black" value="Retorno" ${day.base === 'Retorno' ? 'selected' : ''}>Retorno</option>
            </select>
          </div>
          <div class="kanban-daily-stats" id="stats-${day.date}" style="font-size: 11px; color: var(--text-muted, #666); margin-top: 8px; text-align: center; line-height: 1.4; min-height: 32px;"></div>
        </div>
        <div class="kanban-slots">
          ${PERIODS.map((p) => `
            <div class="kanban-slot" data-day="${day.date}" data-period="${p.id}">
              <div class="slot-label"><span>${p.icon}</span> ${p.label}</div>
              <div class="slot-cards" id="slot-${day.date}-${p.id}"></div>
            </div>
          `).join('')}
        </div>
      `;

      const select = col.querySelector('.kanban-base-select');
      select.addEventListener('change', (e) => {
        TRIP_DAYS[e.target.dataset.index].base = e.target.value;
        updateCalculators();
      });

      board.appendChild(col);
    });

    // Drop zones
    $$('.kanban-slot').forEach((slot) => {
      slot.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        slot.classList.add('drag-over');
      });
      slot.addEventListener('dragleave', () => slot.classList.remove('drag-over'));
      slot.addEventListener('drop', (e) => {
        e.preventDefault();
        slot.classList.remove('drag-over');
        const attrId = e.dataTransfer.getData('text/plain');
        const day = slot.dataset.day;
        const period = slot.dataset.period;
        addToKanban(attrId, day, period);
      });
    });

    // Re-render existing
    Object.entries(state.kanbanCards).forEach(([key, ids]) => {
      ids.forEach((id) => renderKanbanCard(id, key));
    });
  }

  function addToKanban(attrId, day, period) {
    const attr = ATTRACTIONS.find((a) => a.id === attrId);
    if (!attr) return;

    // Remove from any previous slots
    removeFromKanbanSilent(attrId);

    if (attr.durationSlots === 'full') {
      // Full day = morning + afternoon
      const keyMorning = `${day}-morning`;
      const keyAfternoon = `${day}-afternoon`;
      if (!state.kanbanCards[keyMorning]) state.kanbanCards[keyMorning] = [];
      if (!state.kanbanCards[keyAfternoon]) state.kanbanCards[keyAfternoon] = [];
      state.kanbanCards[keyMorning].push(attrId);
      state.kanbanCards[keyAfternoon].push(attrId);
      renderKanbanCard(attrId, keyMorning);
      renderKanbanCard(attrId, keyAfternoon);
    } else {
      // Half day = just the dropped slot
      const key = `${day}-${period}`;
      if (!state.kanbanCards[key]) state.kanbanCards[key] = [];
      state.kanbanCards[key].push(attrId);
      renderKanbanCard(attrId, key);
    }

    state.attractionsInKanban.add(attrId);
    renderAttractions();
    updateCalculators();
    saveState();
  }

  function removeFromKanbanSilent(attrId) {
    Object.keys(state.kanbanCards).forEach((k) => {
      const idx = state.kanbanCards[k].indexOf(attrId);
      if (idx > -1) {
        state.kanbanCards[k].splice(idx, 1);
        const container = document.getElementById(`slot-${k}`);
        if (container) {
          const card = container.querySelector(`[data-id="${attrId}"]`);
          if (card) card.remove();
        }
      }
    });
  }

  function removeFromKanban(attrId) {
    removeFromKanbanSilent(attrId);
    state.attractionsInKanban.delete(attrId);
    renderAttractions();
    updateCalculators();
    saveState();
  }

  function renderKanbanCard(attrId, slotKey) {
    const attr = ATTRACTIONS.find((a) => a.id === attrId);
    if (!attr) return;
    const container = document.getElementById(`slot-${slotKey}`);
    if (!container) return;

    const existing = container.querySelector(`[data-id="${attrId}"]`);
    if (existing) existing.remove();

    const card = document.createElement('div');
    card.className = 'kanban-card';
    card.dataset.id = attrId;
    card.draggable = true;
    card.innerHTML = `
      <div class="kanban-card-title">${attr.name}</div>
      <div class="kanban-card-info">🥾 ${attr.trailLength}km • ${attr.entranceFee > 0 ? 'R$' + attr.entranceFee : '🆓'}</div>
      <button class="kanban-card-remove" title="Remover">✕</button>
    `;

    card.querySelector('.kanban-card-remove').addEventListener('click', (e) => {
      e.stopPropagation();
      removeFromKanban(attrId);
    });

    card.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', attrId);
      e.dataTransfer.effectAllowed = 'move';
    });

    container.appendChild(card);
  }

  // ========================================================================
  // CALCULATORS
  // ========================================================================
  function renderCalculators() {
    const grid = $('#calculatorsGrid');
    grid.innerHTML = `
      <div class="calculator-card">
        <div class="calc-icon">🚗</div>
        <div class="calc-label">Quilometragem Total</div>
        <div class="calc-value" id="calcKmValue">0</div>
        <div class="calc-unit">km estimados</div>
        <div class="calc-breakdown" id="calcKmBreakdown"></div>
      </div>
      <div class="calculator-card">
        <div class="calc-icon">🥾</div>
        <div class="calc-label">Trilhas a Pé</div>
        <div class="calc-value" id="calcTrailValue">0</div>
        <div class="calc-unit">km de trilha</div>
        <div class="calc-breakdown" id="calcTrailBreakdown"></div>
      </div>
      <div class="calculator-card">
        <div class="calc-icon">💰</div>
        <div class="calc-label">Previsão de Gastos</div>
        <div class="calc-value" id="calcCostValue">R$ 0</div>
        <div class="calc-unit">estimativa total (4 pessoas)</div>
        <div class="calc-breakdown" id="calcCostBreakdown"></div>
      </div>
      <div class="calculator-card">
        <div class="calc-icon">👤</div>
        <div class="calc-label">Custo por Pessoa</div>
        <div class="calc-value" id="calcPerPersonValue">R$ 0</div>
        <div class="calc-unit">estimativa individual</div>
      </div>
    `;
    updateCalculators();
  }

  function updateCalculators() {
    const inKanban = [...state.attractionsInKanban]
      .map((id) => ATTRACTIONS.find((a) => a.id === id))
      .filter(Boolean);

    let totalTrailKm = 0;
    inKanban.forEach((a) => {
      totalTrailKm += a.trailLength;
    });

    $('#calcTrailValue').textContent = totalTrailKm.toFixed(1);

    $('#calcTrailBreakdown').innerHTML = inKanban
      .filter((a) => a.trailLength > 0)
      .sort((a, b) => b.trailLength - a.trailLength)
      .slice(0, 6)
      .map((a) => `<div class="calc-breakdown-item"><span>${a.name}</span><span class="calc-breakdown-value">${a.trailLength} km</span></div>`)
      .join('');

    // --- Dynamic Distance Calculation ---
    function getDist(c1, c2) {
      const city1 = c1 === 'Retorno' ? 'Brasília' : c1;
      const city2 = c2 === 'Retorno' ? 'Brasília' : c2;
      if (city1 === city2) return 0;
      const pair = [city1, city2].sort().join('-');
      const dists = {
        'Brasília-Cavalcante': TRIP_CONFIG.distanceBSBtoCavalcante || 320,
        'Alto Paraíso-Brasília': TRIP_CONFIG.distanceBSBtoAltoParaiso || 230,
        'Brasília-São Jorge': 266,
        'Alto Paraíso-Cavalcante': TRIP_CONFIG.distanceCavalcanteToAltoParaiso || 90,
        'Alto Paraíso-São Jorge': TRIP_CONFIG.distanceAltoParaisoToSaoJorge || 36,
        'Cavalcante-São Jorge': 126
      };
      return dists[pair] || 0;
    }

    let currentCity = 'Brasília';
    let baseToBaseKm = 0;
    let routeSegments = [];

    // Calculate nights per city for accommodations
    const cityDays = { Cavalcante: 0, 'Alto Paraíso': 0 };
    const dailyStats = {};

    TRIP_DAYS.forEach((day, i) => {
      dailyStats[day.date] = { trail: 0, car: 0 };
      const base = day.base === 'Retorno' ? 'Brasília' : day.base;

      if (cityDays[base] !== undefined) cityDays[base]++;

      if (base !== currentCity) {
        const dist = getDist(currentCity, base);
        routeSegments.push({ from: currentCity, to: base, km: dist });
        baseToBaseKm += dist;
        currentCity = base;
      }
    });

    const cavNights = $('#nights-Cavalcante');
    const apNights = $('#nights-AltoParaiso');
    if (cavNights) cavNights.textContent = `(${cityDays.Cavalcante} noites)`;
    if (apNights) apNights.textContent = `(${cityDays['Alto Paraíso']} noites)`;

    if (currentCity !== 'Brasília') {
      const dist = getDist(currentCity, 'Brasília');
      routeSegments.push({ from: currentCity, to: 'Brasília', km: dist });
      baseToBaseKm += dist;
    }

    const kmBreakdownHTML = [];
    routeSegments.forEach(seg => {
      kmBreakdownHTML.push(`<div class="calc-breakdown-item"><span style="font-weight:600">${seg.from} → ${seg.to}</span><span class="calc-breakdown-value" style="font-weight:600">${seg.km} km</span></div>`);
    });

    let attractionCarKm = 0;
    inKanban.forEach((a) => {
      // Find which day this attraction is scheduled
      let dayBase = 'Brasília';
      let scheduledDate = null;
      for (const day of TRIP_DAYS) {
        let hasIt = false;
        for (const p of PERIODS) {
          const key = `${day.date}-${p.id}`;
          if (state.kanbanCards[key] && state.kanbanCards[key].includes(a.id)) {
            hasIt = true; break;
          }
        }
        if (hasIt) {
          dayBase = day.base === 'Retorno' ? 'Brasília' : day.base;
          scheduledDate = day.date;
          break;
        }
      }

      const baseToRegionKm = getDist(dayBase, a.region);

      let baseDistance = 0;
      if (dayBase === 'Alto Paraíso') baseDistance = a.distances.altoParaiso || 0;
      else if (dayBase === 'São Jorge') baseDistance = a.distances.saoJorge || a.distances.altoParaiso || 0;
      else if (dayBase === 'Cavalcante') baseDistance = a.distances.cavalcante || a.distances.altoParaiso || 0;
      else baseDistance = a.distances.altoParaiso || 0;

      const distOneWay = baseToRegionKm + baseDistance;
      const totalTrip = distOneWay * 2;
      attractionCarKm += totalTrip;

      if (scheduledDate) {
        dailyStats[scheduledDate].car += totalTrip;
        dailyStats[scheduledDate].trail += a.trailLength;
      }

      kmBreakdownHTML.push(`<div class="calc-breakdown-item" style="color:var(--text-muted); font-size:12px; padding-left:12px; border-left: 2px solid var(--border); margin-left: 6px; margin-top: 4px; margin-bottom: 4px;"><span>↪ ${dayBase} → ${a.name}</span><span class="calc-breakdown-value">ida ${distOneWay}km / volta ${distOneWay}km</span></div>`);
    });

    const totalCarKm = baseToBaseKm + attractionCarKm;
    $('#calcKmValue').textContent = totalCarKm.toLocaleString('pt-BR');
    $('#calcKmBreakdown').innerHTML = kmBreakdownHTML.join('');

    TRIP_DAYS.forEach(day => {
      const el = document.getElementById(`stats-${day.date}`);
      if (el) {
        const d = dailyStats[day.date];
        if (d.car > 0 || d.trail > 0) {
          el.innerHTML = `🚗 Carro ida/volta: <strong>${d.car}km</strong><br>🥾 Caminhada: <strong>${d.trail.toFixed(1)}km</strong>`;
        } else {
          el.innerHTML = `<span style="opacity: 0.5;">Dia Livre</span>`;
        }
      }
    });

    // Costs
    let entranceCost = 0, guideCost = 0, carCost = 0, accCost = 0;

    // Group logic for Kalunga complex (Santa Bárbara, Capivara, Candaru)
    const kalungaGroup = ['santa-barbara', 'capivara', 'candaru'];
    let kalungaCount = 0;

    inKanban.forEach((a) => {
      entranceCost += a.entranceFee * TRIP_CONFIG.travelers;
      if (a.guideRequired) {
        if (kalungaGroup.includes(a.id)) {
          kalungaCount++;
        } else {
          guideCost += a.guideCost;
        }
      }
    });

    if (kalungaCount > 0) {
      guideCost += 200; // Single guide fee for any combination of the 3
    }

    const car = CAR_OPTIONS.find((c) => c.id === state.selectedCar);
    const tripDuration = car?.totalDays || TRIP_DAYS.length || 0;
    if (car) carCost = parseFloat(car.dailyRate || 0) * tripDuration;

    // Sum all 3 accommodations automatically
    let accBreakdownHTML = '';
    ACCOMMODATIONS.forEach((acc) => {
      // Calculate nights based on check-in and check-out dates
      const [d1, m1, y1] = acc.checkIn.split('/').map(Number);
      const [d2, m2, y2] = acc.checkOut.split('/').map(Number);
      const date1 = new Date(y1, m1 - 1, d1);
      const date2 = new Date(y2, m2 - 1, d2);
      const nights = Math.round((date2 - date1) / (1000 * 60 * 60 * 24));

      if (nights > 0) {
        const cost = (acc.totalPrice || (acc.pricePerNight * nights)) * TRIP_CONFIG.couples;
        accCost += cost;
        accBreakdownHTML += `<div class="calc-breakdown-item" style="color:var(--text-muted); font-size:12px; padding-left:12px; border-left: 2px solid var(--border); margin-left: 6px; margin-top: 4px; margin-bottom: 4px;"><span>${acc.name} (${nights} noites)</span><span class="calc-breakdown-value">R$ ${cost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span></div>`;
      }
    });

    // Distance and Fuel Calculations
    let totalDistance = 0;
    const FUEL_PRICE = 6.00; // R$ por litro
    const FUEL_CONSUMPTION = 10; // km/L
    const fuelCostPerKm = FUEL_PRICE / FUEL_CONSUMPTION;

    if (TRIP_DAYS.length > 0) {
      const firstDay = TRIP_DAYS[0];
      const lastDay = TRIP_DAYS[TRIP_DAYS.length - 1];

      let distOrigin = 0;
      let originLabelText = '';
      if (firstDay.base === 'Cavalcante') {
        distOrigin = TRIP_CONFIG.distanceBSBtoCavalcante;
        originLabelText = `Brasília ➔ ${firstDay.base}`;
      } else if (firstDay.base === 'Alto Paraíso') {
        distOrigin = TRIP_CONFIG.distanceBSBtoAltoParaiso;
        originLabelText = `Brasília ➔ ${firstDay.base}`;
      } else if (firstDay.base === 'São Jorge') {
        distOrigin = TRIP_CONFIG.distanceBSBtoSaoJorge;
        originLabelText = `Brasília ➔ ${firstDay.base}`;
      }

      totalDistance += distOrigin * 2; // Ida e Volta

      let mileageHTML = `
        <li class="stat-mileage-item"><span>${originLabelText}</span><span>${distOrigin} km</span></li>
        <li class="stat-mileage-item"><span>${firstDay.base === 'Cavalcante' ? firstDay.base : lastDay.base} ➔ Brasília</span><span>${distOrigin} km</span></li>
      `;

      // Daily Attraction distances
      TRIP_DAYS.forEach(day => {
        const dayCards = state.kanbanCards[day.date + '-full'] || [];
        dayCards.concat(state.kanbanCards[day.date + '-morning'] || [], state.kanbanCards[day.date + '-afternoon'] || []).forEach(attrId => {
          const attr = ATTRACTIONS.find(a => a.id === attrId);
          if (attr && attr.distances) {
            let baseKey = 'altoParaiso';
            let baseName = 'Alto Paraíso';
            if (day.base === 'Cavalcante') { baseKey = 'cavalcante'; baseName = 'Cavalcante'; }
            else if (day.base === 'São Jorge') { baseKey = 'saoJorge'; baseName = 'São Jorge'; }

            const dist = attr.distances[baseKey] || 0;
            totalDistance += dist * 2; // Base to Attr and Back
            mileageHTML += `<li class="stat-mileage-item"><span>${baseName} ➔ ${attr.name}</span><span>${dist * 2} km (i/v)</span></li>`;
          }
        });

        // Inter-base travel (if base changes)
        const dayIndex = TRIP_DAYS.indexOf(day);
        if (dayIndex > 0) {
          const prevDay = TRIP_DAYS[dayIndex - 1];
          if (day.base !== prevDay.base && day.base !== 'Retorno' && prevDay.base !== 'Retorno') {
            let interDist = 0;
            let interLabel = '';
            if ((day.base === 'Cavalcante' && prevDay.base === 'Alto Paraíso') || (day.base === 'Alto Paraíso' && prevDay.base === 'Cavalcante')) {
              interDist = TRIP_CONFIG.distanceCavalcanteToAltoParaiso;
              interLabel = `${prevDay.base} ➔ ${day.base}`;
            } else if ((day.base === 'São Jorge' && prevDay.base === 'Alto Paraíso') || (day.base === 'Alto Paraíso' && prevDay.base === 'São Jorge')) {
              interDist = TRIP_CONFIG.distanceAltoParaisoToSaoJorge;
              interLabel = `${prevDay.base} ➔ ${day.base}`;
            }
            if (interDist > 0) {
              totalDistance += interDist;
              mileageHTML += `<li class="stat-mileage-item"><span>${interLabel}</span><span>${interDist} km</span></li>`;
            }
          }
        }
      });

      // Mileage detail is now only for print
      // if (mileageContainer) mileageContainer.innerHTML = mileageHTML;
    }

    const fuelCostTotal = totalDistance * fuelCostPerKm;
    const total = entranceCost + guideCost + carCost + accCost + fuelCostTotal;
    const pp = total / TRIP_CONFIG.travelers;

    // Assuming 'car' and 'tripDuration' are accessible here if state.selectedCar is true
    // This part of the instruction seems to be intended for the breakdown HTML,
    // but is placed outside. I'll place it as instructed.
    if (state.selectedCar) {
      const car = CAR_OPTIONS.find(c => c.id === state.selectedCar);
      const tripDuration = TRIP_DAYS.length || 0;
      if (document.getElementById('car-breakdown-label')) {
        document.getElementById('car-breakdown-label').textContent = `${car.name} (${tripDuration} dias)`;
      }
      if (document.getElementById('car-breakdown-value')) {
        document.getElementById('car-breakdown-value').textContent = `R$ ${carCost.toLocaleString('pt-BR')}`;
      }
    }

    $('#calcCostValue').textContent = 'R$ ' + total.toLocaleString('pt-BR');
    $('#calcPerPersonValue').textContent = 'R$ ' + pp.toLocaleString('pt-BR', { maximumFractionDigits: 0 });

    // Update hero stats
    const heropp = $('#stat-cost-pp');
    const herototal = $('#stat-cost-total');
    if (heropp) heropp.textContent = 'R$ ' + pp.toLocaleString('pt-BR', { maximumFractionDigits: 0 });
    if (herototal) herototal.textContent = 'R$ ' + total.toLocaleString('pt-BR', { maximumFractionDigits: 0 });

    const entranceBreakdownHTML = inKanban
      .filter((a) => a.entranceFee > 0)
      .sort((a, b) => {
        const rA = a.region || '';
        const rB = b.region || '';
        if (rA !== rB) return rA.localeCompare(rB);
        return (a.name || '').localeCompare(b.name || '');
      })
      .map((a) => `
        <div class="calc-breakdown-item" style="color:var(--text-muted); font-size:11px; padding-left:12px; border-left: 2px solid var(--border); margin-left: 6px; margin-top: 2px; display: flex; justify-content: space-between; align-items: center;">
          <span>↪ ${a.region}: ${a.name}</span>
          <span class="calc-breakdown-value">R$ ${(a.entranceFee * TRIP_CONFIG.travelers).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
        </div>`)
      .join('');

    const guideBreakdownItems = [];
    const kalungaAttractions = inKanban.filter(a => kalungaGroup.includes(a.id) && a.guideRequired);

    inKanban.filter(a => a.guideRequired && a.guideCost > 0).forEach(a => {
      if (kalungaGroup.includes(a.id)) return;
      guideBreakdownItems.push({ name: a.name, cost: a.guideCost });
    });

    if (kalungaAttractions.length > 0) {
      guideBreakdownItems.push({
        name: kalungaAttractions.map(a => a.name.replace('Cachoeira ', '')).join(' + '),
        cost: 200
      });
    }

    guideBreakdownItems.sort((a, b) => a.name.localeCompare(b.name));

    const guideBreakdownHTML = guideBreakdownItems.map(item => `
        <div class="calc-breakdown-item" style="color:var(--text-muted); font-size:11px; padding-left:12px; border-left: 2px solid var(--border); margin-left: 6px; margin-top: 2px; display: flex; justify-content: space-between; align-items: center;">
          <span>↪ ${item.name}</span>
          <span class="calc-breakdown-value">R$ ${item.cost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
        </div>`)
      .join('');

    $('#calcCostBreakdown').innerHTML = `
      <div class="calc-breakdown-item" style="display: flex; justify-content: space-between; align-items: center;"><span>Entradas (${inKanban.length} × ${TRIP_CONFIG.travelers} pax)</span><span class="calc-breakdown-value">R$ ${entranceCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span></div>
      ${entranceBreakdownHTML}
      <div class="calc-breakdown-item" style="margin-top:8px; display: flex; justify-content: space-between; align-items: center;"><span>Guias obrigatórios</span><span class="calc-breakdown-value">R$ ${guideCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span></div>
      ${guideBreakdownHTML}
      <div class="calc-breakdown-item" style="margin-top:8px; display: flex; justify-content: space-between; align-items: center;">
        <span id="car-breakdown-label">Aluguel carro (${TRIP_DAYS.length} dias)</span>
        <span id="car-breakdown-value" class="calc-breakdown-value">R$ ${carCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
      </div>
      <div class="calc-breakdown-item" style="margin-top:8px; display: flex; justify-content: space-between; align-items: center;"><span>Hospedagem Total</span><span class="calc-breakdown-value">R$ ${accCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span></div>
      ${accBreakdownHTML}
      <div class="calc-breakdown-item" style="margin-top:8px; border-top: 1px dashed var(--border); padding-top: 8px; display: flex; justify-content: space-between; align-items: center;">
        <span>Combustível Est. (${totalDistance} km)</span>
        <span class="calc-breakdown-value">R$ ${fuelCostTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
      </div>
      <div class="calc-breakdown-item" style="color:var(--text-muted); font-size:11px; padding-left:12px; border-left: 2px solid var(--border); margin-left: 6px; margin-top: 2px;">
        <span>↪ Méd. R$ ${fuelCostPerKm.toFixed(2)}/km (10km/L)</span>
      </div>
    `;
  }

  // ========================================================================
  // CAR OPTIONS
  // ========================================================================
  function renderCarOptions() {
    const grid = $('#carGrid');
    if (!grid) return;
    grid.innerHTML = '';
    CAR_OPTIONS.forEach((car) => {
      const card = document.createElement('div');
      card.className = 'quotation-card' + (state.selectedCar === car.id ? ' selected' : '');
      const tripDuration = TRIP_DAYS.length || 0;
      card.innerHTML = `
        <div class="quot-card-header">
          <div class="quot-rental-badge">${car.rental}</div>
          <div class="quot-car-name">${car.name}</div>
          <div class="quot-car-type">${car.type}</div>
        </div>
        <div class="quot-price-section">
          <div class="quot-price-main">R$ ${car.dailyRate.toLocaleString('pt-BR')}</div>
          <div class="quot-price-unit">/dia • Total (${tripDuration} dias): R$ ${(car.dailyRate * tripDuration).toLocaleString('pt-BR')}</div>
        </div>
        <ul class="quot-features">
          ${(car.features || []).map((f) => `<li class="quot-feature">${f}</li>`).join('')}
          <li class="quot-feature">Seguro Total + Terceiros</li>
          <li class="quot-feature">Lavação inclusa</li>
        </ul>
    `;
      card.addEventListener('click', () => {
        state.selectedCar = state.selectedCar === car.id ? null : car.id;
        renderCarOptions();
        updateCalculators();
        saveState();
      });
      grid.appendChild(card);
    });
  }

  // ========================================================================
  // ACCOMMODATIONS
  // ========================================================================
  function renderAccommodations() {
    const cavGrid = $('#accGridCavalcante');
    const apGrid = $('#accGridAltoParaiso');
    if (!cavGrid || !apGrid) {
      console.warn("Accommodation grids not found in DOM");
      return;
    }
    cavGrid.innerHTML = '';
    apGrid.innerHTML = '';

    if (typeof ACCOMMODATIONS === 'undefined' || ACCOMMODATIONS.length === 0) {
      console.error("ACCOMMODATIONS data is missing or empty");
      return;
    }

    ACCOMMODATIONS.forEach((acc) => {
      const grid = acc.city === 'Cavalcante' ? cavGrid : apGrid;
      // selection is now automatic based on all 3 being included
      const card = document.createElement('div');
      card.className = 'quotation-card selected';

      const hasUrl = acc.url && acc.url.length > 0;
      card.innerHTML = `
      <div class="quot-icon">${acc.image}</div>
        <div class="quot-name">${acc.name}</div>
        <div class="quot-type">⭐ ${acc.rating}</div>
        <div class="quot-price">R$ ${acc.totalPrice ? acc.totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : acc.pricePerNight.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
        <div class="quot-price-unit">${acc.totalPrice ? 'total por quarto' : '/noite por quarto'}</div>
        ${acc.totalPrice ? `<div style="font-size: 11px; color: var(--text-muted); margin-bottom: 8px;">(R$ ${acc.pricePerNight.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} / diária)</div>` : ''}
        ${acc.breakfast ? '<div class="quot-breakfast-badge">☕ Café da Manhã Incluso</div>' : ''}
    <p style="margin-top:8px;font-size:0.8rem;color:var(--text-muted)">${acc.description}</p>
        ${hasUrl ? '<div class="quot-link">🔗 Ver no Booking.com ↗</div>' : ''}
    `;
      card.addEventListener('click', (e) => {
        if (e.target.closest('.quot-link')) {
          window.open(acc.url, '_blank', 'noopener');
          return;
        }
        // No longer toggling selection, clicking the card just selects or shows info (currently selected by default)
      });
      grid.appendChild(card);
    });
  }

  // ========================================================================
  // STATS & HELPERS
  // ========================================================================
  function updateStats() {
    const attractionsCount = ATTRACTIONS.length;
    $('#stat-attractions').textContent = attractionsCount;

    const travelersCount = TRIP_CONFIG.travelers;
    $('#stat-travelers').textContent = travelersCount;

    const daysCount = TRIP_DAYS.length;
    $('#stat-days').textContent = daysCount;
  }

  function setupPrint() {
    const printBtn = $('#print-itinerary');
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        const printWindow = window.open('', '_blank');
        const printContent = generatePrintLayout();
        printWindow.document.write(printContent);
        printWindow.document.close();
        // Wait for images if any, or just call print
        setTimeout(() => {
          printWindow.print();
        }, 500);
      });
    }
  }

  function generatePrintLayout() {
    const totalKm = $('#calcKmValue').textContent;
    const totalTrail = $('#calcTrailValue').textContent;
    const totalCost = $('#calcCostValue').textContent;
    const costPerPerson = $('#calcPerPersonValue').textContent;

    let html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Roteiro Chapada dos Veadeiros - ${TRIP_CONFIG.startDate} a ${TRIP_CONFIG.endDate}</title>
    <style>
        body { font-family: 'Inter', system-ui, -apple-system, sans-serif; color: #1a2b1f; line-height: 1.4; padding: 20px; }
        .header { text-align: center; border-bottom: 2px solid #00ffa3; padding-bottom: 20px; margin-bottom: 30px; }
        .header h1 { font-family: serif; color: #0f1a12; margin: 0; font-size: 2.5rem; }
        .trip-info { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 30px; background: #f0f7f2; padding: 15px; border-radius: 12px; }
        .info-item { text-align: center; }
        .info-label { font-size: 0.7rem; text-transform: uppercase; color: #749680; font-weight: 700; margin-bottom: 5px; }
        .info-value { font-size: 1.2rem; font-weight: 800; color: #0a110d; }
        
        .kanban { display: flex; flex-direction: column; gap: 20px; }
        .day-row { display: flex; gap: 10px; border: 1px solid #ddd; border-radius: 12px; overflow: hidden; page-break-inside: avoid; }
        .day-header { width: 120px; background: #0f1a12; color: #00ffa3; padding: 15px; text-align: center; display: flex; flex-direction: column; justify-content: center; }
        .day-name { font-weight: 800; font-size: 1.1rem; }
        .day-date { font-size: 0.8rem; opacity: 0.8; }
        .day-base { font-size: 0.7rem; margin-top: 10px; font-weight: 600; color: #ffcc33; }
        
        .slots { flex: 1; display: flex; gap: 10px; }
        .slot { flex: 1; padding: 10px; background: #fbfbfb; border-radius: 8px; min-height: 100px; }
        .slot-title { font-size: 0.65rem; text-transform: uppercase; color: #888; margin-bottom: 8px; font-weight: 700; }
        .calc-breakdown-item { page-break-inside: avoid; break-inside: avoid; margin-bottom: 4px; }
        
        .attr-card { background: white; border: 1px solid #eee; border-radius: 8px; padding: 10px; margin-bottom: 10px; position: relative; }
        .attr-name { font-weight: 700; font-size: 0.9rem; margin-bottom: 4px; color: #0a110d; }
        .attr-details { font-size: 0.75rem; color: #666; display: flex; gap: 8px; flex-wrap: wrap; }
        .attr-tips { font-size: 0.75rem; background: #fffdeb; border-left: 3px solid #ffcc33; padding: 8px; margin-top: 8px; border-radius: 4px; font-style: italic; }
        
        @media print {
            body { padding: 0; }
            button { display: none; }
            .no-print { display: none; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Planejamento: Chapada dos Veadeiros</h1>
        <p>Expedição de ${TRIP_CONFIG.startDate} a ${TRIP_CONFIG.endDate} • ${TRIP_CONFIG.travelers} Viajantes</p>
    </div>

    <div class="trip-info">
        <div class="info-item">
            <div class="info-label">Distância Total</div>
            <div class="info-value">${totalKm} km</div>
        </div>
        <div class="info-item">
            <div class="info-label">Trilhas Total</div>
            <div class="info-value">${totalTrail} km</div>
        </div>
        <div class="info-item">
            <div class="info-label">Custo Total</div>
            <div class="info-value">${totalCost}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Por Pessoa</div>
            <div class="info-value">${costPerPerson}</div>
        </div>
    </div>

    <!-- Mileage Breakdown for Print -->
    <div style="margin-bottom: 30px; background: #fff; border: 1px solid #eee; padding: 15px; border-radius: 12px;">
        <h3 style="margin-top:0; font-size: 1rem; color: #0f1a12; border-bottom: 1px dashed #ddd; padding-bottom: 8px;">📊 Detalhamento de Deslocamento</h3>
        <div style="column-count: 2; column-gap: 30px; font-size: 0.8rem;">
            ${$('#calcKmBreakdown').innerHTML}
        </div>
    </div>

    <div class="kanban">`;

    TRIP_DAYS.forEach(day => {
      html += `
        <div class="day-row">
            <div class="day-header">
                <div class="day-name">${day.weekday}</div>
                <div class="day-date">${day.label}</div>
                <div class="day-base">📍 ${day.base}</div>
            </div>
            <div class="slots">`;

      PERIODS.forEach(period => {
        const key = `${day.date}-${period.id}`;
        const ids = state.kanbanCards[key] || [];
        html += `
                <div class="slot">
                    <div class="slot-title">${period.icon} ${period.label}</div>`;

        ids.forEach(id => {
          const attr = ATTRACTIONS.find(a => a.id === id);
          if (attr) {
            html += `
                    <div class="attr-card">
                        <div class="attr-name">${attr.name}</div>
                        <div class="attr-details">
                            <span>🥾 ${attr.trailLength}km</span>
                            <span>💰 R$${attr.entranceFee}</span>
                            <span>📊 ${attr.difficulty}</span>
                            ${attr.guideRequired ? '<span style="color:red">⚠️ Guia</span>' : ''}
                        </div>
                        <div class="attr-tips"><strong>Dica:</strong> ${attr.tips}</div>
                    </div>`;
          }
        });

        html += `</div>`;
      });

      html += `
            </div>
        </div>`;
    });

    html += `
    </div>

    <div style="margin-top: 40px; font-size: 0.7rem; color: #888; text-align: center; border-top: 1px solid #eee; padding-top: 20px;">
        Gerado pelo Chapada Trip Planner • ${new Date().toLocaleDateString('pt-BR')}
    </div>
</body>
</html>`;
    return html;
  }

  // ========================================================================
  // PERSISTENCE (LocalStorage)
  // ========================================================================
  function saveState() {
    const dataToSave = {
      kanbanCards: state.kanbanCards,
      selectedCar: state.selectedCar,
      selectedAccommodations: state.selectedAccommodations,
      attractionsInKanban: Array.from(state.attractionsInKanban),
      tripConfig: {
        startDate: TRIP_CONFIG.startDate,
        endDate: TRIP_CONFIG.endDate,
        adults: TRIP_CONFIG.adults,
        children: TRIP_CONFIG.children,
        origin: TRIP_CONFIG.origin
      }
    };
    localStorage.setItem('chapada_trip_planner_state', JSON.stringify(dataToSave));
  }

  function loadState() {
    const saved = localStorage.getItem('chapada_trip_planner_state');
    if (!saved) return false;

    try {
      const data = JSON.parse(saved);

      // Restore Config
      if (data.tripConfig) {
        TRIP_CONFIG.startDate = data.tripConfig.startDate;
        TRIP_CONFIG.endDate = data.tripConfig.endDate;
        TRIP_CONFIG.adults = data.tripConfig.adults;
        TRIP_CONFIG.children = data.tripConfig.children;
        TRIP_CONFIG.origin = data.tripConfig.origin;
        TRIP_CONFIG.travelers = TRIP_CONFIG.adults + TRIP_CONFIG.children;
        TRIP_CONFIG.couples = Math.ceil(TRIP_CONFIG.travelers / 2);

        regenerateTripDays(TRIP_CONFIG.startDate, TRIP_CONFIG.endDate);
      }

      // Restore State
      state.kanbanCards = data.kanbanCards || {};
      state.selectedCar = data.selectedCar || null;
      state.selectedAccommodations = data.selectedAccommodations || { Cavalcante: null, 'Alto Paraíso': null };
      state.attractionsInKanban = new Set(data.attractionsInKanban || []);

      return true;
    } catch (e) {
      console.error("Error loading state", e);
      return false;
    }
  }

  // ========================================================================
  // BOOT
  // ========================================================================
  document.addEventListener('DOMContentLoaded', init);
})();
