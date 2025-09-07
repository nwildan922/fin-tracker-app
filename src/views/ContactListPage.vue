<template>
  <ion-page>
    <!-- Header -->
    <ion-header>
      <ion-toolbar>
        <ion-title>Contacts</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="add">
            <ion-icon :icon="addIcon" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <!-- Content -->
    <ion-content class="ion-padding">
      <ion-item lines="none">
        <!-- Search -->
        <ion-searchbar
          v-model="searchQuery"
          placeholder="Search site or username"
        ></ion-searchbar>
        <!-- Three-dots: opens Action Sheet -->
        <ion-button id="more-actions">
          <ion-icon :icon="ellipsisVertical" slot="icon-only"></ion-icon>
        </ion-button>
      </ion-item>
      <ion-action-sheet
        trigger="more-actions"
        header="More options"
        :buttons="actionButtons"
      ></ion-action-sheet>
      <ion-list v-if="filteredData.length > 0">
        <ion-item-sliding
          v-for="item in filteredData"
          :key="item.id"
          ref="slidingRefs"
        >
          <ion-item button @click="viewDetail(item.id)">
            <ion-avatar slot="start">
              <div class="avatar-circle">
                {{ (item.name || "U")[0].toUpperCase() }}
              </div>
            </ion-avatar>
            <ion-label>
              <h2>{{ item.name || "Unnamed Contact" }}</h2>
              <p>
                {{ item.phone1
                }}<span v-if="item.phone2"> / {{ item.phone2 }}</span>
              </p>
              <p v-if="item.email">{{ item.email }}</p>
              <p v-if="item.note">{{ item.note }}</p>
            </ion-label>
          </ion-item>

          <ion-item-options side="end">
            <ion-item-option color="danger" @click="remove(item.id)">
              Delete
            </ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      </ion-list>

      <div v-else class="ion-text-center ion-padding">
        <p>No contacts yet. Click Add to create one.</p>
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
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonLabel,
  IonButton,
  IonButtons,
  IonIcon,
  IonAvatar,
  IonItem,
  IonSearchbar,
  IonActionSheet,
} from "@ionic/vue";
import { add as addIcon, ellipsisVertical } from "ionicons/icons";
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { ContactRepository } from "@/repositories/contact-repository";
import type { Contact } from "@/models/contact";
import { showMessage } from "@/utils/common";
const page = "contact";
const router = useRouter();
const repo = new ContactRepository();
const actionButtons = [
  {
    text: "Import",
    handler: onImport,
  },
  {
    text: "Merge",
    handler: onMerge,
  },
  {
    text: "Cancel",
    role: "cancel", // renders as cancel and auto-closes
  },
];
const searchQuery = ref("");
const gridData = ref<Contact[]>([]);
const loading = ref(true);
let subscription: any = null;

const filteredData = computed(() => {
  if (!searchQuery.value) return gridData.value;
  return gridData.value.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});
function onImport() {
  /* TODO: open picker */
}
function onMerge() {
  /* TODO: merge flow */
}

onMounted(async () => {
  loading.value = true;
  subscription = await repo.observeAll((items) => {
    gridData.value = items;
  });
});

onUnmounted(() => {
  subscription?.unsubscribe?.();
});

const viewDetail = (id: string) => {
  router.push({
    path: `/tabs/${page}`,
    query: { id },
  });
};

const add = () => {
  router.push(`/tabs/${page}`);
};

const remove = async (id: string) => {
  const confirmed = confirm(`Are you sure you want to delete this ${page}?`);
  if (!confirmed) return;

  try {
    await repo.delete(id);
  } catch (err) {
    console.error(`Failed to delete ${page}:`, err);
    showMessage("Something went wrong while deleting.");
  }
};
</script>

<style scoped>
.avatar-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #3880ff;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 16px;
}
</style>
