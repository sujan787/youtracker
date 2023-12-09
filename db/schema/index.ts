import * as accounts from './accounts';
import * as playListVideos from './playlist_videos';
import * as playLists from './playlists';
import * as sessions from './sessions';
import * as users from './users';
import * as verificationTokens from './verification_tokens';
import * as videos from './videos';

const schema = {
    ...accounts,
    ...users,
    ...sessions,
    ...verificationTokens,
    ...videos,
    ...playLists,
    ...playListVideos
}

export default schema
