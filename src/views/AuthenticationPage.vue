<template>
  <ion-page>
    <ion-content class="ion-padding" :fullscreen="true">
      <!-- App name -->
      <div class="app-name" @click="test">Fin Tracker</div>

      <!-- Centered PIN input -->
      <div class="pin-container">
        <ion-input
          ref="pinRef"
          v-model="pin"
          class="pin-input"
          type="password"
          inputmode="numeric"
          pattern="\\d*"
          autocomplete="off"
          autocapitalize="off"
          autocorrect="off"
          enterkeyhint="done"
          :maxlength="6"
          @ionInput="onIonInput"
          @keydown="onKeydown"
          @paste="onPaste"
        />
      </div>

      <!-- message / hint -->
      <div class="message">
        <ion-text color="danger" v-if="errorMessage">
          {{ errorMessage }}
        </ion-text>
        <ion-text color="medium" v-else>
          Please enter your 6-digit PIN
        </ion-text>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent, IonInput, IonText } from "@ionic/vue";
import { ref } from "vue";
import { tryBiometric } from "@/utils/biometrics";
import { showMessage } from "@/utils/common";
const maxLen = 6;
const pin = ref("");
const errorMessage = ref("");

const pinRef = ref<InstanceType<typeof IonInput> | null>(null);

/**
 * Sanitize any input (including IME/paste) to digits only, clamp to maxLen.
 * IonInput’s event carries the text in event.detail.value.
 */
function onIonInput(ev: CustomEvent) {
  const raw = String((ev as any).detail?.value ?? "");
  const digits = raw.replace(/\D/g, "").slice(0, maxLen);
  if (digits !== pin.value) pin.value = digits;
}

async function test() {
  const ok = await tryBiometric();
  if (ok) {
    showMessage("success");
  } else {
    showMessage("failed");
  }
}

/**
 * Block non-digit keys (still allow navigation keys, Backspace, etc.)
 */
function onKeydown(e: KeyboardEvent) {
  const allowed = [
    "Backspace",
    "Delete",
    "Tab",
    "ArrowLeft",
    "ArrowRight",
    "Home",
    "End",
    "Enter",
  ];
  if (allowed.includes(e.key)) return;

  // Allow digits only
  if (!/^\d$/.test(e.key)) {
    e.preventDefault();
  }
}

/**
 * Clean pasted content (digits only)
 */
function onPaste(e: ClipboardEvent) {
  e.preventDefault();
  const pasted = e.clipboardData?.getData("text") ?? "";
  const digits = pasted.replace(/\D/g, "");
  pin.value = (pin.value + digits).slice(0, maxLen);
}
</script>

<style scoped>
.app-name {
  margin-top: 10vh;
  text-align: center;
  font-size: 1.8rem;
  font-weight: 700;
}

.pin-container {
  margin-top: 20vh;
  display: flex;
  justify-content: center;
}

.pin-input {
  max-width: 220px;
  width: 100%;
  text-align: center;
  font-size: 1.4rem;
  letter-spacing: 6px; /* spaced bullets */
}

.message {
  margin-top: 1rem;
  text-align: center;
}
</style>
