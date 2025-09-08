<template>
  <ion-page>
    <!-- Header -->
    <ion-header>
      <ion-toolbar>
        <ion-title>Contacts</ion-title>
        <ion-buttons slot="end">
          <ion-button
            v-if="selectMode && selectedCount"
            color="danger"
            @click="removeSelected"
          >
            <ion-icon :icon="trashIcon" slot="icon-only"></ion-icon>
          </ion-button>
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
          :disabled="selectMode"
        >
          <ion-item
            button
            @click="
              selectMode
                ? toggleOne(item.id, !isSelected(item.id))
                : viewDetail(item.id)
            "
          >
            <ion-checkbox
              v-if="selectMode"
              slot="start"
              :checked="isSelected(item.id)"
              @ionChange="toggleOne(item.id, $event.detail.checked)"
              @click.stop
            />
            <ion-avatar v-else slot="start">
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

          <ion-item-options side="end" v-if="!selectMode">
            <ion-item-option color="danger" @click="remove(item.id)"
              >Delete</ion-item-option
            >
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
  IonCheckbox,
  isPlatform,
} from "@ionic/vue";
import {
  add as addIcon,
  ellipsisVertical,
  trash as trashIcon,
} from "ionicons/icons";
import { ref, computed, onMounted, onUnmounted, watch, Ref } from "vue";
import { useRouter } from "vue-router";
import { ContactRepository } from "@/repositories/contact-repository";
import type { Contact } from "@/models/contact";
import { showMessage } from "@/utils/common";
import { exportContactsToVcf } from "@/utils/contact-vcf-helper";
import {
  exportContactsVcf,
  importContactsFromPickedVcf,
} from "@/utils/contact-vcf-file-helper";
import { Filesystem } from "@capacitor/filesystem";
import { importFile } from "@/utils/vcf-impor-helper";
const page = "contact";
const router = useRouter();
const repo = new ContactRepository();
const actionButtons = [
  {
    text: "Import",
    handler: onImport,
  },
  {
    text: "Export to VCF",
    handler: onExport,
  },
  {
    text: "Select",
    handler: () => enterSelectMode(),
  },
  {
    text: "Select All",
    handler: () => {
      enterSelectMode();
      selectAllFromFiltered();
    },
  },
  {
    text: "Cancel",
    role: "cancel", // renders as cancel and auto-closes
  },
];
const selectMode: Ref<boolean> = ref(false);
const selectedIds: Ref<string[]> = ref([]);

const selectedCount = computed(() => selectedIds.value.length);
const isSelected = (id: string) => selectedIds.value.includes(id);

const enterSelectMode = () => {
  selectMode.value = true;
};
const exitSelectMode = () => {
  selectMode.value = false;
};
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
async function onImport() {
  const data: Contact[] = await importContactsFromPickedVcf();
  for (let i = 0; i < data.length; i++) {
    await repo.create(data[i]);
    console.log(`success add`, JSON.stringify(data[i]));
  }
}
async function onExport() {
  console.log("data will be exported are :");
  const data: Contact[] = await repo.getByIds(selectedIds.value);
  console.log(JSON.stringify(data));
  const result = await exportContactsVcf(data);
  console.log(`result vcf : `, result);
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

const remove = async (id: any) => {
  const confirmed = confirm(`Are you sure you want to delete this ${page}?`);
  if (!confirmed) return;

  try {
    await repo.delete(id);
  } catch (err) {
    console.error(`Failed to delete ${page}:`, err);
    showMessage("Something went wrong while deleting.");
  }
};
const toggleOne = (id: string, checked: boolean) => {
  if (checked) {
    if (!isSelected(id)) selectedIds.value = [...selectedIds.value, id];
  } else {
    selectedIds.value = selectedIds.value.filter((x) => x !== id);
  }
};

// Select all visible items
const selectAllFromFiltered = () => {
  // filteredData must be a ref/computed available in this SFC
  selectMode.value = true;
  selectedIds.value = (filteredData?.value ?? []).map((x) => x.id);
};

const clearSelection = () => {
  selectedIds.value = [];
  exitSelectMode();
};

watch(selectedIds, (v) => {
  if (selectMode.value && v.length === 0) exitSelectMode();
});

// Bulk delete using your existing remove(id)
const removeSelected = async () => {
  if (!selectedIds.value.length) return;
  const ids = [...selectedIds.value];
  for (const id of ids) {
    await remove(id); // reuse your remove
  }
  clearSelection();
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
