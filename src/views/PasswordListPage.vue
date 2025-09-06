<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Password Manager</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="add">
            <ion-icon :icon="addIcon"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <!-- Search -->
      <ion-searchbar
        v-model="searchText"
        placeholder="Search site or username"
      ></ion-searchbar>

      <!-- List -->
      <ion-list>
        <ion-item-sliding v-for="item in filteredPasswords" :key="item.id">
          <!-- Main item -->
          <ion-item button @click="viewDetail(item)">
            <ion-label>
              <h2>{{ item.site }}</h2>
              <p>{{ item.username }}</p>
            </ion-label>

            <!-- Copy button -->
            <ion-buttons slot="end">
              <ion-button @click.stop="copyPassword(item.password)">
                <ion-icon :icon="copyIcon"></ion-icon>
              </ion-button>
            </ion-buttons>
          </ion-item>

          <!-- Slide options -->
          <ion-item-options side="end">
            <ion-item-option color="danger" @click="remove(item.id)">
              Delete
            </ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      </ion-list>

      <div
        v-if="filteredPasswords.length === 0"
        class="ion-text-center ion-padding"
      >
        <p>No passwords found.</p>
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
  IonButtons,
  IonButton,
  IonIcon,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
} from "@ionic/vue";
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { add as addIcon, copy as copyIcon } from "ionicons/icons";
import { Clipboard } from "@capacitor/clipboard";
import { PasswordRepository } from "@/repositories/password-repository";
import type { Password } from "@/models/password";
import { Capacitor } from "@capacitor/core";
import { showMessage } from "@/utils/common";

const router = useRouter();
const searchText = ref("");
const passwords = ref<Password[]>([]);
const repo = new PasswordRepository();
let subscription: any = null;
const loading = ref(true);

onMounted(async () => {
  loading.value = true;
  subscription = await repo.observeAll((items) => {
    passwords.value = items;
  });
});
onUnmounted(() => {
  subscription?.unsubscribe?.();
});

// Filtering
const filteredPasswords = computed(() => {
  const text = searchText.value.toLowerCase();
  return passwords.value.filter(
    (p) =>
      p.site.toLowerCase().includes(text) ||
      p.username.toLowerCase().includes(text)
  );
});

// Navigation
const add = () => {
  router.push("/tabs/password");
};

const viewDetail = (item: Password) => {
  router.push({
    path: "/tabs/password",
    query: { id: item.id },
  });
};

const copyPassword = async (password: string) => {
  try {
    if (Capacitor.getPlatform() === "web") {
      await navigator.clipboard.writeText(password);
    } else {
      await Clipboard.write({ string: password });
    }
    console.log("Password copied!");
  } catch (err) {
    console.error("Failed to copy: ", err);
  }
};

// ✅ Slide delete function
const remove = async (id: string) => {
  const confirmed = confirm("Are you sure you want to delete this password?");
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
