<template>
  <div class="details-card">
    <div class="details-header">
      <div class="details-title">
        <svg class="title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        {{ title }}
      </div>
    </div>

    <div class="details-content">
      <div v-if="details.error" class="detail-item error">
        <div class="detail-label">Error</div>
        <div class="detail-value">{{ details.error }}</div>
      </div>

      <div v-if="details.locator" class="detail-item">
        <div class="detail-label">Locator</div>
        <code class="detail-code">{{ details.locator }}</code>
      </div>

      <div v-if="details.expected" class="detail-item">
        <div class="detail-label">Expected</div>
        <div class="detail-value">{{ details.expected }}</div>
      </div>

      <div v-if="details.received" class="detail-item">
        <div class="detail-label">Received</div>
        <div class="detail-value">{{ details.received }}</div>
      </div>

      <div v-if="details.full" class="detail-item collapsible">
        <div class="detail-label clickable" @click="showLog = !showLog">
          <svg class="collapse-icon" :class="{ rotated: showLog }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 18l6-6-6-6"/>
          </svg>
          Call Log
        </div>
        <Transition name="log">
          <div v-if="showLog" class="detail-log">
            <div v-for="(line, index) in details.callLog" :key="index" class="log-line">
              {{ line }}
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref } from 'vue';

defineProps(['details', 'title']);
const showLog = ref(false);
</script>

<style scoped>
.details-card {
  background: rgba(15, 15, 26, 0.6);
  border-radius: 24px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.details-header {
  padding: 20px 24px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.details-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 18px;
  font-weight: 600;
  background: linear-gradient(135deg, #e2e2e6 0%, #a1a1aa 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.title-icon {
  width: 24px;
  height: 24px;
  color: #818cf8;
  background: none;
  -webkit-text-fill-color: initial;
}

.details-content {
  padding: 16px 24px 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-label {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #818cf8;
}

.detail-value {
  font-size: 14px;
  color: #e2e2e6;
  background: rgba(0, 0, 0, 0.3);
  padding: 10px 14px;
  border-radius: 12px;
  font-family: monospace;
  word-break: break-word;
  white-space: pre-wrap;
}

.detail-code {
  font-size: 13px;
  background: #0a0a12;
  padding: 10px 14px;
  border-radius: 12px;
  color: #34d399;
  font-family: 'Monaco', monospace;
  overflow-x: auto;
}

.detail-item.error .detail-value {
  color: #f87171;
  border-left: 3px solid #ef4444;
}

.clickable {
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  user-select: none;
}

.clickable:hover {
  color: #a78bfa;
}

.collapse-icon {
  width: 16px;
  height: 16px;
  transition: transform 0.2s;
}

.collapse-icon.rotated {
  transform: rotate(90deg);
}

.detail-log {
  background: #0a0a12;
  border-radius: 14px;
  padding: 14px;
  max-height: 280px;
  overflow-y: auto;
  font-family: 'Monaco', monospace;
  font-size: 12px;
}

.log-line {
  padding: 4px 0;
  color: #a1a1aa;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  word-break: break-word;
  white-space: pre-wrap;
}

.log-line:last-child {
  border-bottom: none;
}

.log-enter-active,
.log-leave-active {
  transition: all 0.2s ease;
}

.log-enter-from,
.log-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>