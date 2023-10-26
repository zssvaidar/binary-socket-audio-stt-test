<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
    <HomeComponent :D1="API_1_D1"/>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import HomeComponent from '@/components/HomeComponent.vue'; // @ is an alias to /src

@Options({
  components: {
    HomeComponent,
  },
})
export default class HomeView extends Vue {
  
  get API_1_D1 () {
    return this.$store.state.TTS.D1
  }

  mounted(): void {
    this.$store.dispatch('TTS/API_1', {})
  }
}
</script>
