import { MiddlewareConfigType } from "./type"
import authMiddleware from "./middlewares/auth_middleware"
import { chain } from "./middlewares/chain"
import { withAuth } from "next-auth/middleware"

export const config: MiddlewareConfigType = {
    matcher: ["/", "/videos", "/playlists", "/download"]
}
const middleWares = [authMiddleware]
export default withAuth(chain(middleWares))
