import { getEvent } from "./vlrgg/mod.ts";

console.log(JSON.stringify(
  await getEvent({
    id: "874",
    seriesId: "1730",
  }),
  null,
  2,
));
