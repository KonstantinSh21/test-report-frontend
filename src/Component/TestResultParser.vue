<template>
  <div class="parser">
    <div class="parser-header">
      <div class="parser-badge">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
        </svg>
        <span>{{ models.length }}</span>
      </div>
    </div>

    <div class="parser-form">
      <label class="form-label">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 9l5 5 5-5M12 4v10"/>
        </svg>
        Вставьте результат теста
      </label>
      <textarea
        class="form-textarea"
        v-model="textareaData"
        placeholder="Вставьте текст с результатами тестов..."
      />
    </div>

    <div class="parser-actions">
      <button class="btn btn-secondary" @click="parseData">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 12h4l3-9 4 18 3-9h4"/>
        </svg>
        Вставить
      </button>
      <button class="btn btn-outline" @click="clearData">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 6h18M5 6v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6m-9 4v6m4-6v6"/>
        </svg>
        Очистить
      </button>
      <button class="btn btn-primary" @click="submit" :disabled="models.length === 0">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
          <path d="M17 21v-4H7v4M12 3v5h5"/>
        </svg>
        Принять
      </button>
    </div>

    <div v-if="models.length > 0" class="parser-list">
      <div class="list-header">
        <span>Добавленные тесты</span>
        <span class="list-count">{{ models.length }}</span>
      </div>
      <div class="list-items">
        <div v-for="(model, idx) in models" :key="idx" class="list-item">
          <span class="item-index">{{ idx + 1 }}</span>
          <span class="item-name">{{ model.testName || 'Тест' }}</span>
          <span :class="['item-status', model.status]">{{ model.status }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import TestResultModel from "@/model/TestResultModel.js";

const emit = defineEmits(['submit']);
const textareaData = ref('');
const models = ref([]);

function parseData() {
  try {
    const model = new TestResultModel(textareaData.value);
    models.value.push(model);
    textareaData.value = '';
  } catch (e) {
    alert(e.message);
  }
}

function clearData() {
  models.value = [];
}

function submit() {
  if (models.value.length === 0) return;
  emit('submit', models.value);
}
</script>

<style scoped>
.parser {
  display: flex;
  flex-direction: column;
  gap: 15px;
  min-width: 560px;
}

.parser-header {
  display: flex;
  justify-content: flex-end;
}

.parser-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  margin-right: 48px;
  background: rgba(99, 102, 241, 0.15);
  border-radius: 40px;
  font-size: 13px;
  font-weight: 500;
  color: #818cf8;
  border: 1px solid rgba(99, 102, 241, 0.3);
}

.parser-badge .icon {
  width: 14px;
  height: 14px;
}

.parser-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.form-label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #c4c4cc;
}

.form-label .icon {
  width: 18px;
  height: 18px;
  color: #818cf8;
}

.form-textarea {
  width: 100%;
  height: 280px;
  background: rgba(10, 10, 18, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 14px 16px;
  color: #e2e2e6;
  font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
  font-size: 13px;
  resize: none;
  transition: all 0.2s;
}

.form-textarea:focus {
  outline: none;
  border-color: #6366f1;
  background: rgba(10, 10, 18, 0.8);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.form-textarea::placeholder {
  color: rgba(226, 226, 230, 0.3);
}

.parser-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
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
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
}

.btn-primary:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.08);
  color: #e2e2e6;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.12);
  transform: translateY(-1px);
}

.btn-outline {
  background: transparent;
  color: #a1a1aa;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.btn-outline:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #e2e2e6;
  border-color: rgba(255, 255, 255, 0.25);
}

.icon {
  width: 16px;
  height: 16px;
}

.parser-list {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding-top: 16px;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 13px;
  font-weight: 500;
  color: #a1a1aa;
}

.list-count {
  background: rgba(99, 102, 241, 0.2);
  padding: 2px 10px;
  border-radius: 40px;
  font-size: 12px;
  color: #818cf8;
}

.list-items {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 200px;
  overflow-y: auto;
}

.list-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 10px;
  font-size: 13px;
}

.item-index {
  width: 28px;
  color: #6366f1;
  font-weight: 600;
}

.item-name {
  flex: 1;
  color: #e2e2e6;
  font-family: monospace;
}

.item-status {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 20px;
  text-transform: uppercase;
  font-weight: 600;
}

.item-status.passed {
  background: #10b98120;
  color: #34d399;
}

.item-status.failed {
  background: #ef444420;
  color: #f87171;
}
</style>