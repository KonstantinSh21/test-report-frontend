<template>
  <div class="layout">
    <div class="toolbar">
      <button class="btn btn-primary" @click="openParser = true">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M4 4v16h16V4H4z M8 9h8M8 13h6M8 17h4"/>
          <path d="M15 4v4h4"/>
        </svg>
        Передать данные логов
      </button>

      <button class="btn btn-outline" @click="handleClearClick">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 6h18M5 6v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6m-9 4v6m4-6v6"/>
        </svg>
        Очистить
      </button>

      <button class="btn btn-outline" :disabled="revisions.length === 0" @click="saveJson">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
          <path d="M17 21v-4H7v4M12 3v5h5"/>
        </svg>
        Сохранить JSON
      </button>

      <button class="btn btn-outline" @click="openFileUpload = true">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 3v12m0 0-3-3m3 3 3-3M5 21h14"/>
        </svg>
        Загрузть JSON
      </button>
    </div>

    <div class="content">
      <TestsTable v-if="revisions.length > 0" :revisions="revisions" />
      <div v-else class="empty-state">
        <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.5L17 7.5V19a2 2 0 0 1-2 2z"/>
        </svg>
        <p>Нет данных. Загрузите JSON или добавьте результат парсера.</p>
      </div>
    </div>

    <Modal v-if="openParser" class="modal" @close="openParser = false">
      <TestResultParser @submit="handleSubmit" />
    </Modal>

    <Modal v-if="openFileUpload" class="modal" @close="openFileUpload = false">
      <FileUpload @submit="handleJsonUpload" />
    </Modal>
  </div>
</template>

<script setup>
import TestResultParser from "@/Component/TestResultParser.vue";
import { ref, onMounted } from "vue";
import TestsTable from "@/Component/TestsTable.vue";
import PipeLineTotalModel from "@/model/PipeLineTotalModel.js";
import TableDataHandler from "@/lib/TableDataHandler.js";
import FileHelper from "@/lib/FileHelper.js";
import FileUpload from "@/Component/FileUpload.vue";
import Modal from "@/Component/Modal.vue";

// ========== КОНФИГУРАЦИЯ ==========
const API_BASE = 'http://localhost:8000/api';

const openParser = ref(false);
const openFileUpload = ref(false);
const revisions = ref([]);

onMounted(() => {
  loadRevisions();
});

function adaptApiToPipeLineModel(apiData) {
  return {
    getState() {
      return {
        passed: apiData.passed,
        total: apiData.total,
        failed: apiData.failed,
        tests: (apiData.tests || []).map(test => ({
          testName: test.name,
          status: test.status,
          file: test.file || 'general',
          testDetails: {
            error: test.error || '',
            locator: test.locator || '',
            expected: test.expected || '',
            received: test.received || '',
            callLog: test.call_log || []
          }
        }))
      };
    },
    
    getByFileMap() {
      const map = new Map();
      const tests = this.getState().tests;
      
      for (const test of tests) {
        const fileName = test.file;
        if (!map.has(fileName)) {
          map.set(fileName, new Map());
        }
        map.get(fileName).set(test.testName, test);
      }
      
      return map;
    }
  };
}

async function loadRevisions() {
  try {
    const response = await fetch(`${API_BASE}/runs/`);
    const data = await response.json();
    
    const formattedRevisions = data.map(item => adaptApiToPipeLineModel(item));
    revisions.value = formattedRevisions;
  } catch (error) {
    console.error('Ошибка загрузки:', error);
  }
}

async function saveToBackend(pipeLineModel) {
  const state = pipeLineModel.getState();
  const dataToSend = {
    passed: state.passed,
    total: state.total,
    failed: state.failed,
    tests: state.tests.map(test => ({
      name: test.testName,
      file: test.file,
      status: test.status,
      error: test.testDetails?.error || '',
      locator: test.testDetails?.locator || '',
      expected: test.testDetails?.expected || '',
      received: test.testDetails?.received || '',
      call_log: test.testDetails?.callLog || []
    }))
  };
  
  const response = await fetch(`${API_BASE}/runs/create/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dataToSend),
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Ошибка сохранения: ${error}`);
  }
  
  return response.json();
}

async function clearBackend() {
  await fetch(`${API_BASE}/runs/clear/`, {
    method: 'DELETE',
  });
}


async function handleSubmit(payload) {
  try {
    const dataToSend = {
      passed: payload.length,
      total: payload.length,
      failed: 0,
      tests: payload.map(test => ({
        name: test.testName,
        status: test.status || 'failed',
        file: test.file || 'test.spec.js',
        error: test.testDetails?.error || '',
        locator: test.testDetails?.locator || '',
        expected: test.testDetails?.expected || '',
        received: test.testDetails?.received || '',
        call_log: test.testDetails?.callLog || []
      }))
    };
    
    const response = await fetch(`${API_BASE}/runs/create/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataToSend),
    });
    
    if (!response.ok) {
      throw new Error('Ошибка сохранения');
    }
    
    await loadRevisions();
    openParser.value = false;
  } catch (error) {
    alert('Ошибка при сохранении на сервер');
  }
}

function saveJson() {
  const tableDataHandler = new TableDataHandler(revisions.value);
  const json = tableDataHandler.buildJson();
  const fileName = `table-data_${Date.now()}.json`;
  FileHelper.downloadFile(json, fileName, 'application/json');
}

async function handleJsonUpload(json) {
  try {
    const jsonData = JSON.parse(json);
    
    for (const revision of jsonData) {
      const pipeLineModel = new PipeLineTotalModel(
        revision.passed,
        revision.total,
        revision.failed,
        revision.tests,
      );
      await saveToBackend(pipeLineModel);
    }
    
    await loadRevisions();
    openFileUpload.value = false;
  } catch (error) {
    alert('Ошибка при загрузке файла');
  }
}

async function handleClearClick() {
  if (confirm('Вы уверены, что хотите очистить все данные?')) {
    try {
      await clearBackend();
      await loadRevisions();
    } catch (error) {
      console.error('Ошибка очистки:', error);
    }
  }
}
</script>
<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #app {
  height: 100%;
  width: 100%;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  background: linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 100%);
  color: #e2e2e6;
}

/* Scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

.layout {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 100%;
  width: 100%;
  background: linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 100%);
  overflow: hidden;
}

.toolbar {
  display: flex;
  gap: 12px;
  padding: 16px 24px;
  background: rgba(15, 15, 26, 0.7);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  flex-wrap: wrap;
  z-index: 10;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 20px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  font-family: inherit;
}

.btn-primary {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(99, 102, 241, 0.4);
}

.btn-primary:active {
  transform: translateY(0);
}

.btn-outline {
  background: rgba(255, 255, 255, 0.05);
  color: #e2e2e6;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.btn-outline:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

.btn-outline:active {
  transform: translateY(0);
}

.btn-outline:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none;
}

.icon {
  width: 18px;
  height: 18px;
}

.content {
  flex: 1;
  overflow: auto;
  padding: 24px;
  background-color: #fff;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 16px;
  color: #000;
}

.empty-icon {
  width: 64px;
  height: 64px;
  opacity: 0.3;
}

.empty-state p {
  font-size: 16px;
}
</style>