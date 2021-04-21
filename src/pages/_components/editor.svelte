<script lang="ts">
    import { onMount } from "svelte";
    import loader from "@monaco-editor/loader";
    import {
        Loading
    } from "carbon-components-svelte";
    import {wait} from "../../init_axios.js"

    export let monaco = null,
        editor = null, loading = true;

    let content = "";
    const start_text = 
`[
    "Type",
    "something!"
]`
    onMount(async () => {
        monaco = await loader.init();
        wait(1000).then(()=>{loading = false})
    });

    function make_editor(node) {
        editor = monaco.editor.create(node, {
            value: start_text,
            language: "json",
            theme: "vs-dark",
            minimap:{
                enabled:false
            }
        });
        // editor.onDidChangeModelContent((event) => {
        //     content = editor.getValue();
        // });
    }

    export const model = {
        getText() {
            if (editor) {
                return editor.getValue();
            }
        },
        formatText() {
            if (editor) {
                editor.getAction("editor.action.formatDocument").run();
            }
        },
        setError(
            context: {
                startLineNumber: number;
                startColumn: number;
                endLineNumber: number;
                endColumn: number;
                message: string;
                severity?: any;
            }[]
        ) {
            const updated_context = context.map((e) => {
                e.severity = monaco.MarkerSeverity.Error;
                return e;
            });
            if (monaco && editor) {
                monaco.editor.setModelMarkers(
                    editor.getModel(),
                    "editor",
                    updated_context
                );
            }
        },
        clearError() {
            if (monaco && editor) {
                monaco.editor.setModelMarkers(editor.getModel(), "editor", []);
            }
        },
        setText(text) {
            if (editor) {
                editor.setValue(text);
                editor.getAction("editor.action.formatDocument").run();
            }
        },
    };
</script>

{#if !loading}
    <div class="h-full" use:make_editor/>
{:else}
    <div class="flex flex-col items-center justify-center w-full h-full">
        <Loading withOverlay={false}/>
        <p class="text-white font-bold text-lg">
            Loading Monaco Editor
        </p>
    </div>
{/if}
