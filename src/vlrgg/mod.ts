import { DOMParser, Element } from "deno_dom/deno-dom-native.ts";
import { NodeList } from "deno_dom/src/dom/node-list.ts";
import { Event, Match } from "./models.ts";

export const getEvent = async (
  opts: { id: string; seriesId: string | undefined },
): Promise<Event> => {
  const htmlContent = await fetch(eventUrl(opts));
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
        id: matchEl.getAttribute("href")!.split("/")[1],
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

const eventUrl = (opts: { id: string; seriesId: string | undefined }) =>
  `https://www.vlr.gg/event/matches/${opts.id}/?series_id=${
    opts.seriesId || "all"
  }`;

const toElements = (nodeList: NodeList) =>
  Array.from(nodeList)
    .map((node) => node as Element);
