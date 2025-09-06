<template>
  <ion-page>
    <!-- Header -->
    <ion-header>
      <ion-toolbar>
        <ion-title>Notes</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="add">
            <ion-icon :icon="addIcon" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <!-- Content -->
    <ion-content class="ion-padding">
      <ion-list v-if="notes.length > 0">
        <ion-item-sliding v-for="(note, index) in notes" :key="index">
          <ion-item button @click="viewDetail(note.id)">
            <ion-label>
              <h2>{{ note.title }}</h2>
              <p v-html="getPreview(note.content)"></p>
            </ion-label>
          </ion-item>
          <ion-item-options side="end">
            <ion-item-option color="danger" @click="remove(note.id)">
              Delete
            </ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      </ion-list>

      <div v-else class="ion-text-center ion-padding">
        <p>No notes yet. Click Add to create one.</p>
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
  IonButton,
  IonButtons,
  IonIcon,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
} from "@ionic/vue";
import { add as addIcon } from "ionicons/icons";
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { NoteRepository } from "@/repositories/note-repository";
import type { Note } from "@/models/note";
import { showMessage } from "@/utils/common";

const router = useRouter();
const notes = ref<Note[]>([]);
const repo = new NoteRepository();
let subscription: any = null;
const loading = ref(true);

onMounted(async () => {
  loading.value = true;
  subscription = await repo.observeAll((items) => {
    notes.value = items;
    console.log("items", items);
  });
});
onUnmounted(() => {
  subscription?.unsubscribe?.();
});
// Preview only first 40 chars (strip HTML tags)
const getPreview = (html: string) => {
  const text = html.replace(/<[^>]+>/g, "");
  return text.length > 40 ? text.substring(0, 40) + "..." : text;
};

// Navigation
const add = () => {
  router.push("/tabs/note"); // add new
};
const viewDetail = (id: string) => {
  router.push(`/tabs/note?id=${id}`);
};

const remove = async (id: string) => {
  const confirmed = confirm("Are you sure you want to delete this note?");
  if (!confirmed) return;

  try {
    await repo.delete(id);
    // observeAll subscription will auto-update the list
  } catch (err) {
    console.error("Failed to delete password:", err);
    showMessage("Something went wrong while deleting.");
  }
};
</script>
