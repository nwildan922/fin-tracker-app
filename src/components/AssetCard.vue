<template>
  <ion-card class="asset-card">
    <ion-card-content class="card-grid">
      <!-- Left: big ticker -->
      <div class="ticker">{{ symbol }}</div>

      <!-- Top-middle: buy value (Rp) -->
      <div class="value buy">{{ toIDR(buyValue) }}</div>

      <!-- Top-right: % of portfolio -->
      <div class="percent">{{ percent.toFixed(0) }}%</div>

      <!-- Bottom-middle: market value (Rp) -->
      <div class="value market">{{ toIDR(marketValue) }}</div>

      <!-- Bottom-right: P/L signed -->
      <div class="pnl" :class="pnlClass(pnl)">
        {{ signed(pnl) }}{{ toIDR(Math.abs(pnl)) }}
      </div>
    </ion-card-content>
  </ion-card>
</template>

<script setup lang="ts">
import { IonCard, IonCardContent } from "@ionic/vue";

defineProps<{
  symbol: string; // e.g. "SOL"
  buyValue: number; // qty * buyPrice
  marketValue: number; // qty * marketPrice
  percent: number; // share of portfolio (0..100)
  pnl: number; // marketValue - buyValue
}>();

const toIDR = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);

const pnlClass = (n: number) => (n > 0 ? "pos" : n < 0 ? "neg" : "");
const signed = (n: number) => (n > 0 ? "+" : n < 0 ? "−" : "");
</script>

<style scoped>
.asset-card {
  --ion-card-background: #111; /* force dark bg */
  box-shadow: none;
}

/* Grid: 
   col1 = ticker, col2 = middle values, col3 = right values
   row1 = buy/percent, row2 = market/pnl
*/
.card-grid {
  display: grid;
  grid-template-rows: auto auto;
  align-items: center;
  column-gap: 24px;
  row-gap: 6px;
}

/* Ticker on the left */
.ticker {
  grid-row: 1 / span 2;
  grid-column: 1;
  font-weight: 100;
  font-size: 23px;
  letter-spacing: 2px;
  line-height: 1;
}

/* Middle column values */
.value {
  font-size: 12px;
  line-height: 1.2;
  white-space: nowrap;
}
.buy {
  grid-row: 1;
  grid-column: 2;
}
.market {
  grid-row: 2;
  grid-column: 2;
}

/* Right column */
.percent,
.pnl {
  text-align: right;
  font-size: 12px;
  white-space: nowrap;
}
.percent {
  grid-row: 1;
  grid-column: 3;
}
.pnl {
  grid-row: 2;
  grid-column: 3;
}

.pos {
  color: #22c55e;
} /* green */
.neg {
  color: #ef4444;
} /* red */
</style>
