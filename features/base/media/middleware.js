import { CONFERENCE_LEFT } from '../conference';
import { MiddlewareRegistry } from '../redux';
import { setTrackMuted, TRACK_ADDED } from '../tracks';

import {
    cameraFacingModeChanged,
    cameraMutedStateChanged,
    microphoneMutedStateChanged
} from './actions';

import { CAMERA_FACING_MODE } from './constants';

/**
 * Middleware that captures CONFERENCE_LEFT action and restores initial state
 * for microphone and camera.
 *
 * @param {Store} store - Redux store.
 * @returns {Function}
 */
MiddlewareRegistry.register(store => next => action => {
    let result = next(action);

    switch (action.type) {
    case CONFERENCE_LEFT:
        resetInitialMediaState(store);
        break;

    case TRACK_ADDED:
        if (action.track.isLocal()) {
            syncTrackMutedState(store, action.track);
        }
        break;
    }

    return result;
});

/**
 * Resets initial media state.
 *
 * @param {Store} store - Redux store.
 * @returns {void}
 */
function resetInitialMediaState(store) {
    let { dispatch, getState } = store;
    let state = getState();
    let mediaState = state['features/base/media'];

    // Optimization - do not re-create local video track if we already showing
    // "user" facing mode.
    if (mediaState.camera.facingMode !== CAMERA_FACING_MODE.USER) {
        dispatch(cameraFacingModeChanged(CAMERA_FACING_MODE.USER));
    }

    if (mediaState.camera.muted) {
        dispatch(cameraMutedStateChanged(false));
    }

    if (mediaState.microphone.muted) {
        dispatch(microphoneMutedStateChanged(false));
    }
}

/**
 * Syncs muted state of local media track with muted state from media state.
 *
 * @param {Store} store - Redux store.
 * @param {JitsiLocalTrack} track - Local media track.
 * @returns {void}
 */
function syncTrackMutedState(store, track) {
    let mediaState = store.getState()['features/base/media'];

    if (track.isAudioTrack()) {
        if (track.isMuted() !== mediaState.microphone.muted) {
            setTrackMuted(track, mediaState.microphone.muted);
        }
    } else if (track.isVideoTrack()) {
        if (track.isMuted() !== mediaState.camera.muted) {
            setTrackMuted(track, mediaState.camera.muted);
        }
    }
}