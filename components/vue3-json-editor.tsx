import {
  ComponentPublicInstance,
  defineComponent,
  getCurrentInstance,
  onMounted,
  reactive,
  watch
} from 'vue'
import JsonEditor from './assets/jsoneditor'
import './assets/jsoneditor.css'
import './style.css'

export const Vue3JsonEditor = defineComponent({
  props: {
    modelValue: [String, Boolean, Object, Array],
    showBtns: [Boolean],
    expandedOnStart: {
      type: Boolean,
      default: false
    },
    mode: {
      type: String,
      default: 'tree'
    },
    modes: {
      type: Array,
      default: function () {
        return ['tree', 'code', 'form', 'text', 'view']
      }
    },
    lang: {
      type: String,
      default: 'en'
    },
    schema: {
      type: Object,
      default: null
    },
    schemaRefs: {
      type: Object,
      default: null
    },
    mainMenuBar: {
      type: Boolean,
      default: true
    },
    navigationBar: {
      type: Boolean,
      default: true
    },
    statusBar: {
      type: Boolean,
      default: true
    },
    enableSort: {
      type: Boolean,
      default: true
    },
    enableTransform: {
      type: Boolean,
      default: true
    },
    enableRepair: {
      type: Boolean,
      default: true
    },
    languages: {
      type: Object,
      default: null
    }
  },
  setup (props: any, { emit }) {
    const root = getCurrentInstance()?.root.proxy as ComponentPublicInstance

    const state = reactive({
      editor: null as any,
      error: false,
      json: {},
      internalChange: false,
      expandedModes: ['tree', 'view', 'form'],
      locale: {
        it: {
          save: 'SALVA'
        },
        en: {
          save: 'SAVE'
        },
        zh: {
          save: '保存'
        }
      },
      uid: `jsoneditor-vue-${getCurrentInstance()?.uid}`
    })

    watch(
      () => (props.modelValue as unknown) as any,
      async (val) => {
        if (!state.internalChange) {
          state.json = val
          await setEditor(val)
          state.error = false
          expandAll()
        }
      },
      { immediate: true }
    )

    watch(
      () => props.schema,
      (newSchema) => {
        if (state.editor && newSchema) {
          state.editor.setSchema(newSchema, props.schemaRefs)
        }
      }
    )

    onMounted(() => {
      const options: Record<string, any> = {
        mode: props.mode,
        modes: props.modes,
        schema: props.schema,
        schemaRefs: props.schemaRefs,
        mainMenuBar: props.mainMenuBar,
        navigationBar: props.navigationBar,
        statusBar: props.statusBar,
        enableSort: props.enableSort,
        enableTransform: props.enableTransform,
        language: props.lang,
        languages: props.languages,
        onChange () {
          try {
            const json = state.editor.get()
            state.json = json
            state.error = false
            emit('json-change', json)
            state.internalChange = true
            emit('input', json)
            root.$nextTick(function () {
              state.internalChange = false
            })
          } catch (e) {
            state.error = true
            emit('has-error', e)
          }
        },
        onModeChange (mode) {
          emit('mode-change', mode)
          state.expandedModes.includes(mode) && expandAll()
        },
        onValidationError (errors: any[]) {
          emit('validation-error', errors)
          emit('validate', {
            valid: errors.length === 0,
            errors
          })
        }
      }
      state.editor = new JsonEditor(
        document.querySelector(`#${state.uid}`),
        options,
        state.json
      )

      emit('provide-editor', state.editor)
    })

    function expandAll () {
      if (props.expandedOnStart && state.expandedModes.includes(props.mode)) {
        (state.editor as any).expandAll()
      }
    }

    function onSave () {
      emit('json-save', state.json)
    }

    function setEditor (value: any): void {
      if (state.editor) state.editor.set(value)
    }

    return () => {
      return (
        <div>
          <div id={state.uid} class={'jsoneditor-vue'}></div>
          {props.showBtns !== false && (
            <div class={'jsoneditor-btns'}>
              <button
                class={'json-save-btn'}
                type={'button'}
                onClick={() => {
                  onSave()
                }}
                disabled={state.error}
              >
                {state.locale[props.lang].save}
              </button>
            </div>
          )}
        </div>
      )
    }
  }
})
