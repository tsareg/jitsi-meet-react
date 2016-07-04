import config from '../../../config';
import JitsiMeetJS from '../lib-jitsi-meet';

import {
    participantVideoTypeChanged
} from '../../base/participants';

import {
    TRACK_ADDED,
    TRACK_REMOVED
} from './actionTypes';

import {
    CAMERA_FACING_MODE,
    DEVICE_TYPE
} from './constants';

require('./reducer');


/**
 * Attach a set of local tracks to a conference.
 *
 * @param {JitsiConference} conference - Conference instance.
 * @param {JitsiLocalTrack[]} localTracks - List of local media tracks.
 * @returns {void}
 */
export function addTracksToConference(conference, localTracks) {
    let conferenceLocalTracks = conference.getLocalTracks();
    for (let track of localTracks) {
        // XXX The library lib-jitsi-meet may be draconian, for example, when
        // adding one and the same video track multiple times.
        if (-1 === conferenceLocalTracks.indexOf(track)) {
            conference.addTrack(track);
        }
    }
}

/**
 * Add new local tracks to the conference, replacing any existing tracks that
 * were previously attached.
 *
 * @param {JitsiLocalTrack[]} [newLocalTracks=[]] - List of new local media
 * tracks.
 * @returns {Function}
 */
export function setLocalTracks(newLocalTracks = []) {
    return (dispatch, getState) => {
        const conference = getState()['features/conference'];
        let tracksToAdd = [];
        let tracksToRemove = [];
        let newAudioTrack;
        let newVideoTrack;
        let promise = Promise.resolve();

        if (conference) {
            conference.getLocalTracks().forEach(track => {
                if (track.isAudioTrack()) {
                    newAudioTrack = newLocalTracks.find(t => t.isAudioTrack());

                    if (newAudioTrack) {
                        tracksToAdd.push(newAudioTrack);
                        tracksToRemove.push(track);
                    }
                } else if (track.isVideoTrack()) {
                    newVideoTrack = newLocalTracks.find(t => t.isVideoTrack());

                    if (newVideoTrack) {
                        tracksToAdd.push(newVideoTrack);
                        tracksToRemove.push(track);
                    }
                }
            });

            // TODO: add various checks from original useVideo/AudioStream

            promise = Promise.all(tracksToRemove.map(t => t.dispose()))
                .then(() => Promise.all(
                    tracksToRemove.map(t => dispatch(trackRemoved(t)))))
                .then(() => addTracksToConference(conference, tracksToAdd));
        } else {
            tracksToAdd = newLocalTracks;
        }

        return promise
            .then(() => Promise.all(
                tracksToAdd.map(t => dispatch(trackAdded(t)))))
            .then(() => {
                // Maybe update local participant's videoType after we received
                // new media tracks.
                let participants = getState()['features/base/participants'];
                let localParticipant = participants.find(p => p.local);
                let promise = Promise.resolve();
                let addedVideoTrack = tracksToAdd.find(t => t.isVideoTrack());
                let removedVideoTrack = tracksToRemove
                    .find(t => t.isVideoTrack());

                if (localParticipant) {
                    if (addedVideoTrack) {
                        promise = dispatch(participantVideoTypeChanged(
                            localParticipant.id,
                            addedVideoTrack.videoType));
                    } else if (removedVideoTrack) {
                        promise = dispatch(participantVideoTypeChanged(
                            localParticipant.id,
                            undefined));
                    }
                }

                return promise;
            });
    };
}

/**
 * Request to start capturing local audio and/or video. By default, the user
 * facing camera will be selected.
 *
 * @param {Object} [options] - Options.
 * @param {string[]} [options.devices=[DEVICE_TYPE.AUDIO, DEVICE_TYPE.VIDEO]] -
 *      Required device types ('audio', 'video' etc.).
 * @param {string|null} [options.cameraDeviceId] - Camera device id.
 * @param {string|null} [options.micDeviceId] - Microphone device id.
 * @param {string|null} [options.facingMode=CAMERA_FACING_MODE.USER] - Camera
 *      facing mode to use.
 * @param {boolean} [checkForPermissionPrompt] - If lib-jitsi-meet should check
 *      for gUM permission prompt.
 * @returns {Promise<JitsiLocalTrack[]>}
 */
export function createLocalTracks(options, checkForPermissionPrompt) {
    options || (options = {});
    options.devices || (options.devices = [
        DEVICE_TYPE.AUDIO, DEVICE_TYPE.VIDEO]);

    return JitsiMeetJS.createLocalTracks({
        // copy array to avoid mutations inside library
        devices: options.devices.slice(0),
        facingMode: options.facingMode || CAMERA_FACING_MODE.USER,
        resolution: config.resolution,
        // TODO: use device IDs from settings when available
        cameraDeviceId: options.cameraDeviceId,
        micDeviceId: options.micDeviceId,
        // adds any ff fake device settings if any
        firefox_fake_device: config.firefox_fake_device
    }, checkForPermissionPrompt)
    .catch(function (err) {
        console.error('failed to create local tracks', options.devices, err);
        return Promise.reject(err);
    });
}

/**
 * Create an action for when a new track has been signaled to be added to the
 * conference.
 *
 * @param {JitsiTrack} track - JitsiTrack instance.
 * @returns {{ type: TRACK_ADDED, track: JitsiTrack }}
 */
export function trackAdded(track) {
    return {
        type: TRACK_ADDED,
        track
    };
}

/**
 * Create an action for when a track has been signaled for removal from the
 * conference.
 *
 * @param {JitsiTrack} track - JitsiTrack instance.
 * @returns {{ type: TRACK_REMOVED, track: JitsiTrack }}
 */
export function trackRemoved(track) {
    return {
        type: TRACK_REMOVED,
        track
    };
}

/**
 * Removes all remote tracks.
 *
 * @returns {Function}
 */
export function removeRemoteTracks() {
    return (dispatch, getState) => {
        let remoteTracks = getState()['features/base/tracks']
            .filter(t => !t.isLocal());
        
        return Promise.all(remoteTracks.map(t => dispatch(trackRemoved(t))));
    };
}

/**
 * Removes all local tracks.
 *
 * @returns {Function}
 */
export function removeLocalTracks() {
    return (dispatch, getState) => {
        let localTracks = getState()['features/base/tracks']
            .filter(t => t.isLocal());

        return Promise.all(localTracks.map(t => dispatch(trackRemoved(t))));
    };
}
