<template>
  <ion-page>
    <!-- Header -->
    <ion-header>
      <ion-toolbar>
        <ion-title>Correction</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-list>
        <ion-item>
          <ion-label position="stacked">Asset</ion-label>
          <ion-input type="text" placeholder="0" readonly></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="stacked">Quantity</ion-label>
          <ion-input
            type="number"
            step="0.00000001"
            placeholder="0"
            readonly
          ></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="stacked">Correction (Rp)</ion-label>
          <ion-input type="number" placeholder="0"></ion-input>
        </ion-item>
      </ion-list>
      <ion-button expand="block" class="ion-margin-top"> Save </ion-button>
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
  IonSearchbar,
  IonButton,
  IonButtons,
  IonIcon,
  IonInput,
} from "@ionic/vue";
import { add as addIcon } from "ionicons/icons";

export default {
  name: "CorrectionPage",
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonSearchbar,
    IonButton,
    IonButtons,
    IonInput,
    IonIcon,
  },
  data() {
    return {
      model: {
        id: 0,
        name: "",
      },
    };
  },
  created() {},
  computed: {},
  methods: {},
};
</script>
