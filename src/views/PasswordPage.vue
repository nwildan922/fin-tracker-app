<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ isEdit ? "Edit Password" : "Add Password" }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-list>
        <!-- Site -->
        <ion-item>
          <ion-label position="stacked">Site</ion-label>
          <ion-input v-model="form.site"></ion-input>
        </ion-item>

        <!-- Username -->
        <ion-item>
          <ion-label position="stacked">Username</ion-label>
          <ion-input v-model="form.username"></ion-input>
        </ion-item>

        <!-- Password -->
        <ion-item>
          <ion-label position="stacked">Password</ion-label>
          <ion-input
            :type="showPassword ? 'text' : 'password'"
            v-model="form.password"
          ></ion-input>
          <ion-buttons slot="end">
            <ion-button @click="togglePassword">
              <ion-icon :icon="showPassword ? eyeOff : eye"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-item>

        <!-- Note -->
        <ion-item>
          <ion-label position="stacked">Note</ion-label>
          <ion-textarea v-model="form.note"></ion-textarea>
        </ion-item>
      </ion-list>

      <ion-button expand="block" class="ion-margin-top" @click="savePassword">
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
  IonInput,
  IonTextarea,
  IonButton,
  IonButtons,
  IonIcon,
  onIonViewWillEnter,
} from "@ionic/vue";
import { eye, eyeOff } from "ionicons/icons";
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { PasswordRepository } from "@/repositories/password-repository";
import type { Password } from "@/models/password";
import { v4 as uuidv4 } from "uuid";

// router
const router = useRouter();
const route = useRoute();
const repo = new PasswordRepository();
const showPassword = ref(false);
const isEdit = ref(false);

// form state
const form = ref<Password>({
  id: "",
  site: "",
  username: "",
  password: "",
  note: "",
  created_at: "",
});

// toggle password visibility
const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

// save
const savePassword = async () => {
  if (isEdit.value) {
    await repo.update(form.value.id, form.value);
  } else {
    form.value.id = uuidv4();
    form.value.created_at = new Date().toISOString();
    await repo.create(form.value);
  }
  router.push("/tabs/password-list");
};

// load for edit
onIonViewWillEnter(async () => {
  const id = route.query.id?.toString();
  if (id) {
    isEdit.value = true;
    const data = await repo.fetchById(id);
    if (data) {
      form.value = data;
    }
  }
});
</script>
