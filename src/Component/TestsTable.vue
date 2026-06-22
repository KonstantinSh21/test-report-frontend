<template>
  <Modal
      v-if="details"
      v-model="detailsModalOpen"
      :width="800"
      :max-width="800"
      @close="details = null; detailsTitle = null"
  >
    <Details :details="details" :title="detailsTitle" />
  </Modal>

  <div class="tests-container">
    <!-- Панель инструментов -->
    <!-- <div class="tests-toolbar">
      <button class="btn-tool" @click="handleCopyVisible">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
        </svg>
        Копировать видимые
      </button>
      <button class="btn-tool" @click="handleLoadDetailsForVisible">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
        </svg>
        Выгрузить отчёт
      </button>
    </div> -->

    <!-- Настройки -->
    <div class="settings-panel">
      <div class="panel-header">
        <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
        <span>Настройки отображения</span>
      </div>
      <div class="settings-controls">
        <label class="toggle">
          <input type="checkbox" v-model="settings.showFiles" @change="handleSettingsChange" />
          <span class="toggle-slider"></span>
          <span class="toggle-label">Показывать файлы</span>
        </label>
        <label class="toggle">
          <input type="checkbox" v-model="settings.showStatistics" @change="handleSettingsChange" />
          <span class="toggle-slider"></span>
          <span class="toggle-label">Показывать статистику</span>
        </label>
        <div class="input-group">
          <label class="input-label">Первая колонка</label>
          <input
            type="number"
            class="input-number"
            v-model.number="settings.firstColumnPosition"
            @change="handleSettingsChange"
          />
        </div>
      </div>
    </div>

    <!-- Фильтры -->
    <div class="filters-panel">
      <div class="panel-header">
        <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="22 3 2 3 10 13 10 21 14 18 14 13 22 3"/>
        </svg>
        <span>Фильтры</span>
      </div>
      <div class="filters-controls">
        <label class="filter-chip filter-broken" :data-active="checkboxes.broken">
          <input type="checkbox" v-model="checkboxes.broken" @change="handleFilterCheckboxChange" />
          <span>Сломан</span>
          <span class="chip-count">{{ counters.broken }}</span>
        </label>
        <label class="filter-chip filter-fixed" :data-active="checkboxes.fixed">
          <input type="checkbox" v-model="checkboxes.fixed" @change="handleFilterCheckboxChange" />
          <span>Исправлен</span>
          <span class="chip-count">{{ counters.fixed }}</span>
        </label>
        <label class="filter-chip filter-failed" :data-active="checkboxes.failed">
          <input type="checkbox" v-model="checkboxes.failed" @change="handleFilterCheckboxChange" />
          <span>Не проходит</span>
          <span class="chip-count">{{ counters.failed }}</span>
        </label>
        <label class="filter-chip filter-stable" :data-active="checkboxes.stable">
          <input type="checkbox" v-model="checkboxes.stable" @change="handleFilterCheckboxChange" />
          <span>Проходит</span>
          <span class="chip-count">{{ counters.stable }}</span>
        </label>
        <div class="search-box">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.3-4.3"/>
          </svg>
          <input
            type="text"
            v-model="search"
            placeholder="Поиск..."
            class="search-input"
          />
        </div>
      </div>
    </div>

    <!-- Таблица -->
    <div class="table-wrapper">
      <table class="data-table" v-if="tableData.length > 3">
        <thead>
          <tr>
            <th v-for="(item, index) in tableData[0].cells" :key="`head_${index}`" :class="{ 'col-fixed': index === settings.firstColumnPosition }">
              {{ index === settings.firstColumnPosition ? index : '' }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, rowIndex) in tableData"
            v-show="isRowVisible(row)"
            :key="`row_${rowIndex}`"
            :class="getRowClasses(row)"
          >
            <template
              v-for="(cellData, cellIndex) in row.cells"
              :key="`cell_${rowIndex}_${cellIndex}`"
            >
              <td
                v-if="!cellData.skip"
                :colspan="cellData.colspan"
                :class="getCellClasses(row, cellIndex)"
                @click="handleCellClick(row, cellIndex)"
              >
                {{ cellData.value }}
              </td>
            </template>
          </tr>
        </tbody>
      </table>
      <div v-else class="table-empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <path d="M9 3v18M15 3v18M3 9h18M3 15h18"/>
        </svg>
        <p>Недостаточно данных для отображения таблицы</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  onMounted,
  ref,
  watch,
} from 'vue';
import TableDataHandler from '@/lib/TableDataHandler.js';
import TableFilterHelper from "@/lib/TableFilterHelper.js";
import TableSettingsHelper from "@/lib/TableSettingsHelper.js";
import Modal from "@/Component/Modal.vue";
import Details from "@/Component/Details.vue";
import ReportHelper from "@/lib/ReportHelper.js";
import FileHelper from "@/lib/FileHelper.js";

