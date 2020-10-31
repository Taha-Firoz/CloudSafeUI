<script>
  import { metatags } from "@roxi/routify";
  import jsoneditor from "jsoneditor";
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
  import { json_policy_data } from "../stores.js";
  import { axiosAPI, wait } from "../init_axios";

  let open = false;
  let open_weirdo = false;

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

  let ace_editor = null;

  const unsubscribe = json_policy_data.subscribe((value) => {
    if (ace_editor) {
      ace_editor.set(value);
    }
  });

  function initJsonEditor(e) {
    const editor = new jsoneditor(e, {
      mode: "code",
      theme: "ace/theme/twilight",
      mainMenuBar: false,
    });
    ace_editor = editor;
    editor.set([
      "Import your policy with your credentials",
      "or",
      "Paste your policy here",
    ]);
  }

  function paginate({ page, pageSize }) {
    paginated_rows = all_rows.slice((page - 1) * pageSize, page * pageSize);
  }

  function checkPolicy() {
    try {
      const parsed = JSON.parse(ace_editor.getText());

      if (Array.isArray(parsed)) {
        return;
      } else {
        fetching = "active";
        axiosAPI
          .post("/anomalies/conflicts", JSON.parse(ace_editor.getText()))
          .then((res) => {
            wait(2000).then(()=>{fetching = "finished";response = res.data;
            response.splice(1, 0, {
              title: "Redundancies",
              value: "?",
              meta: {},
            });wait(2000).then(() => (fetching = null));})
            
            
          })
          .catch((e) => {
            wait(2000).then(()=>{fetching = "error";wait(2000).then(() => (fetching = null));})
            console.log(e);
          });
      }
    } catch (e) {
      console.log(e);
      return;
    }
  }
  onDestroy(unsubscribe);
</script>

<svelte:head>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/jsoneditor/9.1.1/jsoneditor.min.css" />
  <!-- <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jsoneditor/9.1.1/img/jsoneditor-icons.svg"> -->
  <meta charset="utf-8" />
  <script src="https://rawgit.com/thlorenz/brace/master/theme/twilight.js">
  </script>
</svelte:head>

<div class="h-full w-full flex" theme="g90">
  <div
    class="flex flex-col w-1/3 h-full border-r-2 border-solid border-carbon-90">
    <div class="flex bg-carbon-80 p-2 justify-between items-center">
      <span class="font-bold ml-4 inline-flex align-middle">
        AWS IAM Policies (JSON)
      </span>
      <div class="w-40">
        {#if fetching === null}
          <Button on:click={checkPolicy} size="small">Update</Button>
        {:else if fetching === 'active'}
          <InlineLoading status="active" description="Fetching Policy" />
        {:else if fetching === 'finished'}
          <InlineLoading status="finished" description="Fetch Successful" />
        {:else if fetching === 'error'}
          <InlineLoading status="error" description="Failed to Fetch" />
        {/if}
      </div>
    </div>
    <div id="jsoneditor" use:initJsonEditor class="flex-1" />
  </div>
  <div class="grid w-2/3 bg-carbon-100 place-items-center">
    <div class="grid grid-cols-2 gap-10 ">
      {#each response as item, i}
        <div
          class="group w-48 h-32 bg-white p-4 {item.title === 'Redundancies' || item.value === '?' ? 'bg-gray-400 cursor-not-allowed' : 'cursor-pointer hover:shadow-2xl hover:bg-cablue-60'}">
          <div
            class="flex flex-col justify-between h-full"
            on:click={() => {
              if (item.title !== 'Redundancies' || item.value === '?') {
                item.title === 'Conflicts'? open_weirdo = true: open = true;
                heading = item.title;
                headers = item.meta.headers;
                all_rows = item.meta.values;
                paginate({ page: 1, pageSize: 10 });
              }
            }}>
            <span
              class="font-bold text-carbon-100 {item.title === 'Redundancies' || item.value === '?' ? '' : 'group-hover:text-white'} text-lg">{item.title}</span>
            <span
              class="font-bold text-carbon-100 {item.title === 'Redundancies' || item.value === '?' ? '' : 'group-hover:text-white'} text-5xl text-right">{item.value}</span>
          </div>
        </div>
      {/each}
    </div>

    <Modal
        bind:open={open_weirdo}
        modalHeading={heading}
        passiveModal
        hasForm
        hasScrollingContent>
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
        totalItems={all_rows.length} />
    </Modal>

    <Modal
      bind:open
      modalHeading={heading}
      passiveModal
      hasForm
      hasScrollingContent>
      <DataTable {headers} rows={paginated_rows} />
      <Pagination
        on:update={(e) => {
          e = e.detail;
          paginate(e);
        }}
        pageSizeInputDisabled
        totalItems={all_rows.length} />
    </Modal>
  </div>
</div>
