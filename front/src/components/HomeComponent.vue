<template>
  <div id="home-component">

    <div class="wrapper">
      <div class="content">

      <h1>{{ 'msg' }}</h1>
      {{ D1 }}

        <section id="menu">
          <main>
            <Card id="card-1" @click="selectCard(1)" class="card-list-1" 
              :class="{'selected-card': selectedCard==1}">
              
              <template #content>
                <div class="dot" :class="{ 'flicker': isFlickering, 'red': isFlickering  }"></div>
                <Icon style="font-size: 28px;" icon="mdi-light:microphone" />
              </template>
              <template #footer>
                Voice cognition
              </template>
            </Card>

            <Card id="card-1" @click="selectCard(2)" class="card-list-1"
              :class="{'selected-card': selectedCard==2}">
              <template #content>
                <Icon style="font-size: 28px;" icon="mdi-light:microphone" />
              </template>
              <template #footer>
                Voice cognition
              </template>
            </Card>
          </main>

          <Fieldset :toggleable="false">
            <template #legend></template>
            
            <button class="btn btn-primary" @click="startRec">Start Recording</button>
            <button class="btn btn-primary" @click="stopRec">Stop Recording</button>
          </Fieldset>

        </section>
      </div>

    </div>

    <button class="btn btn-primary" id="start-rec-btn">Start Recording</button>
    <button class="btn btn-primary" id="stop-rec-btn">Stop Recording</button>
    
  </div>
</template>

<script lang="ts">

import { defineComponent, PropType } from 'vue'

export default defineComponent({
  props: {
    D1: {
      type: Array as PropType<any[]>,
      required: true
    },
  },
  data () {
    return {
      selectedCard: 1,
      isFlickering: false
    }
  },
  methods: {
    selectCard(n: number) {
      this.selectedCard = n
    },
    startRec() {
      window.startRec()
      this.toggleFlickering()
    },
    stopRec() {
      window.stopRec()
      this.toggleFlickering()
    },
    toggleFlickering() {
      this.isFlickering = !this.isFlickering;
    }
  },
  mounted() {
    
    setTimeout(() => {
    }, 1000)

  },
})

</script>

<style lang="scss">
#home-component {
  .wrapper {
    width: 75vw;
    margin-left: auto;
    margin-right: auto;
  }
  .content {
    margin-top: 1rem;
    margin-left: 1rem;
    margin-right: 1rem;
  }

  .p-card {
    .p-card-body .p-card-content {
      padding: 0;
    }
    &:hover {
      background-color: var(--hover-card);
    }
  }
  .card-list-1  {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  #card-1 {
    position: relative;
    .dot {
      position: absolute;
      top: 10px;
      right: 10px;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: gray;
    }

    .flicker {
      animation: flickerAnimation 1s infinite;
    }

    .red {
      background-color: red;
    }

    @keyframes flickerAnimation {
      0% {
        opacity: 1;
      }
      50% {
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
    }
  }
}

#home-component {
  section#menu {
    display: flex;
    align-items: flex-start;
  }
  section#menu main {
    width: 250px;
    flex: 0 0 auto;
    box-sizing: border-box;
    & > *:not(:first-child) {
      margin-top: 1rem;
    }
    &>* {
      height: 140px;
    }
  }

  section#menu fieldset {
    vertical-align: top;
    margin-left: 1rem;
    width: 100%;
    .p-fieldset-legend {
      display: none;
    }
  }
}
.selected-card {
  background-color: var(--hover-card)!important;
}
</style>
