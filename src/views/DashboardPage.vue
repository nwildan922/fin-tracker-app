<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Summary</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-card class="ion-text-center">
        <ion-card-content>
          <h6>Total Value</h6>
          <h3>{{ formattedTotalValue }}</h3>
        </ion-card-content>
      </ion-card>
      <ion-card>
        <ion-card-header>
          <ion-card-title>Assets</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-grid>
            <ion-row class="ion-text-bold">
              <ion-col size="4">Asset</ion-col>
              <ion-col size="4" class="ion-text-end">Value (Rp)</ion-col>
              <ion-col size="4" class="ion-text-end">%</ion-col>
            </ion-row>

            <ion-row v-for="asset in assets" :key="asset.name">
              <ion-col size="4">
                <ion-item lines="none" button router-link="/asset-detail">
                  <ion-label>{{ asset.name }}</ion-label>
                </ion-item>
              </ion-col>
              <ion-col size="4" class="ion-text-end">{{
                formatCurrency(getAmount(asset.id))
              }}</ion-col>
              <ion-col size="4" class="ion-text-end">{{
                getPercentage(asset.id)
              }}</ion-col>
            </ion-row>
          </ion-grid>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonRow,
  IonCol,
  IonGrid,
  IonItem,
  IonLabel,
  onIonViewWillEnter,
} from "@ionic/vue";
import { AssetRepository } from "@/repositories/asset-repository";
import { TransactionRepository } from "@/repositories/transaction-repository";
import { Asset } from "@/models/asset";
import { Transaction } from "@/models/transaction";

const assetRepo = new AssetRepository();
const transRepo = new TransactionRepository();

const assets = ref<Asset[]>([]);
const allTrx = ref<Transaction[]>([]);

const totalValue = computed(() => {
  return allTrx.value.reduce((sum, asset) => sum + asset.amount, 0);
});

const formattedTotalValue = computed(() => {
  return formatCurrency(totalValue.value);
});
function getAmount(id: string): number {
  return allTrx.value
    .filter((x) => x.asset_id == id)
    .reduce((sum, asset) => sum + asset.amount, 0);
}

function formatCurrency(value: number): string {
  return value.toLocaleString("id-ID");
}

function getPercentage(id: string): string {
  if (totalValue.value === 0) return "0%";
  const total = allTrx.value
    .filter((x) => x.asset_id == id)
    .reduce((sum, asset) => sum + asset.amount, 0);
  const percentage = (total / totalValue.value) * 100;
  return `${percentage.toFixed(0)}%`;
}

onIonViewWillEnter(async () => {
  assets.value = await assetRepo.getAll();
  allTrx.value = await transRepo.getAll();
});
</script>
