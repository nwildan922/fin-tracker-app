<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Transactions</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="goToAddTransaction">
            <ion-icon :icon="addIcon" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <!-- Search bar -->
      <ion-searchbar
        v-model="searchQuery"
        placeholder="Search transactions..."
      ></ion-searchbar>

      <ion-list>
        <ion-item-sliding v-for="tx in filteredTransactions" :key="tx.id">
          <!-- Main item -->
          <ion-item button @click="goToTransactionDetail(tx)">
            <ion-label>
              <h2>{{ getAssetName(tx.asset_id) }}</h2>
              <p>Buy Price: {{ formatCurrency(tx.buy_price) }}</p>
              <p>Qty: {{ tx.qty }}</p>
              <p>
                Amount:
                {{ formatCurrency(tx.amount) }}
              </p>
            </ion-label>
            <div class="ion-text-end">
              <small>{{ new Date(tx.created_at).toLocaleString() }}</small>
            </div>
          </ion-item>

          <!-- Slide options -->
          <ion-item-options side="end">
            <ion-item-option color="danger" @click="deleteTransaction(tx.id)">
              Delete
            </ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      </ion-list>

      <div
        v-if="filteredTransactions.length === 0"
        class="ion-text-center ion-padding"
      >
        <p>No transactions found.</p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
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
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
} from "@ionic/vue";
import { add as addIcon } from "ionicons/icons";

import { TransactionRepository } from "@/repositories/transaction-repository";
import { AssetRepository } from "@/repositories/asset-repository";
import type { Transaction } from "@/models/transaction";
import type { Asset } from "@/models/asset";
import { showMessage } from "@/utils/common";

const router = useRouter();
const txRepo = new TransactionRepository();
const assetRepo = new AssetRepository();

const searchQuery = ref("");
const transactions = ref<Transaction[]>([]);
const assets = ref<Asset[]>([]);

const filteredTransactions = computed(() => {
  if (!searchQuery.value) return transactions.value;
  return transactions.value.filter((t) =>
    getAssetName(t.asset_id)
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase())
  );
});

// fetch all assets first for name lookup
const getAssetName = (assetId: string) => {
  const asset = assets.value.find((a) => a.id === assetId);
  return asset ? asset.name : "Unknown Asset";
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(value);
};

// fetch transactions & assets
let subscription: any;
onMounted(async () => {
  assets.value = await assetRepo.getAll();

  subscription = await txRepo.observeAll((items) => {
    transactions.value = items.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  });
});

onUnmounted(() => {
  subscription?.unsubscribe?.();
});

// navigation
const goToTransactionDetail = (tx: Transaction) => {
  router.push({
    path: "/tabs/transaction",
    query: { id: tx.id },
  });
};
const goToAddTransaction = () => {
  router.push("/tabs/transaction");
};

// delete
const deleteTransaction = async (id: string) => {
  if (!confirm("Are you sure you want to delete this transaction?")) return;
  try {
    await txRepo.delete(id);
  } catch (err) {
    console.error("Failed to delete transaction:", err);
    showMessage("Something went wrong while deleting.");
  }
};
</script>