const props = defineProps(['revisions']);
const tableData = ref([]);
const details = ref(null);
const detailsTitle = ref(null);
const detailsModalOpen = ref(false);
const settings = ref({
  showFiles: true,
  showStatistics: true,
  firstColumnPosition: 0,
});
const checkboxes = ref({
  failed: true,
  stable: true,
  fixed: true,
  broken: true,
});
const counters = ref({
  failed: 0,
  stable: 0,
  fixed: 0,
  broken: 0,
});
const filters = ref(['failed', 'stable', 'fixed', 'broken']);
const search = ref('');

onMounted(() => {
  checkboxes.value = TableFilterHelper.getFilters();
  settings.value = TableSettingsHelper.getSettings(props.revisions.length);
  updateFilters();
  const handler = new TableDataHandler(props.revisions, settings.value.firstColumnPosition);
  tableData.value = handler.getTableData();
  initCounters();
});

watch(() => props.revisions, () => {
  if (settings.value.firstColumnPosition === 0) {
    settings.value.firstColumnPosition = TableSettingsHelper.getFirstColumnPosition(props.revisions.length);
  }
  const handler = new TableDataHandler(props.revisions, settings.value.firstColumnPosition);
  tableData.value = handler.getTableData();
  initCounters();
});

watch(() => settings.value.firstColumnPosition, () => {
  const handler = new TableDataHandler(props.revisions, settings.value.firstColumnPosition);
  tableData.value = handler.getTableData();
  initCounters();
});

watch(search, () => {
  // реактивный поиск
});

function getRowClasses(row) {
  return {
    'data-row': true,
    [`status-${row.status}`]: row.status,
    'row-file': row.isFile,
    'row-stats': row.isStatics,
  };
}

function getCellClasses(row, cellIndex) {
  const cell = row.cells[cellIndex];
  
  return [
    'data-cell',
    cellIndex === 0 ? 'cell-test-name' : 'cell-value',  // ← меняем здесь
    cell?.test?.testDetails ? 'cell-details' : null,
    (cell?.test?.testDetails || (row.isFile && cellIndex === 0) || (cellIndex === 0 && !row.isStatics)) ? 'cell-clickable' : null,
  ]
}

function updateFilters() {
  const newFilters = [
    checkboxes.value.failed ? 'failed' : null,
    checkboxes.value.stable ? 'stable' : null,
    checkboxes.value.fixed ? 'fixed' : null,
    checkboxes.value.broken ? 'broken' : null,
  ];
  filters.value = newFilters.filter((value) => !!value);
}

function handleFilterCheckboxChange() {
  updateFilters();
  TableFilterHelper.saveFilters(checkboxes.value);
}

function objectToString(row) {
  const values = [];
  const traverse = (item) => {
    if (item == null) return;
    if (typeof item !== 'object' || item instanceof Date) {
      values.push(String(item));
      return;
    }
    if (Array.isArray(item)) {
      item.forEach(traverse);
      return;
    }
    Object.values(item).forEach(traverse);
  };
  traverse(row);
  return values.join(' ');
}

function handleSettingsChange() {
  TableSettingsHelper.saveSettings(settings.value);
}

