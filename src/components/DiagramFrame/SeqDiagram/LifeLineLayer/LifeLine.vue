<template>
  <div
    :id="entity.name"
    class="lifeline absolute flex flex-col mx-2 transform -translate-x-1/2 h-full"
    :style="{ paddingTop: top + 'px', left: left + 'px' }"
  >
    <div v-show="debug">{{centerOf(entity.name)}}</div>
    <participant v-if="renderParticipants" :entity="entity" />
    <div v-else class="line bg-skin-lifeline w0 mx-auto flex-grow w-px"></div>
  </div>
</template>

<script>
import parentLogger from '../../../../logger/logger';
import EventBus from '../../../../EventBus';
import { mapGetters, mapState } from 'vuex';
import Participant from './Participant.vue';
const logger = parentLogger.child({ name: 'LifeLine' });
export default {
  name: 'life-line',
  components: { Participant },
  props: ['entity', 'context', 'groupLeft', 'inGroup', 'renderParticipants'],
  data: () => {
    return {
      translateX: 0,
      top: 0,
    };
  },
  computed: {
    ...mapGetters(['centerOf']),
    ...mapState(['scale']),
    debug() {
      return !!localStorage.zenumlDebug;
    },
    left() {
      return this.centerOf(this.entity.name) - 8 - (this.groupLeft || 0);
    },
  },
  mounted() {
    logger.debug(`LifeLine mounted for ${this.entity.name}`);
    this.$nextTick(() => {
      this.setTop();
      logger.debug(`nextTick after updated for ${this.entity.name}`);
    });

    EventBus.$on('participant_set_top', () => this.$nextTick(() => this.setTop()));

    // setTimeout( () => {
    //   this.setTop()
    //   this.$emit('rendered')
    //   logger.debug(`setTimeout after mounted for ${this.entity.name}`);
    // })
  },
  updated() {
    logger.debug(`updated for ${this.entity.name}`);
    this.$nextTick(() => {
      this.setTop();
      logger.debug(`nextTick after updated for ${this.entity.name}`);
    });
    // setTimeout( () => {
    //   this.setTop()
    //   this.$emit('rendered')
    //   logger.debug(`setTimeout after updated for ${this.entity.name}`);
    // })
  },
  methods: {
    onSelect() {
      this.$store.commit('onSelect', this.entity.name);
    },
    setTop() {
      // escape entity name to avoid 'not a valid selector' error.
      const escapedName = this.entity.name.replace(/([ #;&,.+*~\':"!^$[\]()=>|\/@])/g, '\\$1');
      const $el = this.$root.$refs.diagram.$el;
      const firstMessage = $el.querySelector(`[data-to="${escapedName}"]`);
      const isVisible = firstMessage?.offsetParent != null;
      if (firstMessage && firstMessage.attributes['data-type'].value === 'creation' && isVisible) {
        logger.debug(`First message to ${this.entity.name} is creation`);
        const rootY = this.$el.getBoundingClientRect().y;
        const messageY = firstMessage.getBoundingClientRect().y;
        this.top = (messageY - rootY) / this.scale;
      } else {
        this.top = 0;
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.lifeline .line {
  /*background: linear-gradient(to bottom, transparent 50%, #223049 50%);*/
  background-size: 1px 20px;
}
</style>
