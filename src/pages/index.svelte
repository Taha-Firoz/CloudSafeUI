<script>
    import { metatags } from "@roxi/routify";
    import Editor from "./_components/editor.svelte";
    import { onDestroy } from "svelte";
    metatags.title = "CloudSafe Editor";
    metatags.description = "The Cloudsafe Policy Editor";
    import {
        Button,
        Modal,
        DataTable,
        Pagination,
        InlineLoading,
    } from "carbon-components-svelte";
    import { json_policy_data, error } from "../stores.js";
    import { axiosAPI, wait } from "../init_axios";

    let open = false;
    let open_weirdo = false;

    let editor;

    let heading = "";

    let headers = [];

    let all_rows = [];

    let paginated_rows = [];

    let fetching = null;

    let response = [
        {
            title: "Conflicts",
            value: "?",
            meta: {},
        },
        {
            title: "Redundancies",
            value: "?",
            meta: {},
        },
        {
            title: "Users",
            value: "?",
            meta: {},
        },
        {
            title: "Groups",
            value: "?",
            meta: {},
        },
    ];

      const unsubscribe = json_policy_data.subscribe((value) => {
        if(editor){
            editor.setText(value);
        }
      });

    function paginate({ page, pageSize }) {
        try {
            paginated_rows = all_rows.slice(
                (page - 1) * pageSize,
                page * pageSize
            );
        } catch (e) {
            error.set(e);
        }
    }

    function checkPolicy() {
        try {
            editor.formatText();
            const text = editor.getText();
            const parsed = JSON.parse(editor.getText());

            if (Array.isArray(parsed)) {
                error.set("Invalid policy format");
                return;
            } else {
                fetching = "active";
                axiosAPI
                    .post("/anomalies/check", {
                        raw: text,
                        processed: JSON.parse(text),
                    })
                    .then((res) => {
                        wait(2000).then(() => {
                            fetching = "finished";
                            response = res.data.rows;
                            const {conflicts, redundancies} = res.data.data;
                            const data = Object.values(redundancies).map((e)=>e.Redundancies);
                            const merged = [].concat.apply([], data);
                            const redundancy_errors = merged.map((e)=>{
                                    return {
                                        startLineNumber: e.Action.line + 1,
                                        startColumn: e.Action.total_length - e.Action.length - 1,
                                        endColumn: e.Action.total_length,
                                        message: `Redundant by Policy: ${e.RedundantActions[0].PolicyName.split('/')[1]}\nAction: ${e.RedundantActions[0].Action}\nResource: ${e.RedundantActions[0].Resource} (line: ${e.RedundantActions[0].line+1})`,
                                    }
                                })
                            editor.setError(redundancy_errors);
                            console.log(redundancy_errors);
                            wait(2000).then(() => (fetching = null));
                        });
                    })
                    .catch((e) => {
                        wait(2000).then(() => {
                            fetching = "error";
                            error.set(e);
                            wait(2000).then(() => (fetching = null));
                        });
                        console.log(e);
                    });
            }
        } catch (e) {
            error.set(e);
            console.log(e);
            return;
        }
    }
      onDestroy(unsubscribe);
</script>

<div class="h-full w-full flex overflow-y-hidden" theme="g90">
    <div
        class="flex flex-col w-1/3 h-full border-r-2 border-solid border-carbon-90"
    >
        <div
            class="flex w-full bg-carbon-80 p-2 justify-between items-center overflow-y-hidden"
        >
            <span class="font-bold ml-4 inline-flex align-middle">
                AWS IAM Policies (JSON)
            </span>
            <div class="w-40">
                {#if fetching === null}
                    <Button on:click={checkPolicy} size="small">Update</Button>
                {:else if fetching === "active"}
                    <InlineLoading
                        status="active"
                        description="Validate Policy"
                    />
                {:else if fetching === "finished"}
                    <InlineLoading
                        status="finished"
                        description="Validation Successful"
                    />
                {:else if fetching === "error"}
                    <InlineLoading
                        status="error"
                        description="Failed to Validate"
                    />
                {/if}
            </div>
        </div>
        <div class="min-h-0 h-full">
            <Editor bind:model={editor} />
        </div>
    </div>
    <div class="grid w-2/3 bg-carbon-100 place-items-center">
        <div class="grid grid-cols-2 gap-10 ">
            {#each response as item, i}
                <div
                    class:cursor-pointer={item.value !== "?"}
                    class="group w-48 h-32 bg-white p-4 cursor-pointer hover:bg-gray-200 hover:bg-cablue-60'"
                >
                    <div
                        class="flex flex-col justify-between h-full"
                        on:click={() => {
                            if (!(item.value === "?")) {
                                item.title === "Conflicts" ||
                                item.title === "Redundancies"
                                    ? (open_weirdo = true)
                                    : (open = true);
                                heading = item.title;
                                headers = item.meta.headers;
                                all_rows = item.meta.values;
                                paginate({ page: 1, pageSize: 10 });
                            }
                        }}
                    >
                        <span
                            class="font-bold text-carbon-100 'group-hover:text-white' text-lg"
                            >{item.title}</span
                        >
                        <span
                            class="font-bold text-carbon-100 'group-hover:text-white' text-5xl text-right"
                            >{item.value}</span
                        >
                    </div>
                </div>
            {/each}
        </div>

        <Modal
            bind:open={open_weirdo}
            modalHeading={heading}
            passiveModal
            hasForm
            hasScrollingContent
        >
            <DataTable expandable {headers} rows={paginated_rows}>
                <div slot="expanded-row" let:row>
                    <pre>
                {JSON.stringify(row, null, 2)}
                </pre>
                </div>
            </DataTable>
            <Pagination
                on:update={(e) => {
                    e = e.detail;
                    paginate(e);
                }}
                pageSizeInputDisabled
                totalItems={all_rows.length}
            />
        </Modal>

        <Modal
            bind:open
            modalHeading={heading}
            passiveModal
            hasForm
            hasScrollingContent
        >
            <DataTable {headers} rows={paginated_rows} />
            <Pagination
                on:update={(e) => {
                    e = e.detail;
                    paginate(e);
                }}
                pageSizeInputDisabled
                totalItems={all_rows.length}
            />
        </Modal>
    </div>
</div>
