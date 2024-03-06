import { Request, Response } from "express";

const DEFAULT_LIMIT = 10;
const DEFAULT_PAGE = 0;

export function getPagination(req: Request, res: Response) {
  let limit = DEFAULT_LIMIT;
  let page = DEFAULT_PAGE;
  let hasError = false;

  if (req.query.limit) {
    limit = Number(req.query.limit);
    if (Number.isNaN(limit) || limit < 1) {
      hasError = true;
      res.status(400).json({
        error: `Invalid value for query param "limit: "${req.query.limit}".`,
      });
    }
  }
  if (req.query.page) {
    page = Number(req.query.page);
    if (Number.isNaN(page) || page < 1) {
      hasError = true;
      res.status(400).json({
        error: `Invalid value for query param "page": "${req.query.limit}".`,
      });
    }
  }

  return { limit, page, hasError };
}
