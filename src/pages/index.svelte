<script>
  import { metatags } from "@roxi/routify";
  import jsoneditor from "jsoneditor";
  metatags.title = "CloudSafe Editor";
  metatags.description = "The Cloudsafe Policy Editor";
  import { Button, Modal, DataTable, Pagination } from "carbon-components-svelte";
  import * as data from "./user_policies.json";

  let open = false;

  const headers = [
    { key: "name", value: "Name" },
    { key: "port", value: "Port" },
    { key: "rule", value: "Rule" }
  ];

  const all_rows = [];

  let paginated_rows =  []

  const response = [
    {
      title: "Conflicts",
      value: "35",
      meta: [
      ],
    },
    {
      title: "Redundancies",
      value: "17",
      meta: [
        "arn:aws:iam::aws:policy/IAMUserChangePassword",
        "arn:aws:iam::aws:policy/AdministratorAccess",
      ],
    },
    {
      title: "Users",
      value: "3",
      meta: ["UzmaBibi", "hooria", "talal"],
    },
    {
      title: "Groups",
      value: "2",
      meta: ["activeStudents", "Administrators"],
    },
  ];
  let json = data;

  function attach(e) {
    const editor = new jsoneditor(e, {
      mode: "code",
      theme: "ace/theme/twilight",
      mainMenuBar: false,
    });
    editor.set(json);
  }

  function paginate({page, pageSize}){
    paginated_rows = all_rows.slice((page-1)*pageSize, page*pageSize)
  }
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
          class="group w-48 h-32 bg-white hover:shadow-2xl hover:bg-cablue-60 p-4 cursor-pointer">
          <div
            class="flex flex-col justify-between h-full"
            on:click={() => {
              open = true;
              paginate(e)
            }}>
            <span class="font-bold text-carbon-100 group-hover:text-white text-lg">{item.title}</span>
            <span class="font-bold text-carbon-100 group-hover:text-white text-5xl text-right">{item.value}</span>
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