function isRowVisible(row) {
  if (settings.value.showStatistics && row.isStatics) return true;
  if (settings.value.showFiles && row.isFile) return true;
  if (!filters.value.includes(row.status)) return false;
  if (!search.value) return true;
  const rowString = objectToString(row.cells);
  return rowString.toLowerCase().includes(search.value.toLowerCase());
}

function handleCopyVisible() {
  const tests = [];
  for (let index = 0; index < tableData.value.length; index += 1) {
    const row = tableData.value[index];
    if (isRowVisible(row) && !row.isStatics) {
      tests.push(row.cells[0].value);
    }
  }
  navigator.clipboard.writeText(tests.join('\n')).then().catch();
}

function handleLoadDetailsForVisible() {
  const tests = [];
  for (let index = 0; index < tableData.value.length; index += 1) {
    const row = tableData.value[index];
    if (isRowVisible(row) && !row.isStatics) {
      tests.push(row);
    }
  }
  const report = ReportHelper.getReport(tests);
  const fileName = `report_${Date.now()}.txt`;
  FileHelper.downloadFile(report, fileName, 'text/plain; charset=utf-8');
}

function handleCellClick(row, cellIndex) {
  const cell = row.cells[cellIndex];
  if (cell?.test?.testDetails) {
    details.value = cell.test.testDetails;
    detailsTitle.value = cell.test.testName;
    detailsModalOpen.value = true;
    return;
  }
  if (row.isFile && row.cells[0]) {
    navigator.clipboard.writeText(row.cells[0].value.trim()).then().catch();
    return;
  }
  if (cellIndex !== 0 || row.isStatics) return;
  navigator.clipboard.writeText(cell.value.trim()).then().catch();
}

function initCounters() {
  counters.value.broken = 0;
  counters.value.fixed = 0;
  counters.value.failed = 0;
  counters.value.stable = 0;
  for (let index = 0; index < tableData.value.length; index += 1) {
    const row = tableData.value[index];
    if (row.isFile || row.isStatics) continue;
    counters.value[row.status] += 1;
  }
}
</script>

<style scoped>
.tests-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Колонка с названием теста - ОГРАНИЧИВАЕМ ШИРИНУ */
.cell-test-name {
  max-width: 250px;
  min-width: 150px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
  font-weight: 500;
  cursor: pointer;
}

/* Тултип при наведении */
.cell-test-name:hover {
  overflow: visible;
  white-space: normal;
  word-break: break-word;
  background: rgba(99, 102, 241, 0.1);
  position: relative;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
}

/* Остальные колонки (цифры) */
.cell-value {
  text-align: center;
  white-space: nowrap;
  padding: 10px 8px;
}

/* Для строк-файлов */
.row-file .cell-test-name {
  font-weight: 700;
  color: #818cf8;
}

/* Toolbar */
.tests-toolbar {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  background: linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 100%);
  padding: 16px 0;
}

.btn-tool {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 18px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  color: #c4c4cc;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-tool:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.15);
  color: white;
  transform: translateY(-1px);
}

.btn-tool .icon {
  width: 16px;
  height: 16px;
}

/* Панели */
.settings-panel,
.filters-panel {
  background: linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 100%);
  backdrop-filter: blur(4px);
  padding: 16px 20px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.panel-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
  font-size: 13px;
  font-weight: 600;
  color: #818cf8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.icon-sm {
  width: 16px;
  height: 16px;
}

.settings-controls,
.filters-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 24px;
}

/* Toggle switch */
.toggle {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-size: 14px;
  color: #d4d4d8;
}

.toggle input {
  display: none;
}

.toggle-slider {
  width: 40px;
  height: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 40px;
  position: relative;
  transition: 0.2s;
}

.toggle-slider::before {
  content: '';
  position: absolute;
  width: 16px;
  height: 16px;
  background: #a1a1aa;
  border-radius: 50%;
  top: 2px;
  left: 2px;
  transition: 0.2s;
}

.toggle input:checked + .toggle-slider {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
}

