<script>
  import { metatags } from "@roxi/routify";
  import jsoneditor from "jsoneditor";
  import { onDestroy } from "svelte";
  metatags.title = "CloudSafe Editor";
  metatags.description = "The Cloudsafe Policy Editor";
  import { Button, Modal, DataTable, Pagination } from "carbon-components-svelte";
  import { json_policy_data } from '../stores.js';

  let open = false;

  const headers = [];

  const all_rows = [];

  let paginated_rows =  []

  const response = [
    {
      title: "Conflicts",
      value: "?",
      meta: [],
    },
    {
      title: "Redundancies",
      value: "?",
      meta: [],
    },
    {
      title: "Users",
      value: "?",
      meta: [],
    },
    {
      title: "Groups",
      value: "?",
      meta: [],
    },
  ];

  let ace_editor = null;

  const unsubscribe = json_policy_data.subscribe((value)=>{
      if(ace_editor){
        ace_editor.set(value);
      }
  })

  function attach(e) {
    const editor = new jsoneditor(e, {
      mode: "code",
      theme: "ace/theme/twilight",
      mainMenuBar: false,
    });
    ace_editor = editor;
    editor.set(["Import your policy with your credentials","or","Paste your policy here"]);
  }

  function paginate({page, pageSize}){
    paginated_rows = all_rows.slice((page-1)*pageSize, page*pageSize)
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
  <div class="flex flex-col w-1/3 h-full border-r-2 border-solid border-carbon-90">
    <div class="flex bg-carbon-80 p-2 justify-between items-center">
        <span class="font-bold ml-4 inline-flex align-middle">
            AWS IAM Policies (JSON)
        </span>
        <Button size="small">Update</Button>
    </div>
    <div id="jsoneditor" use:attach class="flex-1" />
  </div>
  <div class="grid w-2/3 bg-carbon-100 place-items-center">
    <div class="grid grid-cols-2 gap-10 ">
      {#each response as item, i}
        <div
          class="group w-48 h-32 bg-white p-4 {item.title === "Redundancies"? "": "cursor-pointer hover:shadow-2xl hover:bg-cablue-60"}">
          <div
            class="flex flex-col justify-between h-full"
            on:click={() => {
                if(item.title !== "Redundancies"){
                    open = true;
                    paginate({page: 1, pageSize: 10})
                }
            }}>
            <span class="font-bold text-carbon-100 {item.title === "Redundancies"? "": "group-hover:text-white"} text-lg">{item.title}</span>
            <span class="font-bold text-carbon-100 {item.title === "Redundancies"? "": "group-hover:text-white"} text-5xl text-right">{item.value}</span>
          </div>
        </div>
      {/each}
    </div>

    <Modal
      bind:open
      modalHeading="Create database"
      primaryButtonDisabled
      secondaryButtonText="Back"
      on:click:button--secondary={() => (open = false)}
      on:open
      on:close
      on:submit={() => (open = false)}
      >
        <DataTable
        headers={headers}
        rows={paginated_rows} />
        <Pagination on:update={(e)=>{e = e.detail; paginate(e)}} pageSizeInputDisabled totalItems={all_rows.length} />
    </Modal>
  </div>
</div>
