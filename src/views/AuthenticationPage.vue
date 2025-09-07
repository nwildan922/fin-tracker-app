<template>
  <ion-page>
    <ion-content class="ion-padding" :fullscreen="true">
      <!-- App name -->
      <div class="app-name">Fin Tracker</div>

      <div v-if="model.isDisguiseMode">
        <div class="disguise-wrapper">
          <div>
            Service currently unavailable <span @click="handleTap">😔</span>
          </div>
          <div style="margin-top: 10px">error code : 403</div>
        </div>
      </div>
      <div v-if="!model.isDisguiseMode">
        <!-- Centered PIN input -->
        <div class="pin-container">
          <ion-input
            placeholder="******"
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
          />
          <ion-button @click="handleBiometric">
            <ion-icon :icon="fingerPrint"></ion-icon>
          </ion-button>
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
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonContent,
  IonInput,
  IonText,
  IonButton,
  IonIcon,
} from "@ionic/vue";
import { fingerPrint } from "ionicons/icons";
import { onMounted, reactive, ref } from "vue";
import { tryBiometric } from "@/utils/biometrics";
import { showMessage } from "@/utils/common";
import { getData, setData } from "@/utils/preference-helper";
import { useRouter } from "vue-router";
const router = useRouter();
const maxLen = 6;
const expectedPin = "092212";
const pin = ref("");
const errorMessage = ref("");
const model = reactive({
  tapCount: 0,
  lastTap: 0,
  isDisguiseMode: true,
});
const pinRef = ref<InstanceType<typeof IonInput> | null>(null);

async function onIonInput(ev: CustomEvent) {
  const raw = String((ev as any).detail?.value ?? "");
  const digits = raw.replace(/\D/g, "").slice(0, maxLen);
  if (digits !== pin.value) pin.value = digits;
  if (digits.length === 6) {
    if (digits !== expectedPin) {
      showMessage("invalid pin");
      await setData("isAuthenticated", "false");
      return;
    }
    await setData("isAuthenticated", "true");
    showMessage("success");
    router.push("/tabs/dashboard");
  }
}

async function handleBiometric() {
  const ok = await tryBiometric();
  if (ok) {
    await setData("isAuthenticated", "true");
    router.push("/tabs/dashboard");
    showMessage("success");
  } else {
    await setData("isAuthenticated", "false");
    showMessage("failed");
  }
}
async function handleTap() {
  const now = new Date().getTime();
  const timeDifference = now - model.lastTap;
  const tapThreshold = 1000; // Reset count if taps are slower than 1 second

  if (timeDifference > tapThreshold) {
    model.tapCount = 1;
  } else {
    model.tapCount++;
  }

  if (model.tapCount >= 5) {
    model.isDisguiseMode = !model.isDisguiseMode;
    model.tapCount = 0;
  }
  model.lastTap = now;
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
onMounted(async () => {
  const isAuthenticated = await getData("isAuthenticated");
  if (isAuthenticated === "true") {
    router.push("/tabs/dashboard");
  }
});
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
.disguise-wrapper {
  display: flex;
  flex-direction: column;
  margin-top: 150px;
  justify-content: center;
  align-items: center;
  font-size: larger;
}
</style>
