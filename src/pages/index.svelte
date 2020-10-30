<script>
    import { metatags } from '@roxi/routify'
    import jsoneditor from "jsoneditor"
    metatags.title = 'Bruh'
    metatags.description = 'Description coming soon...'
    import { Button } from "carbon-components-svelte";
    import * as data from "./user_policies.json";
    let json = data ;
	
	function attach(e){
        const editor = new jsoneditor(e, {mode:'code', mainMenuBar:false});
        editor.set(json);		
    } 
    
    import { afterUpdate} from "svelte";
    
    afterUpdate(() => {
        document.documentElement.setAttribute("theme", 'g90');
        console.log(document);
    });
</script>


<svelte:head>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jsoneditor/9.1.1/jsoneditor.min.css">
    <!-- <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jsoneditor/9.1.1/img/jsoneditor-icons.svg"> -->
	    <meta charset="utf-8">

	
</svelte:head>

<div class="h-full w-full flex" theme="g90">
    <div id="jsoneditor" use:attach class="w-1/3">
    </div>
    <div class="flex flex-col h-full w-2/3 bg-carbon-80 grid place-items-center">
    </div>
</div>