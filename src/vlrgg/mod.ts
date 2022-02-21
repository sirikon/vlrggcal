import { DOMParser, Element } from "deno_dom/deno-dom-native.ts";
import { NodeList } from "deno_dom/src/dom/node-list.ts";
import { Event, Match } from "./models.ts";

export const getEvent = async (
  id: number,
  seriesId = "all",
): Promise<Event> => {
  const htmlContent = await fetch(
    `https://www.vlr.gg/event/matches/${id}/?series_id=${seriesId}`,
  );
  const dom = new DOMParser().parseFromString(
    await htmlContent.text(),
    "text/html",
  )!;

  const matchesNodes = dom.querySelectorAll("a.wf-module-item.match-item");
  const matches = toElements(matchesNodes)
    .map((matchEl): Match => {
      const teamsEl = toElements(
        matchEl.querySelectorAll("div.match-item-vs-team"),
      );
      const localTeamEl = teamsEl[0];
      const visitorTeamEl = teamsEl[1];

      return {
        id: parseInt(matchEl.getAttribute("href")!.split("/")[1]),
        teams: {
          local: {
            name: localTeamEl.querySelector("div.text-of")!.textContent.trim(),
          },
          visitor: {
            name: visitorTeamEl.querySelector("div.text-of")!.textContent
              .trim(),
          },
        },
        result: null,
      };
    });

  return {
    name: dom.querySelector("h1.wf-title")!.textContent.trim(),
    matches,
  };
};

const toElements = (nodeList: NodeList) =>
  Array.from(nodeList)
    .map((node) => node as Element);
