<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Assets Correction</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="goToAddCorrection">
            <ion-icon :icon="addIcon" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-searchbar
        v-model="searchQuery"
        placeholder="Search assets..."
      ></ion-searchbar>

      <ion-list>
        <ion-item
          v-for="asset in filteredAssets"
          :key="asset.id"
          button
          @click="goToAddCorrectionDetail(asset)"
        >
          <ion-label>
            <h2>{{ asset.name }}</h2>
            <p>Value: Rp {{ asset.value.toLocaleString() }}</p>
          </ion-label>
        </ion-item>
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
  IonSearchbar,
  IonButton,
  IonButtons,
  IonIcon,
} from "@ionic/vue";
import { add as addIcon } from "ionicons/icons";
import { AssetCorrectionRepository } from "@/repositories/asset-correction-repository";
export default {
  name: "CorrectionListPage",
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
    IonIcon,
  },
  data() {
    return {
      searchQuery: "",
      assets: [
        { id: 1, name: "ETH", value: 3500000, percentage: 15 },
        { id: 2, name: "XAUT", value: 12000000, percentage: 52 },
        { id: 3, name: "SHIB", value: 1200000, percentage: 5 },
      ],
    };
  },
  computed: {
    filteredAssets() {
      if (!this.searchQuery) return this.assets;
      return this.assets.filter((a) =>
        a.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },
  methods: {
    goToAddCorrectionDetail(data: any) {
      this.$router.push({
        path: `/tabs/correction`,
        query: {
          data,
        },
      });
    },
    goToAddCorrection() {
      this.$router.push("/tabs/correction");
    },
  },
  setup() {
    return {
      addIcon,
    };
  },
};
</script>
