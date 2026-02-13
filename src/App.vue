<template>
  <div class="example-json" style="height: 100vh">
    <div class="example-demo">vue3-json-editor demo</div>
    <Vue3JsonEditor
      v-model="state.json"
      :schema="schema"
      :schema-refs="undefined"
      :show-btns="false"
      :expandedOnStart="false"
      mode="code"
      lang="en"
      :enable-transform="false"
      :enable-repair="false"
      :status-bar="false"
      :navigation-bar="false"
      style="height: 500px"
      @json-change="onJsonChange"
      @json-save="onJsonSave"
      @provide-editor="onEditorProvided"
      @has-error="onError"
      @validate="onValidate"
    >
    </Vue3JsonEditor>
    <button type="button" @click="resetJson">reset</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import { Vue3JsonEditor } from '../components/vue3-json-editor'

export default defineComponent({
  components: {
    Vue3JsonEditor
  },
  setup() {
    const state = reactive<{
      json: { users: Array<{ name: string; age: number }>; isActive: boolean }
    }>({
      json: {
        users: [
          { name: 'Dirk', age: 1234 },
          { name: 'Jason', age: 25 }
        ],
        isActive: true
      }
    })

    const schema = {
      type: 'object',
      properties: {
        users: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              age: { type: 'number' }
            },
            additionalProperties: false
          }
        },
        isActive: {
          type: 'boolean',
          description: 'Can only be true or false'
        }
      },
      required: ['isActive', 'users'],
      additionalProperties: false
    }

    function onJsonChange(value) {
      console.log('value:', value)
    }

    function onJsonSave(value) {
      console.log('value:', value)
    }

    function onError(value) {
      console.log('value:', value)
    }

    function resetJson() {
      state.json = {
        users: [
          { name: 'Dirk', age: 1234 },
          { name: 'Jason', age: 25 }
        ],
        isActive: true
      } as typeof state.json
    }

    function onEditorProvided(editor: any) {
      console.log(editor)
    }

    function onValidate(res) {
      console.log(res)
    }

    return {
      state,
      schema,
      resetJson,
      onJsonChange,
      onJsonSave,
      onError,
      onEditorProvided,
      onValidate
    }
  }
})
</script>

<style>
.jsoneditor-vue {
  height: 100%;
}
</style>
