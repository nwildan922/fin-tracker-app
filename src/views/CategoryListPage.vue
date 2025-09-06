<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Categories</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="add">
            <ion-icon :icon="addIcon" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-searchbar
        v-model="searchQuery"
        placeholder="Search categories..."
      ></ion-searchbar>

      <ion-list>
        <ion-item-sliding
          v-for="category in filteredCategories"
          :key="category.id"
        >
          <ion-item button @click="viewDetail(category)">
            <ion-label>
              <h2>{{ category.name }}</h2>
              <p v-if="category.is_private">🔒 Private</p>
              <p v-else>🌐 Public</p>
            </ion-label>
          </ion-item>

          <!-- Slide Options -->
          <ion-item-options side="end">
            <ion-item-option color="danger" @click="remove(category.id)">
              Delete
            </ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      </ion-list>
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
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
} from "@ionic/vue";
import { add as addIcon } from "ionicons/icons";
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";

import { CategoryRepository } from "@/repositories/category-repository";
import { Category } from "@/models/category";
import { showMessage } from "@/utils/common";

const router = useRouter();
const repo = new CategoryRepository();

const searchQuery = ref("");
const gridData = ref<Category[]>([]);
const loading = ref(true);

let subscription: any = null;

const filteredCategories = computed(() => {
  if (!searchQuery.value) return gridData.value;
  return gridData.value.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

onMounted(async () => {
  loading.value = true;
  subscription = await repo.observeAll((items) => {
    gridData.value = items;
  });
});

onUnmounted(() => {
  subscription?.unsubscribe?.();
});

const viewDetail = (category: Category) => {
  router.push({
    path: `/tabs/category`,
    query: { data: JSON.stringify(category) },
  });
};

const add = () => {
  router.push("/tabs/category");
};
const remove = async (id: string) => {
  const confirmed = confirm("Are you sure you want to delete this category?");
  if (!confirmed) return;

  try {
    await repo.delete(id);
  } catch (err) {
    console.error("Failed to delete category:", err);
    showMessage("Something went wrong while deleting.");
  }
};
</script>
