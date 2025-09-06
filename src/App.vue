<template>
  <ion-app>
    <ion-router-outlet v-if="isReady" />
    <div v-else class="ion-page flex-center-wrapper">
      <ion-spinner></ion-spinner>
    </div>
  </ion-app>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  IonApp,
  IonRouterOutlet,
  IonSpinner,
  loadingController,
} from "@ionic/vue";

const isReady = ref(false);

const init = async () => {
  let loader: HTMLIonLoadingElement | null = null;
  try {
    loader = await loadingController.create({
      message: "Initializing...",
    });
    await loader.present();

    isReady.value = true;
  } catch (error) {
    console.error("Failed to initialize the app:", error);
  } finally {
    if (loader) {
      loader.dismiss();
    }
  }
};

onMounted(async () => {
  await init();
});
</script>

<style scoped>
.flex-center-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>
