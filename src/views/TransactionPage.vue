<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>{{
          isEditMode ? "Edit Transaction" : "Add Transaction"
        }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-list>
        <!-- Asset -->
        <ion-item>
          <ion-label position="stacked">Asset</ion-label>
          <ion-select v-model="model.asset_id" placeholder="Select asset">
            <ion-select-option
              v-for="asset in assets"
              :key="asset.id"
              :value="asset.id"
            >
              {{ asset.name }}
            </ion-select-option>
          </ion-select>
        </ion-item>

        <!-- Buy Price -->
        <ion-item>
          <ion-label position="stacked">Buy Price (Rp)</ion-label>
          <ion-input
            v-model.number="model.buy_price"
            type="number"
            placeholder="0"
          ></ion-input>
        </ion-item>

        <!-- Quantity -->
        <ion-item>
          <ion-label position="stacked">Quantity</ion-label>
          <ion-input
            v-model.number="model.qty"
            type="number"
            step="0.00000001"
            placeholder="0"
          ></ion-input>
        </ion-item>

        <!-- Amount -->
        <ion-item>
          <ion-label position="stacked">Amount (Rp)</ion-label>
          <ion-input
            :value="formatCurrency(model.amount)"
            type="text"
            readonly
          ></ion-input>
        </ion-item>
      </ion-list>

      <ion-button expand="block" class="ion-margin-top" @click="submit">
        {{ isEditMode ? "Update" : "Save" }}
      </ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { v4 as uuidv4 } from "uuid";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonSelect,
  IonSelectOption,
  IonModal,
  IonDatetimeButton,
  IonDatetime,
} from "@ionic/vue";

import { TransactionRepository } from "@/repositories/transaction-repository";
import { AssetRepository } from "@/repositories/asset-repository";
import type { Transaction } from "@/models/transaction";
import type { Asset } from "@/models/asset";
import { showMessage } from "@/utils/common";

const router = useRouter();
const route = useRoute();
const txRepo = new TransactionRepository();
const assetRepo = new AssetRepository();

const isEditMode = ref(false);
const model = ref<Transaction>({
  id: "",
  asset_id: "",
  time: "",
  buy_price: 0,
  qty: 0,
  amount: 0,
  created_at: "",
});

const assets = ref<Asset[]>([]);

onMounted(async () => {
  assets.value = await assetRepo.getAll();
  const id = route.query.id?.toString();
  if (id) {
    isEditMode.value = true; // ✅ assign to .value
    const data = await txRepo.fetchById(id);
    if (data) {
      model.value = data; // ✅ assign to .value
    }
  }
});

// auto-calculate amount
watch(
  () => [model.value.buy_price, model.value.qty],
  ([price, qty]) => {
    model.value.amount = price * qty;
  }
);

// helper to format currency
const formatCurrency = (value: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(
    value
  );

// submit handler
const submit = async () => {
  if (!model.value.asset_id) {
    showMessage("Please select an asset.");
    return;
  }

  try {
    const data: Transaction = { ...model.value };
    if (isEditMode.value && model.value.id) {
      await txRepo.update(model.value.id, data);
    } else {
      data.id = uuidv4();
      data.created_at = new Date().toISOString();
      await txRepo.create(data);
    }

    router.back();
  } catch (err) {
    console.error("Failed to save transaction:", err);
    showMessage("Something went wrong. Please try again.");
  }
};
</script>
