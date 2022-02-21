import { getEvent } from "./vlrgg/mod.ts";

console.log(JSON.stringify(await getEvent(874, "1730"), null, 2));
