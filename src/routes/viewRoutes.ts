import {
  Request,
  Response,
  NextFunction,
  RequestHandler,
  Router,
} from "express";

const router = Router();

router.get("/about", (req: Request, res: Response) => {
  console.log("Are there any changes ewan ba");
  res.render("pages/about.ejs", { name: "philip" });
  // res.send("authentication server server");
});

export default router;
