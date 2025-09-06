<template>
  <ion-page>
    <!-- Header -->
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/tabs/note-list"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ isEdit ? "Edit Note" : "New Note" }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <!-- Content -->
    <ion-content class="ion-padding">
      <ion-list>
        <!-- Title -->
        <ion-item>
          <ion-label position="stacked">Title</ion-label>
          <ion-input
            v-model="form.title"
            type="text"
            placeholder="Enter note title"
          ></ion-input>
        </ion-item>

        <!-- WYSIWYG Content -->
        <div class="ion-margin-top">
          <ion-label class="ion-padding-start">Content</ion-label>
          <quill-editor
            v-model:content="form.content"
            contentType="html"
            theme="snow"
            style="height: 200px"
          />
        </div>
      </ion-list>

      <!-- Save Button -->
      <ion-button expand="block" class="ion-margin-top" @click="saveNote">
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
  IonButtons,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonBackButton,
} from "@ionic/vue";
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";

import { NoteRepository } from "@/repositories/note-repository";
import type { Note } from "@/models/note";
import { v4 as uuidv4 } from "uuid";
import { showMessage } from "@/utils/common";

const router = useRouter();
const route = useRoute();
const repo = new NoteRepository();

// Reactive refs
const isEdit = ref(false);
const form = ref<Note>({
  id: "",
  title: "",
  content: "",
  created_at: "",
});

// Save function
const saveNote = async () => {
  if (!form.value.title.trim()) {
    showMessage("Title is required");
    return;
  }

  try {
    if (isEdit.value) {
      await repo.update(form.value.id, form.value);
    } else {
      form.value.id = uuidv4();
      form.value.created_at = new Date().toISOString();
      await repo.create(form.value);
    }
    router.push("/tabs/note-list");
  } catch (err) {
    console.error("Failed to save note:", err);
    showMessage("Something went wrong. Please try again.");
  }
};

// Load note if editing
onMounted(async () => {
  const id = route.query.id?.toString();
  if (id) {
    isEdit.value = true; // ✅ assign to .value
    const data = await repo.fetchById(id);
    if (data) {
      form.value = data; // ✅ assign to .value
    }
  }
});
</script>
