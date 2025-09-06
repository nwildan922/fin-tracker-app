<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Main</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list>
        <!-- Asset Section -->
        <ion-item-group>
          <ion-item-divider>
            <ion-label>Asset</ion-label>
          </ion-item-divider>

          <ion-item button @click="goTo('/tabs/category-list')">
            <ion-label>Category</ion-label>
          </ion-item>

          <ion-item button @click="goTo('/tabs/asset-list')">
            <ion-label>Asset</ion-label>
          </ion-item>
          <ion-item button @click="goTo('/tabs/transaction-list')">
            <ion-label>Transaction</ion-label>
          </ion-item>
        </ion-item-group>

        <!-- Miscs Section -->
        <ion-item-group v-if="model.showAdditionalData">
          <ion-item-divider>
            <ion-label>Miscs</ion-label>
          </ion-item-divider>

          <ion-item button @click="goTo('/tabs/contact-list')">
            <ion-label>Contact</ion-label>
          </ion-item>

          <ion-item button @click="goTo('/tabs/note-list')">
            <ion-label>Notes</ion-label>
          </ion-item>
          <ion-item button @click="goTo('/tabs/password-list')">
            <ion-label>Password</ion-label>
          </ion-item>
        </ion-item-group>
      </ion-list>
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
  onIonViewWillEnter,
} from "@ionic/vue";
import { reactive } from "vue";
import { useRouter } from "vue-router";

export default {
  name: "HomePage",
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
  },
  setup() {
    const router = useRouter();
    const goTo = (route: string) => {
      router.push(route);
    };
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
    onIonViewWillEnter(() => {
      model.showAdditionalData = getBooleanFromLocalStorage(
        key.showAdditionalData,
        false
      );
    });
    const key = {
      darkMode: "setting:dark-mode",
      showAdditionalData: "setting:show-additional-data",
    };
    const model = reactive({
      showAdditionalData: getBooleanFromLocalStorage(
        key.showAdditionalData,
        false
      ),
    });
    return {
      goTo,
      model,
    };
  },
};
</script>
