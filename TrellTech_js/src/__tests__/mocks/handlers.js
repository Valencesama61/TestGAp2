import { rest } from "msw";

export const handlers = [
  rest.get("https://api.trello.com/1/members/me/organizations", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        { id: "111", displayName: "Workspace A" },
        { id: "222", displayName: "Workspace B" }
      ])
    );
  }),

  rest.post("https://api.trello.com/1/organizations", async (req, res, ctx) => {
    const body = await req.json();
    return res(
      ctx.status(200),
      ctx.json({
        id: "new123",
        displayName: body.displayName,
        desc: body.desc || ""
      })
    );
  }),
];
