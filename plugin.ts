import * as pug from "pug";
import * as pureta from "pureta";

export default class PugPlugin extends pureta.Plugin {
    dirs = {};

    async registerHandlers() {
        this.app.on("server:init", async () => {
            this.app.server.express.engine("pug", pug.renderFile);
            this.app.server.express.set("view engine", "pug");
            if (this.app.configs.global.get("dev.enable")) {
                this.app.server.express.locals.pretty = true;
                this.app.server.express.disable("view cache");
            }
        });
        this.app.on("request:responding", async (handler: pureta.RequestHandler) => {
            const html = await new Promise((resolve, reject) => {
                handler.res.render(this.app.views[handler.req.mvcPath], handler.res.locals, (err, html) => {
                    if (err) reject(err);
                    else resolve(html);
                });
            });
            handler.res.send(html);
        });
    }
}