.toggle input:checked + .toggle-slider::before {
  transform: translateX(20px);
  background: white;
}

/* Input number */
.input-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.input-label {
  font-size: 13px;
  color: #a1a1aa;
}

.input-number {
  width: 65px;
  background: rgba(10, 10, 18, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 6px 10px;
  color: white;
  font-size: 13px;
  text-align: center;
}

.input-number:focus {
  outline: none;
  border-color: #6366f1;
}

/* Filter chips */
.filter-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border-radius: 40px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.filter-chip input {
  display: none;
}

.filter-chip[data-active="true"] {
  border-color: currentColor;
}

.chip-count {
  padding: 2px 8px;
  border-radius: 30px;
  font-size: 11px;
  font-weight: 600;
}

.filter-broken { color: #f87171; }
.filter-fixed { color: #34d399; }
.filter-failed { color: #fbbf24; }
.filter-stable { color: #6b7280; }

.filter-chip:hover {
  transform: translateY(-1px);
  background: rgba(255, 255, 255, 0.08);
}

/* Search */
.search-box {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: #71717a;
}

.search-input {
  background: rgba(10, 10, 18, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 40px;
  padding: 8px 16px 8px 38px;
  color: #e2e2e6;
  font-size: 13px;
  width: 220px;
  transition: all 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #6366f1;
  width: 280px;
}

.search-input::placeholder {
  color: #52525b;
}

/* Table wrapper */
.table-wrapper {
  overflow-x: auto;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.data-table {
  color: #0f0f1a;
  width: 100%;
  font-size: 13px;
  min-width: 600px;
}

.data-table thead tr {
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

table, td, th {
  border-collapse: collapse;
  border: 1px solid #ccc;
}

.data-table th {
  padding: 14px 12px;
  text-align: center;
  font-weight: 600;
  color: #818cf8;
  font-size: 12px;
}

.data-table th.col-fixed {
  text-align: left;
}

.data-row {
  transition: background 0.15s;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}

.data-row:hover {
  background: rgba(255, 255, 255, 0.03);
}

.data-cell {
  padding: 10px 12px;
}

.cell-label {
  text-align: left;
  font-weight: 500;
}

.cell-value {
  text-align: center;
}

.cell-details {
  position: relative;
  cursor: pointer;
  font-weight: 500;
}

.cell-details::after {
  content: 'ⓘ';
  position: absolute;
  right: 4px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 11px;
  color: #818cf8;
}

.cell-clickable {
  cursor: pointer;
}

/* Статусы строк */
/* СТАТУС FIXED (исправлен) - ЯРКО-ЗЕЛЁНЫЙ */
.status-fixed {
  background: rgba(34, 197, 94, 0.25) !important;
  border-left: 4px solid #22c55e !important;
}


/* СТАТУС FAILED (не проходит) - ЯРКО-ЖЁЛТЫЙ */
.status-failed {
  background: rgba(251, 191, 36, 0.25) !important;
  border-left: 4px solid #fbbf24 !important;
}

/* СТАТУС BROKEN (сломан) - ЯРКО-КРАСНЫЙ */
.status-broken {
  background: rgba(239, 68, 68, 0.25) !important;
  border-left: 4px solid #ef4444 !important;
}

/* СТАТУС STABLE (стабилен) - СИЗЫЙ */
.status-stable {
  background: rgba(156, 163, 175, 0.15) !important;
}

/* Убираем возможные перебивающие стили */
.data-row {
  transition: all 0.2s ease;
}

.data-row.status-fixed,
.data-row.status-failed,
.data-row.status-broken,
.data-row.status-stable {
  background-blend-mode: overlay;
}

.row-file {
  background: rgba(99, 102, 241, 0.03);
}
.row-file .cell-label {
  font-weight: 700;
  color: #818cf8;
}

.row-stats {
  font-style: italic;
}

/* Пустое состояние таблицы */
.table-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #52525b;
  gap: 12px;
}

.table-empty svg {
  width: 48px;
  height: 48px;
  opacity: 0.3;
}
</style>