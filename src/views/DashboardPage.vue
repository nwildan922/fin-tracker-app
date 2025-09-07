<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Summary</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <!-- Portfolio Info Card -->
      <ion-card>
        <ion-card-content class="portfolio-info">
          <div class="row">
            <span>Portofolio Value</span>
            <strong>{{ toIDR(totalValue) }}</strong>
          </div>
          <div class="row">
            <span>Invested</span>
            <strong>{{ toIDR(totalInvested) }}</strong>
          </div>
          <div class="row">
            <span>Unrealized P/L</span>
            <strong :class="pnlClass(overallPnl)">
              {{ sign(overallPnl) }}{{ toIDR(abs(overallPnl)) }}
              <small class="muted">
                ({{ sign(overallPnlPct) }}{{ abs(overallPnlPct).toFixed(2) }}%)
              </small>
            </strong>
          </div>
        </ion-card-content>
      </ion-card>

      <!-- Allocation Card -->
      <ion-card>
        <ion-card-header>
          <ion-card-title>Asset Allocation</ion-card-title>
          <ion-card-subtitle>share of total value</ion-card-subtitle>
        </ion-card-header>
        <ion-card-content>
          <div v-for="a in enrichedAssets" :key="a.symbol" class="alloc-row">
            <div class="alloc-label">
              <strong>{{ a.symbol }}</strong>
              <span class="muted">{{ a.percent.toFixed(0) }}%</span>
            </div>
            <div class="alloc-bar">
              <div class="alloc-fill" :style="{ width: a.percent + '%' }"></div>
            </div>
          </div>
        </ion-card-content>
      </ion-card>

      <!-- Assets Table -->
      <ion-card>
        <ion-card-header>
          <ion-card-title>Assets</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <AssetCard
            v-for="a in enrichedAssets"
            :key="a.symbol"
            :symbol="a.symbol"
            :buyValue="a.invested"
            :marketValue="a.value"
            :percent="a.percent"
            :pnl="a.pnl"
          />
        </ion-card-content>
      </ion-card>
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
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
} from "@ionic/vue";
import { ref, computed } from "vue";
import AssetCard from "@/components/AssetCard.vue";
type AssetRow = {
  name: string;
  symbol: string;
  qty: number;
  buyPrice: number;
  marketPrice: number;
};

const assets = ref<AssetRow[]>([
  {
    name: "Ethereum",
    symbol: "ETH",
    qty: 0.25,
    buyPrice: 5500000,
    marketPrice: 6000000,
  },
  {
    name: "Bitcoin",
    symbol: "BTC",
    qty: 0.01,
    buyPrice: 10000000,
    marketPrice: 10500000,
  },
  { name: "Doge", symbol: "DOGE", qty: 500, buyPrice: 2000, marketPrice: 1900 },
]);

// Derived numbers
const enrichedAssets = computed(() => {
  const vals = assets.value.map((a) => {
    const value = a.qty * a.marketPrice;
    const invested = a.qty * a.buyPrice;
    const pnl = value - invested;
    const pnlPct = invested === 0 ? 0 : (pnl / invested) * 100;
    return { ...a, value, invested, pnl, pnlPct };
  });
  const totalValue = vals.reduce((s, x) => s + x.value, 0);
  return vals.map((x) => ({
    ...x,
    percent: totalValue === 0 ? 0 : (x.value / totalValue) * 100,
  }));
});

const totalValue = computed(() =>
  enrichedAssets.value.reduce((s, x) => s + x.value, 0)
);
const totalInvested = computed(() =>
  enrichedAssets.value.reduce((s, x) => s + x.invested, 0)
);
const overallPnl = computed(() => totalValue.value - totalInvested.value);
const overallPnlPct = computed(() =>
  totalInvested.value === 0 ? 0 : (overallPnl.value / totalInvested.value) * 100
);

// Utils
const toIDR = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);

const abs = Math.abs;
const sign = (n: number) => (n > 0 ? "+" : n < 0 ? "−" : "");
const pnlClass = (n: number) => (n > 0 ? "pos" : n < 0 ? "neg" : "muted");
</script>

<style scoped>
/* Portfolio info card styling */
.portfolio-info .row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 1rem;
}
.portfolio-info strong {
  font-size: 1.05rem;
}

/* Allocation bars */
.alloc-row {
  margin-bottom: 0.75rem;
}
.alloc-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}
.alloc-bar {
  height: 8px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 999px;
  overflow: hidden;
}
.alloc-fill {
  height: 100%;
  background: linear-gradient(90deg, #4ade80, #22d3ee);
}

/* Table */
.table {
  width: 100%;
}
.thead,
.trow {
  display: grid;
  grid-template-columns: 1.3fr 0.6fr 0.9fr 0.9fr 1fr 1.1fr;
  gap: 0.6rem;
  align-items: center;
  padding: 0.5rem 0;
}
.thead {
  font-size: 0.8rem;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  opacity: 0.7;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
.trow {
  border-bottom: 1px dashed rgba(255, 255, 255, 0.06);
}
.num {
  text-align: right;
  white-space: nowrap;
}

.asset-cell {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}
.avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  font-weight: 600;
}
.name {
  font-weight: 600;
  line-height: 1;
}
.symbol {
  font-size: 0.75rem;
}

.pos {
  color: #22c55e;
}
.neg {
  color: #ef4444;
}
.muted {
  opacity: 0.7;
}
</style>
