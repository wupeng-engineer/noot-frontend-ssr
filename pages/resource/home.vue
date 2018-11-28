<template>
<!-- advanced -->
<codemirror
  :value="code"
  :options="this.options"
  ref="myEditor"
  @change="yourCodeChangeMethod">
</codemirror>
</template>

<script>
import { codemirror } from 'vue-codemirror-lite'
  require('codemirror/mode/javascript/javascript')
  require('codemirror/mode/vue/vue')

  require('codemirror/addon/hint/show-hint.js')
  require('codemirror/addon/hint/show-hint.css')
  require('codemirror/addon/hint/javascript-hint.js')
export default {
    components: {
        codemirror
    },
  data () {
    return {
      code: 'const str = "hello world"',
      options: {
        tabSize: 2,
        mode: {
            name: 'javascript',
            json: true,
        },
        lineNumbers: true,
        line: true,
        highlightDifferences: true
      }
    }
  },
  methods: {
    yourCodeChangeMethod(value) {
        console.log(value);
    },
    
  },
  computed: {
    editor() {
      // get current editor object
      return this.$refs.myEditor.editor
    }
  },
  mounted() {
    // use editor object...
  }
}
</script>

