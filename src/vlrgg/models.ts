export type Event = {
  name: string;
  matches: Match[];
};

export type Match = {
  id: number;
  teams: {
    local: Team;
    visitor: Team;
  };
  result: null | {
    rounds: {
      local: number;
      visitor: number;
    };
    winner: null | "local" | "visitor";
  };
};

export type Team = {
  name: string;
};
