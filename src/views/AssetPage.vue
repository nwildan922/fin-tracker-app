<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Asset</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-list>
        <!-- Asset Name -->
        <ion-item>
          <ion-label position="stacked">Asset Name</ion-label>
          <ion-input
            v-model="model.name"
            type="text"
            placeholder="Enter asset name"
          ></ion-input>
        </ion-item>

        <!-- Category -->
        <ion-item>
          <ion-label position="stacked">Category</ion-label>
          <ion-select v-model="model.category_id" placeholder="Choose Category">
            <ion-select-option
              v-for="c in categories"
              :key="c.id"
              :value="c.id"
            >
              {{ c.name }}
            </ion-select-option>
          </ion-select>
        </ion-item>
      </ion-list>

      <!-- Save Button -->
      <ion-button expand="block" class="ion-margin-top" @click="submit">
        Save
      </ion-button>
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
  IonButton,
  IonInput,
  IonSelect,
  IonSelectOption,
} from "@ionic/vue";
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { v4 as uuidv4 } from "uuid";
import { AssetRepository } from "@/repositories/asset-repository";
import { CategoryRepository } from "@/repositories/category-repository";
import type { Asset } from "@/models/asset";
import type { Category } from "@/models/category";
import { showMessage } from "@/utils/common";

const router = useRouter();
const route = useRoute();
const repo = new AssetRepository();

// mode flag
const id = ref<string | null>(null);

// reactive model
const model = ref<Asset>({
  id: "",
  name: "",
  category_id: "",
  created_at: "",
});

const categories = ref<Category[]>([]);

// Load data on page mount
onMounted(async () => {
  const categoryRepo = new CategoryRepository();
  categories.value = await categoryRepo.getAll();

  const queryData = route.query.data as string | undefined;
  if (queryData) {
    try {
      const data: Asset = JSON.parse(queryData);
      id.value = data.id;
      model.value = { ...data };
    } catch (err) {
      console.error("Invalid query data:", err);
    }
  }
});

// Save handler
const submit = async () => {
  if (!model.value.name.trim()) {
    showMessage("Name is required");
    return;
  }
  if (!model.value.category_id) {
    showMessage("Category is required");
    return;
  }

  try {
    if (id.value) {
      await repo.update(model.value.id, model.value);
    } else {
      model.value.id = uuidv4();
      model.value.created_at = new Date().toISOString();
      await repo.create(model.value);
    }

    router.back();
  } catch (err) {
    console.error("Failed to save asset:", err);
    showMessage("Something went wrong. Please try again.");
  }
};
</script>
