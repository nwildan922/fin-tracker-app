<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title @click="handleTap">Setting</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-content class="ion-padding">
        <ion-list>
          <ion-item button @click="handleBackup">
            <ion-label>📤 Export Data</ion-label>
          </ion-item>

          <ion-item button @click="handleImport">
            <ion-label>📥 Import Data</ion-label>
          </ion-item>

          <ion-item button>
            <ion-label>🌙 Dark Mode</ion-label>
            <ion-toggle v-model="model.darkMode" slot="end" />
          </ion-item>

          <ion-item button color="danger">
            <ion-label>🗑 Clear All Data</ion-label>
          </ion-item>

          <ion-item-group v-if="model.developerMode">
            <ion-item-divider>
              <ion-label>Developer Options</ion-label>
            </ion-item-divider>
            <ion-item button>
              <ion-label>Show Additional Data</ion-label>
              <ion-toggle v-model="model.showAdditionalData" slot="end" />
            </ion-item>
          </ion-item-group>
        </ion-list>
      </ion-content>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonItemGroup,
  IonItemDivider,
  IonToggle,
  onIonViewWillEnter,
  isPlatform,
} from "@ionic/vue";
import { reactive, ref, watch } from "vue";
import { backupFile, importFile } from "@/utils/file-hepler";
import { Filesystem } from "@capacitor/filesystem";
import { showMessage } from "@/utils/common";
import { exportData, importData } from "@/utils/backup-helper";
import { Backup } from "@/models/backup";
export default {
  name: "SettingPage",
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonItemGroup,
    IonItemDivider,
    IonToggle,
  },
  setup() {
    // function or event here
    const getBooleanFromLocalStorage = (key: string, defaultValue: boolean) => {
      const value = localStorage.getItem(key);
      switch (value) {
        case "false":
          return false;
        case "true":
          return true;
        default:
          return defaultValue;
      }
    };
    const handleTap = () => {
      const now = new Date().getTime();
      const timeDifference = now - model.lastTap;
      const tapThreshold = 1000; // Reset count if taps are slower than 1 second

      if (timeDifference > tapThreshold) {
        model.tapCount = 1;
      } else {
        model.tapCount++;
      }

      if (model.tapCount >= 5) {
        model.developerMode = !model.developerMode; // Toggle the developer mode
        model.tapCount = 0; // Reset the counter
        console.log(`Developer options toggled to: ${model.developerMode}`);
      }
      model.lastTap = now;
    };
    onIonViewWillEnter(() => {
      const showAdditional = getBooleanFromLocalStorage(
        key.showAdditionalData,
        false
      );
      model.tapCount = 0;
      model.lastTap = 0;
      model.developerMode = showAdditional;
    });
    // variable here
    const key = {
      darkMode: "setting:dark-mode",
      showAdditionalData: "setting:show-additional-data",
    };
    const model = reactive({
      developerMode: getBooleanFromLocalStorage(key.showAdditionalData, false),
      tapCount: 0,
      lastTap: 0,
      showAdditionalData: getBooleanFromLocalStorage(
        key.showAdditionalData,
        false
      ),
      darkMode: getBooleanFromLocalStorage(key.darkMode, false),
    });
    watch(
      () => model.darkMode,
      (newValue) => {
        localStorage.setItem(key.darkMode, JSON.stringify(newValue));
      }
    );
    watch(
      () => model.showAdditionalData,
      (newValue) => {
        localStorage.setItem(key.showAdditionalData, JSON.stringify(newValue));
        if (!newValue) {
          setTimeout(() => {
            model.developerMode = newValue;
          }, 1000);
        }
      }
    );
    const handleBackup = async () => {
      // Native platform logic (Android/iOS)
      if (isPlatform("capacitor")) {
        // 1. Request permissions first
        const permissionStatus = await Filesystem.requestPermissions();

        if (permissionStatus.publicStorage !== "granted") {
          // Permission denied, handle the error
          showMessage("Permission to access storage was denied.");
          return;
        }
      }
      const data = await exportData();
      await backupFile(data);
      showMessage("Backup data success.");
    };
    const handleImport = async () => {
      if (isPlatform("capacitor")) {
        const permissionStatus = await Filesystem.requestPermissions();
        if (permissionStatus.publicStorage !== "granted") {
          showMessage("Permission to access storage was denied.");
          return;
        }
      }
      try {
        const data: Backup = await importFile();
        await importData(data);
        showMessage("Import data success.");
      } catch (error) {
        showMessage("Failed import data : " + error);
      }
    };
    return {
      model,
      handleTap,
      handleBackup,
      handleImport,
    };
  },
};
</script>
