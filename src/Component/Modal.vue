<template>
  <div
      class="modal"
  >
    <div
        ref="modal"
        class="modal__content"
        :style="styles"
    >
      <slot />

      <button
          ref="closeButton"
          class="close"
          @click="handleClose"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import {
  computed,
  ref,
} from "vue";

const modal = ref();
const closeButton = ref();
const emit = defineEmits(['close']);
const props = defineProps({
  width: {
    type: [Number, String],
    default: null,
  },
  maxWidth: {
    type: [Number, String],
    default: 600,
  },
});

const styles = computed(() => {
  return {
    width: props.width ? `${props.width}px` : null,
    maxWidth: `${props.maxWidth}px`,
  };
});

function handleClose(event) {
  emit('close');
}
</script>

<style scoped>
.modal {
  display: flex;
  flex-direction: column;
  position: fixed;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  z-index: 1000;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
}

.modal__content {
  display: flex;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 20px 30px;
  border-radius: 28px;
  background: linear-gradient(135deg, #1e1e2a 0%, #181826 100%);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  animation: modalSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.close {
  position: absolute;
  z-index: 100;
  cursor: pointer;
  top: 20px;
  right: 16px;
  background: rgba(255, 255, 255, 0.08);
  border: none;
  border-radius: 40px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #a1a1aa;
  transition: all 0.2s;
}

.close:hover {
  background: rgba(255, 255, 255, 0.15);
  color: white;
}
</style>