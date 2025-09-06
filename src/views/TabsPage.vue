<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>

      <ion-tab-bar slot="bottom">
        <!-- Dashboard Tab -->
        <ion-tab-button tab="dashboard" href="/tabs/dashboard">
          <ion-icon aria-hidden="true" :icon="triangle"></ion-icon>
          <ion-label>Summary</ion-label>
        </ion-tab-button>

        <!-- Main Tab -->
        <ion-tab-button tab="main" href="/tabs/main">
          <ion-icon aria-hidden="true" :icon="ellipse"></ion-icon>
          <ion-label>Main</ion-label>
        </ion-tab-button>

        <!-- Setting Tab -->
        <ion-tab-button tab="setting" href="/tabs/setting">
          <ion-icon aria-hidden="true" :icon="square"></ion-icon>
          <ion-label>Setting</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script lang="ts">
import {
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonLabel,
  IonIcon,
  IonPage,
  IonRouterOutlet
} from '@ionic/vue';

import { ellipse, square, triangle } from 'ionicons/icons';

export default {
  name: 'TabsPage',
  components: {
    IonTabBar,
    IonTabButton,
    IonTabs,
    IonLabel,
    IonIcon,
    IonPage,
    IonRouterOutlet
  },
  data() {
    return {
      ellipse,
      square,
      triangle
    };
  }
};
</script>
