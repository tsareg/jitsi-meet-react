import { ColorPalette, createStyleSheet } from '../../../base/styles';

/**
 * Generic styles for a button.
 *
 * @type {Object}
 */
const button = {
    alignSelf: 'center',
    borderRadius: 35,
    borderWidth: 0,
    flexDirection: 'row',
    height: 60,
    justifyContent: 'center',
    width: 60
};

/**
 * Generic container for buttons.
 *
 * @type {Object}
 */
const container = {
    flex: 1,
    flexDirection: 'row',
    left: 0,
    position: 'absolute',
    right: 0
};

/**
 * The toolbar related styles.
 * TODO Make styles more generic and reusable. Use ColorPalette for all colors.
 */
export const styles = createStyleSheet({
    /**
     * The toolbar button icon style.
     */
    icon: {
        alignSelf: 'center',
        color: ColorPalette.jitsiDarkGrey,
        fontSize: 24
    },

    /**
     * Container for toggle camera facing mode button.
     */
    toggleCameraFacingModeContainer: {
        ...container,
        height: 60,
        justifyContent: 'flex-end'
    },

    /**
     * The toggle camera facing mode button style.
     */
    toggleCameraFacingModeButton: {
        ...button,
        backgroundColor: 'transparent'
    },

    /**
     * The toolbar button style.
     */
    toolbarButton: {
        ...button,
        backgroundColor: 'white',
        marginLeft: 20,
        marginRight: 20,
        opacity: 0.8
    },

    /**
     * The toolbar buttons container style.
     */
    toolbarButtonsContainer: {
        ...container,
        bottom: 30,
        height: 60,
        justifyContent: 'center'
    },

    /**
     * The toolbar container style.
     */
    toolbarContainer: {
        ...container,
        bottom: 0,
        top: 0
    }
});
