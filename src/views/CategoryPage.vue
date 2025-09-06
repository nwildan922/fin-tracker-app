<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Add Category</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-list>
        <ion-item>
          <ion-label position="stacked">Category Name</ion-label>
          <ion-input
            v-model="model.name"
            type="text"
            placeholder="Enter category name"
          ></ion-input>
        </ion-item>

        <ion-item lines="none">
          <ion-label>Is Private</ion-label>
          <ion-checkbox v-model="model.isPrivate" slot="start"></ion-checkbox>
        </ion-item>
      </ion-list>

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
  IonCheckbox,
  IonInput,
} from "@ionic/vue";
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { CategoryRepository } from "@/repositories/category-repository";
import type { Category } from "@/models/category";
import { v4 as uuidv4 } from "uuid";
import { showMessage } from "@/utils/common";

const router = useRouter();
const route = useRoute();
const repo = new CategoryRepository();

// mode flag
const isEditMode = ref(false);
const id = ref<string | null>(null);

// reactive model
const model = ref<{ name: string; isPrivate: boolean }>({
  name: "",
  isPrivate: false,
});

// load existing category if query data exists
onMounted(() => {
  const queryData = route.query.data as string | undefined;
  if (queryData) {
    try {
      const category: Category = JSON.parse(queryData);
      isEditMode.value = true;
      id.value = category.id;
      model.value = {
        name: category.name,
        isPrivate: category.is_private === 1,
      };
    } catch (err) {
      console.error("Invalid query data:", err);
    }
  }
});

// submit handler
const submit = async () => {
  if (!model.value.name.trim()) {
    showMessage("Category name is required");
    return;
  }

  try {
    if (isEditMode.value && id.value) {
      // ✅ update mode
      await repo.update(id.value, {
        name: model.value.name,
        is_private: model.value.isPrivate ? 1 : 0,
      });
    } else {
      // ✅ create mode
      const data: Category = {
        id: uuidv4(),
        name: model.value.name,
        is_private: model.value.isPrivate ? 1 : 0,
        created_at: new Date().toISOString(),
      };
      await repo.create(data);
    }

    router.back();
  } catch (err) {
    console.error("Failed to save category:", err);
    showMessage("Something went wrong. Please try again.");
  }
};
</script>
