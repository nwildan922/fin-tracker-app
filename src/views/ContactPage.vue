<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Add Contact</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-list>
        <ion-item>
          <ion-label position="stacked">Name</ion-label>
          <ion-input
            v-model="form.name"
            type="text"
            placeholder="Enter name"
          ></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="stacked">Phone 1</ion-label>
          <ion-input
            v-model="form.phone1"
            type="tel"
            placeholder="Enter phone 1"
          />
        </ion-item>

        <ion-item>
          <ion-label position="stacked">Phone 2</ion-label>
          <ion-input
            v-model="form.phone2"
            type="tel"
            placeholder="Enter phone 2"
          />
        </ion-item>

        <ion-item>
          <ion-label position="stacked">Email</ion-label>
          <ion-input
            v-model="form.email"
            type="email"
            placeholder="Enter email (optional)"
          />
        </ion-item>

        <ion-item>
          <ion-label position="stacked">Note</ion-label>
          <ion-input v-model="form.note" placeholder="Add a note (optional)" />
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
  IonInput,
  onIonViewWillEnter,
} from "@ionic/vue";
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { v4 as uuidv4 } from "uuid";
import { ContactRepository } from "@/repositories/contact-repository";
import type { Contact } from "@/models/contact";
import { showMessage } from "@/utils/common";

const router = useRouter();
const route = useRoute();
const repo = new ContactRepository();

const isEditMode = ref(false);
const form = ref<Contact>({
  id: "",
  name: "",
  phone1: "",
  phone2: "",
  email: "",
  note: "",
  created_at: "",
});

onMounted(async () => {
  const id = route.query.id?.toString();
  if (id) {
    isEditMode.value = true; // ✅ assign to .value
    const data = await repo.fetchById(id);
    if (data) {
      form.value = data; // ✅ assign to .value
    }
  } else {
    form.value = {
      id: "",
      name: "",
      phone1: "",
      phone2: "",
      email: "",
      note: "",
      created_at: "",
    };
  }
});

const submit = async () => {
  if (!form.value.name.trim() || !form.value.phone1.trim()) {
    showMessage("Name, Phone 1, and Phone 2 are required");
    return;
  }

  try {
    if (isEditMode.value) {
      await repo.update(form.value.id, { ...form.value });
    } else {
      const data: Contact = {
        ...form.value,
        id: uuidv4(),
        created_at: new Date().toISOString(),
      };
      await repo.create(data);
    }
    router.back();
  } catch (err) {
    console.error("Failed to save contact:", err);
    showMessage("Something went wrong. Please try again.");
  }
};
</script>
