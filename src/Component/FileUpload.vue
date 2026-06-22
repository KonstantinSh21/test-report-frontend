<template>
  <div class="uploader">
    <div class="uploader-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M12 3v12m0 0-3-3m3 3 3-3M5 21h14"/>
        <path d="M4 12v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4"/>
      </svg>
    </div>
    <p class="uploader-title">Загрузите JSON файл</p>
    <p class="uploader-hint">Поддерживаются файлы с расширением .json</p>

    <label class="uploader-area" :class="{ 'has-file': selectedFile }">
      <input
        ref="fileInput"
        type="file"
        accept=".json,application/json"
        class="uploader-input"
        @change="handleFileChange"
      />
      <span class="uploader-area-text">
        {{ selectedFile ? selectedFile.name : 'Выберите файл или перетащите его сюда' }}
      </span>
    </label>

    <button class="btn btn-primary" @click="submit" :disabled="!selectedFile">
      <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M5 13l4 4L19 7"/>
      </svg>
      Загрузить
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import FileHelper from "@/lib/FileHelper.js";

const emit = defineEmits(['submit']);
const fileInput = ref(null);
const selectedFile = ref(null);

function handleFileChange(event) {
  const file = event.target.files?.[0];
  selectedFile.value = file || null;
  console.log('Файл выбран:', file?.name);
}

async function submit() {
  if (!selectedFile.value) {
    alert('Выберите файл');
    return;
  }
  
  console.log('Загружаем файл:', selectedFile.value.name);
  const json = await FileHelper.readFile(selectedFile.value);
  console.log('JSON прочитан, длина:', json.length);
  emit('submit', json);
}
</script>

<style scoped>
.uploader {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 16px;
  min-width: 400px;
}

.uploader-icon {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #6366f120 0%, #8b5cf620 100%);
  border-radius: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}

.uploader-icon svg {
  width: 32px;
  height: 32px;
  color: #818cf8;
}

.uploader-title {
  font-size: 18px;
  font-weight: 600;
  color: #e2e2e6;
}

.uploader-hint {
  font-size: 13px;
  color: #71717a;
  margin-top: -8px;
}

.uploader-area {
  width: 100%;
  min-height: 120px;
  background: rgba(10, 10, 18, 0.4);
  border: 2px dashed rgba(99, 102, 241, 0.4);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.uploader-area:hover {
  border-color: #6366f1;
  background: rgba(99, 102, 241, 0.05);
}

.uploader-area.has-file {
  border-color: #10b981;
  border-style: solid;
  background: rgba(16, 185, 129, 0.05);
}

.uploader-input {
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.uploader-area-text {
  font-size: 14px;
  color: #a1a1aa;
  text-align: center;
  padding: 20px;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 28px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border: none;
  border-radius: 40px;
  color: white;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
}

.btn-primary:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.icon {
  width: 16px;
  height: 16px;
}
</style>