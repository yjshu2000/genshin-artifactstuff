let VIRTUAL_SETS, SETS, SETS_META, CHARS;

// ══════════════════════════════════════════════
//  HELPERS
// ══════════════════════════════════════════════

function truncate(str, max) {
  return str.length > max ? str.slice(0, max) + '…' : str;
}

function makeCharPill(charName, priority, note) {
  const char = CHARS[charName];
  const el = char ? char.element : 'none';
  const pill = document.createElement('span');
  pill.className = `char-pill el-${el} p-${priority}`;
  pill.textContent = charName + (note ? '*' : '');
  if (note) pill.dataset.note = note;
  return pill;
}

function buildSetIndex() {
  const idx = {};
  SETS.forEach(s => idx[s] = []);
  VIRTUAL_SETS.forEach(v => idx[v.key] = []);
  Object.entries(CHARS).forEach(([charName, data]) => {
    data.sets.forEach(entry => {
      if (!idx[entry.set]) idx[entry.set] = [];
      idx[entry.set].push({ charName, priority: entry.priority || 'primary', note: entry.note });
    });
  });
  return idx;
}

// ══════════════════════════════════════════════
//  RENDER: SETS VIEW
// ══════════════════════════════════════════════

function renderSets() {
  const idx = buildSetIndex();
  const tbody = document.getElementById('sets-tbody');
  tbody.innerHTML = '';

  VIRTUAL_SETS.forEach(v => {
    const tr = document.createElement('tr');
    const tdNum = document.createElement('td'); tdNum.className = 'col-num';
    const tdSet = document.createElement('td'); tdSet.className = 'col-set virtual'; tdSet.textContent = v.name;
    const tdChars = document.createElement('td');
    const div = document.createElement('div'); div.className = 'col-chars';
    (idx[v.key] || []).forEach(e => div.appendChild(makeCharPill(e.charName, e.priority, e.note)));
    tdChars.appendChild(div);
    tr.append(tdNum, tdSet, tdChars);
    tbody.appendChild(tr);
  });

  SETS.forEach((setName, i) => {
    const tr = document.createElement('tr');
    const tdNum = document.createElement('td'); tdNum.className = 'col-num'; tdNum.textContent = i + 1;
    const tdSet = document.createElement('td'); tdSet.className = 'col-set'; tdSet.textContent = setName;
    const tdChars = document.createElement('td');
    const div = document.createElement('div'); div.className = 'col-chars';
    (idx[setName] || []).forEach(e => div.appendChild(makeCharPill(e.charName, e.priority, e.note)));
    if (SETS_META[setName]?.exclusive) {
      const marker = document.createElement('span');
      marker.className = 'exclusive-marker';
      marker.textContent = '||';
      div.appendChild(marker);
    }
    tdChars.appendChild(div);
    tr.append(tdNum, tdSet, tdChars);
    tbody.appendChild(tr);
  });
}

// ══════════════════════════════════════════════
//  RENDER: CHARS VIEW
// ══════════════════════════════════════════════

function renderChars() {
  const tbody = document.getElementById('chars-tbody');
  tbody.innerHTML = '';
  const MAX = 16;

  Object.entries(CHARS).forEach(([charName, data]) => {
    const tr = document.createElement('tr');
    const tdName = document.createElement('td'); tdName.className = 'col-charname'; tdName.textContent = charName;
    const tdSets = document.createElement('td');
    const div = document.createElement('div'); div.className = 'col-sets';

    data.sets.forEach(entry => {
      const virtual = VIRTUAL_SETS.find(v => v.key === entry.set);
      const fullName = virtual ? virtual.name : entry.set;
      const pill = document.createElement('span');
      pill.className = `set-pill p-${entry.priority || 'primary'}`;
      pill.textContent = truncate(fullName, MAX);
      pill.dataset.fullname = fullName + (entry.note ? ' — ' + entry.note : '');
      div.appendChild(pill);
    });

    tdSets.appendChild(div);
    tr.append(tdName, tdSets);
    tbody.appendChild(tr);
  });
}

// ══════════════════════════════════════════════
//  TABS
// ══════════════════════════════════════════════

document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('view-' + tab.dataset.tab).classList.add('active');
  });
});

fetch("/data.json")
  .then(r => r.json())
  .then(d => {
    VIRTUAL_SETS = d.virtual_sets;
    SETS         = d.sets;
    SETS_META    = d.sets_meta;
    CHARS        = d.chars;
    renderSets();
    renderChars();
  });
