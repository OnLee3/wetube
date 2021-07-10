import express from "express";
import { getJoin, getLogin,postLogin, postJoin } from "../controllers/userController";
import { home, search} from "../controllers/videoController";

const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.route("/join").get(getJoin).post(postJoin);
rootRouter.route("/Login").get(getLogin).post(postLogin);
rootRouter.get("/search", search);

export default rootRouter;