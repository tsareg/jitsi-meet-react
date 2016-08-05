/**
 * Mute or unmute local track if any.
 *
 * @param {JitsiLocalTrack} track - Track instance.
 * @param {boolean} muted - If audio stream should be muted or unmuted.
 * @returns {Promise}
 */
export function setTrackMuted(track, muted) {
    if (!track) {
        return Promise.resolve();
    }

    if (muted) {
        return track.mute()
            .catch(err => {
                console.warn('Track mute was rejected:', err);
                throw err;
            });
    } else {
        return track.unmute()
            .catch(err => {
                console.warn('Track unmute was rejected:', err);
                throw err;
            });
    }
}