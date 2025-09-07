<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Assets</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="goToAddAsset">
            <ion-icon :icon="addIcon" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <!-- 🔍 Search -->
      <ion-searchbar
        v-model="searchQuery"
        placeholder="Search assets..."
      ></ion-searchbar>

      <!-- 📋 List -->
      <ion-list>
        <ion-item-sliding v-for="asset in filteredAssets" :key="asset.id">
          <!-- Main item -->
          <ion-item button @click="goToAssetDetail(asset)">
            <ion-label>
              <div class="item-header">
                <h2>{{ asset.name }}</h2>
                <p class="date">{{ formatDate(asset.created_at) }}</p>
              </div>
              <p>Category: {{ getCategoryName(asset.category_id) }}</p>
            </ion-label>
          </ion-item>

          <!-- Slide options -->
          <ion-item-options side="end">
            <ion-item-option color="danger" @click="deleteAsset(asset.id)">
              Delete
            </ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      </ion-list>

      <!-- 🚫 Empty state -->
      <div
        v-if="filteredAssets.length === 0"
        class="ion-text-center ion-padding"
      >
        <p>No assets found.</p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
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
  onIonViewWillEnter,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
} from "@ionic/vue";
import { add as addIcon } from "ionicons/icons";
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import type { Asset } from "@/models/asset";
import type { Category } from "@/models/category";
import { AssetRepository } from "@/repositories/asset-repository";
import { CategoryRepository } from "@/repositories/category-repository";
import { showMessage } from "@/utils/common";

const router = useRouter();
const assetRepo = new AssetRepository();
const categoryRepo = new CategoryRepository();

// ✅ State
const searchQuery = ref("");
const assets = ref<Asset[]>([]);
const categories = ref<Category[]>([]);

// ✅ Filtered list
const filteredAssets = computed(() => {
  if (!searchQuery.value) return assets.value;
  return assets.value.filter((a) =>
    a.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// ✅ Helpers
const getCategoryName = (id: string) => {
  const cat = categories.value.find((c) => c.id === id);
  return cat ? cat.name : "Unknown";
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// ✅ Load data
let subscription: any;
onIonViewWillEnter(async () => {
  // Load categories once
  categories.value = await categoryRepo.getAll();

  // Subscribe to assets
  subscription = await assetRepo.observeAll((items) => {
    assets.value = items;
  });
});

onUnmounted(() => {
  if (subscription) {
    subscription.unsubscribe();
  }
});

// ✅ Navigation
const goToAssetDetail = (data: Asset) => {
  router.push({
    path: `/tabs/asset`,
    query: { data: JSON.stringify(data) },
  });
};

const goToAddAsset = () => {
  router.push("/tabs/asset");
};

const deleteAsset = async (id: string) => {
  const confirmed = confirm("Are you sure you want to delete this asset?");
  if (!confirmed) return;

  try {
    await assetRepo.delete(id); // call your repository delete
    // ✅ if using observeAll, the list will auto-refresh
  } catch (err) {
    console.error("Failed to delete asset:", err);
    showMessage("Something went wrong while deleting.");
  }
};
</script>

<style scoped>
.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.item-header h2 {
  margin: 0;
  font-size: 16px;
}
.item-header .date {
  font-size: 12px;
  color: var(--ion-color-medium);
}
</style>
