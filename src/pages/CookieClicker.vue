<script setup>
import { computed, ref } from 'vue';

const cookies = ref(0);
const buildings = ref([
    { name: '🖱️Cursor', price: 15, cps: 0.1, count: 0, multiplier: 1 },
    { name: '👵🏻Grandma', price: 100, cps: 1, count: 0, multiplier: 1 },
    { name: '🚜Farm', price: 1000, cps: 10, count: 0, multiplier: 1 },
    { name: '🏭Factory', price: 10_000, cps: 100, count: 0, multiplier: 1 },
    { name: '⛰️Mine', price: 100_000, cps: 1000, count: 0, multiplier: 1 },
    { name: '🥼Laboratory', price: 1_000_000, cps: 10000, count: 0, multiplier: 1 },
    { name: '🚀Rocket', price: 10_000_000, cps: 10000, count: 0, multiplier: 1 },
    { name: '🌚Moon', price: 100_000_000, cps: 100000, count: 0, multiplier: 1 },
    { name: 'COMING SOON', price: 0, cps: 0.000000001, count: 0, multiplier: 1 },
]);

function buyBuilding(building) {
    cookies.value -= building.price;
    building.price += Math.ceil(building.price * 0.15);
    building.count++;
}

const cps = computed(() => {
    return buildings.value.reduce((sum, b) => sum + (b.cps * b.count * b.multiplier), 0);
});

// 🍪 Golden cookie logic
const goldenCookieVisible = ref(false);
const goldenCookieBoost = ref(false);

function spawnGoldenCookie() {
    goldenCookieVisible.value = true;
    setTimeout(() => goldenCookieVisible.value = false, 7000);
}

function clickGoldenCookie() {
    goldenCookieVisible.value = false;
    goldenCookieBoost.value = true;
    setTimeout(() => goldenCookieBoost.value = false, 10000); // 10 sec boost
}

const upgrades = ref([
    { name: "🖱️Sticky Fingertips", cost: 100, building: "Cursor", applied: false },
    { name: "👵🏻Nana-nator 9000", cost: 500, building: "Grandma", applied: false },
    { name: "🚜Cookies on the Cob", cost: 2500, building: "Farm", applied: false },
    { name: "🏭Union-Busting Biscuits", cost: 15_000, building: "Factory", applied: false },
    { name: "⛰️I yearn for the mines", cost: 150_000, building: "Mine", applied: false },
    { name: "🥼Dough Matter Accelerator", cost: 1_500_000, building: "Laboratory", applied: false },
    { name: "🚀Fueling with Frosting", cost: 15_000_000, building: "Rocket", applied: false },
    { name: "🌚THE MOON", cost: 150_000_000, building: "Moon", applied: false },
]);

function buyUpgrade(upgrade) {
    cookies.value -= upgrade.cost;
    const target = buildings.value.find(b => b.name === upgrade.building);
    if (target) target.multiplier *= 2;
    upgrade.applied = true;
}

const achievementNotifications = ref([]); // For achievement pop-ups

const achievements = ref([
  { name: "Buy 10 Cursors", unlocked: false, condition: () => buildings.value.find(b => b.name === "🖱️Cursor")?.count >= 10 },
  { name: "Sticky Fingertips", unlocked: false, condition: () => upgrades.value.find(u => u.name === "🖱️Sticky Fingertips")?.applied },
  { name: "First Grandma", unlocked: false, condition: () => buildings.value.find(b => b.name === "👵🏻Grandma")?.count >= 1 },
  { name: "Cookie Tycoon", unlocked: false, condition: () => cookies.value >= 1_000_000 },
  { name: "Golden Clicker", unlocked: false, condition: () => goldenCookieBoost.value },
  { name: "Ultimate Comitment", unlocked: false, condition: () => buildings.value.find(b => b.name === "COMING SOON")?.count >= 3600000 },
]);

function checkAchievements() {
  achievements.value.forEach(a => {
    if (!a.unlocked && a.condition()) {
      a.unlocked = true;
      achievementNotifications.value.push(a.name);
      setTimeout(() => {
        const index = achievementNotifications.value.indexOf(a.name);
        if (index !== -1) {
          achievementNotifications.value.splice(index, 1);
        }
      }, 5000); // Show popup for 8 seconds then fade out
    }
  });
}

setInterval(() => {
    cookies.value += goldenCookieBoost.value ? cps.value * 2 : cps.value;
    document.title = '🍪 ' + cookies.value.toFixed(1) + ' Cookies!';
    if (Math.random() < 0.01 && !goldenCookieVisible.value) spawnGoldenCookie(); // 1% chance per second
    checkAchievements();
}, 1000);

</script>

<template>
  <div class="columns">
    <div class="column is-4 has-background-link has-text-centered">
      <h1 class="is-size-1">{{ +cookies.toFixed(1) }} cookies</h1>
      <h3 class="is-size-3">{{ +cps.toFixed(1) }} cps</h3>

      <figure class="image is-square" @click="cookies++">
        <img
          src="https://sweetlorens.com/cdn/shop/products/Copy-of-Chocolate-Chunk-Full-Cookie-transparent-background.png?v=1687811511"
        />
      </figure>

      <div v-if="goldenCookieVisible" @click="clickGoldenCookie" class="notification is-warning mt-4" style="cursor: pointer;">
        🌟 Golden Cookie! Click me!
      </div>
      <p v-if="goldenCookieBoost" class="has-text-warning mt-2">🍪 Golden boost active!</p>
    </div>

    <div class="column is-5 has-background-black has-text-white">
      <h2 class="is-size-3 has-text-white">Upgrades</h2>
      <div v-for="upgrade in upgrades" :key="upgrade.name" class="box">
        <button
          class="button is-info is-fullwidth"
          :disabled="cookies < upgrade.cost || upgrade.applied"
          @click="buyUpgrade(upgrade)"
        >
          {{ upgrade.name }} - 🍪{{ upgrade.cost }}
        </button>
      </div>
    </div>

    <div class="column is-3 has-background-white">
      <button
        v-for="building in buildings"
        :key="building.name"
        :disabled="cookies < building.price"
        @click="buyBuilding(building)"
        class="button is-primary is-large is-fullwidth mb-2"
      >
        {{ building.name }} 🍪{{ building.price }} #{{ building.count }}
      </button>
    </div>
  </div>

  <!-- Achievement notifications container -->
  <div class="achievement-notifications" style="position: fixed; top: 20px; right: 20px; z-index: 1000;">
    <transition-group name="fade" tag="div">
      <div
        v-for="(msg, index) in achievementNotifications"
        :key="msg"
        class="notification is-success"
        style="margin-bottom: 8px; min-width: 250px;"
      >
        🎉 Achievement Unlocked: {{ msg }}!
      </div>
    </transition-group>
  </div>
</template>

<style scoped>
.notification {
  transition: opacity 0.3s ease;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 1s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.fade-enter-to, .fade-leave-from {
  opacity: 1;
}
</style>
